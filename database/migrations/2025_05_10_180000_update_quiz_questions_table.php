<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First check if the table has the expected structure
        if (Schema::hasColumn('quiz_questions', 'video_id') && Schema::hasColumn('quiz_questions', 'options')) {
            // If it has the old structure, update it
            Schema::table('quiz_questions', function (Blueprint $table) {
                // Drop existing columns that we'll replace
                $table->dropColumn(['video_id', 'options']);
            });
        }
        
        // Now add the new columns
        Schema::table('quiz_questions', function (Blueprint $table) {
            if (!Schema::hasColumn('quiz_questions', 'course_slug')) {
                $table->string('course_slug')->after('id');
            }
            
            if (!Schema::hasColumn('quiz_questions', 'option_a')) {
                $table->string('option_a')->after('question');
            }
            
            if (!Schema::hasColumn('quiz_questions', 'option_b')) {
                $table->string('option_b')->after('option_a');
            }
            
            if (!Schema::hasColumn('quiz_questions', 'option_c')) {
                $table->string('option_c')->after('option_b');
            }
            
            if (!Schema::hasColumn('quiz_questions', 'option_d')) {
                $table->string('option_d')->after('option_c');
            }
            
            if (!Schema::hasColumn('quiz_questions', 'correct_answer')) {
                $table->string('correct_answer')->after('option_d');
            }
            
            if (!Schema::hasColumn('quiz_questions', 'quiz_id')) {
                $table->string('quiz_id')->nullable()->after('correct_answer');
            }
            
            // Add index for course_slug
            try {
                $table->index('course_slug');
            } catch (\Exception $e) {
                // Index might already exist, that's fine
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Only attempt to roll back if the columns exist
        if (Schema::hasColumn('quiz_questions', 'course_slug')) {
            Schema::table('quiz_questions', function (Blueprint $table) {
                // Try to drop the index if it exists
                try {
                    $table->dropIndex('quiz_questions_course_slug_index');
                } catch (\Exception $e) {
                    // Index might not exist, that's fine
                }
                
                // Remove new columns that we added
                $columns = [];
                foreach (['course_slug', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'quiz_id'] as $column) {
                    if (Schema::hasColumn('quiz_questions', $column)) {
                        $columns[] = $column;
                    }
                }
                
                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
            
            // Add back original columns if they don't exist
            Schema::table('quiz_questions', function (Blueprint $table) {
                if (!Schema::hasColumn('quiz_questions', 'video_id')) {
                    $table->string('video_id');
                }
                
                if (!Schema::hasColumn('quiz_questions', 'options')) {
                    $table->json('options');
                }
                
                // Try to recreate original index
                try {
                    $table->index('video_id');
                } catch (\Exception $e) {
                    // Index might already exist, that's fine
                }
            });
        }
    }
};
