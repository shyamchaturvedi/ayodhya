import React, { useState, useEffect } from 'react';
import './Donate.css';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient';
import { FaHandHoldingHeart, FaOm, FaQrcode, FaRupeeSign } from 'react-icons/fa';

const Donate = () => {
    const [upiId, setUpiId] = useState('9838272583@okbizaxis');
    const [loading, setLoading] = useState(true);
    const [customAmount, setCustomAmount] = useState('');

    // Fetch UPI ID from database on load
    useEffect(() => {
        const fetchUpiId = async () => {
            try {
                const { data } = await supabase
                    .from('settings')
                    .select('value')
                    .eq('key', 'upi_id')
                    .single();

                if (data && data.value) {
                    setUpiId(data.value);
                }
            } catch (err) {
                console.error('Could not fetch UPI ID');
            } finally {
                setLoading(false);
            }
        };
        fetchUpiId();
    }, []);

    const handleDonate = async (amount, category) => {
        if (!amount || amount <= 0) {
            alert('कृपया सही राशि दर्ज करें');
            return;
        }

        const storedUser = localStorage.getItem('userData');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const donorName = user ? user.name : 'Anonymous Ram Bhakt';

        try {
            await supabase.from('donations').insert([{
                donor_name: donorName,
                amount: amount.toString(),
                payment_method: 'UPI-App',
                category: category
            }]);
        } catch (err) {
            console.error('Error saving donation:', err);
        }

        const payeeName = 'Shri Ram Rajya Mahayagya';
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
        window.location.href = upiUrl;
    };

    const handleCustomDonate = () => {
        const amount = parseInt(customAmount);
        if (amount && amount > 0) {
            handleDonate(amount, 'अन्य दान');
        } else {
            alert('कृपया सही राशि दर्ज करें');
        }
    };

    // Generate UPI URL for QR code
    const getUpiUrl = (amount = '') => {
        const payeeName = 'Shri Ram Rajya Mahayagya';
        let url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`;
        if (amount) {
            url += `&am=${amount}`;
        }
        return url;
    };

    const donationOptions = [
        { title: 'दीप दान', amount: 101, icon: '🪔' },
        { title: 'आहुति सेवा', amount: 501, icon: '🔥' },
        { title: 'महायज्ञ सहयोग', amount: 2100, icon: '🙏' },
        { title: 'सहयोग', amount: 11000, icon: '🙏' },
        { title: 'विशेष यजमान', amount: 11000, icon: '👑' },
        { title: 'महा यजमान', amount: 51000, icon: '🏆' },
    ];

    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="page-hero donate-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="om-decoration">
                        <FaOm />
                    </div>
                    <h1>दान &amp; सेवा</h1>
                    <p>यज्ञ में दी गई आहुति और दान कभी व्यर्थ नहीं जाता।<br />
                        आपकी छोटी सी सेवा राम राज्य की नींव मजबूत करेगी।</p>
                </div>
            </section>

            {/* Donation Options */}
            <section className="page-content">
                <div className="section-title-center">
                    <h2 className="section-title">दान विकल्प</h2>
                </div>

                <div className="donation-grid">
                    {donationOptions.map((item, index) => (
                        <div className="donation-category premium-card" key={index}>
                            <span className="donation-icon">{item.icon}</span>
                            <h3>{item.title}</h3>
                            <div className="amount">₹{item.amount.toLocaleString('en-IN')}</div>
                            <button
                                className="btn-primary-theme"
                                onClick={() => handleDonate(item.amount, item.title)}
                            >
                                <FaHandHoldingHeart style={{ marginRight: '8px' }} />
                                Donate Now
                            </button>
                        </div>
                    ))}

                    {/* Custom Amount Card */}
                    <div className="donation-category premium-card custom-donation-card">
                        <span className="donation-icon">💝</span>
                        <h3>अन्य राशि</h3>
                        <div className="custom-amount-input">
                            <span className="rupee-symbol">₹</span>
                            <input
                                type="number"
                                placeholder="राशि दर्ज करें"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                min="1"
                            />
                        </div>
                        <div className="quick-amounts">
                            <button onClick={() => setCustomAmount('1100')}>₹1,100</button>
                            <button onClick={() => setCustomAmount('5100')}>₹5,100</button>
                            <button onClick={() => setCustomAmount('11000')}>₹11,000</button>
                            <button onClick={() => setCustomAmount('21000')}>₹21,000</button>
                        </div>
                        <button
                            className="btn-primary-theme"
                            onClick={handleCustomDonate}
                            disabled={!customAmount || parseInt(customAmount) <= 0}
                        >
                            <FaHandHoldingHeart style={{ marginRight: '8px' }} />
                            दान करें
                        </button>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="qr-section">
                    <div className="qr-card premium-card">
                        <div className="corner-decoration corner-tl"></div>
                        <div className="corner-decoration corner-tr"></div>
                        <div className="corner-decoration corner-bl"></div>
                        <div className="corner-decoration corner-br"></div>

                        <h3><FaQrcode style={{ marginRight: '10px' }} />QR Code से दान करें</h3>

                        <div className="qr-placeholder">
                            {loading ? (
                                <div className="loader"></div>
                            ) : (
                                <>
                                    <QRCodeSVG
                                        value={getUpiUrl()}
                                        size={180}
                                        level="H"
                                        includeMargin={true}
                                        style={{ display: 'block', margin: '0 auto' }}
                                    />
                                    <p className="scan-text">Scan to Pay via UPI</p>
                                    <p className="upi-text">UPI: <strong>{upiId}</strong></p>
                                </>
                            )}
                        </div>

                        <hr className="divider" />

                        <div className="bank-details">
                            <h4>Bank Transfer Details</h4>
                            <div className="bank-info">
                                <p><span>Bank Name:</span> Union Bank of India</p>
                                <p><span>Account Name:</span> Vishwa Shanti Mahayagya</p>
                                <p><span>A/c No:</span> 520101264968270</p>
                                <p><span>IFSC:</span> UBIN0929219</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="info-box">
                    <h3>॥ दान का महत्व ॥</h3>
                    <p>
                        यज्ञ में दान देने से मनुष्य के सभी पापों का नाश होता है और पुण्य की प्राप्ति होती है।
                        आपका प्रत्येक दान इस पवित्र कार्य में सीधे योगदान देता है।
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Donate;
