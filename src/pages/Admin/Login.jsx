import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check for demo purposes
    if (password === 'unveiling123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="container" style={{ padding: '8rem 0', maxWidth: '400px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '2rem' }}>Admin Access</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Admin Password"
          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--primary-lilac-dark)' }}
        />
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
