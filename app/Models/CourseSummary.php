<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseSummary extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'course_name',
        'slug',
        'summary'
    ];
    
    /**
     * Get the course associated with the summary.
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'slug', 'slug');
    }
}
