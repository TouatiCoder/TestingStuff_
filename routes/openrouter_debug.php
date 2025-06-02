<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

// Debug route to test OpenRouter API directly
Route::get('/debug-openrouter', function () {
    // Get the API key from config
    $apiKey = config('services.openrouter.key');
    $baseUrl = 'https://openrouter.ai/api/v1';
    $model = 'meta-llama/llama-3.3-70b-instruct:free';
    
    // Simple test prompt
    $prompt = "Generate 3 multiple-choice questions about programming with 4 options each (A, B, C, D). Return in JSON format with fields: question, options, correct_option.";
    
    try {
        // Log the request
        Log::info('Debug OpenRouter - Starting API test');
        Log::info('API Key (masked): ' . substr($apiKey, 0, 5) . '...' . substr($apiKey, -5));
        
        // Make the API request
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post($baseUrl . '/chat/completions', [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that generates quiz questions.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.5,
            'max_tokens' => 1000
        ]);
        
        // Log the response status
        Log::info('Debug OpenRouter - Response status: ' . $response->status());
        
        if ($response->successful()) {
            $data = $response->json();
            
            // Check if we have a valid response
            if (isset($data['choices'][0]['message']['content'])) {
                $content = $data['choices'][0]['message']['content'];
                Log::info('Debug OpenRouter - Content received', [
                    'content_length' => strlen($content),
                    'content_preview' => substr($content, 0, 100) . '...'
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'API call successful',
                    'content' => $content
                ]);
            } else {
                Log::error('Debug OpenRouter - Invalid response structure', $data);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid response structure',
                    'data' => $data
                ], 500);
            }
        } else {
            Log::error('Debug OpenRouter - API call failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'API call failed',
                'status' => $response->status(),
                'body' => $response->json()
            ], 500);
        }
    } catch (\Exception $e) {
        Log::error('Debug OpenRouter - Exception: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Exception: ' . $e->getMessage()
        ], 500);
    }
});
