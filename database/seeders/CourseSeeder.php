<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            [
                'name' => 'Python Programming',
                'slug' => 'python-programming',
                'description' => 'Learn Python programming from scratch. Master the basics and advanced concepts.',
                'difficulty' => 'beginner',
                'duration' => 1200, // 20 hours
                'is_active' => true,
            ],
            [
                'name' => 'PHP Development',
                'slug' => 'php-development',
                'description' => 'Comprehensive PHP course covering web development and Laravel framework.',
                'difficulty' => 'intermediate',
                'duration' => 1500, // 25 hours
                'is_active' => true,
            ],
            [
                'name' => 'C++ Programming',
                'slug' => 'cpp-programming',
                'description' => 'Advanced C++ programming course focusing on object-oriented programming.',
                'difficulty' => 'advanced',
                'duration' => 1800, // 30 hours
                'is_active' => true,
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
