import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
// Import images (assuming names based on upload order, user can verify)
import RamJiImg from '../assets/uploaded_image_1_1765986143244.jpg';
import PosterImg from '../assets/uploaded_image_0_1765986143244.jpg';

const Home = () => {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const targetDate = new Date('2026-05-11T00:00:00');
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            setDaysLeft(days);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${RamJiImg})` }}>
                <div className="container hero-content">
                    <h2 className="animate-fade-in">विश्व का प्रथम</h2>
                    <h1 className="main-title animate-slide-up">श्री राम राज्य महायज्ञ <br /> <span className="kund-count">(9011 कुण्ड)</span></h1>
                    <p className="hero-subtitle">विश्व कल्याण एवं श्री राम राज्य स्थापना हेतु</p>

                    <div className="event-details">
                        <div className="detail-item">
                            <span className="icon">📍</span>
                            <span>शरयू तट, श्री राम जन्मभूमि, अयोध्या धाम</span>
                        </div>
                        <div className="detail-item">
                            <span className="icon">📅</span>
                            <span>11 मई 2026 – 22 मई 2026</span>
                        </div>
                    </div>

                    <div className="hero-buttons">
                        <Link to="/participate" className="btn-primary btn-large">यज्ञ से जुड़ें</Link>
                        <Link to="/donate" className="btn-secondary btn-large">आहुति अर्पण करें</Link>
                    </div>

                    <div className="countdown-timer">
                        <h3>महा कुम्भ शुरु होने में</h3>
                        <div className="timer-box">
                            <span className="days">{daysLeft}</span>
                            <span className="label">दिन शेष</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro / Blessing Section */}
            <section className="intro-section container">
                <div className="intro-grid">
                    <div className="intro-image">
                        <img src={PosterImg} alt="Mahayagya Poster" className="poster-img" />
                    </div>
                    <div className="intro-text">
                        <h2>दिव्य संकल्प</h2>
                        <p>
                            अयोध्या धाम की पावन धरती पर, सरयू तट के किनारे, एक ऐतिहासिक महायज्ञ का आयोजन होने जा रहा है।
                            यह केवल एक यज्ञ नहीं, अपितु 'श्री राम राज्य' की पुन: स्थापना का एक आध्यात्मिक शंखनाद है।
                        </p>
                        <p>
                            <strong>9011 कुण्डों</strong> में प्रज्ज्वलित होने वाली यज्ञ अग्नि न केवल वातावरण को शुद्ध करेगी,
                            बल्कि करोडो देशवासियों के ह्रदय में धर्म और राष्ट्र प्रेम की अलख जगाएगी।
                        </p>
                        <div className="blessing-quote">
                            "धर्म की जय हो, अधर्म का नाश हो, प्राणियों में सद्भावना हो, विश्व का कल्याण हो।"
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
