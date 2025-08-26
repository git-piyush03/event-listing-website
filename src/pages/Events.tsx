import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';
import EventCard from '../components/EventCard';
import type { Event } from '../types/Event';
import { fetchEvents } from '../services/eventService';
import './Events.css';
import PastEvents from '../components/PastEvents';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, selectedLocation]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

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

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    setFilteredEvents(filtered);
  };
  const categories = ['all', 'hackathon', 'coding-contest', 'workshop', 'conference', 'meetup'];
  const locations = ['all', 'online', 'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata'];

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        {/* Header */}
        <div className="events-header">
          <h1 className="page-title">Hackathons</h1>
          <p className="page-subtitle">
            Harnessing creativity of tech enthusiasts to build a futuristic funnel of innovative India.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by hackathon name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">
                <Filter size={16} />
                Category
              </label>
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

            <div className="filter-group">
              <label className="filter-label">
                <MapPin size={16} />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location.charAt(0).toUpperCase() + location.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Toggle Past Events Button */}
        <div className="toggle-past-events">
          <button 
            className={`btn ${showPastEvents ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowPastEvents(!showPastEvents)}
          >
            {showPastEvents ? 'Show Upcoming Events' : 'Show Past Events'}
          </button>
        </div>

        {/* Events Display */}
        {showPastEvents ? (
          <PastEvents events={events} />
        ) : (
          <>
            {/* Results Count */}
            <div className="results-info">
              <p>
                Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events
              </p>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="no-events">
                <div className="no-events-icon">
                  <Calendar size={64} />
                </div>
                <h3>No events found</h3>
                <p>Try adjusting your search criteria or check back later for new events.</p>
              </div>
            )}
          </>
        )}

        {/* Load More Button
        {filteredEvents.length > 0 && (
          <div className="load-more">
            <button className="btn btn-primary">
              Load More Events
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Events;
