import { 
  fetchAllExternalEvents,
  fetchEventsBySource as fetchExternalEventsBySource,
  searchExternalEvents
} from './externalEventService';

// Export external API functions
export const fetchEvents = fetchAllExternalEvents;
export const fetchEventsBySource = fetchExternalEventsBySource;
export const searchEvents = searchExternalEvents;

// Note: External APIs don't support real-time subscriptions
// Events are fetched on-demand when needed
