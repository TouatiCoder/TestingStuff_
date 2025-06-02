<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->string('video_id');
            $table->text('question');
            $table->json('options');
            $table->string('correct_answer');
            $table->timestamps();

            $table->index('video_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
