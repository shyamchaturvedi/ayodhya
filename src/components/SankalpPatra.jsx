
import React, { forwardRef } from 'react';
import logo from '../assets/logo.png';
import './SankalpPatra.css';

const SankalpPatra = forwardRef(({ user }, ref) => {
    if (!user) return null;

    const date = new Date().toLocaleDateString('hi-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="sankalp-container" ref={ref}>
            <div className="sankalp-border">
                <div className="sankalp-header">
                    <img src={logo} alt="Logo" className="sankalp-logo" />
                    <h1>श्री राम राज्य संकल्प पत्र</h1>
                </div>

                <div className="sankalp-content">
                    <p className="shloka">
                        स्वस्ति प्रजाभ्यः परिपालयन्तां<br />
                        न्याय्येन मार्गेण महीं महीशाः।<br />
                        गोब्राह्मणेभ्यः शुभमस्तु नित्यं<br />
                        लोकाः समस्ताः सुखिनो भवन्तु।।
                    </p>

                    <p className="pledge-text">
                        मैं, <strong>{user.name}</strong>, पुत्र/पुत्री (गोत्र: {user.gotra}), निवासी <strong>{user.city}</strong>,
                        आज श्री अयोध्या धाम में आयोजित "श्री राम राज्य महायज्ञ" के पावन अवसर पर यह संकल्प लेता/लेती हूँ कि:
                    </p>

                    <ul className="pledge-points">
                        <li>मैं अपने जीवन में सत्य, धर्म और मर्यादा का पालन करूँगा/करूँगी।</li>
                        <li>मैं सनातन धर्म और राष्ट्र की सेवा के लिए सदैव तत्पर रहूँगा/रहूँगी।</li>
                        <li>मैं श्री राम राज्य के आदर्शों को अपने परिवार और समाज में स्थापित करने का प्रयास करूँगा/करूँगी।</li>
                        <li>मैं नित्य प्रभु श्री राम का स्मरण और गौ माता की सेवा करूँगा/करूँगी।</li>
                    </ul>

                    <p className="confirmation">
                        हे प्रभु श्री राम! मुझे इस संकल्प को पूर्ण करने की शक्ति प्रदान करें।
                    </p>
                </div>

                <div className="sankalp-footer">
                    <div className="footer-item">
                        <span className="label">दिनांक:</span>
                        <span className="value">{date}</span>
                    </div>
                    <div className="footer-item">
                        <span className="label">स्थान:</span>
                        <span className="value">अयोध्या धाम</span>
                    </div>
                    <div className="footer-item signature-block">
                        <span className="digital-sign">Digital Signature</span>
                        <span className="label">हस्ताक्षर: {user.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SankalpPatra;
