<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['course_id', 'title', 'youtube_video_id', 'order', 'notes'];

    public function course() { return $this->belongsTo(Course::class); }
    public function quizzes() { return $this->hasMany(Quiz::class); }
}
