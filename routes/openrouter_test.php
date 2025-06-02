<?php

use Illuminate\Support\Facades\Route;
use App\Models\CourseSummary;
use Illuminate\Support\Facades\Http;

// Test route for quiz questions generation with OpenRouter
Route::get('/test-openrouter/{courseSlug}', function ($courseSlug) {
    // Get the course summary
    $courseSummary = CourseSummary::where('slug', $courseSlug)->first();
    
    if (!$courseSummary) {
        return response()->json(['error' => 'Course summary not found'], 404);
    }
    
    // OpenRouter configuration
    $apiKey = config('services.openrouter.key');
    $baseUrl = 'https://openrouter.ai/api/v1';
    $model = 'meta-llama/llama-3.3-70b-instruct:free';
    
    // Create a custom prompt for quiz questions
    $prompt = "Generate 5 multiple-choice questions with 4 options each (A, B, C, D) based on the following course content. Mark the correct option with a key. Return in JSON format with fields: question, options, correct_option.";
    
    $fullPrompt = $prompt . "\n\nCourse: {$courseSlug}\n\nContent: {$courseSummary->summary}";
    
    try {
        // Make the API request to OpenRouter
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
            'max_tokens' => 1000
        ]);
        
        if (!$response->successful()) {
            return response()->json([
                'error' => 'OpenRouter API request failed',
                'details' => $response->json()
            ], 500);
        }
        
        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? '';
        
        // Extract JSON from the response
        preg_match('/\[\s*\{.*\}\s*\]/s', $content, $matches);
        $jsonString = $matches[0] ?? '';
        
        if (empty($jsonString)) {
            return response()->json([
                'error' => 'Could not extract JSON from response',
                'content' => $content
            ], 500);
        }
        
        $questions = json_decode($jsonString, true);
        
        if (!is_array($questions) || empty($questions)) {
            return response()->json([
                'error' => 'Invalid questions format',
                'parsed' => $questions,
                'raw_content' => $content
            ], 500);
        }
        
        // Format the questions
        $formattedQuestions = [];
        foreach ($questions as $q) {
            if (isset($q['question'])) {
                $formattedQuestions[] = [
                    'question' => $q['question'],
                    'options' => isset($q['options']) && is_array($q['options']) ? 
                        [
                            'A' => $q['options']['A'] ?? '',
                            'B' => $q['options']['B'] ?? '',
                            'C' => $q['options']['C'] ?? '',
                            'D' => $q['options']['D'] ?? ''
                        ] : 
                        [
                            'A' => $q['option_a'] ?? '',
                            'B' => $q['option_b'] ?? '',
                            'C' => $q['option_c'] ?? '',
                            'D' => $q['option_d'] ?? ''
                        ],
                    'correct_answer' => $q['correct_option'] ?? $q['correct_answer'] ?? 'A'
                ];
            }
        }
        
        return response()->json([
            'course' => $courseSlug,
            'questions_count' => count($formattedQuestions),
            'questions' => $formattedQuestions,
            'raw_response' => $content // Include raw response for debugging
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
});
