import React from 'react';
import './Footer.css';
import { FaPhone, FaMapMarkerAlt, FaYoutube, FaFacebook } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>श्री राम राज्य महायज्ञ</h3>
                    <p>विश्व कल्याण एवं श्री राम राज्य स्थापना हेतु 9011 कुंडीय महायज्ञ।</p>
                    <div className="social-links">
                        <a href="#" className="social-icon"><FaYoutube /></a>
                        <a href="#" className="social-icon"><FaFacebook /></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About Yagya</a></li>
                        <li><a href="/sankalp">Sankalp</a></li>
                        <li><a href="/donate">Donate</a></li>
                        <li><a href="/guide">Help / गाइड</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p><FaMapMarkerAlt /> सराय तट, श्री राम जन्मभूमि, अयोध्या धाम</p>
                    <p><FaPhone /> +91 9990359801</p>
                    <p><FaPhone /> +91 9455898365</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Vishva Ka Pratham Shri Ram Rajya Mahayagya. All Rights Reserved.</p>
                <p className="builder-credit">
                    Demo Ready | Made by <a href="https://www.aroventech.site" target="_blank" rel="noreferrer" style={{ color: '#FFD700', textDecoration: 'none' }}>Aroven Tech Lucknow</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
