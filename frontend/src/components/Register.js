import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ username, password, role });
      toast.success("Account created! Please Login. 🎉");
      navigate('/login');
    } catch (error) {
      toast.error("Username might be taken.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#4f46e5', margin: '0 0 10px 0' }}>TaskFlow</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Create an account</h2>
            <p style={{ color: '#6b7280', marginTop: '5px' }}>Join your team and start managing tasks.</p>
        </div>

        <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Choose Username</label>
                <input 
                    className="saas-input" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                    placeholder="e.g. johndoe"
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Choose Password</label>
                <input 
                    type="password" 
                    className="saas-input" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="Min 6 characters"
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>I am a...</label>
                <select className="saas-select" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="user">Regular User (Employee)</option>
                    <option value="admin">Admin (Manager)</option>
                </select>
            </div>

            <button 
                type="submit" 
                className="saas-btn" 
                style={{ width: '100%', height: '48px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                disabled={loading}
            >
                {loading ? 'Creating Account...' : 'Sign up'}
            </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Already have an account? </span>
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
                Sign in
            </Link>
        </div>

      </div>
    </div>
  );
}

// === REUSE STYLES FROM LOGIN ===
const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
    padding: '20px'
};

const cardStyle = {
    background: 'white',
    width: '100%',
    maxWidth: '440px',
    padding: '40px',
    borderRadius: '16px',
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

export default Register;