import React from 'react';
import { Link } from '@inertiajs/react';

const LessonNavigation = ({ navigation, isQuizCorrect }) => {
    if (!navigation) return null;

    return (
        <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-lg shadow-sm">
            {/* Previous Button */}
            {navigation.previous ? (
                <Link
                    href={route('lessons.youtube', {
                        course: navigation.previous.course_slug,
                        videoId: navigation.previous.videoId,
                        title: navigation.previous.title
                    })}
                    className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </Link>
            ) : (
                <div className="w-24"></div> /* Spacer to maintain layout */
            )}

            {/* Next Button */}
            {navigation.next ? (
                <Link
                    href={route('lessons.youtube', {
                        course: navigation.next.course_slug,
                        videoId: navigation.next.videoId,
                        title: navigation.next.title
                    })}
                    className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                        isQuizCorrect
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => !isQuizCorrect && e.preventDefault()}
                >
                    Next
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            ) : (
                <div className="w-24"></div> /* Spacer to maintain layout */
            )}
        </div>
    );
};

export default LessonNavigation;
