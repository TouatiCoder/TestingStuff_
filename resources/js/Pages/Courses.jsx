import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Courses({ auth, errors, userCourses }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Courses</h2>}
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userCourses.map((userCourse) => (
                            <div key={userCourse.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-4xl">{getCourseIcon(userCourse.course.slug)}</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            userCourse.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {userCourse.status === 'completed' ? 'Completed' : 'In Progress'}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {userCourse.course.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4">
                                        {userCourse.course.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="font-medium">Level:</span>
                                            <span className="ml-1 capitalize">{userCourse.course.difficulty}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="font-medium">Duration:</span>
                                            <span className="ml-1">{formatDuration(userCourse.course.duration)}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Progress</span>
                                            <span>{userCourse.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    userCourse.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                                                }`}
                                                style={{ width: `${userCourse.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('courses.youtube', userCourse.course.slug)}
                                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Continue Learning
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export function getCourseIcon(slug) {
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
