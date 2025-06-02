<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateCourseTotalLessons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'courses:update-total-lessons';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Count and update the total_lessons field for all courses';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Updating total lessons count for all courses...');
        
        $courses = \App\Models\Course::all();
        $bar = $this->output->createProgressBar(count($courses));
        $bar->start();
        
        foreach ($courses as $course) {
            $totalLessons = $course->updateTotalLessons();
            $this->line(' Updated ' . $course->name . ' with ' . $totalLessons . ' lessons.');
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);
        $this->info('All courses have been updated with their total lessons count.');
        
        return Command::SUCCESS;
    }
}
