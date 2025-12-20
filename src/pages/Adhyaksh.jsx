import React from 'react';
import './Adhyaksh.css';
import { FaOm, FaQuoteLeft } from 'react-icons/fa';
import adhyakshaImage from '../assets/adhyaksha.jpg';
import maharajWithShishyaImage from '../assets/maharaj_with_shishya.jpg';

const Adhyaksh = () => {
    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="page-hero adhyaksh-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="om-decoration">
                        <FaOm />
                    </div>
                    <h1>महायज्ञ अध्यक्ष</h1>
                    <p>विश्व के प्रथम 9011 कुण्डीय महायज्ञ के पथप्रदर्शक</p>
                </div>
            </section>

            <section className="page-content">
                <div className="adhyaksh-content">
                    <div className="adhyaksh-image-container premium-card">
                        <div className="guru-image-wrapper">
                            <img src={adhyakshaImage} alt="Shri Ram Vanshaj Bhupendra Pratap Hanuman Maharaj Ji" className="guru-image" />
                        </div>
                    </div>

                    <div className="adhyaksh-text premium-card">
                        <div className="corner-decoration corner-tl"></div>
                        <div className="corner-decoration corner-tr"></div>
                        <div className="corner-decoration corner-bl"></div>
                        <div className="corner-decoration corner-br"></div>

                        <h2 className="guru-name">श्री राम वंशज भूपेन्द्र प्रताप हनुमान महाराज जी</h2>
                        <h3 className="guru-title">श्री राम सेना अयोध्या प्रमुख</h3>

                        <p className="guru-description">
                            परम पूज्य महाराज जी, जो स्वयं श्री राम वंशज हैं, इस ऐतिहासिक 9011 कुंडीय महायज्ञ के अध्यक्ष हैं।
                            उनके पावन सानिध्य और मार्गदर्शन में यह विश्व का प्रथम 'श्री राम राज्य महायज्ञ' आयोजित हो रहा है।
                        </p>

                        <div className="quote-box">
                            <FaQuoteLeft className="quote-icon" />
                            <p>
                                "राम राज्य केवल एक शासन व्यवस्था नहीं, बल्कि एक आदर्श जीवन पद्धति है। आइए, हम सब मिलकर इस महायज्ञ के माध्यम से
                                उस आदर्श को पुनः स्थापित करने का संकल्प लें।"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divine Moments Section */}
                <div className="divine-moments">
                    <div className="section-title-center">
                        <h2 className="section-title-small">सानिध्य एवं आशीर्वाद</h2>
                    </div>
                    <div className="moment-card premium-card">
                        <div className="moment-image-wrapper">
                            <img src={maharajWithShishyaImage} alt="Maharaj Ji with Devotees in Ayodhya" className="moment-image" />
                        </div>
                        <p className="moment-caption">अयोध्या धाम में शिष्यों और भक्तों के साथ महाराज जी का स्नेहपूर्ण सानिध्य।</p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="info-box">
                    <h3>॥ मार्गदर्शन ॥</h3>
                    <p>
                        महाराज जी के आशीर्वाद और मार्गदर्शन में यह महायज्ञ राष्ट्र की एकता और सनातन धर्म के गौरव का प्रतीक बनेगा।
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Adhyaksh;
