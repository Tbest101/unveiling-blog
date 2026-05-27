import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
        // Track view only if not admin
        const isAdmin = localStorage.getItem('adminAuth') === 'true';
        if (!isAdmin) {
          fetch(`/api/posts/${data.id}/view`, { method: 'POST' });
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!post) return;

    const sendReadTime = () => {
      const isAdmin = localStorage.getItem('adminAuth') === 'true';
      if (isAdmin) return; // Don't track admin read time
      
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      if (seconds > 0) {
        const url = `/api/posts/${post.id}/read-time`;
        const blob = new Blob([JSON.stringify({ seconds })], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      }
    };

    window.addEventListener('beforeunload', sendReadTime);
    return () => {
      window.removeEventListener('beforeunload', sendReadTime);
      sendReadTime();
    };
  }, [post, startTime]);

  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (post) {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setHasLiked(likedPosts.includes(post.id));
    }
  }, [post]);

  const handleLike = async () => {
    try {
      const action = hasLiked ? 'unlike' : 'like';
      const res = await fetch(`/api/posts/${post.id}/${action}`, { method: 'POST' });
      const data = await res.json();
      setPost(prev => ({ ...prev, likes: data.likes }));
      
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (hasLiked) {
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts.filter(id => id !== post.id)));
      } else {
        localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, post.id]));
      }
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error('Like operation failed', err);
    }
  };

  const [reviewForm, setReviewForm] = useState({ author: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      const newReview = await res.json();
      setPost(prev => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview]
      }));
      setReviewForm({ author: '', comment: '' });
    } catch (err) {
      console.error('Review failed', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>Loading...</div>;
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>{error || 'Post not found'}</h2>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <article style={{ padding: '6rem 2rem', maxWidth: '760px', width: '100%', margin: '0 auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <Link to="/" style={{ color: 'var(--text-muted)', marginBottom: '2rem', display: 'inline-block' }}>← Back to home</Link>
      
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--primary-lilac-light)',
          color: 'var(--primary-lilac-dark)',
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>{post.category}</span>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{post.title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{post.date}</p>
      </div>

      <div 
        className="post-content"
        style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--text-main)', marginBottom: '4rem' }}
        dangerouslySetInnerHTML={{ __html: post.content ? post.content.replace(/&nbsp;/g, ' ') : '' }}
      />

      {/* Engagement Section */}
      <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '3rem',
        marginTop: '3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <button 
            onClick={handleLike}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.8rem',
              padding: '0.8rem 2rem' 
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{hasLiked ? '❤' : '♡'}</span> {post.likes || 0}
          </button>
          <span style={{ color: 'var(--text-muted)' }}>{post.views || 0} reading views</span>
        </div>

        <div id="reviews">
          <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Reviews ({post.reviews?.length || 0})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
            {post.reviews?.length > 0 ? (
              post.reviews.map(review => (
                <div key={review.id} style={{
                  background: 'var(--bg-off-white)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid var(--glass-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-lilac-dark)' }}>{review.author}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-main)', marginBottom: 0 }}>{review.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Review Form */}
          <form 
            onSubmit={handleReviewSubmit}
            className="glass-morphism" 
            style={{ 
              padding: '2rem', 
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}
          >
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Leave a Review</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={reviewForm.author}
                onChange={e => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.2rem',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <textarea 
              placeholder="What did you think of this story?" 
              value={reviewForm.comment}
              onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submittingReview}
              style={{ alignSelf: 'flex-start', padding: '0.8rem 2.5rem' }}
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>
      </div>
      
      <style>{`
        .post-content p { margin-bottom: 1.5rem; }
        .post-content h2, .post-content h3 { margin: 2.5rem 0 1rem; }
        @media (max-width: 600px) { .post-content { font-size: 1rem !important; } }
      `}</style>
    </article>
  );
};

export default PostDetail;
