import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AdCarousel from '../components/AdCarousel';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPostsData(data);
        } else {
          console.error("API Error:", data);
          setPostsData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setPostsData([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Hero />
      <AdCarousel />
      <section id="blog" className="container" style={{ padding: '5rem 0' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2.5rem' }}>Latest Write-ups</h2>
          <Link to="/" style={{ color: 'var(--primary-lilac-dark)', fontWeight: 600 }}>View All Posts →</Link>
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading posts...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
            gap: '2.5rem'
          }}>
            {postsData.length === 0 ? <p>No published posts available.</p> : null}
            {postsData.map(post => {
              // Extract first image from content as fallback
              let featuredImage = post.image;

              
              if (!featuredImage || featuredImage.includes('unsplash.com/photo-1596434444211-38290263625f')) {
                const imgMatch = post.content ? post.content.match(/<img[^>]+src="([^">]+)"/) : null;
                if (imgMatch) {
                  featuredImage = imgMatch[1];
                }
              }

              // Replace tags with spaces, then decode &nbsp;, then collapse multiple spaces to single space
              let strip = post.content ? post.content.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim() : "";
              let excerpt = strip.length > 120 ? strip.substring(0, 120).trim() + '...' : strip;
              return (
                <div key={post.id} style={{ minWidth: 0 }}>
                  <BlogCard {...post} image={featuredImage} excerpt={excerpt} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ background: 'var(--bg-off-white)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Interested in updates?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Every Friday, I share a snippet of my latest unveilings and thoughts.
          </p>
          <button className="btn-primary">Subscribe to Newsletter</button>
        </div>
      </section>
    </>
  );
};

export default Home;
