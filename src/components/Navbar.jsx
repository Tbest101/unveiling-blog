import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="glass-morphism" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '0.8rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          className="logo" 
          onDoubleClick={() => navigate('/admin')}
          title="Double click for Admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          <img 
            src="/assets/logo.png" 
            alt="Unveiling with me" 
            style={{ 
              height: '50px', 
              width: 'auto',
              borderRadius: '8px'
            }} 
          />
        </Link>
        
        <div className="nav-links" style={{
          display: 'flex',
          gap: '2rem',
          fontWeight: 500
        }}>
          <Link to="/">Home</Link>
          <Link to="/#blog">Blog</Link>
          <Link to="/about">About</Link>
          <a href="#footer">Contact</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              color: 'var(--text-main)',
              transition: 'transform 0.3s ease'
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn-primary">Subscribe</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
