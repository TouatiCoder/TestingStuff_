<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResponse extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'quiz_question_id',
        'selected_answer',
        'is_correct'
    ];
    
    /**
     * Get the user who submitted this response.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the question this response is for.
     */
    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }
}
