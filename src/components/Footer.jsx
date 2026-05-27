import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="footer" style={{
      background: 'var(--bg-white)',
      borderTop: '1px solid var(--glass-border)',
      color: 'var(--text-main)',
      padding: '4rem 0 2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <img 
                src="/assets/logo.png" 
                alt="Unveiling with me" 
                style={{ 
                  height: '60px', 
                  width: 'auto',
                  borderRadius: '12px'
                }} 
              />
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Sharing stories that unveil the hidden beauty in everyday life. Join our community of readers.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.8rem' }}><Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link></li>
              <li style={{ marginBottom: '0.8rem' }}><Link to="/#blog" style={{ color: 'var(--text-muted)' }}>Blog</Link></li>
              <li style={{ marginBottom: '0.8rem' }}><Link to="/about" style={{ color: 'var(--text-muted)' }}>About</Link></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#footer" style={{ color: 'var(--text-muted)' }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Newsletter</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email" style={{
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                color: 'var(--text-main)',
                flex: 1
              }} />
              <button className="btn-primary" style={{ padding: '0.8rem 1.2rem' }}>Join</button>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          &copy; {new Date().getFullYear()} Unveiling with me. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
