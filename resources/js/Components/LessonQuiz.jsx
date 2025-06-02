import React, { useState } from 'react';
import axios from 'axios';

const LessonQuiz = ({ questions, userResponses }) => {
    const [responses, setResponses] = useState(userResponses || {});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);

    if (!questions || questions.length === 0) {
        return null;
    }

    const handleOptionSelect = async (questionId, optionIndex) => {
        if (responses[questionId]?.submitted) {
            return; // Prevent resubmission
        }

        setLoading(prev => ({ ...prev, [questionId]: true }));
        setError(null);

        try {
            const response = await axios.post('/api/quiz/submit', {
                question_id: questionId,
                selected_option: optionIndex,
            });

            setResponses(prev => ({
                ...prev,
                [questionId]: {
                    selected_option: optionIndex,
                    is_correct: response.data.is_correct,
                    correct_index: response.data.correct_index,
                    submitted: true,
                },
            }));
        } catch (err) {
            setError('Failed to submit answer. Please try again.');
        } finally {
            setLoading(prev => ({ ...prev, [questionId]: false }));
        }
    };

    const getOptionClassName = (questionId, optionIndex) => {
        const response = responses[questionId];
        if (!response?.submitted) return 'hover:bg-gray-100';

        if (response.correct_index === optionIndex) {
            return 'bg-green-100 border-green-500';
        }
        if (response.selected_option === optionIndex && !response.is_correct) {
            return 'bg-red-100 border-red-500';
        }
        return 'opacity-50';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-6">Knowledge Check</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {questions.map((question, qIndex) => {
                    // No need to parse options as they're already an array
                    const options = Array.isArray(question.options) ? question.options : [];

                    return (
                        <div key={question.id} className="border-b pb-6 last:border-b-0">
                            <h3 className="font-medium text-lg mb-4">
                                {qIndex + 1}. {question.question}
                            </h3>
                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(question.id, index)}
                                        disabled={loading[question.id] || responses[question.id]?.submitted}
                                        className={`w-full text-left p-3 border rounded-lg transition-colors duration-200 ${getOptionClassName(question.id, index)}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {responses[question.id]?.submitted && (
                                <div className={`mt-4 p-3 rounded-lg ${responses[question.id].is_correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                    {responses[question.id].is_correct
                                        ? 'Correct! Well done!'
                                        : `Incorrect. The correct answer was: ${options[responses[question.id].correct_index]}`}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LessonQuiz;
