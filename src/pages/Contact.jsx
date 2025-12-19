import React, { useState } from 'react';
import './Contact.css';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'inquiry',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const EMAIL_ADDRESS = 'info@sreeramrajyamahayagya2026.com';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'volunteer': return 'Volunteer Registration / स्वयंसेवक पंजीकरण';
            case 'sponsor': return 'Sponsorship / प्रायोजक';
            case 'media': return 'Media & Press / मीडिया';
            default: return 'General Inquiry / सामान्य पूछताछ';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save to Supabase for admin panel backup
            await supabase.from('contacts').insert([{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: formData.type,
                message: formData.message
            }]);

            // 2. Create mailto link and open email client directly
            const subject = encodeURIComponent(`[${getTypeLabel(formData.type)}] - ${formData.name}`);
            const body = encodeURIComponent(
                `जय श्री राम!

नाम (Name): ${formData.name}
फ़ोन (Phone): ${formData.phone}
ईमेल (Email): ${formData.email || 'N/A'}
प्रकार (Type): ${getTypeLabel(formData.type)}

संदेश (Message):
${formData.message}

---
यह संदेश श्री राम राज्य महायज्ञ वेबसाइट के Contact Form से भेजा गया है।
`
            );

            // Open email client directly
            window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

            setSuccess(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    type: 'inquiry',
                    message: ''
                });
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <div className="contact-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>॥ संपर्क करें ॥</h1>
                    <p>Contact Us - हम आपकी सेवा में तत्पर हैं</p>
                </div>
            </div>

            <div className="container contact-content">
                <div className="contact-grid">
                    {/* Contact Info Cards */}
                    <div className="contact-info">
                        <div className="info-card">
                            <div className="card-icon">📍</div>
                            <h3>अयोध्या कार्यालय</h3>
                            <p>ठाकुर बाड़ी गोला घाट, लक्ष्मण किला, अयोध्या जी, उ.प्र.</p>
                        </div>

                        <div className="info-card">
                            <div className="card-icon">📍</div>
                            <h3>प्रदेश कार्यालय</h3>
                            <p>लकड़ मंडी, माता मन्दिर, लखनऊ, उ.प्र. - 226010</p>
                        </div>

                        <div className="info-card">
                            <div className="card-icon">📞</div>
                            <h3>संपर्क सूत्र</h3>
                            <div className="contact-persons">
                                <div className="person">
                                    <strong>श्री राम वंशज भूपेन्द्र प्रताप हनुमान महाराज जी</strong>
                                    <span className="role">(श्री राम सेना अयोध्या प्रमुख)</span>
                                    <a href="tel:+919990359801" className="phone-link">📱 9990359801</a>
                                    <a href="tel:+919415101622" className="phone-link">📱 9415101622</a>
                                </div>
                                <div className="person">
                                    <strong>पवन सिंह</strong>
                                    <span className="role">(महासचिव)</span>
                                    <a href="tel:+917710977805" className="phone-link">📱 7710977805</a>
                                </div>
                                <div className="person">
                                    <strong>क्षत्रिय अमित सिंह भदौरिया</strong>
                                    <a href="tel:+916390511963" className="phone-link">📱 6390511963</a>
                                </div>
                            </div>
                        </div>

                        <div className="info-card email-card">
                            <div className="card-icon">✉️</div>
                            <h3>ईमेल</h3>
                            <a href={`mailto:${EMAIL_ADDRESS}`} className="email-link">
                                {EMAIL_ADDRESS}
                            </a>
                        </div>

                        {/* WhatsApp Button */}
                        <a href="https://wa.me/919990359801?text=जय श्री राम! मुझे श्री राम राज्य महायज्ञ के बारे में जानकारी चाहिए।"
                            target="_blank"
                            rel="noreferrer"
                            className="whatsapp-btn">
                            <FaWhatsapp /> WhatsApp पर संपर्क करें
                        </a>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h3>📝 संपर्क फ़ॉर्म</h3>
                        <p className="form-subtitle">फ़ॉर्म भरें - आपका Email Client खुलेगा और सीधे ईमेल भेजें</p>

                        {success && (
                            <div className="success-msg">
                                ✅ Email Client खुल गया है। कृपया Send बटन दबाकर ईमेल भेजें।
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>आपका नाम *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="अपना पूरा नाम लिखें"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>ईमेल</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>फ़ोन नंबर *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>संपर्क का प्रकार</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="inquiry">सामान्य पूछताछ / General Inquiry</option>
                                    <option value="volunteer">स्वयंसेवक पंजीकरण / Volunteer Registration</option>
                                    <option value="sponsor">प्रायोजक / Sponsorship</option>
                                    <option value="media">मीडिया / Press</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>आपका संदेश *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="अपना संदेश यहाँ लिखें..."
                                    rows="5"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? '⏳ खोला जा रहा है...' : '📨 ईमेल भेजें'}
                            </button>

                            <p className="form-note">
                                * बटन दबाने पर आपका Email App (Gmail/Outlook) खुलेगा जिसमें सारी जानकारी पहले से भरी होगी।
                            </p>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="map-section">
                    <h3>📍 यज्ञ स्थल - अयोध्या धाम</h3>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14264.793543566513!2d82.1916539!3d26.7922459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07c5b8ec6d3f%3A0xa6e2f9f1c2f0b7a7!2sRam%20Janmabhoomi%2C%20Ayodhya!5e0!3m2!1sen!2sin!4v1703000000000"
                            width="100%"
                            height="400"
                            style={{ border: 0, borderRadius: '15px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ram Janmabhoomi Ayodhya Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
