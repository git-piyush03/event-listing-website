import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Trophy, Settings, LogOut } from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-authenticated">
            <h2>Please log in to view your profile</h2>
            <p>You need to be authenticated to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={currentUser.photoURL || '/default-avatar.png'} 
              alt="Profile" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png';
              }}
            />
          </div>
          <div className="profile-info">
            <h1>{currentUser.displayName || 'User'}</h1>
            <p className="user-email">{currentUser.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <Calendar size={20} />
                <span>Events Joined: 12</span>
              </div>
              <div className="stat">
                <Trophy size={20} />
                <span>Prizes Won: 3</span>
              </div>
              <div className="stat">
                <Users size={20} />
                <span>Team Members: 8</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-secondary">
              <Settings size={16} />
              Edit Profile
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-section">
            <h2>Recent Events</h2>
            <div className="recent-events">
              <div className="event-item">
                <div className="event-image">
                  <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100&h=60&fit=crop" alt="Event" />
                </div>
                <div className="event-details">
                  <h3>Code4Bharath: Innovate for India</h3>
                  <p>Status: <span className="status active">Active</span></p>
                  <p>Joined: August 19, 2025</p>
                </div>
              </div>
              <div className="event-item">
                <div className="event-image">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=60&fit=crop" alt="Event" />
                </div>
                <div className="event-details">
                  <h3>Innoquest 2025</h3>
                  <p>Status: <span className="status upcoming">Upcoming</span></p>
                  <p>Joined: August 4, 2025</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Preferences</h2>
            <div className="preferences-grid">
              <div className="preference-item">
                <h4>Event Categories</h4>
                <div className="tags">
                  <span className="tag">Hackathons</span>
                  <span className="tag">Coding Contests</span>
                  <span className="tag">Workshops</span>
                </div>
              </div>
              <div className="preference-item">
                <h4>Location</h4>
                <div className="tags">
                  <span className="tag">Online</span>
                  <span className="tag">Delhi</span>
                  <span className="tag">Bangalore</span>
                </div>
              </div>
              <div className="preference-item">
                <h4>Difficulty Level</h4>
                <div className="tags">
                  <span className="tag">Beginner</span>
                  <span className="tag">Intermediate</span>
                </div>
              </div>
              <div className="preference-item">
                <h4>Notifications</h4>
                <div className="tags">
                  <span className="tag">Email</span>
                  <span className="tag">Push</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Activity</h2>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon">
                  <Calendar size={16} />
                </div>
                <div className="activity-content">
                  <p>Joined <strong>Code4Bharath: Innovate for India</strong></p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <Trophy size={16} />
                </div>
                <div className="activity-content">
                  <p>Won 2nd place in <strong>AgriTech Hack 2025</strong></p>
                  <span className="activity-time">1 week ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <Users size={16} />
                </div>
                <div className="activity-content">
                  <p>Joined team <strong>Innovation Squad</strong></p>
                  <span className="activity-time">2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
