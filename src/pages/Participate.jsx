import React, { useState, useRef } from 'react';
import './Participate.css';
import { supabase } from '../supabaseClient';

const Participate = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gotra: '',
        familyMembers: '1',
        city: '',
        state: '',
        password: '',
        prasad: false
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const getNextMemberId = async () => {
        try {
            const { count, error } = await supabase
                .from('registrations')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            const nextNum = (count || 0) + 1;
            const paddedNum = nextNum.toString().padStart(3, '0');
            return `RRY-2026/9011/${paddedNum}`;
        } catch (err) {
            console.error('Error generating ID:', err);
            // Fallback random if count fails
            const random = Math.floor(100 + Math.random() * 900); // 3 digit random
            return `RRY-2026/9011/${random}`;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.name || !formData.phone || !formData.password) {
            setError('कृपया सभी आवश्यक फ़ील्ड भरें।');
            setLoading(false);
            return;
        }

        if (formData.phone.length !== 10) {
            setError('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।');
            setLoading(false);
            return;
        }

        if (formData.password.length < 4) {
            setError('पासवर्ड कम से कम 4 अक्षर का होना चाहिए।');
            setLoading(false);
            return;
        }

        const newMemberId = await getNextMemberId();

        try {
            // Check if phone already exists
            const { data: existingUser } = await supabase
                .from('registrations')
                .select('phone')
                .eq('phone', formData.phone)
                .single();

            if (existingUser) {
                setError('यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।');
                setLoading(false);
                return;
            }

            // Insert new registration
            const { data, error: insertError } = await supabase
                .from('registrations')
                .insert([{
                    name: formData.name,
                    phone: formData.phone,
                    gotra: formData.gotra || null,
                    family_members: parseInt(formData.familyMembers) || 1,
                    city: formData.city || null,
                    state: formData.state || null,
                    password: formData.password,
                    payment_status: 'verified', // Automatic verification as requested
                    member_id: newMemberId,
                    prasad: formData.prasad
                }])
                .select()
                .single();

            if (insertError) {
                console.error('Supabase Error:', insertError);
                throw insertError;
            }

            // Success
            setMemberData({
                ...formData,
                member_id: data?.member_id || newMemberId
            });
            setSuccess(true);

            // Store login session
            localStorage.setItem('userPhone', formData.phone);

        } catch (err) {
            console.error('Registration Error:', err);
            setError(`पंजीकरण विफल: ${err.message || 'कृपया पुनः प्रयास करें।'}`);
        } finally {
            setLoading(false);
        }
    };

    // Success Screen
    if (success && memberData) {
        return (
            <div className="participate-page">
                <div className="success-hero">
                    <div className="success-content">
                        <div className="success-icon">✅</div>
                        <h1>॥ जय श्री राम ॥</h1>
                        <h2>आपका पंजीकरण सफल हुआ!</h2>

                        <div className="member-card">
                            <div className="member-header">
                                <span className="member-label">Member ID</span>
                                <span className="member-id">{memberData.member_id}</span>
                            </div>
                            <div className="member-details">
                                <p><strong>नाम:</strong> {memberData.name}</p>
                                <p><strong>मोबाइल:</strong> {memberData.phone}</p>
                                <p><strong>शहर:</strong> {memberData.city || '-'}</p>
                            </div>
                        </div>

                        <div className="success-message">
                            <p>🙏 आपका विवरण सुरक्षित सुरक्षित कर लिया गया है।</p>
                            <p>📱 अब आप अपने <strong>Mobile Number</strong> और <strong>Password</strong> से Login कर सकते हैं।</p>
                        </div>

                        <div className="success-actions">
                            <a href="/login" className="btn-primary">
                                🔑 लॉगिन करें
                            </a>
                            <a href="/sankalp" className="btn-secondary">
                                📜 संकल्प पत्र बनाएं
                            </a>
                            <button onClick={() => window.location.reload()} className="btn-outline">
                                ➕ नया पंजीकरण करें
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Registration Form
    return (
        <div className="participate-page">
            {/* Hero */}
            <div className="participate-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>॥ यज्ञ में सहभागिता ॥</h1>
                    <p>अपना विवरण भरें और राष्ट्र निर्माण में भागीदार बनें</p>
                </div>
            </div>

            <div className="container participate-content">
                <div className="form-card">
                    <form className="participate-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-box">
                                ❌ {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>पूरा नाम (Full Name) *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="श्री राम कुमार"
                            />
                        </div>

                        <div className="form-group">
                            <label>मोबाइल नंबर (Mobile Number) *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="9876543210"
                                maxLength="10"
                                pattern="[0-9]{10}"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>शहर (City) *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ayodhya"
                                />
                            </div>
                            <div className="form-group">
                                <label>राज्य (State)</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Uttar Pradesh"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>गोत्र (Gotra)</label>
                                <input
                                    type="text"
                                    name="gotra"
                                    value={formData.gotra}
                                    onChange={handleChange}
                                    placeholder="वशिष्ठ, भारद्वाज..."
                                />
                            </div>
                            <div className="form-group">
                                <label>परिवार के सदस्य</label>
                                <input
                                    type="number"
                                    name="familyMembers"
                                    value={formData.familyMembers}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="4"
                                />
                            </div>
                        </div>

                        <div className="form-group password-group">
                            <label>🔐 सुरक्षा पासवर्ड (Create Password) *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="कम से कम 4 अक्षर"
                                minLength="4"
                            />
                            <small>इस पासवर्ड का उपयोग लॉगिन करने के लिए किया जाएगा।</small>
                        </div>

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                name="prasad"
                                checked={formData.prasad}
                                onChange={handleChange}
                                id="prasad"
                            />
                            <label htmlFor="prasad">क्या आप डाक द्वारा महाप्रसाद मंगवाना चाहते हैं?</label>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? '⏳ प्रोसेसिंग...' : '🙏 पंजीकरण करें (Register Now)'}
                        </button>

                        <p className="login-link">
                            पहले से पंजीकृत हैं? <a href="/login">यहाँ लॉगिन करें</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Participate;
