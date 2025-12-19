import React from 'react';
import './Media.css';
import { FaPlay, FaOm, FaImage } from 'react-icons/fa';

// Importing Saint Images (Local Assets)
import bhagirathImg from '../assets/bhagirath.jpg';
import vishwamitraImg from '../assets/vishwamitra.webp';
import vashishthaImg from '../assets/vashishtha.png';
import dashrathImg from '../assets/dashrath.jpg';
import valmikiImg from '../assets/valmiki.jpg';
import devrahaBabaImg from '../assets/devraha_baba.png';
import ramLallaImg from '../assets/ram_lalla.webp';
import rambhadracharyaImg from '../assets/rambhadracharya.jpg';
import yogiAdityanathImg from '../assets/yogi_adityanath.avif';

const Media = () => {
    const saints = [
        { name: 'राजा भगीरथ', desc: 'Raja Bhagirath', img: bhagirathImg },
        { name: 'महर्षि विश्वामित्र', desc: 'Maharshi Vishwamitra', img: vishwamitraImg },
        { name: 'महा महर्षि वशिष्ठ', desc: 'Maha Maharshi Vashishtha', img: vashishthaImg },
        { name: 'चक्रवर्ती सम्राट महाराजा दशरथ', desc: 'Chakravarti Samrat Maharaja Dashrath', img: dashrathImg },
        { name: 'महर्षि वाल्मीकि जी', desc: 'Maharshi Valmiki Ji', img: valmikiImg },
        { name: 'श्री देवराहा बाबा', desc: 'Shri Devraha Baba', img: devrahaBabaImg },
        { name: 'श्री रामलला', desc: 'Shri Ram Lalla', img: ramLallaImg },
        { name: 'जगद्गुरु रामभद्राचार्य जी', desc: 'Jagadguru Rambhadracharya Ji', img: rambhadracharyaImg },
        { name: 'गोरखनाथ पीठाधीश्वर', desc: 'Gorakhnath Peethadheeshwar', img: yogiAdityanathImg }
    ];

    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="page-hero media-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="om-decoration">
                        <FaOm />
                    </div>
                    <h1>Live दर्शन &amp; मीडिया</h1>
                    <p>महायज्ञ का सीधा प्रसारण एवं दिव्य दृश्य</p>
                </div>
            </section>

            <section className="page-content">
                {/* Live Stream Section */}
                <div className="live-stream-section">
                    <div className="section-title-center">
                        <h2 className="section-title">Live Streaming</h2>
                    </div>
                    <div className="video-container premium-card">
                        <div className="video-placeholder">
                            <div className="live-badge">LIVE</div>
                            <div className="play-button">
                                <FaPlay />
                            </div>
                            <p>Live Streaming will start on 11 May 2026</p>
                        </div>
                        <div className="stream-info">
                            <h3>Live from Ayodhya Dham</h3>
                            <p>श्री राम जन्मभूमि, अयोध्या धाम से सीधा प्रसारण</p>
                        </div>
                    </div>
                </div>

                {/* Divine Saints Section */}
                <div className="saints-section">
                    <div className="section-title-center">
                        <h2 className="section-title">दिव्य संत</h2>
                    </div>
                    <div className="sants-scroll-container">
                        <div className="sants-track">
                            {/* Doubled for infinite scroll */}
                            {[...saints, ...saints].map((sant, index) => (
                                <div className="sant-card" key={index}>
                                    <div className="sant-image-frame">
                                        <img
                                            src={sant.img}
                                            alt={sant.name}
                                            className="sant-img"
                                        />
                                    </div>
                                    <h3 className="sant-name">{sant.name}</h3>
                                    <p className="sant-desc">{sant.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="gallery-section">
                    <div className="section-title-center">
                        <h2 className="section-title">गैलरी</h2>
                    </div>
                    <div className="gallery-grid">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div className="gallery-item" key={item}>
                                <div className="gallery-placeholder">
                                    <FaImage />
                                    <span>Coming Soon</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Box */}
                <div className="info-box">
                    <h3>॥ दर्शन का महत्व ॥</h3>
                    <p>
                        9011 कुण्डीय महायज्ञ के दर्शन मात्र से असीम पुण्य की प्राप्ति होती है।
                        Live प्रसारण के माध्यम से घर बैठे इस दिव्य आयोजन के साक्षी बनें।
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Media;
