<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'difficulty',
        'duration',
        'total_lessons',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration' => 'integer',
        'total_lessons' => 'integer',
    ];

    public function userCourses()
    {
        return $this->hasMany(UserCourse::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_courses')
            ->withPivot('status', 'progress')
            ->withTimestamps();
    }
    
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
    
    /**
     * Count and update the total number of lessons for this course
     * 
     * @return int
     */
    public function updateTotalLessons()
    {
        $count = $this->lessons()->count();
        $this->update(['total_lessons' => $count]);
        return $count;
    }
}
