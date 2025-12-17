import React from 'react';
import './Donate.css';
import { FaQrcode } from 'react-icons/fa';

const Donate = () => {
    return (
        <div className="page-container container">
            <h1 className="page-title text-center">दान & सेवा (Donation)</h1>
            <p className="text-center subtitle-text">
                "यज्ञ में दी गई आहुति और दान कभी व्यर्थ नहीं जाता।"<br />
                आपकी छोटी सी सेवा राम राज्य की नींव मजबूत करेगी।
            </p>

            <div className="donation-grid">
                <div className="donation-category">
                    <h3>दीप दान</h3>
                    <div className="amount">₹101</div>
                    <button className="btn-donate">Donate Now</button>
                </div>
                <div className="donation-category featured">
                    <h3>आहुति सेवा</h3>
                    <div className="amount">₹501</div>
                    <button className="btn-donate">Donate Now</button>
                </div>
                <div className="donation-category">
                    <h3>महायज्ञ सहयोग</h3>
                    <div className="amount">₹2100</div>
                    <button className="btn-donate">Donate Now</button>
                </div>
                <div className="donation-category">
                    <h3>विशेष यजमान</h3>
                    <div className="amount">₹11000</div>
                    <button className="btn-donate">Donate Now</button>
                </div>
            </div>

            <div className="qr-section">
                <div className="qr-card">
                    <h3>QR Code से दान करें</h3>
                    <div className="qr-placeholder">
                        <FaQrcode size={100} color="#333" />
                        <p>Scan to Pay via UPI</p>
                    </div>
                    <div className="bank-details">
                        <p><strong>Bank Name:</strong> State Bank of India</p>
                        <p><strong>Account Name:</strong> Shri Ram Sena</p>
                        <p><strong>A/c No:</strong> XXXXXXXXXXX</p>
                        <p><strong>IFSC:</strong> SBIN000XXXX</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donate;
