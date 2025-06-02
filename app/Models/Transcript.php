<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Transcript extends Model
{
    protected $connection = 'courses_transcript';
    protected $fillable = [
        'title',
        'video_id',
        'transcript',
        'created_at'
    ];
    public $timestamps = false;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        // Default table name if no course slug is provided
        $this->table = 'python-programming';
    }

    /**
     * Set the table name based on course slug
     *
     * @param string $courseSlug
     * @return self
     */
    public static function forCourse(string $courseSlug): self
    {
        $instance = new self;
        $instance->setTable($courseSlug);
        return $instance;
    }

    /**
     * Get all available course tables
     *
     * @return array
     */
    public static function getAvailableCourses(): array
    {
        return [
            'python-programming',
            'cpp-programming',
            'php-development'
        ];
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
