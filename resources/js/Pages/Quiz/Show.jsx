import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function QuizShow({ auth, errors, course, quizId, totalQuestions, userResponses }) {
    const [completedQuestions, setCompletedQuestions] = useState(userResponses ? userResponses.length : 0);
    
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
            <Head title={`${course.name} Quiz`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">Quiz Overview</h3>
                            
                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    This quiz contains {totalQuestions} multiple-choice questions about {course.name}.
                                </p>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div 
                                        className="h-2.5 rounded-full bg-blue-600" 
                                        style={{ width: `${(completedQuestions / totalQuestions) * 100}%` }}
                                    ></div>
                                </div>
                                
                                <p className="text-gray-600 mb-4">
                                    You have completed {completedQuestions} out of {totalQuestions} questions.
                                </p>
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href={route('quizzes')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Back to Quizzes
                                </Link>
                                
                                {completedQuestions === totalQuestions ? (
                                    <Link
                                        href={route('quizzes.results', course.slug)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        View Results
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('quizzes.question', { courseSlug: course.slug, questionNumber: completedQuestions + 1 })}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {completedQuestions > 0 ? 'Continue Quiz' : 'Start Quiz'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
