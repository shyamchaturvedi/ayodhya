import React from 'react';
import './Details.css';
import { FaOm, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Details = () => {
    const schedule = [
        {
            date: '10 मई 2026',
            time: '08:30 AM',
            title: 'कलश यात्रा',
            desc: 'भव्य कलश यात्रा का शुभारंभ।',
            icon: '🏺'
        },
        {
            date: '11 - 21 मई 2026',
            time: 'Daily',
            title: 'श्री राम राज्य महायज्ञ',
            desc: '9011 कुण्डीय महायज्ञ का अनुष्ठान।',
            icon: '🔥'
        },
        {
            date: '11 फरवरी 2026',
            time: 'Special Event',
            title: 'महायज्ञ ध्वज रोहण',
            desc: 'सरयू तट, अयोध्या जी।',
            icon: '🚩'
        }
    ];

    const dailySchedule = [
        { time: '08:30 AM – 11:00 AM', event: 'श्री राम राज्य महायज्ञ', icon: '🔥' },
        { time: '04:00 PM – 06:00 PM', event: 'श्री राम कथा & प्रवचन', icon: '📖' },
        { time: '06:00 PM', event: 'संध्या आरती', icon: '🪔' }
    ];

    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="page-hero details-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="om-decoration">
                        <FaOm />
                    </div>
                    <h1>महायज्ञ विवरण</h1>
                    <p>विश्व के प्रथम 9011 कुण्डीय महायज्ञ की पूर्ण जानकारी</p>
                </div>
            </section>

            <section className="page-content">
                {/* Important Dates */}
                <div className="section-title-center">
                    <h2 className="section-title">महत्वपूर्ण तिथियां</h2>
                </div>

                <div className="schedule-grid">
                    {schedule.map((item, index) => (
                        <div className="schedule-card premium-card" key={index}>
                            <span className="schedule-icon">{item.icon}</span>
                            <div className="date-badge">
                                <FaCalendarAlt />
                                <span>{item.date}</span>
                            </div>
                            <div className="time-badge">
                                <FaClock />
                                <span>{item.time}</span>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Daily Schedule */}
                <div className="daily-section">
                    <div className="section-title-center">
                        <h2 className="section-title">दैनिक कार्यक्रम</h2>
                    </div>

                    <div className="daily-schedule-card premium-card">
                        <div className="corner-decoration corner-tl"></div>
                        <div className="corner-decoration corner-tr"></div>
                        <div className="corner-decoration corner-bl"></div>
                        <div className="corner-decoration corner-br"></div>

                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>समय</th>
                                    <th>कार्यक्रम</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailySchedule.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span className="time-text">{item.time}</span>
                                        </td>
                                        <td>
                                            <span className="event-icon">{item.icon}</span>
                                            {item.event}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Venue Info */}
                <div className="venue-card premium-card">
                    <div className="venue-icon">
                        <FaMapMarkerAlt />
                    </div>
                    <h3>स्थान: शरयू तट, श्री राम जन्मभूमि</h3>
                    <p>अयोध्या धाम, उत्तर प्रदेश</p>
                </div>

                {/* Info Box */}
                <div className="info-box">
                    <h3>॥ यज्ञ का महत्व ॥</h3>
                    <p>
                        यह 9011 कुण्डीय महायज्ञ विश्व का प्रथम ऐसा आयोजन है जो प्रत्यक्ष रूप से 'राम राज्य' की स्थापना के संकल्प को समर्पित है।
                        इसमें भाग लेने मात्र से जन्म-जन्मांतर के पापों का नाश होता है और राष्ट्र की उन्नति का मार्ग प्रशस्त होता है।
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Details;
