import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Zap } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Amazing Tech Events & Hackathons
            </h1>
            <p className="hero-subtitle">
              Stay updated with the latest coding competitions, hackathons, and tech events happening around you. 
              Join thousands of developers, designers, and innovators in building the future.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary">
                <Calendar size={20} />
                Browse Events
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <Users size={20} />
                Join Community
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="floating-card card-1">
                <Calendar size={24} />
                <span>Hackathons</span>
              </div>
              <div className="floating-card card-2">
                <Trophy size={24} />
                <span>Prizes</span>
              </div>
              <div className="floating-card card-3">
                <Zap size={24} />
                <span>Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose EventHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about new events, registration deadlines, and important updates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Community Driven</h3>
              <p>Connect with like-minded developers, share experiences, and build lasting relationships.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Trophy size={32} />
              </div>
              <h3>Curated Events</h3>
              <p>Hand-picked events from top platforms like Codeforces, Kaggle, MLH, and more.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Smart Filtering</h3>
              <p>Find events by location, type, difficulty level, and your interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Events Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of developers who are already discovering amazing opportunities.</p>
            <Link to="/events" className="btn btn-primary btn-large">
              Explore Events Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
