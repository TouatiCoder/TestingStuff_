import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function OnboardingPage({ courses }) {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleCourseSelection = (courseId) => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const handleSubmit = () => {
        if (selectedCourses.length === 0) {
            alert('Please select at least one course to continue');
            return;
        }

        setIsLoading(true);

        router.post('/api/user/courses', {
            courses: selectedCourses
        }, {
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: (errors) => {
                setIsLoading(false);
                alert('There was an error saving your courses. Please try again.');
            }
        });
    };

    return (
        <>
            <Head title="Choose Your Courses" />

            <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Welcome to L-earn Academy
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Choose languages you're interested in learning to personalize your dashboard.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            You can always add or remove languages later.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                    selectedCourses.includes(course.id)
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200'
                                }`}
                                onClick={() => toggleCourseSelection(course.id)}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-4xl">{getCourseIcon(course.slug)}</span>
                                        {selectedCourses.includes(course.id) && (
                                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>

                                    <p className="mt-2 text-sm text-gray-500">{course.description}</p>

                                    <div className="mt-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="font-medium">Level:</span>
                                            <span className="ml-1">{course.difficulty}</span>
                                        </div>

                                        <div className="mt-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="font-medium">Duration:</span>
                                                <span className="ml-1">{formatDuration(course.duration)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selectedCourses.length === 0 || isLoading}
                            className={`
                                inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm
                                ${selectedCourses.length === 0 || isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }
                            `}
                        >
                            {isLoading ? 'Saving...' : `Get Started with ${selectedCourses.length} Course${selectedCourses.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function getCourseIcon(slug) {
    const icons = {
        'python-programming': '🐍',
        'php-development': '🐘',
        'cpp-programming': '⚙️'
    };
    return icons[slug] || '📚';
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}
