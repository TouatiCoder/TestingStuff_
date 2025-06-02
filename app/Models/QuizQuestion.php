<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'course_slug',
        'question',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'quiz_id'
    ];
    
    /**
     * Get the course associated with the quiz question.
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_slug', 'slug');
    }
    
    /**
     * Get the responses for this question.
     */
    public function responses()
    {
        return $this->hasMany(QuizResponse::class);
    }
}
