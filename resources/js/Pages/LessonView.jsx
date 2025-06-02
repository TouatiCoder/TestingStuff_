import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyC2vlChHMyDY57sInDdN6QRKTJ71zMqfrc';

export default function LessonView({ auth, course, lesson, quizzes, hasAccess, lastAt }) {
    const [videoData, setVideoData] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [progressUpdated, setProgressUpdated] = useState(false);

    useEffect(() => {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${lesson.youtube_video_id}&key=${YOUTUBE_API_KEY}`)
            .then(res => res.json())
            .then(data => setVideoData(data.items && data.items[0]));
    }, [lesson.youtube_video_id]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={lesson.title} />
            <div className="max-w-4xl mx-auto py-8">
                <nav className="mb-4">
                    <Link href={route('courses')} className="text-blue-600">Home</Link> /
                    <Link href={route('courses.show', course.slug)} className="text-blue-600 ml-2">Courses</Link> /
                    <span className="ml-2">{lesson.title}</span>
                </nav>
                <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
                <div className="mb-6">
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${lesson.youtube_video_id}`}
                        title={lesson.title}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>

                {!hasAccess ? (
                    <div className="mb-6 bg-yellow-50 p-6 rounded border border-yellow-200">
                        <h3 className="font-semibold text-lg text-yellow-800 mb-2">Lesson Locked</h3>
                        <p className="text-yellow-700">
                            You need to complete the previous lesson's quiz correctly to unlock this lesson.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 bg-gray-50 p-4 rounded">
                            <h3 className="font-semibold mb-2">Lesson Notes</h3>
                            <div>{lesson.notes || "No notes for this lesson yet."}</div>
                        </div>
                        
                        <div className="mb-6 bg-gray-50 p-4 rounded">
                            <h3 className="font-semibold mb-2">Quiz</h3>
                            {quizzes.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-lg">{quizzes[0].question}</p>
                                    <div className="space-y-2">
                                        {quizzes[0].options.map((option, index) => (
                                            <label
                                                key={index}
                                                className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                                                    showAnswer
                                                        ? index === quizzes[0].correct_option
                                                            ? 'bg-green-100'
                                                            : selectedAnswer === index
                                                            ? 'bg-red-100'
                                                            : 'bg-gray-100'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="quiz"
                                                    value={index}
                                                    onChange={() => setSelectedAnswer(index)}
                                                    disabled={showAnswer}
                                                    className="mr-3"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {!showAnswer && selectedAnswer !== null && (
                                        <button
                                            onClick={() => {
                                                setShowAnswer(true);
                                                const correctOption = quizzes[0].correct_option;
                                                const correct = selectedAnswer === correctOption;
                                                setIsCorrect(correct);
                                                
                                                // If answer is correct, update progress
                                                if (correct) {
                                                    axios.post(`/lessons/${lesson.id}/progress`)
                                                        .then(response => {
                                                            if (response.data.success) {
                                                                setProgressUpdated(true);
                                                            }
                                                        })
                                                        .catch(error => console.error('Error updating progress:', error));
                                                }
                                            }}
                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Submit Answer
                                        </button>
                                    )}
                                    {showAnswer && (
                                        <div className={`mt-4 p-4 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {isCorrect
                                                ? 'Correct! You can now proceed to the next lesson.'
                                                : `Incorrect. The correct answer was: ${quizzes[0].options[quizzes[0].correct_option]}`}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>No quiz for this lesson yet.</div>
                            )}
                        </div>
                    </>
                )}
                {/* Navigation */}
                {showAnswer && isCorrect && progressUpdated && (
                    <div className="flex justify-end mt-8">
                        <Link
                            href={route('courses.show', course.slug)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Continue to Next Lesson
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
