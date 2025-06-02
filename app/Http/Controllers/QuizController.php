<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSummary;
use App\Models\UserCourse;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuizController extends Controller
{
    /**
     * Display a listing of completed courses for quizzes.
     */
    public function index()
    {
        $user = auth()->user();

        // Get courses where the user has 100% progress
        $completedCourses = UserCourse::where('user_id', $user->id)
            ->where('progress', 100)
            ->with(['course:id,name,slug,description,difficulty,duration,total_lessons'])
            ->get()
            ->map(function ($userCourse) {
                return [
                    'id' => $userCourse->id,
                    'course' => $userCourse->course,
                    'status' => $userCourse->status,
                    'progress' => $userCourse->progress,
                    'completed_at' => $userCourse->completed_at,
                ];
            });

        return Inertia::render('Quiz/Index', [
            'completedCourses' => $completedCourses
        ]);
    }

    /**
     * Display the quiz for a specific course.
     */
    public function show(string $courseSlug)
    {
        $user = auth()->user();
        $course = Course::where('slug', $courseSlug)->firstOrFail();

        // Check if the user has completed this course
        $userCourse = UserCourse::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$userCourse || $userCourse->progress < 100) {
            return redirect()->route('courses')->with('error', 'You must complete this course before taking the quiz.');
        }

        // Show the generation page
        return Inertia::render('Quiz/Generate', [
            'course' => $course
        ]);
    }

    /**
     * Generate quiz questions for a course.
     */
    public function generate(Request $request, string $courseSlug)
    {
        // Increase the execution time limit for this method
        set_time_limit(180); // 3 minutes to handle more questions

        $user = auth()->user();
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $courseSummary = CourseSummary::where('slug', $courseSlug)->first();

        if (!$courseSummary) {
            return redirect()->route('quizzes')->with('error', 'No course summary available for quiz generation.');
        }

        // Generate a unique session ID for this quiz attempt
        $quizSessionId = Str::uuid()->toString();

        // Initialize session with generation status
        session(['quiz_generation_' . $quizSessionId => [
            'course_slug' => $courseSlug,
            'course_name' => $course->name,
            'status' => 'in_progress',
            'progress' => 0,
            'total_questions' => 10, // Reduced from 20 to 10
            'questions' => [],
            'started_at' => now()
        ]]);

        // Show generation progress page first
        return Inertia::render('Quiz/Generating', [
            'course' => $course,
            'sessionId' => $quizSessionId,
            'totalQuestions' => 10 // Reduced from 20 to 10
        ]);
    }

    /**
     * Check quiz generation progress.
     */
    public function checkProgress(Request $request, string $courseSlug, string $session_id)
    {
        $user = auth()->user();

        // Get quiz generation status from session
        $generationData = session('quiz_generation_' . $session_id);

        if (!$generationData) {
            return response()->json([
                'error' => 'Quiz generation session not found',
                'redirect' => route('quizzes.show', $courseSlug)
            ], 404);
        }

        return response()->json($generationData);
    }

    /**
     * Start the actual quiz after generation is complete.
     */
    public function startQuiz(Request $request, string $courseSlug, string $session_id)
    {
        $user = auth()->user();

        // Get the generated questions
        $generationData = session('quiz_generation_' . $session_id);

        if (!$generationData || $generationData['status'] !== 'completed') {
            return redirect()->route('quizzes.show', $courseSlug)
                ->with('error', 'Quiz generation is not complete. Please try again.');
        }

        // Create the quiz session with the generated questions
        $quizSessionId = Str::uuid()->toString();
        $course = Course::where('slug', $courseSlug)->firstOrFail();

        session(['quiz_' . $quizSessionId => [
            'questions' => $generationData['questions'],
            'course_slug' => $courseSlug,
            'course_name' => $course->name,
            'started_at' => now(),
            'current_question' => 1,
            'answers' => [],
            'total_questions' => count($generationData['questions'])
        ]]);

        // Redirect to the first question
        return redirect()->route('quizzes.question', [
            'courseSlug' => $courseSlug,
            'questionNumber' => 1,
            'session_id' => $quizSessionId
        ]);
    }

    /**
     * Get a specific question from the quiz.
     */
    public function question(Request $request, string $courseSlug, int $questionNumber, string $session_id)
    {
        $user = auth()->user();

        // Get quiz data from session
        $quizData = session('quiz_' . $session_id);

        if (!$quizData) {
            return redirect()->route('quizzes.generate', $courseSlug)
                ->with('error', 'Quiz session expired or not found. Please start a new quiz.');
        }

        $questions = $quizData['questions'];
        $total = count($questions);

        // Ensure question number is valid
        if ($questionNumber < 1 || $questionNumber > $total) {
            return redirect()->route('quizzes.question', [
                'courseSlug' => $courseSlug,
                'questionNumber' => 1,
                'session_id' => $session_id
            ]);
        }

        // Get the specific question
        $question = $questions[$questionNumber - 1];

        // Get user's previous answer to this question if it exists
        $userAnswer = $quizData['answers'][$questionNumber] ?? null;

        // Update current question in session
        $quizData['current_question'] = $questionNumber;
        session(['quiz_' . $session_id => $quizData]);

        return Inertia::render('Quiz/Question', [
            'course' => Course::where('slug', $courseSlug)->first(),
            'question' => [
                'id' => $questionNumber,
                'text' => $question['question'],
                'options' => [
                    'A' => $question['options']['A'] ?? '',
                    'B' => $question['options']['B'] ?? '',
                    'C' => $question['options']['C'] ?? '',
                    'D' => $question['options']['D'] ?? '',
                ],
                'number' => $questionNumber,
                'total' => $total
            ],
            'userAnswer' => $userAnswer,
            'sessionId' => $session_id,
            'isCompleted' => count($quizData['answers']) === $total
        ]);
    }


    /**
     * Submit an answer for a quiz question.
     */
    public function submitAnswer(Request $request)
    {
        $request->validate([
            'question_number' => 'required|integer|min:1',
            'selected_answer' => 'required|in:A,B,C,D',
            'session_id' => 'required|string',
            'course_slug' => 'required|string'
        ]);

        $user = auth()->user();
        $questionNumber = $request->input('question_number');
        $selectedAnswer = $request->input('selected_answer');
        $sessionId = $request->input('session_id');
        $courseSlug = $request->input('course_slug');

        // Get quiz data from session
        $quizData = session('quiz_' . $sessionId);

        if (!$quizData) {
            return redirect()->route('quizzes')
                ->with('error', 'Quiz session expired or not found. Please start a new quiz.');
        }

        $questions = $quizData['questions'];

        // Ensure question number is valid
        if ($questionNumber < 1 || $questionNumber > count($questions)) {
            return redirect()->back()->with('error', 'Invalid question number.');
        }

        // Get the question and check if the answer is correct
        $question = $questions[$questionNumber - 1];
        $correctAnswer = $question['correct_answer'] ?? ($question['correct_option'] ?? null);
        $isCorrect = $selectedAnswer === $correctAnswer;

        // Store the answer in session
        $quizData['answers'][$questionNumber] = $selectedAnswer;
        $quizData['is_correct'][$questionNumber] = $isCorrect;
        session(['quiz_' . $sessionId => $quizData]);

        // If this was the last question, redirect to results
        if ($questionNumber >= count($questions)) {
            return redirect()->route('quizzes.results', [
                'courseSlug' => $courseSlug,
                'session_id' => $sessionId
            ]);
        }

        // Otherwise, go to the next question
        return redirect()->route('quizzes.question', [
            'courseSlug' => $courseSlug,
            'questionNumber' => $questionNumber + 1,
            'session_id' => $sessionId
        ]);
    }

    /**
     * Show quiz results.
     */
    public function results(string $courseSlug, string $session_id)
    {
        $user = auth()->user();

        // Get quiz data from session
        $quizData = session('quiz_' . $session_id);

        if (!$quizData) {
            return redirect()->route('quizzes')
                ->with('error', 'Quiz session expired or not found. Please start a new quiz.');
        }

        $questions = $quizData['questions'];
        $answers = $quizData['answers'] ?? [];
        $isCorrect = $quizData['is_correct'] ?? [];

        // Calculate score
        $totalQuestions = count($questions);
        $correctAnswers = count(array_filter($isCorrect, function($value) { return $value === true; }));
        $score = $totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100) : 0;

        // Format responses for the view
        $responses = [];
        foreach ($questions as $index => $question) {
            $questionNumber = $index + 1;
            if (isset($answers[$questionNumber])) {
                $responses[] = [
                    'question' => $question['question'],
                    'selected_answer' => $answers[$questionNumber],
                    'correct_answer' => $question['correct_answer'] ?? ($question['correct_option'] ?? 'A'),
                    'is_correct' => $isCorrect[$questionNumber] ?? false,
                    'options' => [
                        'A' => $question['options']['A'] ?? '',
                        'B' => $question['options']['B'] ?? '',
                        'C' => $question['options']['C'] ?? '',
                        'D' => $question['options']['D'] ?? '',
                    ]
                ];
            }
        }

        return Inertia::render('Quiz/Results', [
            'course' => Course::where('slug', $courseSlug)->first(),
            'score' => $score,
            'correctAnswers' => $correctAnswers,
            'totalQuestions' => $totalQuestions,
            'responses' => $responses
        ]);
    }

    /**
     * Generate quiz questions using OpenRouter API with progress tracking.
     */
    private function generateQuestionsWithAI($courseSummary, $courseSlug, $sessionId)
    {
        $apiKey = config('services.openrouter.key');
        $baseUrl = 'https://openrouter.ai/api/v1';
        $model = 'meta-llama/llama-3.3-70b-instruct:free';

        // Smaller batches - 3 or 4 questions per request
        $questionsPerBatch = 3;
        $targetTotalQuestions = 10; // Reduced from 20 to 10
        $batchCount = 3; // More batches with fewer questions each

        $prompt = "Generate {$questionsPerBatch} multiple-choice questions with 4 options each (A, B, C, D) based on the following course content. Mark the correct option with a key. Return in JSON format with fields: question, options, correct_option.";

        $fullPrompt = $prompt . "\n\nCourse: {$courseSlug}\n\nContent: {$courseSummary}";

        try {
            $allQuestions = [];
            logger()->info('Starting quiz generation for ' . $courseSlug);

            for ($i = 0; $i < $batchCount && count($allQuestions) < $targetTotalQuestions; $i++) {
                // Add shorter delay between requests
                if ($i > 0) {
                    usleep(300000); // 0.3 second delay
                }

                // Update progress in session
                $currentProgress = intval(($i / $batchCount) * 100);
                $this->updateGenerationProgress($sessionId, $currentProgress, $allQuestions);

                logger()->info('Generating batch ' . ($i + 1) . ' of questions');

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json'
                ])->post($baseUrl . '/chat/completions', [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a helpful assistant that generates quiz questions based on course content.'],
                        ['role' => 'user', 'content' => $fullPrompt]
                    ],
                    'temperature' => 0.5,
                    'max_tokens' => 1500
                ]);

                logger()->info('OpenRouter API Response', [
                    'status' => $response->status(),
                    'successful' => $response->successful() ? 'yes' : 'no'
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $content = $data['choices'][0]['message']['content'] ?? '';

                    // Extract JSON from the response
                    preg_match('/\[\s*\{.*\}\s*\]/s', $content, $matches);
                    $jsonString = $matches[0] ?? '';

                    if (!empty($jsonString)) {
                        $questions = json_decode($jsonString, true);

                        if (is_array($questions) && !empty($questions)) {
                            foreach ($questions as $q) {
                                if (isset($q['question'])) {
                                    $formattedQuestion = [
                                        'question' => $q['question'],
                                        'options' => isset($q['options']) && is_array($q['options']) ?
                                            [
                                                'A' => $q['options']['A'] ?? '',
                                                'B' => $q['options']['B'] ?? '',
                                                'C' => $q['options']['C'] ?? '',
                                                'D' => $q['options']['D'] ?? ''
                                            ] :
                                            [
                                                'A' => $q['option_a'] ?? $q['options'][0] ?? '',
                                                'B' => $q['option_b'] ?? $q['options'][1] ?? '',
                                                'C' => $q['option_c'] ?? $q['options'][2] ?? '',
                                                'D' => $q['option_d'] ?? $q['options'][3] ?? ''
                                            ],
                                        'correct_answer' => $q['correct_option'] ?? $q['correct_answer'] ?? 'A'
                                    ];

                                    // Add to questions array if not a duplicate
                                    $isDuplicate = false;
                                    foreach ($allQuestions as $existingQuestion) {
                                        if ($existingQuestion['question'] === $formattedQuestion['question']) {
                                            $isDuplicate = true;
                                            break;
                                        }
                                    }

                                    if (!$isDuplicate && count($allQuestions) < $targetTotalQuestions) {
                                        $allQuestions[] = $formattedQuestion;

                                        // Update progress after each question is added
                                        $questionProgress = intval((count($allQuestions) / $targetTotalQuestions) * 100);
                                        $this->updateGenerationProgress($sessionId, $questionProgress, $allQuestions);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // If we got at least some questions, return them
            if (!empty($allQuestions)) {
                logger()->info('Successfully generated ' . count($allQuestions) . ' questions');

                // Update progress to 100%
                $this->updateGenerationProgress($sessionId, 100, $allQuestions, 'completed');

                return $allQuestions;
            }

            // Fallback to static questions if API fails
            logger()->info('Failed to generate questions with OpenRouter, using static questions');
            $staticQuestions = $this->getStaticQuestions($courseSlug);
            $this->updateGenerationProgress($sessionId, 100, $staticQuestions, 'completed_with_fallback');
            return $staticQuestions;

        } catch (\Exception $e) {
            logger()->error('Quiz generation error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            $staticQuestions = $this->getStaticQuestions($courseSlug);
            $this->updateGenerationProgress($sessionId, 100, $staticQuestions, 'completed_with_error');
            return $staticQuestions;
        }
    }

    /**
     * Get static questions as a fallback.
     *
     * @param string $courseSlug
     * @return array
     */
    private function getStaticQuestions($courseSlug)
    {
        // Sample questions for Python
        if ($courseSlug === 'python-programming') {
            return [
                [
                    'question' => 'What is Python?',
                    'options' => [
                        'A' => 'A type of snake',
                        'B' => 'A high-level programming language',
                        'C' => 'A database management system',
                        'D' => 'A web framework'
                    ],
                    'correct_answer' => 'B'
                ],
                [
                    'question' => 'Which of the following is NOT a Python data type?',
                    'options' => [
                        'A' => 'List',
                        'B' => 'Dictionary',
                        'C' => 'Array',
                        'D' => 'Tuple'
                    ],
                    'correct_answer' => 'C'
                ],
                [
                    'question' => 'What is the correct way to create a function in Python?',
                    'options' => [
                        'A' => 'function myFunc():',
                        'B' => 'def myFunc():',
                        'C' => 'create myFunc():',
                        'D' => 'func myFunc():'
                    ],
                    'correct_answer' => 'B'
                ]
            ];
        }

        // C++ Programming questions
        if ($courseSlug === 'cpp-programming') {
            return [
                [
                    'question' => 'What is the main purpose of this course?',
                    'options' => [
                        'A' => 'To teach programming basics',
                        'B' => 'To explore advanced concepts',
                        'C' => 'To provide practical examples',
                        'D' => 'All of the above'
                    ],
                    'correct_answer' => 'D'
                ],
                [
                    'question' => 'What is C++?',
                    'options' => [
                        'A' => 'A markup language',
                        'B' => 'An object-oriented programming language',
                        'C' => 'A database system',
                        'D' => 'A web framework'
                    ],
                    'correct_answer' => 'B'
                ],
                [
                    'question' => 'Which of the following is a correct way to declare a variable in C++?',
                    'options' => [
                        'A' => 'var x = 10;',
                        'B' => 'int x = 10;',
                        'C' => 'x = 10;',
                        'D' => 'declare x = 10;'
                    ],
                    'correct_answer' => 'B'
                ],
                [
                    'question' => 'What is the purpose of the "break" statement in a loop?',
                    'options' => [
                        'A' => 'To repeat a block of code',
                        'B' => 'To skip a block of code',
                        'C' => 'To exit a loop or skip to the next iteration',
                        'D' => 'To add a delay in the program execution'
                    ],
                    'correct_answer' => 'C'
                ],
                [
                    'question' => 'What is the primary advantage of using vectors in C++?',
                    'options' => [
                        'A' => 'They are static and fixed-size',
                        'B' => 'They are dynamic and resizable',
                        'C' => 'They are only used for storing integers',
                        'D' => 'They are only used for storing characters'
                    ],
                    'correct_answer' => 'B'
                ],
                [
                    'question' => 'What is the purpose of a try-catch statement?',
                    'options' => [
                        'A' => 'To handle exceptions and errors',
                        'B' => 'To execute code regardless of whether an exception occurred',
                        'C' => 'To define a block of code to be executed if no exceptions occur',
                        'D' => 'To declare a new exception type'
                    ],
                    'correct_answer' => 'A'
                ],
                [
                    'question' => 'What is polymorphism in object-oriented programming?',
                    'options' => [
                        'A' => 'The ability to create multiple objects',
                        'B' => 'The ability to hide implementation details',
                        'C' => 'The ability of a function to perform different tasks based on the object that invokes it',
                        'D' => 'The process of combining data and functions into a single unit'
                    ],
                    'correct_answer' => 'C'
                ]
            ];
        }

        // Default fallback questions
        return [
            [
                'question' => 'What is the output of 2 + 2?',
                'options' => [
                    'A' => '3',
                    'B' => '4',
                    'C' => '5',
                    'D' => '6'
                ],
                'correct_answer' => 'B'
            ],
            [
                'question' => 'What is the capital of France?',
                'options' => [
                    'A' => 'London',
                    'B' => 'Berlin',
                    'C' => 'Paris',
                    'D' => 'Madrid'
                ],
                'correct_answer' => 'C'
            ]
        ];
    }


    /**
     * Update the quiz generation progress in the session.
     */
    private function updateGenerationProgress($sessionId, $progress, $questions, $status = 'in_progress')
    {
        $generationData = session('quiz_generation_' . $sessionId) ?? [];
        $generationData['progress'] = $progress;
        $generationData['questions'] = $questions;
        $generationData['status'] = $status;
        $generationData['last_updated'] = now();

        session(['quiz_generation_' . $sessionId => $generationData]);
        return $generationData;
    }

    /**
     * Process quiz generation in the background and update progress.
     */
    public function processGeneration(Request $request, string $courseSlug, string $session_id)
    {
        $user = auth()->user();
        $course = Course::where('slug', $courseSlug)->firstOrFail();
        $courseSummary = CourseSummary::where('slug', $courseSlug)->first();

        if (!$courseSummary) {
            return response()->json(['error' => 'No course summary available'], 404);
        }

        // Start the generation process
        $questions = $this->generateQuestionsWithAI($courseSummary->summary, $courseSlug, $session_id);

        return response()->json([
            'status' => 'completed',
            'questions_count' => count($questions)
        ]);
    }

}
