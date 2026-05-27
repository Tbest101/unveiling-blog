import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [newAdUrl, setNewAdUrl] = useState('');
  const [newAdLink, setNewAdLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin');
      return;
    }
    fetchPosts();
    fetchAds();
  }, [navigate]);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts?admin=true');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  async function fetchAds() {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setAds(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        fetchPosts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteAd = async (id) => {
    if (window.confirm('Remove this advertisement?')) {
      try {
        await fetch(`/api/ads/${id}`, { method: 'DELETE' });
        fetchAds();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addAd = async (e) => {
    e.preventDefault();
    if (!newAdUrl || !newAdLink) return;
    try {
      await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: newAdUrl, link: newAdLink })
      });
      setNewAdUrl('');
      setNewAdLink('');
      fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="container" style={{ padding: '6rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your stories</p>
        </div>
        <div>
          <Link to="/admin/new" className="btn-primary" style={{ marginRight: '1rem' }}>+ New Post</Link>
          <button onClick={() => {
            localStorage.removeItem('adminAuth');
            navigate('/');
          }} style={{ border: 'none', background: 'none', color: 'var(--text-muted)' }}>Logout</button>
        </div>
      </div>

      <div className="glass-morphism" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(107, 63, 160, 0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1.2rem' }}>Story Title</th>
              <th style={{ padding: '1.2rem' }}>Views</th>
              <th style={{ padding: '1.2rem' }}>Likes</th>
              <th style={{ padding: '1.2rem' }}>Read Time</th>
              <th style={{ padding: '1.2rem' }}>Reviews</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }} className="dash-row">
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ fontWeight: 600 }}>{post.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</div>
                </td>
                <td style={{ padding: '1.2rem' }}>{post.views || 0}</td>
                <td style={{ padding: '1.2rem' }}>❤️ {post.likes || 0}</td>
                <td style={{ padding: '1.2rem' }}>{formatTime(post.readTime)}</td>
                <td style={{ padding: '1.2rem' }}>💬 {post.reviews?.length || 0}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    background: post.published ? 'rgba(122, 158, 126, 0.2)' : 'rgba(214, 166, 166, 0.2)', 
                    color: post.published ? '#7A9E7E' : '#D6A6A6',
                    padding: '6px 12px', 
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: '1px solid currentColor'
                  }}>
                    {post.published ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <Link to={`/admin/edit/${post.id}`} style={{ marginRight: '1rem', color: 'var(--primary-lilac-dark)', fontWeight: 600 }}>Edit</Link>
                  <button onClick={() => deletePost(post.id)} style={{ color: '#ef4444', fontWeight: 600, border: 'none', background: 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Advertisement Management</h3>
        <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '24px' }}>
          <form onSubmit={addAd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Image URL (e.g., https://example.com/image.jpg)" 
                value={newAdUrl}
                onChange={(e) => setNewAdUrl(e.target.value)}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
              />
              <input 
                type="text" 
                placeholder="Destination Link (e.g., https://selar.com/abc)" 
                value={newAdLink}
                onChange={(e) => setNewAdLink(e.target.value)}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Add Ad</button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {ads.map(ad => (
              <div key={ad.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <img src={ad.image} alt="Ad" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <button 
                  onClick={() => deleteAd(ad.id)}
                  style={{ 
                    position: 'absolute', top: '5px', right: '5px', 
                    background: 'rgba(239, 68, 68, 0.9)', color: 'white', 
                    borderRadius: '50%', width: '24px', height: '24px', 
                    fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dash-row:hover {
          background: rgba(107, 63, 160, 0.02);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
