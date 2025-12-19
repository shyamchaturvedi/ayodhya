import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './UserLogin.css';
import { FaOm, FaUser, FaLock } from 'react-icons/fa';

const UserLogin = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if mobile number exists in registrations
            const { data, error: fetchError } = await supabase
                .from('registrations')
                .select('*')
                .eq('phone', mobile)
                .single();

            if (fetchError || !data) {
                setError('मोबाइल नंबर नहीं मिला। कृपया पहले पंजीकरण करें।');
            } else if (data.password !== password) {
                setError('गलत पासवर्ड। कृपया सही पासवर्ड दर्ज करें।');
            } else {
                // Successful login
                localStorage.setItem('userMobile', mobile);
                localStorage.setItem('userData', JSON.stringify(data));
                navigate('/profile');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('लॉगिन में समस्या आ रही है। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="om-icon">🕉️</div>
                        <h2>भक्त लॉगिन</h2>
                        <p className="login-subtitle">अपना विवरण और प्रमाण पत्र देखने के लिए लॉगिन करें</p>
                    </div>

                    {error && (
                        <div className="error-box">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>
                                <FaUser style={{ marginRight: '8px' }} />
                                मोबाइल नंबर
                            </label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="अपना पंजीकृत मोबाइल नंबर"
                                required
                                maxLength="10"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaLock style={{ marginRight: '8px' }} />
                                पासवर्ड
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="अपना पासवर्ड दर्ज करें"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? '⏳ प्रतीक्षा करें...' : '🔑 लॉगिन करें'}
                        </button>
                    </form>

                    <div className="register-link">
                        <p>अभी तक पंजीकृत नहीं हैं?</p>
                        <Link to="/participate" className="btn-register">
                            🙏 अभी पंजीकरण करें
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
