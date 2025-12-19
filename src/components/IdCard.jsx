
import React, { forwardRef } from 'react';
import logo from '../assets/logo.png';
import './IdCard.css';

const IdCard = forwardRef(({ user }, ref) => {
    if (!user) return null;

    return (
        <div className="id-card-container" ref={ref}>
            <div className="id-card-header">
                <img src={logo} alt="Logo" className="id-card-logo" />
                <div className="id-card-title">
                    <h2>श्री राम राज्य</h2>
                    <span>महा यज्ञ 2026</span>
                </div>
            </div>

            <div className="id-card-body">
                <div className="id-photo-placeholder">
                    {/* Placeholder for user photo or Om symbol if no photo */}
                    <div className="om-symbol">ॐ</div>
                </div>

                <div className="id-details">
                    <h3 className="member-name">{user.name}</h3>
                    <p className="member-role">श्री राम सेवक</p>

                    <div className="id-info-row">
                        <span className="label">Member ID:</span>
                        <span className="value">{user.member_id || 'PENDING'}</span>
                    </div>
                    <div className="id-info-row">
                        <span className="label">City:</span>
                        <span className="value">{user.city}</span>
                    </div>
                    <div className="id-info-row">
                        <span className="label">Phone:</span>
                        <span className="value">{user.phone}</span>
                    </div>
                </div>
            </div>

            <div className="id-card-footer">
                <p>।। धर्मो रक्षति रक्षितः ।।</p>
            </div>
        </div>
    );
});

export default IdCard;
