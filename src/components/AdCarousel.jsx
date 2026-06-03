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
    <div className="ad-carousel-container" style={{ marginTop: '4rem' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'var(--bg-white)',
            border: '1px solid var(--glass-border)',
            padding: '6px 16px',
            borderRadius: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}>Sponsored / Books</span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, var(--glass-border), transparent)' }}></div>
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
