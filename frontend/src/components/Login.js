import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({ username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      toast.success("Welcome back! 👋");
      navigate('/'); 
      window.location.reload(); 
    } catch (error) {
      toast.error("Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#4f46e5', margin: '0 0 10px 0' }}>TaskFlow</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Welcome back</h2>
            <p style={{ color: '#6b7280', marginTop: '5px' }}>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Username</label>
                <input 
                    className="saas-input" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                    placeholder="Enter your username"
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>Password</label>
                <input 
                    type="password" 
                    className="saas-input" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit" 
                className="saas-btn" 
                style={{ width: '100%', height: '48px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign in'}
            </button>
        </form>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
                Create account
            </Link>
        </div>

      </div>
    </div>
  );
}

// === MODERN AUTH STYLES ===
const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Premium Gradient Background
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)', 
    padding: '20px'
};

const cardStyle = {
    background: 'white',
    width: '100%',
    maxWidth: '440px',
    padding: '40px',
    borderRadius: '16px',
    // Deep "Floating" Shadow
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.8)'
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
};

export default Login;