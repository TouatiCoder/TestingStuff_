// resources/js/Pages/TestComponent.jsx

import React from 'react';

const TestComponent = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>🧪 Image Load Test</h1>
        <p>If the image below shows up, it's working correctly:</p>
        <img
            src="/images/python.png"
            alt="Test Hero"
            style={{ width: '300px', height: 'auto', border: '1px solid #ccc', marginTop: '20px' }}
        />
        </div>
    );
};

export default TestComponent;
