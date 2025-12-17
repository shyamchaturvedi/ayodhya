import React from 'react';
import './Details.css';

const Details = () => {
    return (
        <div className="page-container container">
            <h1 className="page-title text-center">महायज्ञ विवरण</h1>

            <div className="details-card">
                <h2>महत्वपूर्ण तिथियां</h2>
                <div className="schedule-grid">
                    <div className="schedule-item">
                        <div className="date-badge">10 मई 2026</div>
                        <div className="time">08:30 AM</div>
                        <h3>कलश यात्रा</h3>
                        <p>भव्य कलश यात्रा का शुभारंभ।</p>
                    </div>
                    <div className="schedule-item">
                        <div className="date-badge">11 - 22 मई 2026</div>
                        <div className="time">Daily</div>
                        <h3>श्री राम राज्य महायज्ञ</h3>
                        <p>9011 कुण्डीय महायज्ञ का अनुष्ठान।</p>
                    </div>
                    <div className="schedule-item">
                        <div className="date-badge">11 फरवरी 2026</div>
                        <div className="time">Event</div>
                        <h3>महायज्ञ ध्वज रोहण</h3>
                        <p>सरयू तट, अयोध्या जी।</p>
                    </div>
                </div>
            </div>

            <div className="details-card">
                <h2>दैनिक कार्यक्रम (Daily Schedule)</h2>
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>समय</th>
                            <th>कार्यक्रम</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>08:30 AM – 11:00 AM</td>
                            <td>श्री राम राज्य महायज्ञ</td>
                        </tr>
                        <tr>
                            <td>02:00 PM – 04:00 PM</td>
                            <td>श्री राम कथा & प्रवचन</td>
                        </tr>
                        <tr>
                            <td>06:00 PM</td>
                            <td>संध्या आरती</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="info-box">
                <h3>यज्ञ का महत्व</h3>
                <p>
                    यह 9011 कुण्डीय महायज्ञ विश्व का प्रथम ऐसा आयोजन है जो प्रत्यक्ष रूप से 'राम राज्य' की स्थापना के संकल्प को समर्पित है।
                    इसमें भाग लेने मात्र से जन्म-जन्मांतर के पापों का नाश होता है और राष्ट्र की उन्नति का मार्ग प्रशस्त होता है।
                </p>
            </div>
        </div>
    );
};

export default Details;
