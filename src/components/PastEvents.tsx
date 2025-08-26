import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { Event } from '../types/Event';
import { isAfter } from 'date-fns';
import EventCard from './EventCard';
import './PastEvents.css';

interface PastEventsProps {
  events: Event[];
}

const PastEvents: React.FC<PastEventsProps> = ({ events }) => {
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const now = new Date();
    const past = events.filter(event => {
      const eventEnd = event.eventEnd ? new Date(event.eventEnd) : new Date(event.registrationEnd);
      return isAfter(now, eventEnd);
    });
    setPastEvents(past);
  }, [events]);

  useEffect(() => {
    let filtered = pastEvents;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [pastEvents, searchTerm, selectedCategory]);

  const categories = ['all', 'hackathon', 'coding-contest', 'workshop', 'conference', 'meetup', 'data-science'];

  if (pastEvents.length === 0) {
    return (
      <div className="past-events-page">
        <div className="container">
          <div className="past-events-header">
            <h1 className="page-title">Past Events</h1>
            <p className="page-subtitle">
              No past events found. Check back later for completed events.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="past-events-page">
      <div className="container">
        {/* Header */}
        <div className="past-events-header">
          <h1 className="page-title">Past Events</h1>
          <p className="page-subtitle">
            Browse through completed events and hackathons from the past.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search past events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing <strong>{filteredEvents.length}</strong> of <strong>{pastEvents.length}</strong> past events
          </p>
        </div>

        {/* Past Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="past-events-grid">
            {filteredEvents.map((event) => (
              <div key={event.id} className="past-event-card">
                <EventCard event={event} />
                <div className="past-event-badge">
                  <Clock size={16} />
                  <span>Completed</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-past-events">
            <div className="no-events-icon">
              <Calendar size={64} />
            </div>
            <h3>No past events found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;