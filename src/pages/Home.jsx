
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaOm } from 'react-icons/fa';
import './Home.css';
import '../variables.css';

const Home = () => {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const targetDate = new Date('2026-05-11T00:00:00');
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;
            const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
            setDaysLeft(days > 0 ? days : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <div className="om-container">
                        <span className="scrolling-om">ॐ</span>
                    </div>

                    <h3 className="animate-fade-in pre-title">विश्व का प्रथम</h3>
                    <h1 className="animate-slide-up main-title">श्री राम राज्य महायज्ञ</h1>
                    <h2 className="subtitle animate-slide-up-delay">(9011 कुण्ड)</h2>

                    <h3 className="sub-text animate-slide-up-delay-2">विश्व कल्याण एवं श्री राम राज्य स्थापना हेतु</h3>

                    <div className="event-badges animate-slide-up-delay-2">
                        <div className="badge-item">
                            <FaMapMarkerAlt className="icon" />
                            <span>शरयू तट, श्री राम जन्मभूमि, अयोध्या धाम</span>
                        </div>
                        <div className="badge-item">
                            <FaCalendarAlt className="icon" />
                            <span>11 मई 2026 – 22 मई 2026</span>
                        </div>
                    </div>

                    <div className="hero-actions animate-slide-up-delay-3">
                        <Link to="/participate" className="btn-primary-custom large">यज्ञ में जुड़ें</Link>
                        <Link to="/donate" className="btn-secondary-custom large">आहुति अर्पण करें</Link>
                    </div>

                    <div className="countdown-container">
                        <p className="kumbh-text">महा कुम्भ शुरू होने में</p>
                        <div className="timer-box">
                            <span className="count">{daysLeft}</span>
                            <span className="label">दिन शेष</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="intro-section container">
                <div className="intro-grid">
                    <div className="intro-text">
                        <h2>धर्मो रक्षति रक्षितः</h2>
                        <p>
                            अयोध्या की पावन धरा पर, त्रेता युग के समान 'राम राज्य' की पुर्नस्थापना हेतु
                            एक ऐतिहासिक संकल्प लिया गया है। <strong>9011 कुंडीय श्री राम राज्य महायज्ञ</strong>
                            न केवल एक अनुष्ठान है, बल्कि यह सनातन धर्म के गौरव और विश्व कल्याण का शंखनाद है।
                        </p>
                        <p>
                            इस महायज्ञ का उद्देश्य सामाजिक समरसता, राष्ट्र की एकता और आध्यात्मिक चेतना का जागरण है।
                            साधु-संतों के सानिध्य में आयोजित इस भव्य कार्यक्रम में आप सपरिवार आमंत्रित हैं।
                        </p>
                        <Link to="/sankalp" className="text-link">संकल्प पत्र पढ़ें &rarr;</Link>
                    </div>
                    <div className="intro-image">
                        {/* Placeholder for an evocative image */}
                        <div className="image-placeholder-art">
                            <FaOm className="big-om" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
