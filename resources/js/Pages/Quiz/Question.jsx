import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function QuizQuestion({ auth, errors, course, question, userAnswer, sessionId, isCompleted }) {
    const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedAnswer || isSubmitting) return;
        
        setIsSubmitting(true);
        
        router.post(route('quizzes.submit-answer'), {
            question_number: question.number,
            selected_answer: selectedAnswer,
            session_id: sessionId,
            course_slug: course.slug
        }, {
            onSuccess: () => {
                if (question.number < question.total) {
                    // Go to next question
                    window.location.href = route('quizzes.question', {
                        courseSlug: course.slug,
                        questionNumber: question.number + 1,
                        session_id: sessionId
                    });
                } else {
                    // Quiz completed, go to results
                    window.location.href = route('quizzes.results', {
                        courseSlug: course.slug,
                        session_id: sessionId
                    });
                }
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };
    
    const handleOptionSelect = (option) => {
        if (userAnswer) return; // Don't allow changing if already answered
        setSelectedAnswer(option);
    };
    
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">{course.name} Quiz</h2>
                </div>
            }
        >
            <Head title={`Quiz Question ${question.number}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Question {question.number} of {question.total}</h3>
                                <span className="text-sm text-gray-500">
                                    {Math.round((question.number / question.total) * 100)}% Complete
                                </span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                <div 
                                    className="h-2.5 rounded-full bg-blue-600" 
                                    style={{ width: `${(question.number / question.total) * 100}%` }}
                                ></div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-800 text-lg mb-4">{question.text}</p>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-3 mb-6">
                                    {Object.entries(question.options).map(([key, value]) => (
                                        <div 
                                            key={key}
                                            onClick={() => handleOptionSelect(key)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAnswer === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'} ${userAnswer ? 'cursor-default' : ''}`}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedAnswer === key ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'}`}>
                                                        {key}
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-gray-700">{value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between">
                                    {question.number > 1 && (
                                        <a 
                                            href={route('quizzes.question', { courseSlug: course.slug, questionNumber: question.number - 1, session_id: sessionId })}
                                            className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            Previous
                                        </a>
                                    )}
                                    
                                    <div className="ml-auto">
                                        {userAnswer ? (
                                            <a 
                                                href={question.number < question.total 
                                                    ? route('quizzes.question', { courseSlug: course.slug, questionNumber: question.number + 1, session_id: sessionId })
                                                    : route('quizzes.results', { courseSlug: course.slug, session_id: sessionId })
                                                }
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                {question.number < question.total ? 'Next Question' : 'View Results'}
                                            </a>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={!selectedAnswer || isSubmitting}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
