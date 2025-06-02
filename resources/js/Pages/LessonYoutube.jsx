import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function LessonYoutube({ auth, course, videoId, videoTitle, insights, question, navigation, hasAccess, lastAt, lessonNumber }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [progressUpdated, setProgressUpdated] = useState(false);
    const [currentLastAt, setCurrentLastAt] = useState(lastAt || 1);

    const handleSubmit = () => {
        setShowAnswer(true);
        const correct = selectedAnswer === question.correct_answer;
        setIsCorrect(correct);
        
        // If answer is correct, update progress
        if (correct) {
            axios.post(`/courses/${course.slug}/youtube/${videoId}/progress`)
                .then(response => {
                    if (response.data.success) {
                        setProgressUpdated(true);
                        // Update the local state with the new last_at value
                        if (response.data.last_at) {
                            setCurrentLastAt(response.data.last_at);
                        }
                    }
                })
                .catch(error => console.error('Error updating progress:', error));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={videoTitle} />
            <div className="max-w-4xl mx-auto py-8">
                <nav className="mb-4">
                    <Link href={route('courses')} className="text-blue-600">Courses</Link> /
                    <Link href={route('courses.youtube', course.slug)} className="text-blue-600 ml-2">Lessons</Link> /
                    <span className="ml-2">{videoTitle}</span>
                </nav>
                <h2 className="text-2xl font-bold mb-4">{videoTitle}</h2>
                <div className="mb-6">
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={videoTitle}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
                
                {(!hasAccess && lessonNumber > currentLastAt) && (
                    <div className="mb-6 bg-yellow-50 p-6 rounded border border-yellow-200">
                        <h3 className="font-semibold text-lg text-yellow-800 mb-2">Lesson Locked</h3>
                        <p className="text-yellow-700">
                            You need to complete the previous lesson's quiz correctly to unlock this lesson.
                            <span className="block mt-2 font-medium">Your current progress: Lesson {currentLastAt}</span>
                        </p>
                    </div>
                )}

                {(hasAccess || lessonNumber <= currentLastAt) && (
                    <>
                        {/* Key Insights Section */}
                        <div className="mb-6 bg-gray-50 p-4 rounded">
                            <h3 className="font-semibold mb-4">Key Insights</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                {insights.map((insight, index) => (
                                    <li key={index} className="text-gray-700">{insight}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {(hasAccess || lessonNumber <= currentLastAt) && (
                    <>
                        {/* Quiz Section */}
                        <div className="mb-6 bg-gray-50 p-6 rounded">
                            <h3 className="font-semibold mb-4">Knowledge Check</h3>
                            <div className="space-y-4">
                                <p className="text-lg">{question.question}</p>
                                <div className="space-y-2">
                                    {question.options.map((option, index) => (
                                        <label
                                            key={index}
                                            className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                                                showAnswer
                                                    ? option === question.correct_answer
                                                        ? 'bg-green-100'
                                                        : selectedAnswer === option
                                                        ? 'bg-red-100'
                                                        : 'bg-gray-100'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="quiz"
                                                value={option}
                                                onChange={() => setSelectedAnswer(option)}
                                                disabled={showAnswer}
                                                className="mr-3"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                                {!showAnswer && selectedAnswer && (
                                    <button
                                        onClick={handleSubmit}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Submit Answer
                                    </button>
                                )}
                                {showAnswer && (
                                    <div className={`mt-4 p-4 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isCorrect
                                            ? 'Correct! You can now proceed to the next lesson.'
                                            : `Incorrect. The correct answer was: ${question.correct_answer}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    {navigation.previous && (
                        <Link
                            href={route('courses.youtube.lesson', {
                                course: course.slug,
                                videoId: navigation.previous
                            })}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        >
                            Previous Lesson
                        </Link>
                    )}
                    {navigation.next && (
                        <Link
                            href={route('courses.youtube.lesson', {
                                course: course.slug,
                                videoId: navigation.next
                            })}
                            className={`px-4 py-2 rounded transition ${
                                ((hasAccess || lessonNumber <= currentLastAt) && showAnswer && isCorrect) || progressUpdated
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                            onClick={(e) => !(((hasAccess || lessonNumber <= currentLastAt) && showAnswer && isCorrect) || progressUpdated) && e.preventDefault()}
                        >
                            Next Lesson
                        </Link>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
