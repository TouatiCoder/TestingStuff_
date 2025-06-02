import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { fetchPlaylistVideos } from '@/utils/youtubeApi';
import { getPlaylistIdBySlug } from '@/utils/playlistMap';

// function cleanTitle(title) {
//     // Remove 'Learn Python in Arabic #001 - ' or similar prefix
//     return title.replace(/^Learn Python in Arabic #[0-9]+ - /i, '').trim();
// }
function cleanTitle(title) {
    // Remove different course prefixes like "Learn Python in Arabic #001 -", "[Arabic] Fundamentals Of Programming With C++ #001 -", etc.
    return title
        .replace(/^(\[Arabic\]\s*)?Fundamentals Of Programming With C\+\+ #[0-9]+ - /i, '')
        .replace(/^Learn PHP 8 In Arabic 2022 - #[0-9]+ - /i, '')
        .replace(/^Learn Python in Arabic #[0-9]+ - /i, '')
        .trim();
}

export default function CourseLessons({ auth, course, userProgress, lessons: propLessons }) {
    const [videos, setVideos] = useState([]);
    const [nextPageToken, setNextPageToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [lastAt, setLastAt] = useState(userProgress?.last_at || 1);

    const playlistId = getPlaylistIdBySlug(course.slug);

    useEffect(() => {
        setLoading(true);
        fetchPlaylistVideos(playlistId)
            .then(data => {
                setVideos(data.items);
                setNextPageToken(data.nextPageToken || '');
            })
            .finally(() => setLoading(false));
    }, [playlistId]);

    const loadMore = () => {
        if (!nextPageToken) return;
        fetchPlaylistVideos(playlistId, nextPageToken)
            .then(data => {
                setVideos(prev => [...prev, ...data.items]);
                setNextPageToken(data.nextPageToken || '');
            });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={course.name} />
            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-4xl font-bold text-center mb-4">
                    {course.name}
                </h1>
                
                {/* Progress Bar */}
                <div className="max-w-lg mx-auto mb-10">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{userProgress?.progress || 0}% ({userProgress?.last_at || 1}/{course.total_lessons || '?'} lessons)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${
                                (userProgress?.progress || 0) === 100 ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${userProgress?.progress || 0}%` }}
                        ></div>
                    </div>
                </div>
                {loading ? (
                    <div>Loading videos...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {videos.map((video, idx) => (
                                <Link
                                    key={video.id || video.snippet.resourceId.videoId}
                                    href={route('courses.youtube.lesson', {
                                        course: course.slug,
                                        videoId: video.snippet.resourceId.videoId
                                    })}
                                    className={`relative flex flex-col items-center ${
                                        idx + 1 <= lastAt 
                                            ? 'bg-white hover:shadow-md cursor-pointer' 
                                            : 'bg-gray-100 cursor-not-allowed'
                                    } rounded-xl shadow-sm border p-6 min-h-[120px] transition group focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    onClick={(e) => {
                                        if (idx + 1 > lastAt) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <div className="w-full flex-1 flex items-start justify-center">
                                        <span className="text-lg font-semibold text-gray-900 text-center w-full break-words mt-1">
                                            {cleanTitle(video.snippet.title)}
                                        </span>
                                    </div>
                                    <div className="absolute left-4 bottom-4">
                                        <span className="inline-block bg-blue-600 text-white font-bold rounded px-3 py-1 text-xs align-middle">
                                            {String(idx + 1).padStart(3, '0')}
                                        </span>
                                    </div>
                                    <span
                                        className="absolute right-4 bottom-4 flex items-center px-4 py-1.5 border border-blue-600 text-blue-600 bg-gray-50 rounded font-semibold text-xs group-hover:bg-blue-50 transition shadow"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <polygon points="10,9 16,12 10,15" fill="currentColor" />
                                        </svg>
                                        Watch
                                    </span>
                                </Link>
                            ))}
                        </div>
                        {nextPageToken && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                                >
                                    Load More Videos
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
