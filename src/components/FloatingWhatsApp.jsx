import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
    return (
        <a
            href="https://whatsapp.com/channel/0029Vb6mdBXEFeXqV6Co6B1E"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp"
            title="Join Official WhatsApp Channel"
        >
            <FaWhatsapp />
            <span className="tooltip-text">अपडेट्स के लिए जुड़ें</span>
        </a>
    );
};

export default FloatingWhatsApp;
