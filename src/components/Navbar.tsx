import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Home, Users, LogIn, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <Calendar className="logo-icon" />
            <span>EventHub</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link 
            to="/events" 
            className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span>Events</span>
          </Link>
          <Link 
            to="/community" 
            className={`navbar-link ${location.pathname === '/community' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Community</span>
          </Link>
        </div>

        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile">
                <img 
                  src={currentUser.photoURL || '/default-avatar.png'} 
                  alt="Profile" 
                  className="user-avatar"
                />
                <span className="user-name">{currentUser.displayName}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
