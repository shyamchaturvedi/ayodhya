import React from 'react';
import './Contact.css';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="page-container container">
            <h1 className="page-title text-center">संपर्क करें (Contact Us)</h1>

            <div className="contact-grid">
                <div className="contact-info">
                    <div className="info-card">
                        <FaMapMarkerAlt className="icon" />
                        <h3>अयोध्या कार्यालय</h3>
                        <p>ठाकुर बाड़ी गोला घाट, लक्ष्मण किला, अयोध्या जी, उ.प्र.</p>
                    </div>
                    <div className="info-card">
                        <FaMapMarkerAlt className="icon" />
                        <h3>प्रदेश कार्यालय</h3>
                        <p>लकड़ मंडी, माता मन्दिर, लखनऊ, उ.प्र. - 226010</p>
                    </div>
                    <div className="info-card">
                        <FaPhone className="icon" />
                        <h3>Helpline</h3>
                        <p>7710977805, 9455898365</p>
                    </div>
                </div>

                <div className="contact-form-section">
                    <h3>Volunteer Registration / Inquiry</h3>
                    <form>
                        <input type="text" placeholder="Name" className="form-input" />
                        <input type="email" placeholder="Email" className="form-input" />
                        <input type="tel" placeholder="Phone" className="form-input" />
                        <textarea placeholder="Message" className="form-input textarea"></textarea>
                        <button className="btn-primary full-width">Send Message</button>
                    </form>
                </div>
            </div>

            <div className="map-section">
                {/* Placeholder for Map Embed */}
                <div className="map-placeholder">
                    Google Map Integration
                </div>
            </div>
        </div>
    );
};

export default Contact;
