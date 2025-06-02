<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\UserCourse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function show($courseSlug, $lessonId)
    {
        $lesson = Lesson::with('quizzes')->findOrFail($lessonId);
        $course = $lesson->course;
        
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
        
        // Check if lesson order is greater than last_at
        $hasAccess = $lesson->order <= $userCourse->last_at;
        
        return Inertia::render('LessonView', [
            'lesson' => $lesson,
            'course' => $course,
            'quizzes' => $lesson->quizzes,
            'hasAccess' => $hasAccess,
            'lastAt' => $userCourse->last_at
        ]);
    }
    
    public function updateProgress(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $course = $lesson->course;
        
        // Find user course record
        $userCourse = UserCourse::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();
            
        if (!$userCourse) {
            return response()->json(['error' => 'User not enrolled in this course'], 400);
        }
        
        // Check if the next lesson exists
        $nextLessonOrder = $lesson->order + 1;
        $nextLessonExists = Lesson::where('course_id', $course->id)
            ->where('order', $nextLessonOrder)
            ->exists();
            
        // Only update if the next lesson exists and current last_at is less than next lesson order
        if ($nextLessonExists && $userCourse->last_at < $nextLessonOrder) {
            $userCourse->update(['last_at' => $nextLessonOrder]);
            
            // Count total lessons in the course
            $totalLessons = Lesson::where('course_id', $course->id)->count();
            
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
    }
}
