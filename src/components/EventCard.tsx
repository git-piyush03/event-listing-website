import React from 'react';
import { Calendar, MapPin, Users, Trophy, ExternalLink, Clock, Tag } from 'lucide-react';
import type { Event } from '../types/Event';
import { format, isAfter, isBefore } from 'date-fns';
import './EventCard.css';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const now = new Date();
  const registrationStart = new Date(event.registrationStart);
  const registrationEnd = new Date(event.registrationEnd);
  
  const isRegistrationOpen = isAfter(now, registrationStart) && isBefore(now, registrationEnd);
  const isRegistrationClosed = isAfter(now, registrationEnd);
  const isRegistrationNotStarted = isBefore(now, registrationStart);

  const getStatusBadge = () => {
    if (isRegistrationClosed) {
      return <span className="status-badge closed">Registration Closed</span>;
    } else if (isRegistrationNotStarted) {
      return <span className="status-badge upcoming">Registration Soon</span>;
    } else {
      return <span className="status-badge open">Registration Open</span>;
    }
  };

  // kept for potential UI coloring needs; suppress unused in strict mode by using it in style below if needed

  return (
    <div className="event-card">
      {/* Event Image */}
      <div className="event-image">
        <img 
          src={event.image || 'https://via.placeholder.com/400x200/28a745/ffffff?text=Event+Image'} 
          alt={event.title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/assets/images/1.jpg'; // Fallback image
            target.onerror = null; // Prevent infinite loop if fallback image fails
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        <div className="event-overlay">
          {getStatusBadge()}
        </div>
      </div>

      {/* Event Content */}
      <div className="event-content">
        {/* Event Header */}
        <div className="event-header">
          <div className="event-category">
            <Tag size={14} />
            <span>{event.category.replace('-', ' ').toUpperCase()}</span>
          </div>
          <h3 className="event-title">
            <a href={event.eventUrl} target="_blank" rel="noopener noreferrer">
              {event.title}
            </a>
          </h3>
        </div>

        {/* Event Description */}
        <p className="event-description">
          {event.description.length > 120 
            ? `${event.description.substring(0, 120)}...` 
            : event.description
          }
        </p>

        {/* Event Details */}
        <div className="event-details">
          <div className="detail-item">
            <MapPin size={16} />
            <span>{event.location === 'online' ? 'Online Event' : event.location}</span>
          </div>
          
          <div className="detail-item">
            <Users size={16} />
            <span>{event.organizer}</span>
          </div>

          {event.prize && (
            <div className="detail-item">
              <Trophy size={16} />
              <span>{event.prize}</span>
            </div>
          )}
        </div>

        {/* Registration Dates */}
        <div className="registration-dates">
          <div className="date-item">
            <Calendar size={16} />
            <div className="date-info">
              <span className="date-label">Registration Start:</span>
              <span className="date-value">
                {format(registrationStart, 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
          
          <div className="date-item">
            <Clock size={16} />
            <div className="date-info">
              <span className="date-label">Registration End:</span>
              <span className="date-value">
                {format(registrationEnd, 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="event-actions">
          {isRegistrationOpen ? (
            <a 
              href={event.registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-register"
            >
              <ExternalLink size={16} />
              Register Now
            </a>
          ) : isRegistrationClosed ? (
            <button className="btn btn-disabled" disabled>
              Registration Closed
            </button>
          ) : (
            <button className="btn btn-upcoming" disabled>
              Registration Opens Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
