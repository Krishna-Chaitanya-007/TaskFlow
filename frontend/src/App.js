import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EmployeeList from './components/EmployeeList';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

// Wrapper to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      
      {/* Show Navbar ONLY if logged in */}
      {token && (
        <nav className="navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>TaskFlow</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}>Tasks</Link>
            <Link to="/employees" className={`nav-link ${location.pathname === '/employees' ? 'active' : ''}`}>Team</Link>
            
            <button 
                onClick={handleLogout} 
                style={{ marginLeft: '30px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Logout
            </button>
          </div>
        </nav>
      )}

      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}