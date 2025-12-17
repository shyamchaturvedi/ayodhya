import React, { useState } from 'react';
import './Participate.css';

const Participate = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        familyMembers: 1,
        gotra: '',
        city: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`जय श्री राम! Registration Successful for ${formData.name}`);
        // Here you would integrate with backend or WhatsApp API
    };

    return (
        <div className="page-container container">
            <h1 className="page-title text-center">यज्ञ सहभागिता पंजीकरण</h1>

            <div className="form-wrapper">
                <form onSubmit={handleSubmit} className="participation-form">
                    <div className="form-group">
                        <label>पूरा नाम (Full Name)</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Ex: Amit Sharma"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>मोबाइल नंबर (Mobile Number)</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="Ex: 9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>गोत्र (Gotra)</label>
                            <input
                                type="text"
                                name="gotra"
                                placeholder="Optional"
                                value={formData.gotra}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>सदस्य संख्या (Family Members)</label>
                            <input
                                type="number"
                                name="familyMembers"
                                min="1"
                                value={formData.familyMembers}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>शहर / राज्य (City & State)</label>
                        <input
                            type="text"
                            name="city"
                            required
                            placeholder="Ex: Ayodhya, UP"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" id="prasad" />
                        <label htmlFor="prasad">मुझे ई-प्रसाद (E-Prasad) चाहिए</label>
                    </div>

                    <button type="submit" className="btn-primary full-width">पंजीकरण करें (Register Now)</button>
                </form>
            </div>
        </div>
    );
};

export default Participate;
