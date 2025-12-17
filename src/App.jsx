import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Details from './pages/Details';
import Sankalp from './pages/Sankalp';
import Adhyaksh from './pages/Adhyaksh';
import Participate from './pages/Participate';
import Donate from './pages/Donate';
import Media from './pages/Media';
import Contact from './pages/Contact';
import HindiGuide from './pages/HindiGuide';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Placeholder components for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>Coming Soon...</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<Details />} />
        <Route path="sankalp" element={<Sankalp />} />
        <Route path="adhyaksh" element={<Adhyaksh />} />
        <Route path="participate" element={<Participate />} />
        <Route path="donate" element={<Donate />} />
        <Route path="gallery" element={<Media />} />
        <Route path="contact" element={<Contact />} />
        <Route path="guide" element={<HindiGuide />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
