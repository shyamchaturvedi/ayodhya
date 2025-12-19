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
                        margin: 15mm;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Nirmala UI', 'Segoe UI', sans-serif;
                        background: #FFF8E1;
                        color: #333;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .certificate {
                        width: 100%;
                        height: 100vh;
                        padding: 20px;
                        position: relative;
                    }
                    .cert-border {
                        border: 4px double #C73E2C;
                        border-radius: 10px;
                        height: 100%;
                        padding: 25px;
                        position: relative;
                        background: linear-gradient(180deg, rgba(255,215,0,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,215,0,0.1) 100%);
                    }
                    .corner {
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        border: 3px solid #FFD700;
                    }
                    .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; border-top-left-radius: 8px; }
                    .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; border-top-right-radius: 8px; }
                    .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; border-bottom-left-radius: 8px; }
                    .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; border-bottom-right-radius: 8px; }
                    
                    .header {
                        text-align: center;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #FFD700;
                        margin-bottom: 20px;
                    }
                    .om { font-size: 2.5rem; color: #C73E2C; }
                    .header h1 {
                        color: #C73E2C;
                        font-size: 26pt;
                        margin: 10px 0 5px;
                    }
                    .header h2 {
                        color: #FF8F00;
                        font-size: 14pt;
                        font-weight: normal;
                        margin: 0 0 5px;
                    }
                    .member-id {
                        font-size: 10pt;
                        color: #666;
                    }
                    .member-id code {
                        background: #FFD700;
                        padding: 3px 10px;
                        border-radius: 15px;
                        color: #333;
                        font-weight: bold;
                    }
                    
                    .shloka {
                        text-align: center;
                        font-style: italic;
                        color: #8B4513;
                        font-size: 11pt;
                        margin: 15px 0;
                        line-height: 1.6;
                    }
                    
                    .intro {
                        background: rgba(255,255,255,0.7);
                        padding: 15px 20px;
                        border-radius: 8px;
                        border-left: 4px solid #C73E2C;
                        margin-bottom: 20px;
                        font-size: 12pt;
                        line-height: 1.8;
                    }
                    .intro .highlight {
                        color: #C73E2C;
                        font-weight: bold;
                    }
                    
                    .pledges {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .pledge-item {
                        display: flex;
                        gap: 10px;
                        align-items: flex-start;
                        background: rgba(255,255,255,0.6);
                        padding: 12px 15px;
                        border-radius: 8px;
                        font-size: 11pt;
                    }
                    .pledge-num {
                        width: 28px;
                        height: 28px;
                        background: linear-gradient(135deg, #C73E2C, #E64A19);
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        flex-shrink: 0;
                    }
                    
                    .prayer {
                        text-align: center;
                        color: #C73E2C;
                        font-size: 13pt;
                        font-weight: bold;
                        margin: 15px 0;
                    }
                    
                    .footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 2px dashed #FFD700;
                    }
                    .footer-left p {
                        margin: 5px 0;
                        font-size: 11pt;
                    }
                    .signature-box {
                        text-align: center;
                        min-width: 200px;
                    }
                    .signature-name {
                        border-bottom: 2px solid #333;
                        padding: 5px 15px;
                        margin-bottom: 5px;
                        font-family: cursive;
                        font-size: 16pt;
                        font-style: italic;
                    }
                    .signature-label {
                        font-size: 10pt;
                        color: #666;
                    }
                    
                    .bottom {
                        text-align: center;
                        margin-top: 15px;
                    }
                    .bottom .blessing {
                        color: #C73E2C;
                        font-size: 14pt;
                        font-weight: bold;
                    }
                    .bottom .event-info {
                        color: #666;
                        font-size: 10pt;
                        margin-top: 5px;
                    }
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
                            <p class="member-id">Member ID: <code>${userData?.member_id || 'N/A'}</code></p>
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
                                <p><strong>स्थान:</strong> अयोध्या धाम, उत्तर प्रदेश</p>
                            </div>
                            <div class="signature-box">
                                <div class="signature-name">${formData.name}</div>
                                <span class="signature-label">हस्ताक्षर / Signature</span>
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
                        }, 500);
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

                {/* Check if user is logged in */}
                {!isLoggedIn ? (
                    /* Not Logged In - Show Registration CTA */
                    <div className="login-required-section">
                        <div className="login-required-card">
                            <div className="lock-icon">🔒</div>
                            <h2>संकल्प पत्र के लिए पंजीकरण आवश्यक है</h2>
                            <p>अपना संकल्प पत्र प्राप्त करने के लिए कृपया पहले पंजीकरण करें या लॉगिन करें।</p>

                            <div className="auth-buttons">
                                <Link to="/participate" className="btn-register">
                                    🙏 अभी पंजीकरण करें
                                </Link>
                                <Link to="/login" className="btn-login">
                                    🔑 पहले से पंजीकृत? लॉगिन करें
                                </Link>
                            </div>

                            <div className="benefits-box">
                                <h4>पंजीकरण के लाभ:</h4>
                                <ul>
                                    <li>✅ व्यक्तिगत संकल्प पत्र प्राप्त करें</li>
                                    <li>✅ यज्ञ में सहभागिता का प्रमाण पत्र</li>
                                    <li>✅ विशेष Member ID</li>
                                    <li>✅ यज्ञ की अपडेट्स प्राप्त करें</li>
                                </ul>
                            </div>
                        </div>
                    </div>
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
                                        <p className="cert-member-id">Member ID: {userData?.member_id}</p>
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
                                                <p className="date-line">दिनांक: {formData.date}</p>
                                                <p className="place-line">स्थान: अयोध्या धाम</p>
                                            </div>
                                            <div className="footer-right">
                                                <div className="signature-box">
                                                    <div className="signature-line-box"></div>
                                                    <p>संकल्पकर्ता के हस्ताक्षर</p>
                                                </div>
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
    );
};

export default Sankalp;
