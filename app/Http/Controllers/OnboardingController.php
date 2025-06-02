<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function show()
    {
        $courses = Course::where('is_active', true)
            ->select('id', 'name', 'slug', 'description', 'difficulty', 'duration')
            ->get();

        return Inertia::render('OnboardingPage', [
            'courses' => $courses
        ]);
    }

    public function storeCourses(Request $request)
    {
        $validated = $request->validate([
            'courses' => 'required|array|min:1',
            'courses.*' => 'exists:courses,id',
        ]);

        $user = auth()->user();

        // Store selected courses
        foreach ($validated['courses'] as $courseId) {
            $user->courses()->create([
                'course_id' => $courseId,
                'status' => 'active',
                'progress' => 0,
            ]);
        }

        // Mark user as onboarded
        $user->update([
            'needs_onboarding' => false,
            'onboarded_at' => now(),
        ]);

        return redirect()->route('dashboard');
    }
}
