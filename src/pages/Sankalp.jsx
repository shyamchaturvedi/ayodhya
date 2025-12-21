import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sankalp.css';
import { supabase } from '../supabaseClient';

const Sankalp = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(10023);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        gotra: '',
        village: '',
        district: '',
        state: '',
        date: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    const certificateRef = useRef(null);

    useEffect(() => {
        checkUserLogin();
        // Live counter simulation
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 3));
        }, 3000);
        return () => clearInterval(interval);
    }, []);


    const checkUserLogin = async () => {
        try {
            const userPhone = localStorage.getItem('userPhone');
            if (userPhone) {
                // Fetch user data from registrations
                const { data, error } = await supabase
                    .from('registrations')
                    .select('*')
                    .eq('phone', userPhone)
                    .single();

                if (data && !error) {
                    setIsLoggedIn(true);
                    setUserData(data);
                    // Pre-fill form with user data
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        gotra: data.gotra || '',
                        village: data.city || '',
                        state: data.state || ''
                    }));
                }
            }
        } catch (error) {
            console.error('Error checking login:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatMemberId = (id) => {
        if (!id) return 'RRY-2026/9011/001';
        if (id.toString().includes('/9011/')) return id;

        const parts = id.toString().split('-');
        const sequence = parts[parts.length - 1];
        return `RRY-2026/9011/${sequence}`;
    };

    const handleGetCertificate = () => {
        navigate('/login');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateCertificate = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.fatherName) {
            alert('कृपया अपना नाम और पिता का नाम भरें।');
            return;
        }
        setShowCertificate(true);
    };


    const printCertificate = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sankalp Patra - ${formData.name}</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Nirmala UI', 'Segoe UI', sans-serif;
                        background: white;
                        color: #333;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        width: 100vw;
                    }
                    .certificate {
                        width: 100%;
                        height: 100%;
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .cert-border {
                        border: 4px double #C73E2C;
                        border-radius: 10px;
                        width: 98%;
                        height: 96%;
                        padding: 25px;
                        position: relative;
                        background: white;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    .corner {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        border: 3px solid #C73E2C;
                    }
                    .corner-tl { top: 15px; left: 15px; border-right: none; border-bottom: none; border-top-left-radius: 8px; }
                    .corner-tr { top: 15px; right: 15px; border-left: none; border-bottom: none; border-top-right-radius: 8px; }
                    .corner-bl { bottom: 15px; left: 15px; border-right: none; border-top: none; border-bottom-left-radius: 8px; }
                    .corner-br { bottom: 15px; right: 15px; border-left: none; border-top: none; border-bottom-right-radius: 8px; }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                        position: relative;
                        z-index: 2;
                    }
                    .om { font-size: 2.5rem; color: #C73E2C; margin-bottom: 5px; }
                    .header h1 {
                        color: #C73E2C;
                        font-size: 24pt;
                        margin: 0;
                        font-weight: bold;
                    }
                    .header h2 {
                        color: #888;
                        font-size: 12pt;
                        margin: 5px 0 0;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .member-id {
                        font-size: 10pt;
                        color: #666;
                        margin-top: 5px;
                        background: #f5f5f5;
                        display: inline-block;
                        padding: 2px 10px;
                        border-radius: 12px;
                    }
                    
                    .shloka {
                        text-align: center;
                        font-style: italic;
                        color: #555;
                        font-size: 10pt;
                        margin: 10px 0;
                        line-height: 1.4;
                    }
                    
                    .intro {
                        text-align: justify;
                        padding: 15px;
                        background: #fff;
                        border-left: 5px solid #C73E2C;
                        margin: 10px 0;
                        font-size: 12pt;
                        line-height: 1.6;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    
                    .pledges {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin: 10px 0;
                    }
                    .pledge-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-size: 10pt;
                    }
                    .pledge-num {
                        background: #C73E2C;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 9pt;
                        font-weight: bold;
                        flex-shrink: 0;
                    }
                    
                    .prayer {
                        text-align: center;
                        color: #C73E2C;
                        font-weight: bold;
                        margin: 15px 0;
                        font-size: 12pt;
                    }
                    
                    .footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-top: auto;
                        padding-top: 10px;
                        border-top: 1px solid #eee;
                    }
                    .footer-left p {
                        font-size: 10pt;
                        margin: 3px 0;
                        color: #444;
                    }
                    
                    /* Digital Approval Style */
                    .footer-right {
                        text-align: right;
                    }
                    .approval-status {
                        color: #2e7d32;
                        font-size: 10pt;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        margin-bottom: 5px;
                    }
                    .check-icon {
                        background: #2e7d32;
                        color: white;
                        border-radius: 50%;
                        width: 16px;
                        height: 16px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        margin-right: 5px;
                    }
                    .authority {
                        color: #1a237e;
                        font-weight: bold;
                        font-size: 11pt;
                        border-top: 2px solid #1a237e;
                        padding-top: 2px;
                        display: inline-block;
                    }
                    
                    .bottom {
                        text-align: center;
                        margin-top: 10px;
                        border-top: 2px solid #C73E2C; /* Simple solid line */
                        padding-top: 10px;
                    }
                    .bottom p { margin: 2px 0; }
                    .blessing { color: #C73E2C; font-weight: bold; font-size: 12pt; }
                    .event-info { font-size: 9pt; color: #666; }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="cert-border">
                        <div class="corner corner-tl"></div>
                        <div class="corner corner-tr"></div>
                        <div class="corner corner-bl"></div>
                        <div class="corner corner-br"></div>
                        
                        <div class="header">
                            <div class="om">ॐ</div>
                            <h1>॥ श्री राम राज्य महायज्ञ ॥</h1>
                            <h2>संकल्प पत्र / SANKALP PATRA</h2>
                            <span class="member-id">Member ID: ${formatMemberId(userData?.member_id)}</span>
                        </div>
                        
                        <p class="shloka">
                            ॥ स्वस्ति प्रजाभ्यः परिपालयन्तां न्याय्येन मार्गेण महीं महीशाः ।<br/>
                            गोब्राह्मणेभ्यः शुभमस्तु नित्यं लोकाः समस्ताः सुखिनो भवन्तु ॥
                        </p>
                        
                        <div class="intro">
                            मैं, <span class="highlight">${formData.name}</span>, 
                            पुत्र/पुत्री <span class="highlight">${formData.fatherName}</span>, 
                            ${formData.gotra ? `गोत्र <span class="highlight">${formData.gotra}</span>,` : ''} 
                            निवासी <span class="highlight">${formData.village || '-'}${formData.district ? ', ' + formData.district : ''}, ${formData.state || 'भारत'}</span>,
                            श्री अयोध्या धाम में आयोजित <strong>"विश्व के प्रथम श्री राम राज्य महायज्ञ"</strong> के 
                            पावन अवसर पर निम्नलिखित संकल्प लेता/लेती हूँ:
                        </div>
                        
                        <div class="pledges">
                            <div class="pledge-item">
                                <span class="pledge-num">१</span>
                                <p>मैं अपने जीवन में <strong>सत्य, धर्म और मर्यादा</strong> का पालन करूँगा/करूँगी।</p>
                            </div>
                            <div class="pledge-item">
                                <span class="pledge-num">२</span>
                                <p>मैं <strong>सनातन धर्म और राष्ट्र</strong> की सेवा के लिए सदैव तत्पर रहूँगा/रहूँगी।</p>
                            </div>
                            <div class="pledge-item">
                                <span class="pledge-num">३</span>
                                <p>मैं <strong>श्री राम राज्य के आदर्शों</strong> को अपने परिवार और समाज में स्थापित करने का प्रयास करूँगा/करूँगी।</p>
                            </div>
                            <div class="pledge-item">
                                <span class="pledge-num">४</span>
                                <p>मैं नित्य <strong>प्रभु श्री राम का स्मरण</strong> और <strong>गौ माता की सेवा</strong> करूँगा/करूँगी।</p>
                            </div>
                        </div>
                        
                        <p class="prayer">🙏 हे प्रभु श्री राम! मुझे इस संकल्प को पूर्ण करने की शक्ति प्रदान करें। 🙏</p>
                        
                        <div class="footer">
                            <div class="footer-left">
                                <p><strong>दिनांक:</strong> ${formData.date}</p>
                                <p><strong>स्थान:</strong> अयोध्या धाम</p>
                            </div>
                            <div class="footer-right">
                                <div class="approval-status">
                                    <span class="check-icon">✓</span> Digitally Approved
                                </div>
                                <div class="authority">Shree Ram Rajya Mahayagya Samiti</div>
                            </div>
                        </div>
                        
                        <div class="bottom">
                            <p class="blessing">॥ जय श्री राम ॥ जय सियाराम ॥</p>
                            <p class="event-info">विश्व का प्रथम श्री राम राज्य महायज्ञ | 11 - 21 मई 2026 | शरयू तट, अयोध्या धाम</p>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 800);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (loading) {
        return (
            <div className="sankalp-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem' }}>🙏</div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sankalp-page">
            {/* Hero Section */}
            <div className="sankalp-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>॥ श्री राम राज्य संकल्प पत्र ॥</h1>
                    <p className="hero-subtitle">विश्व का प्रथम श्री राम राज्य महायज्ञ - अयोध्या धाम</p>
                </div>
            </div>

            <div className="container sankalp-content">
                {/* Counter Section */}
                <div className="counter-section">
                    <div className="counter-icon">🙏</div>
                    <h3>अब तक जुड़े राम भक्त</h3>
                    <div className="counter-display">{count.toLocaleString()}</div>
                    <p className="counter-subtitle">और बढ़ रहे हैं...</p>
                </div>

                {/* Pledge Text Section */}
                <div className="pledge-card">
                    <div className="pledge-header">
                        <span className="om-symbol">🕉️</span>
                        <h2>मेरा संकल्प</h2>
                        <span className="om-symbol">🕉️</span>
                    </div>
                    <div className="pledge-text">
                        <p>
                            <strong>॥ श्री राम जय राम जय जय राम ॥</strong>
                        </p>
                        <p>
                            मैं शपथ लेता/लेती हूँ कि मैं अपने जीवन में <strong>श्री राम के आदर्शों</strong> का पालन करूँगा/करूँगी।
                        </p>
                        <p>
                            मैं <strong>राष्ट्र की एकता, अखंडता और सनातन धर्म</strong> के उत्थान के लिए सदैव तत्पर रहूँगा/रहूँगी।
                        </p>
                        <p>
                            मैं <strong>विश्व के प्रथम श्री राम राज्य महायज्ञ</strong> में तन-मन-धन से सहयोग करूँगा/करूँगी।
                        </p>
                        <p className="signature-line">
                            ॥ जय श्री राम ॥
                        </p>
                    </div>
                </div>


                {/* Action Section */}
                <div className="action-section" style={{ textAlign: 'center', marginTop: '3rem' }}>
                    {!isLoggedIn ? (
                        <button
                            onClick={handleGetCertificate}
                            className="btn-generate"
                            style={{ maxWidth: '400px', margin: '0 auto' }}
                        >
                            🙏 संकल्प पत्र प्राप्त करें
                        </button>
                    ) : (
                        /* User is Logged In - Show Certificate Form */
                        <>
                            {/* Welcome Message */}
                            <div className="welcome-user">
                                <p>🙏 <strong>जय श्री राम, {userData?.name || 'भक्त'}!</strong></p>
                                <p className="member-id">आपकी Member ID: <code>{userData?.member_id}</code></p>
                            </div>

                            {/* Certificate Form */}
                            {!showCertificate ? (
                                <div className="certificate-form-section">
                                    <h2 className="form-title">
                                        <span>॥</span> अपना संकल्प पत्र बनाएं <span>॥</span>
                                    </h2>
                                    <p className="form-subtitle">नीचे अपनी जानकारी भरें और अपना संकल्प पत्र प्राप्त करें</p>

                                    <form className="certificate-form" onSubmit={generateCertificate}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>आपका पूरा नाम *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="श्री/श्रीमती..."
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>पिता/पति का नाम *</label>
                                                <input
                                                    type="text"
                                                    name="fatherName"
                                                    value={formData.fatherName}
                                                    onChange={handleInputChange}
                                                    placeholder="श्री..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>गोत्र</label>
                                                <input
                                                    type="text"
                                                    name="gotra"
                                                    value={formData.gotra}
                                                    onChange={handleInputChange}
                                                    placeholder="भारद्वाज, कश्यप, आदि"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>ग्राम/नगर</label>
                                                <input
                                                    type="text"
                                                    name="village"
                                                    value={formData.village}
                                                    onChange={handleInputChange}
                                                    placeholder="आपका गाँव/शहर"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>जिला</label>
                                                <input
                                                    type="text"
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                    placeholder="जिले का नाम"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>राज्य</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="उत्तर प्रदेश, आदि"
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-generate">
                                            🙏 संकल्प पत्र बनाएं
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* Certificate Display */
                                <div className="certificate-section">
                                    <div className="certificate-actions no-print">
                                        <button className="btn-action" onClick={printCertificate}>🖨️ प्रिंट करें</button>
                                        <button className="btn-action" onClick={() => setShowCertificate(false)}>✏️ संपादित करें</button>
                                    </div>

                                    <div className="sankalpatra" ref={certificateRef}>
                                        {/* Certificate Header */}
                                        <div className="cert-header">
                                            <div className="cert-border-top"></div>
                                            <div className="cert-om">🕉️</div>
                                            <h1 className="cert-title">॥ श्री राम राज्य संकल्प पत्र ॥</h1>
                                            <p className="cert-subtitle">SHRI RAM RAJYA SANKALP PATRA</p>
                                            <p className="cert-member-id">Member ID: {formatMemberId(userData?.member_id)}</p>
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
                                                    <span className="value">{formData.name || '_______________'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">पिता/पति श्री:</span>
                                                    <span className="value">{formData.fatherName || '_______________'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">गोत्र:</span>
                                                    <span className="value">{formData.gotra || '_______________'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">ग्राम/नगर:</span>
                                                    <span className="value">{formData.village || '_______________'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">जिला:</span>
                                                    <span className="value">{formData.district || '_______________'}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">राज्य:</span>
                                                    <span className="value">{formData.state || '_______________'}</span>
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
                                                    <p className="date-line"><strong>दिनांक:</strong> {formData.date}</p>
                                                    <p className="place-line">स्थान: अयोध्या धाम</p>
                                                </div>

                                                <div className="footer-right-approval">
                                                    <p className="approval-status">
                                                        <span className="check-icon">✓</span> Digitally Approved
                                                    </p>
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
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sankalp;
