import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function QuizResults({ auth, errors, course, score, correctAnswers, totalQuestions, responses }) {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">{course.name} Quiz Results</h2>
                </div>
            }
        >
            <Head title={`Quiz Results - ${course.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-medium mb-4">Your Score</h3>
                            
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-100 mb-4">
                                    <span className="text-3xl font-bold text-blue-600">{score}%</span>
                                </div>
                                
                                <p className="text-gray-600 mb-2">
                                    You answered {correctAnswers} out of {totalQuestions} questions correctly.
                                </p>
                                
                                {score >= 70 ? (
                                    <p className="text-green-600 font-medium">
                                        Congratulations! You passed the quiz.
                                    </p>
                                ) : (
                                    <p className="text-yellow-600 font-medium">
                                        Keep learning and try again to improve your score.
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="font-medium">{showDetails ? 'Hide' : 'Show'} Detailed Results</span>
                                <svg className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            {showDetails && (
                                <div className="mt-4 space-y-4">
                                    {responses.map((response, index) => (
                                        <div key={index} className={`p-4 border rounded-lg ${response.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                            <p className="font-medium mb-2">{index + 1}. {response.question}</p>
                                            
                                            <div className="space-y-2 mb-2">
                                                {Object.entries(response.options).map(([key, value]) => (
                                                    <div 
                                                        key={key}
                                                        className={`p-3 rounded-lg ${response.selected_answer === key && response.correct_answer === key ? 'bg-green-100' : ''} ${response.selected_answer === key && response.correct_answer !== key ? 'bg-red-100' : ''} ${response.selected_answer !== key && response.correct_answer === key ? 'bg-green-100' : ''}`}
                                                    >
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0">
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${response.correct_answer === key ? 'bg-green-500 text-white' : response.selected_answer === key ? 'bg-red-500 text-white' : 'border border-gray-300'}`}>
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
                                            
                                            <div className={`text-sm ${response.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                                {response.is_correct ? 'Correct answer!' : `Incorrect. The correct answer is ${response.correct_answer}.`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                            <Link
                                href={route('quizzes')}
                                className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Back to Quizzes
                            </Link>
                            
                            <Link
                                href={route('courses.youtube', course.slug)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Return to Course
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
