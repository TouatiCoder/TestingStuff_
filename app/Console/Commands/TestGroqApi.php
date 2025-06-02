<?php

namespace App\Console\Commands;

use App\Services\GroqService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestGroqApi extends Command
{
    protected $signature = 'groq:test';
    protected $description = 'Test the GROQ API integration';

    public function handle(GroqService $groqService)
    {
        $this->info('Testing GROQ API integration...');

        try {
            // Test with a simple transcript
            $testTranscript = "Python is a high-level programming language known for its simplicity and readability.
            It supports multiple programming paradigms including procedural, object-oriented, and functional programming.
            Python's extensive standard library and third-party packages make it suitable for various applications.";

            $this->info('Sending test transcript to GROQ API...');
            $result = $groqService->analyzeTranscript($testTranscript);

            $this->info('API Response received successfully!');
            $this->info('Insights:');
            foreach ($result['insights'] as $index => $insight) {
                $this->line(($index + 1) . '. ' . $insight);
            }

            $this->info("\nGenerated Question: " . $result['question']['question']);
            $this->info('Options:');
            foreach ($result['question']['options'] as $index => $option) {
                $this->line(($index + 1) . '. ' . $option);
            }
            $this->info('Correct Answer: ' . $result['question']['correct_answer']);

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error testing GROQ API: ' . $e->getMessage());
            Log::error('GROQ API Test Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return Command::FAILURE;
        }
    }
}
