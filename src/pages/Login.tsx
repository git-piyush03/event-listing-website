import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Trophy, Zap } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="logo-section">
              <Calendar className="logo-icon" size={48} />
              <h1>EventHub</h1>
            </div>
            <h2>Welcome to EventHub</h2>
            <p>Join thousands of developers discovering amazing tech events and hackathons</p>
          </div>

          <div className="login-form">
            <button 
              onClick={handleGoogleLogin}
              className="google-login-btn"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="guest-option">
              <p>Want to explore events first?</p>
              <button 
                onClick={() => navigate('/events')}
                className="guest-btn"
              >
                Browse as Guest
              </button>
            </div>
          </div>

          <div className="features-preview">
            <h3>Why Join EventHub?</h3>
            <div className="features-grid">
              <div className="feature-item">
                <Calendar className="feature-icon" />
                <h4>Real-time Updates</h4>
                <p>Get instant notifications about new events and deadlines</p>
              </div>
              <div className="feature-item">
                <Users className="feature-icon" />
                <h4>Community</h4>
                <p>Connect with like-minded developers and innovators</p>
              </div>
              <div className="feature-item">
                <Trophy className="feature-icon" />
                <h4>Curated Events</h4>
                <p>Hand-picked events from top platforms worldwide</p>
              </div>
              <div className="feature-item">
                <Zap className="feature-icon" />
                <h4>Smart Filtering</h4>
                <p>Find events that match your interests and skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
