import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function QuizGenerate({ auth, errors, course }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        window.location.href = route('quizzes.generate', course.slug);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Generate Quiz</h2>
                </div>
            }
        >
            <Head title={`${course.name} Quiz`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">{course.name} Quiz</h3>
                            
                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    You're about to generate a quiz with 10 questions based on the content of this course.
                                </p>
                                <p className="text-gray-600 mb-4">
                                    Each question will have 4 multiple-choice options (A, B, C, D).
                                </p>
                                <p className="text-gray-600 mb-4">
                                    You'll be able to see your results after completing all questions.
                                </p>
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href={route('quizzes')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </Link>
                                
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    {isGenerating ? 'Generating...' : 'Generate Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
