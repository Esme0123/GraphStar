import React from 'react';
import YouTube from 'react-youtube';

const TutorialModal = ({ videoId, onClose }) => {
    if (!videoId) return null;
    const opts = {
        height: '480',
        width: '100%', 
        playerVars: {
            autoplay: 1, 
        },
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ width: '80%', maxWidth: '854px' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>X</button>
                <h2>Tutorial de la Sección</h2>
                <div className="video-container">
                    <YouTube videoId={videoId} opts={opts} />
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;