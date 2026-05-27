import React from 'react';
import aboutData from '../data/about.json';

const About = () => {
  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-lilac-dark)' }}>About my blog</h1>
      <div 
        className="post-content"
        style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)' }}
        dangerouslySetInnerHTML={{ __html: aboutData.content }}
      />
      <style>{`
        .post-content p {
          margin-bottom: 1.5rem;
        }
        .post-content a {
          color: var(--primary-lilac-dark);
          text-decoration: underline;
        }
        .post-content ul {
          margin-left: 2rem;
          margin-bottom: 1.5rem;
        }
        .post-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default About;
