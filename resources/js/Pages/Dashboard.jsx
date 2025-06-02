// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Dashboard(props) {
//     return (
//         <AuthenticatedLayout
//             auth={props.auth}
//             errors={props.errors}
//             header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">You're logged in!</div>
//                     </div>
//                 </div>
//             </div>

//         </AuthenticatedLayout>
//     );
// }


import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
// import { getCourseIcon } from '@/Pages/Courses';

export default function Dashboard({ auth, errors, userCourses, availableCourses, upcomingLessons = [], availableQuizzes = [], weeklyActivity = [], streak = 0, totalHours = 0, studyTime = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Track user activity when they leave the page
    useEffect(() => {
        const recordLogout = () => {
            // Send logout event to the server
            navigator.sendBeacon('/user-activity/logout');
        };
        
        // Add event listeners for page unload/visibility change
        window.addEventListener('beforeunload', recordLogout);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                recordLogout();
            }
        });
        
        // Clean up event listeners
        return () => {
            window.removeEventListener('beforeunload', recordLogout);
            document.removeEventListener('visibilitychange', recordLogout);
        };
    }, []);

    const toggleCourseSelection = (courseId) => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const handleEnroll = () => {
        if (selectedCourses.length === 0) {
            alert('Please select at least one course to enroll');
            return;
        }

        setIsLoading(true);

        router.post('/api/user/courses', {
            courses: selectedCourses
        }, {
            onSuccess: () => {
                setIsLoading(false);
                setIsModalOpen(false);
                setSelectedCourses([]);
            },
            onError: (errors) => {
                setIsLoading(false);
                alert('There was an error enrolling in courses. Please try again.');
            }
        });
    };

    // Use real course progress data from the backend
    // We don't need useState here since the data comes from props
    const courseProgress = userCourses || [];

    // Use the dynamic quiz data from the backend
    const [codingChallenges] = useState(() => {
        // Add action property to each quiz
        return availableQuizzes.map(quiz => ({
            ...quiz,
            action: 'Start'
        }));
    });

    // upcomingLessons is now destructured from props

    // Use the real activity data from props instead of static data

    // We'll use userCourses directly for Quick Access instead of static data

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'course',
            message: 'New course available: "Advanced React Hooks"',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'challenge',
            message: 'Challenge completed: "JavaScript Basics"',
            time: '5 hours ago'
        },
        {
            id: 3,
            type: 'reminder',
            message: 'Reminder: "Complete your Python project by Friday"',
            time: '1 day ago'
        }
    ]);

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Enroll in New Courses
                    </button>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Course Progress Section */}
                        <div className="md:col-span-2">
                            <div className="bg-white border rounded-lg shadow-sm h-full">
                                <div className="border-b px-6 py-4">
                                    <h3 className="text-lg font-medium">Course Progress</h3>
                                </div>
                                <div className="p-6">
                                    {courseProgress.length > 0 ? (
                                        courseProgress.map((userCourse) => (
                                            <div key={userCourse.id} className="mb-6">
                                                <div className="flex justify-between mb-2">
                                                    <Link
                                                        href={route('courses.youtube', userCourse.course.slug)}
                                                        className="text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        {userCourse.course.name}
                                                    </Link>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-700 mr-2">{userCourse.progress}%</span>
                                                        <span className="text-xs text-gray-500">
                                                            ({userCourse.last_at}/{userCourse.course.total_lessons || '?'})
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${userCourse.progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                                                        style={{ width: `${userCourse.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coding Challenges Section */}
                        <div>
                            <div className="bg-white border rounded-lg shadow-sm h-full">
                                <div className="border-b px-6 py-4">
                                    <h3 className="text-lg font-medium">Coding Challenges</h3>
                                </div>
                                <div className="p-6">
                                    {codingChallenges.map((challenge, index) => (
                                        <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                            <span className={`${challenge.available ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {challenge.title}
                                            </span>
                                            {challenge.available ? (
                                                <Link
                                                    href={route('quizzes.generate', challenge.courseSlug)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-4 rounded"
                                                >
                                                    {challenge.action}
                                                </Link>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-amber-600 bg-amber-100 py-1 px-3 rounded-full mb-1">
                                                        Complete course first
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {challenge.progress}% completed
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Lessons Section */}
                        <div>
                            <div className="bg-white border rounded-lg shadow-sm h-full">
                                <div className="border-b px-6 py-4">
                                    <h3 className="text-lg font-medium">Upcoming Lessons</h3>
                                </div>
                                <div className="p-6">
                                    {upcomingLessons.length > 0 ? (
                                        <ul>
                                            {upcomingLessons.map((lesson, index) => (
                                                <li key={index} className="py-3 border-b last:border-b-0">
                                                    <Link
                                                        href={lesson.type === 'youtube'
                                                            ? route('courses.youtube.lesson', { course: lesson.course_slug, videoId: lesson.video_id })
                                                            : route('courses.lesson', { course: lesson.course_slug, lesson: lesson.lesson_id })}
                                                        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        <span className="text-2xl mr-3">{getCourseIcon(lesson.course_slug)}</span>
                                                        <div>
                                                            <div className="font-medium">{cleanLessonTitle(lesson.lesson_title)}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {lesson.course_name} • Lesson {lesson.lesson_number}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500">No upcoming lessons available.</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                You've either completed all your courses or haven't enrolled in any yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Section */}
                        <div>
                            <div className="bg-white border rounded-lg shadow-sm h-full">
                                <div className="border-b px-6 py-4">
                                    <h3 className="text-lg font-medium">Quick Access</h3>
                                </div>
                                <div className="p-6">
                                    {userCourses.length > 0 ? (
                                        <ul>
                                            {userCourses.map((userCourse) => (
                                                <li key={userCourse.id} className="py-3 border-b last:border-b-0">
                                                    <Link
                                                        href={route('courses.youtube', userCourse.course.slug)}
                                                        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        <span className="text-2xl mr-3">{getCourseIcon(userCourse.course.slug)}</span>
                                                        <div>
                                                            <div className="font-medium">{userCourse.course.name}</div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Your Learning Activity Section (Replacing Quick Access) */}
                        <div>
                            <div className="bg-white border rounded-lg shadow-sm h-full">
                                <div className="border-b px-6 py-4">
                                    <h3 className="text-lg font-medium">Your Learning Activity</h3>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-700">Current streak</span>
                                            <span className="font-bold text-green-600">{streak} {streak === 1 ? 'day' : 'days'}</span>
                                        </div>
                                        <div className="flex justify-between items-end space-x-1">
                                            {weeklyActivity.map((day, index) => (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div className="group relative">
                                                        <div
                                                            className={`w-6 ${day.hours > 0 ? 'bg-blue-600' : 'bg-gray-200'} rounded-sm transition-all hover:bg-blue-700`}
                                                            style={{ height: `${day.hours * 10 + 5}px` }}
                                                        ></div>
                                                        {/* Tooltip that appears on hover */}
                                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                {day.hours} {day.hours === 1 ? 'hour' : 'hours'}
                                                            </div>
                                                            {/* Triangle pointer */}
                                                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-t-gray-800 border-l-transparent border-r-transparent mx-auto"></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center mt-6">
                                        <p className="text-gray-700">You've studied <span className="font-bold text-blue-600">{studyTime ? studyTime.value : totalHours} {studyTime ? studyTime.unit : (totalHours === 1 ? 'hour' : 'hours')}</span> this week!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications Section */}
                        <div className="md:col-span-3">
                            <div className="bg-white border rounded-lg shadow-sm">
                                <div className="border-b px-6 py-4">
                                    <h3 className="text-lg font-medium">Notifications</h3>
                                </div>
                                <div className="p-6">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="flex items-start py-3 border-b last:border-b-0">
                                            <div className="mr-3 text-xl">
                                                {notification.type === 'course' && '📚'}
                                                {notification.type === 'challenge' && '🏆'}
                                                {notification.type === 'reminder' && '⏰'}
                                            </div>
                                            <div>
                                                <div className="text-gray-800">{notification.message}</div>
                                                <div className="text-gray-500 text-sm">{notification.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enroll in New Courses Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
                        <div className="border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium">Enroll in New Courses</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {availableCourses.map((course) => (
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
                        </div>
                        <div className="border-t px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnroll}
                                disabled={selectedCourses.length === 0 || isLoading}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                    selectedCourses.length === 0 || isLoading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isLoading ? 'Enrolling...' : `Enroll in ${selectedCourses.length} Course${selectedCourses.length !== 1 ? 's' : ''}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
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
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function cleanLessonTitle(title) {
    // If the title contains a dash, keep only the part after the dash
    if (title.includes(' - ')) {
        return title.split(' - ').pop().trim();
    }

    // For titles that use other dash characters
    if (title.includes(' – ') || title.includes(' — ')) {
        return title.split(/\s+[\-–—]\s+/).pop().trim();
    }

    return title;
}
