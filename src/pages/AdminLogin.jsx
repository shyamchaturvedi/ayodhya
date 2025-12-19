import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { supabase } from '../supabaseClient';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Fetch credentials from database
            const { data, error: fetchError } = await supabase
                .from('settings')
                .select('key, value')
                .in('key', ['admin_username', 'admin_password']);

            let savedUsername = 'admin';
            let savedPassword = 'ramrajya2026';

            if (!fetchError && data && data.length > 0) {
                data.forEach(item => {
                    if (item.key === 'admin_username') savedUsername = item.value;
                    if (item.key === 'admin_password') savedPassword = item.value;
                });
            }

            // Verify credentials
            if (username === savedUsername && password === savedPassword) {
                localStorage.setItem('adminUser', savedUsername);
                navigate('/admin/dashboard');
            } else {
                setError('Invalid username or password! कृपया सही जानकारी दर्ज करें।');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-box">
                <h2>Admin Panel</h2>
                <p>श्री राम राज्य महायज्ञ - प्रशासन लॉगिन</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username / उपयोगकर्ता नाम</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password / पासवर्ड</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login / प्रवेश करें'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
