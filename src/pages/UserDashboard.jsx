import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const idCardRef = useRef(null);
    const sankalpRef = useRef(null);
    const receiptRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const mobile = localStorage.getItem('userMobile');
        if (!mobile) {
            navigate('/login');
            return;
        }
        fetchUserData(mobile);
    }, [navigate]);

    const fetchUserData = async (mobile) => {
        try {
            setLoading(true);

            // Fetch user registration data
            const { data: regData, error: regError } = await supabase
                .from('registrations')
                .select('*')
                .eq('phone', mobile)
                .single();

            if (regError) throw regError;
            setUserData(regData);
            setEditFormData({
                name: regData.name,
                gotra: regData.gotra || '',
                family_members: regData.family_members || 1,
                city: regData.city || '',
                state: regData.state || ''
            });

            // Fetch user donations
            const { data: donationData } = await supabase
                .from('donations')
                .select('*')
                .eq('phone', mobile)
                .order('created_at', { ascending: false });

            setDonations(donationData || []);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const { error } = await supabase
                .from('registrations')
                .update({
                    name: editFormData.name,
                    gotra: editFormData.gotra,
                    family_members: parseInt(editFormData.family_members),
                    city: editFormData.city,
                    state: editFormData.state
                })
                .eq('member_id', userData.member_id);

            if (error) throw error;

            setUserData(prev => ({
                ...prev,
                ...editFormData
            }));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userMobile');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    // Download ID Card
    const downloadIdCard = async () => {
        if (!idCardRef.current) return;
        try {
            const canvas = await html2canvas(idCardRef.current, {
                useCORS: true,
                scale: 3,
                backgroundColor: '#fff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', [85.6, 53.98]);
            pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
            pdf.save(`ID_Card_${userData?.member_id}.pdf`);
        } catch (err) {
            console.error("ID Card Generation failed", err);
            alert("ID Card download failed");
        }
    };

    // Download Sankalp Patra - A4 Landscape
    const downloadSankalpPatra = async () => {
        if (!sankalpRef.current) return;
        try {
            const canvas = await html2canvas(sankalpRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#FFF8E1'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
            pdf.save(`Sankalp_Patra_${userData?.name}.pdf`);
        } catch (err) {
            console.error("Certificate Generation failed", err);
            alert("Sankalp Patra download failed");
        }
    };

    // Download Donation Receipt
    const downloadReceipt = async (donation) => {
        const receiptElement = document.getElementById(`receipt-${donation.id}`);
        if (!receiptElement) return;

        try {
            const canvas = await html2canvas(receiptElement, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#fff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a5');
            pdf.addImage(imgData, 'PNG', 5, 5, 138, 190);
            pdf.save(`Donation_Receipt_${donation.id}.pdf`);
        } catch (err) {
            console.error("Receipt Generation failed", err);
            alert("Receipt download failed");
        }
    };

    // Print Receipt
    const printReceipt = (donation) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Donation Receipt - ${userData.member_id}</title>
                <style>
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body { 
                        font-family: 'Segoe UI', 'Nirmala UI', sans-serif; 
                        padding: 40px;
                        background: #fff;
                        color: #333;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .receipt-container {
                        max-width: 500px;
                        margin: 0 auto;
                        border: 3px solid #C73E2C;
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .receipt-header {
                        background: linear-gradient(135deg, #C73E2C, #E64A19);
                        color: white;
                        padding: 25px;
                        text-align: center;
                    }
                    .receipt-header .logo {
                        font-size: 40px;
                        margin-bottom: 10px;
                    }
                    .receipt-header h1 {
                        font-size: 22px;
                        margin: 0 0 5px;
                    }
                    .receipt-header h2 {
                        font-size: 16px;
                        font-weight: normal;
                        color: #FFD700;
                        margin: 0;
                    }
                    .receipt-body {
                        padding: 30px;
                    }
                    .receipt-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px dotted #ddd;
                    }
                    .receipt-row:last-of-type {
                        border-bottom: none;
                    }
                    .receipt-row .label {
                        color: #666;
                        font-size: 14px;
                    }
                    .receipt-row .value {
                        font-weight: 600;
                        color: #333;
                        font-size: 14px;
                    }
                    .receipt-amount {
                        background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
                        text-align: center;
                        padding: 25px;
                        margin: 20px 0;
                        border-radius: 12px;
                    }
                    .receipt-amount .label {
                        display: block;
                        color: #388E3C;
                        font-size: 12px;
                        margin-bottom: 5px;
                    }
                    .receipt-amount .value {
                        font-size: 36px;
                        font-weight: 700;
                        color: #2E7D32;
                    }
                    .receipt-footer {
                        background: #f9f9f9;
                        padding: 20px;
                        text-align: center;
                        border-top: 2px dashed #FFD700;
                    }
                    .receipt-footer .blessing {
                        color: #C73E2C;
                        font-size: 16px;
                        font-weight: 700;
                        margin-bottom: 10px;
                    }
                    .receipt-footer p {
                        color: #666;
                        font-size: 12px;
                        margin: 3px 0;
                    }
                    .receipt-footer .org {
                        color: #333;
                        font-weight: 600;
                        margin-top: 10px;
                    }
                    .watermark {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 150px;
                        color: rgba(199, 62, 44, 0.05);
                        z-index: -1;
                    }
                </style>
            </head>
            <body>
                <div class="watermark">ॐ</div>
                <div class="receipt-container">
                    <div class="receipt-header">
                        <div class="logo">🙏</div>
                        <h1>श्री राम राज्य महायज्ञ</h1>
                        <h2>Donation Receipt / दान रसीद</h2>
                    </div>
                    <div class="receipt-body">
                        <div class="receipt-row">
                            <span class="label">Receipt No:</span>
                            <span class="value">RR-DON-${donation.id}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Date / दिनांक:</span>
                            <span class="value">${formatDate(donation.created_at)}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Donor Name / दानदाता:</span>
                            <span class="value">${userData.name}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Member ID:</span>
                            <span class="value">${userData.member_id}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Phone:</span>
                            <span class="value">${userData.phone}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Location / स्थान:</span>
                            <span class="value">${userData.city || '-'}, ${userData.state || '-'}</span>
                        </div>
                        <div class="receipt-amount">
                            <span class="label">DONATION AMOUNT / दान राशि</span>
                            <span class="value">${formatAmount(donation.amount)}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Transaction ID:</span>
                            <span class="value">${donation.transaction_id || 'N/A'}</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Status / स्थिति:</span>
                            <span class="value">${donation.status === 'verified' ? '✅ Verified' : '⏳ Pending'}</span>
                        </div>
                    </div>
                    <div class="receipt-footer">
                        <div class="blessing">॥ जय श्री राम ॥</div>
                        <p>Thank you for your generous donation!</p>
                        <p>आपके उदार दान के लिए धन्यवाद!</p>
                        <p class="org">श्री राम जन्मभूमि, अयोध्या धाम</p>
                        <p>11-21 मई 2026</p>
                    </div>
                </div>
                <script>
                    window.onload = function() { 
                        setTimeout(function() {
                            window.print(); 
                            window.close(); 
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('hi-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading Profile...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="loading-screen">
                <p>Profile not found. <a href="/login">Login again</a></p>
            </div>
        );
    }

    const totalDonations = donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    return (
        <div className="user-dashboard">
            {/* Hero Header */}
            <header className="dashboard-hero">
                <div className="hero-pattern"></div>
                <div className="hero-content">
                    <div className="user-welcome">
                        <div className="avatar">
                            <span>ॐ</span>
                        </div>
                        <div className="welcome-text">
                            <h1>जय श्री राम, {userData.name}</h1>
                            <p>Member ID: <strong>{userData.member_id}</strong></p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-strip">
                <div className="stat-card">
                    <div className="stat-icon">🪪</div>
                    <div className="stat-info">
                        <span className="stat-label">Member ID</span>
                        <span className="stat-value">{userData.member_id}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        {userData.payment_status === 'verified' ? '✅' : '⏳'}
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Status</span>
                        <span className={`stat-value status-${userData.payment_status}`}>
                            {userData.payment_status === 'verified' ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <span className="stat-label">Total Donations</span>
                        <span className="stat-value">{formatAmount(totalDonations)}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div className="stat-info">
                        <span className="stat-label">Location</span>
                        <span className="stat-value">{userData.city || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <nav className="dashboard-tabs">
                <button
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    📋 Overview
                </button>
                <button
                    className={activeTab === 'donations' ? 'active' : ''}
                    onClick={() => setActiveTab('donations')}
                >
                    💰 My Donations
                </button>
                <button
                    className={activeTab === 'downloads' ? 'active' : ''}
                    onClick={() => setActiveTab('downloads')}
                >
                    📥 Downloads
                </button>
            </nav>

            {/* Tab Content */}
            <main className="dashboard-content">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-panel overview-panel">
                        <div className="info-grid">
                            <div className="info-card">
                                <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3>👤 Personal Details</h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn-edit-profile"
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #C73E2C',
                                                color: '#C73E2C',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editFormData.name}
                                                onChange={handleEditChange}
                                                required
                                                className="edit-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Gotra</label>
                                            <input
                                                type="text"
                                                name="gotra"
                                                value={editFormData.gotra}
                                                onChange={handleEditChange}
                                                className="edit-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Family Members</label>
                                            <input
                                                type="number"
                                                name="family_members"
                                                value={editFormData.family_members}
                                                onChange={handleEditChange}
                                                min="1"
                                                className="edit-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={editFormData.city}
                                                onChange={handleEditChange}
                                                required
                                                className="edit-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={editFormData.state}
                                                onChange={handleEditChange}
                                                className="edit-input"
                                            />
                                        </div>

                                        <div className="edit-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                            <button
                                                type="submit"
                                                disabled={updateLoading}
                                                style={{
                                                    background: '#2E7D32',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {updateLoading ? 'Saving...' : '💾 Save'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                style={{
                                                    background: '#757575',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ❌ Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="info-rows">
                                        <div className="info-row">
                                            <span>Name</span>
                                            <strong>{userData.name}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>Phone</span>
                                            <strong>{userData.phone}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>Gotra</span>
                                            <strong>{userData.gotra || '-'}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>Family Members</span>
                                            <strong>{userData.family_members || 1}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>City</span>
                                            <strong>{userData.city || '-'}</strong>
                                        </div>
                                        <div className="info-row">
                                            <span>State</span>
                                            <strong>{userData.state || '-'}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="info-card">
                                <h3>📊 Registration Status</h3>
                                <div className="status-display">
                                    <div className={`status-badge large ${userData.payment_status}`}>
                                        {userData.payment_status === 'verified' ? (
                                            <>✅ Verified</>
                                        ) : (
                                            <>⏳ Pending Verification</>
                                        )}
                                    </div>
                                    {userData.payment_status !== 'verified' && (
                                        <p className="status-note">
                                            आपका पंजीकरण प्राप्त हो गया है।<br />
                                            कृपया दान करें और Admin verification का इंतजार करें।
                                        </p>
                                    )}
                                    {userData.transaction_id && (
                                        <div className="txn-info">
                                            <span>Transaction ID:</span>
                                            <code>{userData.transaction_id}</code>
                                        </div>
                                    )}
                                </div>

                                {userData.payment_status !== 'verified' && (
                                    <a href="/donate" className="donate-cta">
                                        🙏 दान करें (Donate Now)
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h3>⚡ Quick Actions</h3>
                            <div className="action-buttons">
                                <button onClick={downloadIdCard} className="action-btn">
                                    🪪 Download ID Card
                                </button>
                                <button onClick={downloadSankalpPatra} className="action-btn secondary">
                                    📜 Download Sankalp Patra
                                </button>
                                <a href="/donate" className="action-btn donate">
                                    💰 Make Donation
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Donations Tab */}
                {activeTab === 'donations' && (
                    <div className="tab-panel donations-panel">
                        <div className="panel-header">
                            <h2>💰 My Donations</h2>
                            <a href="/donate" className="btn-new-donation">+ New Donation</a>
                        </div>

                        {donations.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🙏</div>
                                <h3>कोई दान नहीं मिला</h3>
                                <p>अभी तक आपने कोई दान नहीं किया है।</p>
                                <a href="/donate" className="btn-donate">अभी दान करें</a>
                            </div>
                        ) : (
                            <>
                                <div className="donations-summary">
                                    <div className="summary-card">
                                        <span>Total Donations</span>
                                        <strong>{formatAmount(totalDonations)}</strong>
                                    </div>
                                    <div className="summary-card">
                                        <span>Number of Donations</span>
                                        <strong>{donations.length}</strong>
                                    </div>
                                </div>

                                <div className="donations-list">
                                    {donations.map((donation) => (
                                        <div key={donation.id} className="donation-card">
                                            <div className="donation-info">
                                                <div className="donation-amount">
                                                    {formatAmount(donation.amount)}
                                                </div>
                                                <div className="donation-meta">
                                                    <span className="donation-date">
                                                        📅 {formatDate(donation.created_at)}
                                                    </span>
                                                    <span className={`donation-status ${donation.status || 'pending'}`}>
                                                        {donation.status === 'verified' ? '✅ Verified' : '⏳ Pending'}
                                                    </span>
                                                </div>
                                                {donation.transaction_id && (
                                                    <div className="donation-txn">
                                                        TXN: {donation.transaction_id}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="donation-actions">
                                                <button
                                                    onClick={() => printReceipt(donation)}
                                                    className="btn-print"
                                                >
                                                    🖨️ Print
                                                </button>
                                                <button
                                                    onClick={() => downloadReceipt(donation)}
                                                    className="btn-download"
                                                >
                                                    📥 Download
                                                </button>
                                            </div>

                                            {/* Hidden Receipt for PDF/Print */}
                                            <div
                                                id={`receipt-${donation.id}`}
                                                className="receipt-template"
                                                style={{ position: 'absolute', left: '-9999px' }}
                                            >
                                                <div className="receipt">
                                                    <div className="receipt-header">
                                                        <img src={logo} alt="Logo" />
                                                        <h2>श्री राम राज्य महायज्ञ</h2>
                                                        <p>Donation Receipt</p>
                                                    </div>
                                                    <div className="receipt-body">
                                                        <div className="receipt-row">
                                                            <span>Receipt No:</span>
                                                            <strong>RR-{donation.id}</strong>
                                                        </div>
                                                        <div className="receipt-row">
                                                            <span>Date:</span>
                                                            <strong>{formatDate(donation.created_at)}</strong>
                                                        </div>
                                                        <div className="receipt-row">
                                                            <span>Donor Name:</span>
                                                            <strong>{userData.name}</strong>
                                                        </div>
                                                        <div className="receipt-row">
                                                            <span>Phone:</span>
                                                            <strong>{userData.phone}</strong>
                                                        </div>
                                                        <div className="receipt-row">
                                                            <span>Member ID:</span>
                                                            <strong>{userData.member_id}</strong>
                                                        </div>
                                                        <div className="receipt-amount">
                                                            {formatAmount(donation.amount)}
                                                        </div>
                                                        <div className="receipt-row">
                                                            <span>Transaction ID:</span>
                                                            <strong>{donation.transaction_id || 'N/A'}</strong>
                                                        </div>
                                                        <div className="receipt-row">
                                                            <span>Status:</span>
                                                            <strong>{donation.status === 'verified' ? 'Verified ✅' : 'Pending ⏳'}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="receipt-footer">
                                                        <p>॥ जय श्री राम ॥</p>
                                                        <p>Thank you for your generous donation!</p>
                                                        <p>श्री राम जन्मभूमि, अयोध्या धाम</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Downloads Tab */}
                {activeTab === 'downloads' && (
                    <div className="tab-panel downloads-panel">
                        <h2>📥 Downloads</h2>
                        <p className="downloads-info">
                            अपना ID Card और संकल्प पत्र यहाँ से Download करें।
                        </p>

                        <div className="download-cards">
                            <div className="download-card">
                                <div className="download-icon">🪪</div>
                                <h3>ID Card</h3>
                                <p>Credit card size ID for event entry</p>
                                <button onClick={downloadIdCard} className="btn-download-main">
                                    Download PDF
                                </button>
                            </div>

                            <div className="download-card featured">
                                <div className="download-icon">📜</div>
                                <h3>संकल्प पत्र</h3>
                                <p>A4 Landscape - Professional Certificate</p>
                                <button onClick={downloadSankalpPatra} className="btn-download-main">
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Hidden Templates for PDF Generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {/* ID Card Template */}
                <div ref={idCardRef} className="id-card-template">
                    <div className="id-card">
                        <div className="id-header">
                            <img src={logo} alt="Logo" className="id-logo" />
                            <div className="id-title">
                                <h2>श्री राम राज्य</h2>
                                <span>महायज्ञ 2026</span>
                            </div>
                        </div>
                        <div className="id-body">
                            <div className="id-photo">
                                <span className="om">ॐ</span>
                            </div>
                            <div className="id-details">
                                <h3>{userData.name}</h3>
                                <p className="role">श्री राम सेवक</p>
                                <div className="id-row">
                                    <span>ID:</span> <strong>{userData.member_id}</strong>
                                </div>
                                <div className="id-row">
                                    <span>City:</span> <strong>{userData.city || '-'}</strong>
                                </div>
                                <div className="id-row">
                                    <span>Phone:</span> <strong>{userData.phone}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="id-footer">
                            ।। धर्मो रक्षति रक्षितः ।।
                        </div>
                    </div>
                </div>

                <div ref={sankalpRef} className="sankalp-template">
                    <div className="sankalpatra">
                        {/* Certificate Header */}
                        <div className="cert-header">
                            <div className="cert-border-top"></div>
                            <div className="cert-om">🕉️</div>
                            <h1 className="cert-title">॥ श्री राम राज्य संकल्प पत्र ॥</h1>
                            <p className="cert-subtitle">SHRI RAM RAJYA SANKALP PATRA</p>
                            <p className="cert-member-id">Member ID: {userData.member_id}</p>
                            <div className="cert-line"></div>
                        </div>

                        {/* Certificate Body */}
                        <div className="cert-body">
                            <p className="cert-intro">
                                विश्व के प्रथम श्री राम राज्य महायज्ञ, अयोध्या धाम के पावन अवसर पर
                            </p>

                            <div className="cert-details">
                                <div className="detail-row">
                                    <span className="label">संकल्पकर्ता का नाम:</span>
                                    <span className="value">{userData.name || '_______________'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">पिता/पति श्री:</span>
                                    <span className="value">_______________</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">गोत्र:</span>
                                    <span className="value">{userData.gotra || '_______________'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">ग्राम/नगर:</span>
                                    <span className="value">{userData.city || '_______________'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">जिला:</span>
                                    <span className="value">_______________</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">राज्य:</span>
                                    <span className="value">{userData.state || '_______________'}</span>
                                </div>
                            </div>

                            <div className="cert-pledge">
                                <h3>॥ मेरा संकल्प ॥</h3>
                                <p>
                                    मैं संकल्प लेता/लेती हूँ कि मैं अपने जीवन में <strong>भगवान श्री राम के आदर्शों</strong> —
                                    सत्य, धर्म, न्याय, और मर्यादा का पालन करूँगा/करूँगी।
                                </p>
                                <p>
                                    मैं <strong>राष्ट्र की एकता, अखंडता और सनातन धर्म</strong> के उत्थान में अपना योगदान दूँगा/दूँगी।
                                </p>
                                <p>
                                    मैं <strong>विश्व कल्याण एवं श्री राम राज्य स्थापना</strong> की इस पावन यज्ञ में तन-मन-धन से सहयोग करूँगा/करूँगी।
                                </p>
                            </div>

                            <div className="cert-footer">
                                <div className="footer-left">
                                    <p className="date-line"><strong>दिनांक:</strong> {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="place-line">स्थान: अयोध्या धाम</p>
                                </div>

                                <div className="footer-right-approval">
                                    <div className="approval-status">
                                        <span className="check-icon">✓</span> Digitally Approved
                                    </div>
                                    <p className="approval-authority">Shree Ram Rajya Mahayagya Samiti</p>
                                </div>
                            </div>

                            <div className="cert-bottom">
                                <p className="blessing">॥ श्री राम जय राम जय जय राम ॥</p>
                                <p className="event-info">विश्व का प्रथम श्री राम राज्य महायज्ञ | 11 - 21 मई 2026 | शरयू तट, अयोध्या धाम</p>
                            </div>
                        </div>

                        {/* Decorative Corners */}
                        <div className="corner corner-tl"></div>
                        <div className="corner corner-tr"></div>
                        <div className="corner corner-bl"></div>
                        <div className="corner corner-br"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
