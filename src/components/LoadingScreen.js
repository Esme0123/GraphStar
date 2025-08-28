import React from 'react';

const LoadingScreen = ({ onStart }) => (
    <div className="loading-screen">
        <div className="planet-container">
            <h1 className="loading-title">GraphStar</h1>
            <button className="start-button" onClick={onStart}>START</button>
        </div>
    </div>
);

export default LoadingScreen;