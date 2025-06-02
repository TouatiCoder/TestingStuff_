import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function QuizGenerating({ auth, errors, course, sessionId, totalQuestions }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('starting');
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Start the generation process
        const startGeneration = async () => {
            try {
                setStatus('generating');
                // Trigger the generation process in the backend
                await axios.get(route('quizzes.process-generation', [course.slug, sessionId]));
            } catch (err) {
                setError('Failed to start quiz generation. Please try again.');
                setStatus('error');
                console.error(err);
            }
        };

        startGeneration();

        // Set up polling to check progress
        const checkProgressInterval = setInterval(async () => {
            try {
                const response = await axios.get(route('quizzes.check-progress', [course.slug, sessionId]));
                const data = response.data;
                
                setProgress(data.progress || 0);
                setQuestions(data.questions || []);
                
                // If generation is completed, redirect to start the quiz
                if (data.status === 'completed' || data.status === 'completed_with_fallback' || data.status === 'completed_with_error') {
                    clearInterval(checkProgressInterval);
                    setStatus('completed');
                    
                    // Small delay before redirecting to ensure user sees 100%
                    setTimeout(() => {
                        window.location.href = route('quizzes.start', [course.slug, sessionId]);
                    }, 1500);
                }
            } catch (err) {
                console.error('Error checking progress:', err);
                // Don't stop polling on error, just log it
            }
        }, 1000); // Check every second

        // Cleanup
        return () => {
            clearInterval(checkProgressInterval);
        };
    }, [sessionId, course.slug]);

    // Generate question dots for animation
    const generateQuestionDots = () => {
        const dots = [];
        const completedQuestions = Math.ceil((questions.length / totalQuestions) * 100) / 100 * totalQuestions;
        
        for (let i = 0; i < totalQuestions; i++) {
            const isComplete = i < completedQuestions;
            const isGenerating = i === Math.floor(completedQuestions) && progress < 100;
            
            dots.push(
                <div 
                    key={i} 
                    className={`h-4 w-4 rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-green-500' : 
                        isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'
                    }`}
                    title={`Question ${i + 1}`}
                ></div>
            );
        }
        
        return dots;
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Generating Quiz</h2>
                </div>
            }
        >
            <Head title={`Generating ${course.name} Quiz`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">{course.name} Quiz</h3>
                            
                            {error ? (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <p className="text-gray-600 mb-4">
                                            {status === 'starting' && 'Preparing to generate quiz questions...'}
                                            {status === 'generating' && 'Generating personalized quiz questions based on course content...'}
                                            {status === 'completed' && 'Quiz generation complete! Redirecting to quiz...'}
                                        </p>
                                        
                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                            <div 
                                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        
                                        {/* Progress percentage */}
                                        <p className="text-gray-700 font-medium mb-6">
                                            {progress}% Complete
                                        </p>
                                        
                                        {/* Question dots */}
                                        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mb-4">
                                            {generateQuestionDots()}
                                        </div>
                                        
                                        {/* Question count */}
                                        <p className="text-sm text-gray-500">
                                            Generated {questions.length} of {totalQuestions} questions
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
