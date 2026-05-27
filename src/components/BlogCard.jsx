import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ title, excerpt, date, category, image, slug }) => {
  return (
    <Link to={`/post/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="blog-card" style={{
        background: 'var(--bg-off-white)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition-smooth)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          height: '240px',
          backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1596434444211-38290263625f?auto=format&fit=crop&w=800'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <span style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            border: '1px solid var(--glass-border)'
          }}>{category}</span>
        </div>
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>{date}</span>
          <h3 style={{
            fontSize: '1.4rem',
            marginBottom: '1rem',
            color: 'var(--text-main)',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            hyphens: 'none'
          }}>{title}</h3>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            hyphens: 'none'
          }}>{excerpt}</p>
          <div style={{ marginTop: 'auto', fontWeight: 700, color: 'var(--primary-lilac-dark)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Read More <span style={{ transition: 'transform 0.3s ease' }} className="arrow">→</span>
          </div>
        </div>
        <style>{`
          .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-glow);
          }
          .blog-card:hover .arrow {
            transform: translateX(5px);
          }
        `}</style>
      </div>
    </Link>
  );
};

export default BlogCard;
