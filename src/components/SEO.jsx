import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
    const siteTitle = "श्री राम राज्य महायज्ञ | 9011 कुंडीय महायज्ञ अयोध्या धाम";
    const defaultDescription = "विश्व का प्रथम 9011 कुंडीय श्री राम राज्य महायज्ञ, अयोध्या धाम में 11 मई से 21 मई 2026 तक आयोजित। राष्ट्र की एकता और सनातन धर्म के उत्थान के लिए जुड़ें।";
    const defaultKeywords = "Shri Ram Rajya Mahayagya, Ayodhya Dham, 9011 Kundiya Yagya, Sanatan Dharma, Yagya 2026, Ram Mandir Ayodhya, Ayodhya Event, Vishwa Shanti Yagya, Bhupendra Pratap Hanuman Maharaj, Hindu Rituals, Vedic Yagya, Ayodhya Mahotsav, Spiritual Event India";

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

            {/* Structured Data (JSON-LD) for Google Events */}
            <script type="application/ld+json">
                {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Event",
                      "name": "Shri Ram Rajya Mahayagya",
                      "startDate": "2026-05-11",
                      "endDate": "2026-05-21",
                      "eventStatus": "https://schema.org/EventScheduled",
                      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                      "location": {
                        "@type": "Place",
                        "name": "Ayodhya Dham",
                        "address": {
                          "@type": "PostalAddress",
                          "streetAddress": "Ayodhya Dham",
                          "addressLocality": "Ayodhya",
                          "postalCode": "224123",
                          "addressRegion": "UP",
                          "addressCountry": "IN"
                        }
                      },
                      "image": [
                        "https://shriramrajyamahayagya.com/logo.png",
                        "https://shriramrajyamahayagya.com/og-image.jpg"
                       ],
                      "description": "Join the world's first 9011 Kundiya Shri Ram Rajya Mahayagya at Ayodhya Dham from 11th May to 21st May 2026.",
                      "organizer": {
                        "@type": "Organization",
                        "name": "Shree Ram Sena",
                        "url": "https://shriramrajyamahayagya.com"
                      }
                    }
                `}
            </script>
        </Helmet>
    );
};

export default SEO;
