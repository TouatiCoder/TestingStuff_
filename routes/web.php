<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CoursesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    return Inertia::render('WelcomePage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
});




Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/courses', [CoursesController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('courses');

Route::get('/courses/{course:slug}', [CoursesController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('courses.show');

Route::get('/courses/{course:slug}/lessons/{lesson}', [LessonController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('lessons.show');

Route::post('/lessons/{lesson}/progress', [LessonController::class, 'updateProgress'])
    ->middleware(['auth', 'verified'])
    ->name('lessons.update-progress');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/courses/{course:slug}/youtube', [CoursesController::class, 'youtubeLessons'])
        ->name('courses.youtube');
    Route::get('/courses/{course:slug}/youtube/{videoId}', [CoursesController::class, 'youtubeLessonView'])
        ->name('courses.youtube.lesson');

    // Quiz Routes
    Route::get('/quizzes', [QuizController::class, 'index'])->name('quizzes');
    Route::get('/quizzes/{courseSlug}', [QuizController::class, 'show'])->name('quizzes.show');
    Route::get('/quizzes/{courseSlug}/generate', [QuizController::class, 'generate'])->name('quizzes.generate');
    Route::get('/quizzes/{courseSlug}/process-generation/{session_id}', [QuizController::class, 'processGeneration'])->name('quizzes.process-generation');
    Route::get('/quizzes/{courseSlug}/check-progress/{session_id}', [QuizController::class, 'checkProgress'])->name('quizzes.check-progress');
    Route::get('/quizzes/{courseSlug}/start/{session_id}', [QuizController::class, 'startQuiz'])->name('quizzes.start');
    Route::get('/quizzes/{courseSlug}/question/{questionNumber}/{session_id}', [QuizController::class, 'question'])->name('quizzes.question');
    Route::post('/quizzes/submit-answer', [QuizController::class, 'submitAnswer'])->name('quizzes.submit-answer');
    Route::get('/quizzes/{courseSlug}/results/{session_id}', [QuizController::class, 'results'])->name('quizzes.results');
    Route::post('/courses/{course:slug}/youtube/{videoId}/progress', [CoursesController::class, 'updateYoutubeProgress'])
        ->name('courses.youtube.update-progress');
});

Route::get('/onboarding', [OnboardingController::class, 'show'])
    ->middleware(['auth'])
    ->name('onboarding');

Route::post('/api/user/courses', [OnboardingController::class, 'storeCourses'])
    ->middleware(['auth'])
    ->name('user.courses.store');

// Test route for GROQ integration
Route::get('/test-groq/{courseSlug}', function ($courseSlug, App\Services\GroqService $groqService) {
    $transcript = App\Models\Transcript::forCourse($courseSlug)->first();
    return $groqService->analyzeTranscript($transcript->transcript);
});

// Test route for quiz questions generation
Route::get('/test-quiz-questions/{courseSlug}', function ($courseSlug) {
    // Get the course summary
    $courseSummary = App\Models\CourseSummary::where('slug', $courseSlug)->first();

    if (!$courseSummary) {
        return response()->json(['error' => 'Course summary not found'], 404);
    }

    // Initialize the GROQ service
    $groqService = app(App\Services\GroqService::class);

    // Create a custom prompt for quiz questions
    $transcript = "Generate a multiple-choice quiz question for this course: {$courseSlug}\n\nContent: {$courseSummary->summary}";

    // Set lower temperature and max tokens to reduce rate limit issues
    $customOptions = [
        'temperature' => 0.3,
        'max_tokens' => 800,
        'response_format' => ['type' => 'json_object']
    ];

    // Generate 5 questions with a delay between each
    $questions = [];
    $attempts = 0;
    $maxAttempts = 5;

    while (count($questions) < 5 && $attempts < $maxAttempts) {
        try {
            // Add a delay between requests to avoid rate limits
            if ($attempts > 0) {
                sleep(2); // 2 second delay
            }

            // Generate a question
            $result = $groqService->analyzeTranscript($transcript);

            if (isset($result['question'])) {
                // Format the question
                $question = [
                    'question' => $result['question']['question'],
                    'options' => $result['question']['options'],
                    'correct_answer' => $result['question']['correct_answer']
                ];

                // Add to questions array
                $questions[] = $question;
            }

            $attempts++;
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'questions_generated' => $questions
            ], 500);
        }
    }

    return response()->json([
        'course' => $courseSlug,
        'questions_count' => count($questions),
        'questions' => $questions
    ]);
});

// User Activity Routes
Route::middleware(['auth'])->group(function () {
    Route::post('/user-activity/logout', [App\Http\Controllers\UserActivityController::class, 'recordLogout'])->name('user-activity.logout');
    Route::get('/user-activity/stats', [App\Http\Controllers\UserActivityController::class, 'getActivityStats'])->name('user-activity.stats');
});


// routes/web.php

Route::get('/image-test', function () {
    return Inertia::render('TestComponent');
});


require __DIR__.'/auth.php';

// Include OpenRouter test routes
require __DIR__.'/openrouter_test.php';

// Include OpenRouter debug routes
require __DIR__.'/openrouter_debug.php';
