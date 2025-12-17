import React from 'react';
import './Adhyaksh.css';
// Using uploaded images as placeholders for profiles
import MaharajImg from '../assets/uploaded_image_0_1765986143244.jpg';
import SagesImg from '../assets/uploaded_image_2_1765986143244.jpg';

const Adhyaksh = () => {
    return (
        <div className="page-container container">
            <h1 className="page-title text-center">महायज्ञ अध्यक्ष परिचय</h1>

            <div className="profile-card hero-profile">
                <div className="profile-image">
                    {/* Using a crop/object-fit to focus on Maharaj Ji from the poster if possible, or just the poster */}
                    <img src={MaharajImg} alt="Maharaj Ji" style={{ objectFit: 'cover', objectPosition: 'bottom left' }} />
                </div>
                <div className="profile-content">
                    <h3>श्री श्री 1008 महायज्ञ अध्यक्ष</h3>
                    <h2>महामंडलेश्वर रघुवंशी भूपेन्द्र प्रताप हनुमान दास महाराज जी</h2>
                    <p className="designation">श्री राम सेना अयोध्या प्रमुख</p>
                    <div className="message-box">
                        <p>
                            "यह महायज्ञ केवल एक अनुष्ठान नहीं, बल्कि राष्ट्र शक्ति का जागरण है।
                            जब 9011 कुंडों में अग्नि प्रज्वलित होगी, तो वह ऊर्जा संपूर्ण विश्व में
                            सनातन धर्म का प्रकाश फैलाएगी।"
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="section-title text-center">संत परंपरा</h2>
            <div className="sants-grid">
                {['राजा भगीरथ', 'महर्षि विश्वामित्र', 'महर्षि वशिष्ठ', 'महाराज दशरथ', 'महर्षि वाल्मीकि', 'श्री देवराहा बाबा', 'श्री कनक बिहारी दास जी', 'जगद्गुरु रामानंदाचार्य जी'].map((name, index) => (
                    <div className="sant-card" key={index}>
                        <div className="sant-img-placeholder">
                            {/* Simulating individual images using the group image */}
                            <img src={SagesImg} alt={name} />
                        </div>
                        <h4>{name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Adhyaksh;
