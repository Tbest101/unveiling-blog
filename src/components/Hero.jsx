import React from 'react';

const Hero = () => {
  return (
    <section id="home" style={{
      background: 'linear-gradient(135deg, var(--bg-off-white) 0%, var(--primary-lilac-light) 100%)',
      padding: '8rem 0 5rem',
      textAlign: 'center'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 500, marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem', lineHeight: '1.2' }}>
          <span style={{ 
            background: 'var(--gradient-text)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>Unveiling with Me</span>
        </h1>
        <p style={{
          fontSize: '1.4rem',
          color: 'var(--text-muted)',
          maxWidth: '650px',
          margin: '0 auto 3rem',
          fontWeight: 400,
          lineHeight: '1.8'
        }}>
          Stories and reflections on life and faith, shared in the light of Jesus.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button className="btn-primary">Read Latest Posts</button>
          <button style={{
            padding: '0.8rem 1.8rem',
            borderRadius: '50px',
            border: '2px solid var(--primary-lilac)',
            color: 'var(--text-main)',
            fontWeight: 600,
            transition: 'inherit',
            background: 'var(--glass-bg)',
            boxShadow: 'var(--shadow-sm)'
          }} onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }} onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}>About Me</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
