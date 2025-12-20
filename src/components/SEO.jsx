import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
    const siteTitle = "श्री राम राज्य महायज्ञ | 9011 कुंडीय महायज्ञ अयोध्या धाम";
    const defaultDescription = "विश्व का प्रथम 9011 कुंडीय श्री राम राज्य महायज्ञ, अयोध्या धाम में 11 मई से 21 मई 2026 तक आयोजित। राष्ट्र की एकता और सनातन धर्म के उत्थान के लिए जुड़ें।";
    const defaultKeywords = "Shri Ram Rajya Mahayagya, Ayodhya Dham, 9011 Kundiya Yagya, Sanatan Dharma, Yagya 2026, Ram Mandir Ayodhya, Ayodhya Event";
    const defaultImage = "https://shriramrajyamahayagya.com/og-image.jpg"; // Replace with actual image URL later or use a local asset if handled correctly requires public URL

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content="hi_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Canonical Link */}
            <link rel="canonical" href={window.location.href} />
        </Helmet>
    );
};

export default SEO;
