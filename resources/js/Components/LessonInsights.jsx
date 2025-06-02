import React from 'react';

const LessonInsights = ({ insights }) => {
    if (!insights || insights.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
            <div className="space-y-4">
                {insights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-lg text-gray-900">{insight.title}</h3>
                        <p className="text-gray-600 mt-1">{insight.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonInsights;
