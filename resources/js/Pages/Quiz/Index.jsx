import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function QuizIndex({ auth, errors, completedCourses }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Quizzes</h2>
                </div>
            }
        >
            <Head title="Quizzes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Available Quizzes</h3>
                        
                        {completedCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedCourses.map((userCourse) => (
                                    <div key={userCourse.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                        <div className="p-6">
                                            <h4 className="text-lg font-medium mb-2">{userCourse.course.name}</h4>
                                            <p className="text-gray-600 mb-4 text-sm">
                                                {userCourse.course.description.substring(0, 100)}...
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-green-600 font-medium">
                                                    {userCourse.progress}% Complete
                                                </span>
                                                <Link
                                                    href={route('quizzes.show', userCourse.course.slug)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                                >
                                                    Take Quiz
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You haven't completed any courses yet.</p>
                                <p className="text-sm text-gray-400">
                                    Complete a course with 100% progress to unlock its quiz.
                                </p>
                                <Link
                                    href={route('courses')}
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    View Courses
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
