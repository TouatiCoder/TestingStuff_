<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        // Skip if table already exists
        if (Schema::hasTable('course_summaries')) {
            return;
        }
        
        Schema::create('course_summaries', function (Blueprint $table) {
            $table->id();
            $table->string('course_name');
            $table->string('slug')->unique();
            $table->longText('summary');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course_summaries');
    }
};
