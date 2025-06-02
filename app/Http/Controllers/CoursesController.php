<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\UserCourse;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transcript;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CoursesController extends Controller
{
    protected $groqService;

    public function __construct(GroqService $groqService)
    {
        $this->groqService = $groqService;
    }

    public function index()
    {
        $user = auth()->user();

        // Get user's enrolled courses with course details
        $userCourses = $user->courses()
            ->with(['course:id,name,slug,description,difficulty,duration'])
            ->select('id', 'course_id', 'status', 'progress', 'completed_at', 'last_at')
            ->get()
            ->map(function ($userCourse) {
                return [
                    'id' => $userCourse->id,
                    'course' => $userCourse->course,
                    'status' => $userCourse->status,
                    'progress' => $userCourse->progress,
                    'completed_at' => $userCourse->completed_at,
                    'last_at' => $userCourse->last_at ?? 1,
                ];
            });

        return Inertia::render('Courses', [
            'userCourses' => $userCourses,
        ]);
    }

    public function show($slug)
    {
        $course = \App\Models\Course::where('slug', $slug)->firstOrFail();
        $lessons = $course->lessons()->orderBy('order')->get();
        
        // Get user's progress for this course
        $userProgress = \App\Models\UserCourse::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();
            
        // If no progress record exists, create one with last_at = 1
        if (!$userProgress) {
            $userProgress = \App\Models\UserCourse::create([
                'user_id' => auth()->id(),
                'course_id' => $course->id,
                'status' => 'in_progress',
                'progress' => 0,
                'last_at' => 1
            ]);
        }
        
        // Calculate progress percentage based on last_at and total_lessons
        if ($course->total_lessons > 0) {
            $progressPercentage = round(($userProgress->last_at / $course->total_lessons) * 100);
            $userProgress->update(['progress' => $progressPercentage]);
        }
        
        return \Inertia\Inertia::render('CourseLessons', [
            'course' => $course,
            'lessons' => $lessons,
            'userProgress' => $userProgress,
        ]);
    }

    public function youtubeLessons(Course $course)
    {
        $lessons = Transcript::forCourse($course->slug)
            ->orderBy('id', 'asc')
            ->select('id', 'title', 'video_id')
            ->get();
            
        // Get user's progress for this course
        $userProgress = UserCourse::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();
            
        // If no progress record exists, create one with last_at = 1
        if (!$userProgress) {
            $userProgress = UserCourse::create([
                'user_id' => Auth::id(),
                'course_id' => $course->id,
                'status' => 'in_progress',
                'progress' => 0,
                'last_at' => 1
            ]);
        }
        
        // Calculate progress percentage based on last_at and total_lessons
        // For YouTube courses, we need to count the total lessons from the transcripts
        $totalLessons = Transcript::forCourse($course->slug)->count();
        
        // Update the course's total_lessons if it's different
        if ($course->total_lessons != $totalLessons && $totalLessons > 0) {
            $course->update(['total_lessons' => $totalLessons]);
        }
        
        // Calculate progress percentage
        if ($totalLessons > 0) {
            $progressPercentage = round(($userProgress->last_at / $totalLessons) * 100);
            $userProgress->update(['progress' => $progressPercentage]);
        }

        return Inertia::render('CourseLessons', [
            'course' => $course,
            'lessons' => $lessons,
            'userProgress' => $userProgress,
        ]);
    }

    public function youtubeLessonView(Course $course, $videoId)
    {
        try {
            // 1. Get transcript from the correct table
            $transcript = Transcript::forCourse($course->slug)
                ->where('video_id', $videoId)
                ->firstOrFail();
                
            // Check if user has access to this lesson
            $userCourse = UserCourse::where('user_id', Auth::id())
                ->where('course_id', $course->id)
                ->first();
                
            // If no user_course record exists, create one with last_at = 1
            if (!$userCourse) {
                $userCourse = UserCourse::create([
                    'user_id' => Auth::id(),
                    'course_id' => $course->id,
                    'status' => 'in_progress',
                    'progress' => 0,
                    'last_at' => 1
                ]);
            }
            
            // Get all lessons ordered by ID to determine current lesson number
            $lessons = Transcript::forCourse($course->slug)
                ->orderBy('id', 'asc')
                ->pluck('video_id')
                ->toArray();
                
            $currentLessonIndex = array_search($videoId, $lessons) + 1; // 1-based index
            $hasAccess = $currentLessonIndex <= $userCourse->last_at;

            // 2. Get GROQ analysis
            $analysis = $this->groqService->analyzeTranscript($transcript->transcript);

            // 3. Get navigation data
            $navigation = $this->getLessonNavigation($course->slug, $videoId);

            return Inertia::render('LessonYoutube', [
                'course' => $course,
                'videoId' => $videoId,
                'videoTitle' => $transcript->title,
                'insights' => $analysis['insights'] ?? ['Unable to load insights at this time.'],
                'question' => $analysis['question'] ?? [
                    'question' => 'Question not available',
                    'options' => ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                    'correct_answer' => 'Option 1'
                ],
                'navigation' => $navigation,
                'hasAccess' => $hasAccess,
                'lastAt' => $userCourse->last_at,
                'lessonNumber' => $currentLessonIndex,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in youtubeLessonView', [
                'error' => $e->getMessage(),
                'course' => $course->slug,
                'videoId' => $videoId
            ]);

            return back()->with('error', 'Unable to load lesson. Please try again later.');
        }
    }

    protected function getLessonNavigation($courseSlug, $currentVideoId)
    {
        $lessons = Transcript::forCourse($courseSlug)
            ->orderBy('id', 'asc')
            ->pluck('video_id')
            ->toArray();

        $currentIndex = array_search($currentVideoId, $lessons);

        return [
            'previous' => $currentIndex > 0 ? $lessons[$currentIndex - 1] : null,
            'next' => $currentIndex < count($lessons) - 1 ? $lessons[$currentIndex + 1] : null,
        ];
    }
    
    public function updateYoutubeProgress(Course $course, $videoId)
    {
        try {
            // Get all lessons ordered by ID to determine current lesson number
            $lessons = Transcript::forCourse($course->slug)
                ->orderBy('id', 'asc')
                ->pluck('video_id')
                ->toArray();
                
            $currentLessonIndex = array_search($videoId, $lessons) + 1; // 1-based index
            
            // Find user course record
            $userCourse = UserCourse::where('user_id', Auth::id())
                ->where('course_id', $course->id)
                ->first();
                
            if (!$userCourse) {
                return response()->json(['error' => 'User not enrolled in this course'], 400);
            }
            
            // Check if the next lesson exists
            $nextLessonIndex = $currentLessonIndex + 1;
            $nextLessonExists = isset($lessons[$nextLessonIndex - 1]); // Convert to 0-based index
                
            // Only update if the next lesson exists and current last_at is less than next lesson index
            if ($nextLessonExists && $userCourse->last_at < $nextLessonIndex) {
                $userCourse->update(['last_at' => $nextLessonIndex]);
                
                // Calculate progress percentage based on last_at and total_lessons
                $totalLessons = count($lessons);
                
                // Update the course's total_lessons if it's different
                if ($course->total_lessons != $totalLessons && $totalLessons > 0) {
                    $course->update(['total_lessons' => $totalLessons]);
                }
                
                // Calculate and update progress percentage
                if ($totalLessons > 0) {
                    $progressPercentage = round(($userCourse->last_at / $totalLessons) * 100);
                    $userCourse->update(['progress' => $progressPercentage]);
                }
            }
            
            return response()->json([
                'success' => true,
                'last_at' => $userCourse->last_at
            ]);
        } catch (\Exception $e) {
            Log::error('Error in updateYoutubeProgress', [
                'error' => $e->getMessage(),
                'course' => $course->slug,
                'videoId' => $videoId
            ]);
            
            return response()->json(['error' => 'Failed to update progress'], 500);
        }
    }
}
