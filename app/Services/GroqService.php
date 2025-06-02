<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $model;
    protected int $maxTokens = 6000;
    protected int $charsPerToken = 4; // Approximate characters per token

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key');
        $this->baseUrl = 'https://api.groq.com/openai/v1';
        $this->model = 'llama3-70b-8192';
    }

    public function analyzeTranscript($transcript)
    {
        try {
            Log::info('Starting transcript analysis', ['transcript_length' => strlen($transcript)]);

            // If transcript is too long, get a summary first
            if (strlen($transcript) / $this->charsPerToken > $this->maxTokens * 0.75) {
                $transcript = $this->getSummary($transcript);
            }

            $payload = [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert at analyzing transcripts and extracting key insights and creating educational content.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Please analyze this transcript and provide:
                        1. A summary of 3 key insights (maximum 2 sentences each)
                        2. 1 multiple-choice question with 4 options and the correct answer marked

                        Format the response as JSON with the following structure:
                        {
                            \"insights\": [\"string\", \"string\", \"string\"],
                            \"question\": {
                            \"question\": \"string\",
                            \"options\": [\"string\", \"string\", \"string\", \"string\"],
                            \"correct_answer\": \"string\"
                            }
                        }

                        Ensure each insight is a simple string, not an object.

                        Transcript: {$transcript}"
                    ]
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.7,
                'max_tokens' => 1000
            ];

            Log::info('GROQ API Request', ['payload' => $payload]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', $payload);

            if (!$response->successful()) {
                Log::error('GROQ API Error', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new \Exception('GROQ API request failed: ' . json_encode($response->json()));
            }

            $responseData = $response->json();
            Log::info('GROQ API Response', ['response' => $responseData]);

            if (!isset($responseData['choices']) || empty($responseData['choices'])) {
                Log::error('No choices in GROQ response', ['response' => $responseData]);
                throw new \Exception('Invalid GROQ response structure');
            }

            $content = json_decode($responseData['choices'][0]['message']['content'], true);
            Log::info('Parsed content', ['content' => $content]);

            if (!isset($content['insights']) || !isset($content['question'])) {
                Log::error('Invalid content structure', ['content' => $content]);
                throw new \Exception('Invalid content structure');
            }

            return $content;

        } catch (\Exception $e) {
            Log::error('Error analyzing transcript', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'insights' => ['Unable to analyze transcript at this time. Error: ' . $e->getMessage()],
                'question' => [
                    'question' => 'Question not available',
                    'options' => ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                    'correct_answer' => 'Option 1'
                ]
            ];
        }
    }

    protected function getSummary($transcript)
    {
        try {
            $payload = [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert at summarizing educational content while preserving key information.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Please provide a concise summary of this transcript, focusing on the main topics and key points. Keep the summary under 2000 characters.\n\nTranscript: {$transcript}"
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1000
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', $payload);

            if (!$response->successful()) {
                throw new \Exception('Summary generation failed');
            }

            $responseData = $response->json();
            return $responseData['choices'][0]['message']['content'];

        } catch (\Exception $e) {
            Log::error('Error generating summary', [
                'error' => $e->getMessage()
            ]);
            // Return a truncated version of the original transcript as fallback
            return substr($transcript, 0, 6000 * $this->charsPerToken * 0.75);
        }
    }
}
