<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['lesson_id', 'question', 'options', 'correct_option'];

    protected $casts = [
        'options' => 'array',
    ];

    public function lesson() { return $this->belongsTo(Lesson::class); }
}
