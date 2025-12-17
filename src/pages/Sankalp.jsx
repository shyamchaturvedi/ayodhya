import React, { useState, useEffect } from 'react';
import './Sankalp.css';

const Sankalp = () => {
    const [count, setCount] = useState(10023); // Starting simulated count

    useEffect(() => {
        // Simulate live counter
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 3));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="page-container container sankalp-page">
            <div className="sankalp-hero">
                <h1 className="page-title text-center">श्री राम राज्य संकल्प</h1>
                <p className="sankalp-intro">
                    "आइए, हम सब मिलकर एक ऐसे भारत का निर्माण करें जहाँ धर्म, न्याय और सत्य का शासन हो।"
                </p>
            </div>

            <div className="counter-section">
                <h3>अब तक जुड़े राम भक्त</h3>
                <div className="counter-display">
                    {count.toLocaleString()}
                </div>
            </div>

            <div className="pledge-card">
                <h2>मेरा संकल्प</h2>
                <div className="pledge-text">
                    <p>
                        मैं शपथ लेता/ लेती हूँ कि मैं अपने जीवन में श्री राम के आदर्शों का पालन करूँगा/करूँगी।
                        मैं राष्ट्र की एकता, अखंडता और सनातन धर्म के उत्थान के लिए सदैव तत्पर रहूँगा/रहूँगी।
                        मैं विश्व के प्रथम श्री राम राज्य महायज्ञ में तन-मन-धन से सहयोग करूँगा/करूँगी।
                    </p>
                </div>
                <button className="btn-primary btn-pledge">मैं इस संकल्प का हिस्सा हूँ</button>
            </div>
        </div>
    );
};

export default Sankalp;
