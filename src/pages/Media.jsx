import React from 'react';
import './Media.css';

const Media = () => {
    return (
        <div className="page-container container">
            <h1 className="page-title text-center">Live दर्शन & मीडिया</h1>

            <div className="live-stream-box">
                <div className="video-placeholder">
                    <div className="play-icon">▶</div>
                    <p>Live Streaming will start on 11 May 2026</p>
                </div>
                <h3>Live from Ayodhya Dham</h3>
            </div>

            <h2 className="section-title text-center">गैलरी (Gallery)</h2>
            <div className="gallery-grid">
                {/* Placeholders for gallery */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div className="gallery-item" key={item}></div>
                ))}
            </div>
        </div>
    );
};

export default Media;
