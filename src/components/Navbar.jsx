import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
          fontWeight: 500,
          alignItems: 'center'
        }}>
          <Link to="/">Home</Link>
          <div 
            style={{ position: 'relative' }} 
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Blog {dropdownOpen ? '▴' : '▾'}
            </div>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '-20px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '240px',
                padding: '0.5rem 0',
                boxShadow: 'var(--shadow-md)',
                marginTop: '0.5rem',
                zIndex: 1000
              }}>
                <Link to="/?category=All#blog" style={{ padding: '10px 20px', display: 'block', textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>All Categories</Link>
                <div style={{ padding: '0 20px', opacity: 0.5 }}><hr style={{ border: 'none', borderTop: '1px solid currentColor' }}/></div>
                <Link to="/?category=MEMORIES%20FROM%20CHILDHOOD#blog" style={{ padding: '10px 20px', display: 'block', textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>MEMORIES FROM CHILDHOOD</Link>
                <Link to="/?category=PARENTING#blog" style={{ padding: '10px 20px', display: 'block', textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>PARENTING</Link>
                <Link to="/?category=RELATIONSHIPS#blog" style={{ padding: '10px 20px', display: 'block', textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>RELATIONSHIPS</Link>
                <Link to="/?category=GROWTH#blog" style={{ padding: '10px 20px', display: 'block', textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>GROWTH</Link>
                <Link to="/?category=FAITH#blog" style={{ padding: '10px 20px', display: 'block', textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>FAITH</Link>
              </div>
            )}
          </div>
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
