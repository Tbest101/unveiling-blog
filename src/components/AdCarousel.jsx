import React, { useState, useEffect } from 'react';

const AdCarousel = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch('/api/ads')
      .then(res => res.json())
      .then(data => {
        setAds(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        setAds([]);
      });
  }, []);

  if (ads.length === 0) return null;

  // Double the ads for infinite scroll effect
  const displayAds = [...ads, ...ads];

  return (
    <div className="ad-carousel-container">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase',
            color: 'var(--primary-lilac-dark)',
            background: 'var(--primary-lilac-light)',
            padding: '4px 12px',
            borderRadius: '20px'
          }}>Sponsored</span>
          <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }}></div>
        </div>
      </div>
      
      <div className="ad-track">
        {displayAds.map((ad, index) => (
          <a key={index} href={ad.link} target="_blank" rel="noopener noreferrer" className="ad-item">
            <img src={ad.image} alt={`Advertisement ${index + 1}`} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
