<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Transcript;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get user's enrolled courses with course details
        $userCourses = $user->courses()
            ->with(['course:id,name,slug,description,difficulty,duration,total_lessons'])
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

        // Get available courses (courses the user is not enrolled in)
        $enrolledCourseIds = $userCourses->pluck('course.id')->toArray();
        $availableCourses = Course::where('is_active', true)
            ->whereNotIn('id', $enrolledCourseIds)
            ->select('id', 'name', 'slug', 'description', 'difficulty', 'duration')
            ->get();

        // Get upcoming lessons for each course the user is enrolled in
        $upcomingLessons = [];
        
        foreach ($userCourses as $userCourse) {
            // Skip courses where the user has completed all lessons
            if ($userCourse['last_at'] >= $userCourse['course']['total_lessons'] && $userCourse['course']['total_lessons'] > 0) {
                continue;
            }
            
            $courseSlug = $userCourse['course']['slug'];
            $nextLessonNumber = $userCourse['last_at']; // This is the next lesson to take
            
            // Check if this is a YouTube course (using transcripts)
            if (in_array($courseSlug, Transcript::getAvailableCourses())) {
                // Get the next lesson from transcripts
                $nextLesson = Transcript::forCourse($courseSlug)
                    ->orderBy('id', 'asc')
                    ->skip($nextLessonNumber - 1) // Convert to 0-based index
                    ->first();
                    
                if ($nextLesson) {
                    $upcomingLessons[] = [
                        'course_name' => $userCourse['course']['name'],
                        'course_slug' => $courseSlug,
                        'lesson_title' => $nextLesson->title,
                        'lesson_number' => $nextLessonNumber,
                        'video_id' => $nextLesson->video_id,
                        'type' => 'youtube'
                    ];
                }
            } else {
                // Get the next lesson from regular lessons
                $nextLesson = Lesson::where('course_id', $userCourse['course']['id'])
                    ->where('order', $nextLessonNumber)
                    ->first();
                    
                if ($nextLesson) {
                    $upcomingLessons[] = [
                        'course_name' => $userCourse['course']['name'],
                        'course_slug' => $courseSlug,
                        'lesson_title' => $nextLesson->title,
                        'lesson_number' => $nextLessonNumber,
                        'lesson_id' => $nextLesson->id,
                        'type' => 'regular'
                    ];
                }
            }
        }
        
        // Get available quizzes based on completed courses
        $availableQuizzes = [];
        foreach ($userCourses as $userCourse) {
            // Only show quizzes for courses that are 100% complete
            if ($userCourse['progress'] === 100) {
                $availableQuizzes[] = [
                    'title' => $userCourse['course']['name'] . ' Quiz',
                    'courseSlug' => $userCourse['course']['slug'],
                    'available' => true
                ];
            } else {
                // Include incomplete courses with availability flag set to false
                $availableQuizzes[] = [
                    'title' => $userCourse['course']['name'] . ' Quiz',
                    'courseSlug' => $userCourse['course']['slug'],
                    'available' => false,
                    'progress' => $userCourse['progress']
                ];
            }
        }
        
        // Get user activity data
        $now = now();
        $weekStart = $now->copy()->startOfWeek();
        $weekEnd = $now->copy()->endOfWeek();
        
        // Get daily activity for the current week
        $dailyActivity = [];
        $dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Initialize with zero hours/minutes for each day
        foreach ($dayNames as $index => $day) {
            $dailyActivity[] = [
                'day' => $day,
                'hours' => 0,
                'minutes' => 0
            ];
        }
        
        // Get activity records for the current week
        $weeklyRecords = $user->activities()
            ->whereBetween('date', [$weekStart->toDateString(), $weekEnd->toDateString()])
            ->get();
        
        // Calculate minutes and hours for each day
        foreach ($weeklyRecords as $record) {
            $dayOfWeek = \Carbon\Carbon::parse($record->date)->dayOfWeekIso - 1; // 1 (Mon) to 7 (Sun), convert to 0-6
            $dailyActivity[$dayOfWeek]['minutes'] += $record->duration_minutes;
            $dailyActivity[$dayOfWeek]['hours'] = round($dailyActivity[$dayOfWeek]['minutes'] / 60, 1);
        }
        
        // Calculate streak (consecutive days with activity)
        $streak = 0;
        $checkDate = $now->copy();
        
        while (true) {
            $hasActivity = $user->activities()
                ->whereDate('date', $checkDate->toDateString())
                ->exists();
                
            if ($hasActivity) {
                $streak++;
                $checkDate->subDay();
            } else {
                break;
            }
        }
        
        // Calculate total study time this week
        $totalMinutes = $weeklyRecords->sum('duration_minutes');
        $totalHours = $totalMinutes / 60;
        $totalHoursRounded = round($totalHours, 1);
        
        // Format study time appropriately - use minutes if less than 1 hour
        $formattedStudyTime = [
            'value' => $totalHours < 1 ? $totalMinutes : $totalHoursRounded,
            'unit' => $totalHours < 1 ? 'minutes' : 'hours'
        ];
        
        return Inertia::render('Dashboard', [
            'userCourses' => $userCourses,
            'availableCourses' => $availableCourses,
            'upcomingLessons' => $upcomingLessons,
            'availableQuizzes' => $availableQuizzes,
            'weeklyActivity' => $dailyActivity,
            'streak' => $streak,
            'totalHours' => $totalHoursRounded,
            'studyTime' => $formattedStudyTime,
        ]);
    }
}
