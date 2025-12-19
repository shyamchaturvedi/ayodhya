import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Shree Ram Sena Ayodhya" style={{ height: '60px', width: 'auto' }} />
            <div className="logo-text">
              <h1>श्री राम राज्य</h1>
              <span>महा यज्ञ 2026</span>
            </div>
          </Link>
        </div>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/about" onClick={toggleMenu}>Mahayagya</Link></li>
            <li><Link to="/adhyaksh" onClick={toggleMenu}>Adhyaksh</Link></li>
            <li><Link to="/organizers" onClick={toggleMenu}>Committee</Link></li>
            <li><Link to="/sankalp" onClick={toggleMenu}>Sankalp</Link></li>
            <li><Link to="/participate" onClick={toggleMenu}>Participate</Link></li>
            <li><Link to="/gallery" onClick={toggleMenu}>Darshan</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
            <li><Link to="/login" onClick={toggleMenu} className="login-link-nav">Login</Link></li>
          </ul>
          <div className="cta-buttons-mobile">
            <Link to="/donate" className="btn-primary" onClick={toggleMenu}>Donate</Link>
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/donate" className="btn-primary desktop-only">Donate</Link>
          <button className="mobile-menu-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
