import type { Event } from '../types/Event';

// Check if DOMParser is available (browser environment)
const isBrowser = typeof window !== 'undefined' && typeof DOMParser !== 'undefined';

// API endpoints and configurations
const API_CONFIG = {
  CODEFORCES: {
    baseUrl: 'https://codeforces.com/api',
    endpoints: {
      contests: '/contest.list'
    }
  },
  KAGGLE: {
    baseUrl: import.meta.env.DEV ? '/api/kaggle' : 'https://www.kaggle.com/api/v1',
    endpoints: {
      competitions: '/competitions/list'
    }
  },
  EVENTBRITE: {
    baseUrl: 'https://www.eventbrite.com',
    endpoints: {
      events: '/api/v3/events/search'
    }
  },
  MLH: {
    baseUrl: 'https://mlh.io',
    endpoints: {
      events: '/seasons/2026/events'
    }
  }
};

// Convert external API data to our Event interface
const convertCodeforcesContest = (contest: any): Event => ({
  id: `codeforces_${contest.id}`,
  title: contest.name,
  description: `Codeforces contest: ${contest.name}`,
  category: 'coding-contest',
  location: 'online',
  organizer: 'Codeforces',
  image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
  eventUrl: `https://codeforces.com/contest/${contest.id}`,
  registrationUrl: `https://codeforces.com/contestRegistration/${contest.id}`,
  registrationStart: new Date(contest.startTimeSeconds * 1000).toISOString(),
  registrationEnd: new Date(contest.startTimeSeconds * 1000).toISOString(),
  eventStart: new Date(contest.startTimeSeconds * 1000).toISOString(),
  eventEnd: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toISOString(),
  difficulty: contest.difficulty || 'intermediate',
  tags: ['competitive-programming', 'algorithms'],
  source: 'codeforces',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const convertKaggleCompetition = (competition: any): Event => ({
  id: `kaggle_${competition.id}`,
  title: competition.title,
  description: competition.description || `Kaggle competition: ${competition.title}`,
  category: 'data-science',
  location: 'online',
  organizer: 'Kaggle',
  image: '/src/assets/images/7.jpg', // Placeholder image
  // Use competition.image if available, otherwise fallback to a placeholder
  eventUrl: `${competition.ref}`,
  registrationUrl: `${competition.ref}`,
  registrationStart: competition.enabledDate || new Date().toISOString(),
  registrationEnd: competition.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  eventStart: competition.enabledDate || new Date().toISOString(),
  eventEnd: competition.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  prize: competition.rewardDisplay || 'Prizes available',
  difficulty: 'intermediate',
  tags: ['data-science', 'machine-learning', 'AI'],
  source: 'kaggle',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});



// convertMLHEvent no longer used (scraping logic below)

// convertGitHubEvent removed

// Fetch events from Codeforces
export const fetchCodeforcesEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_CONFIG.CODEFORCES.baseUrl}${API_CONFIG.CODEFORCES.endpoints.contests}`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.result
        .filter((contest: any) => contest.phase === 'BEFORE')
        .slice(0, 20)
        .map(convertCodeforcesContest);
    }
    return [];
  } catch (error) {
    console.error('Error fetching Codeforces events:', error);
    return [];
  }
};

// Fetch events from Kaggle
export const fetchKaggleEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.KAGGLE.baseUrl}${API_CONFIG.KAGGLE.endpoints.competitions}?group=general&sortBy=recentlyCreated`
    );
    const data = await response.json();
    if (Array.isArray(data)) {
      return data.slice(0, 20).map(convertKaggleCompetition);
    }
    return [];
  } catch (error) {
    console.error('Error fetching Kaggle events:', error);
    return [];
  }
};

// Fetch events from Eventbrite

// Fetch events from MLH
export const fetchMLHEvents = async (): Promise<Event[]> => {
  try {
    // Try to fetch from MLH directly first
    let response: Response;
    let html = '';
    
    try {
      response = await fetch(`${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`);
      
      if (response.ok) {
        html = await response.text();
      } else {
        throw new Error(`Direct fetch failed with status: ${response.status}`);
      }
    } catch (fetchError) {
      // Fallback to a CORS proxy if direct fetch fails
      try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const proxyUrl = `${corsProxy}${encodeURIComponent(`${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`)}`;
        response = await fetch(proxyUrl);
        
        if (response.ok) {
          html = await response.text();
        } else {
          throw new Error(`CORS proxy failed with status: ${response.status}`);
        }
      } catch (proxyError) {
        // If both methods fail, return fallback events
        return [{
          id: 'mlh_fallback_1',
          title: 'MLH 2026 Season Events',
          description: 'Major League Hacking (MLH) 2026 season hackathons and events. Visit the MLH website for detailed event information, dates, and registration.',
          category: 'hackathon',
          location: 'online',
          organizer: 'Major League Hacking',
          image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
          eventUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
          registrationUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
          registrationStart: new Date().toISOString(),
          registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          eventStart: new Date().toISOString(),
          eventEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: 'intermediate',
          tags: ['hackathon', 'mlh', '2026'],
          source: 'mlh',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];
      }
    }
    
    // Check if we're in a browser environment with DOMParser
    if (!isBrowser) {
      return [{
        id: 'mlh_2026_season',
        title: 'MLH 2026 Season Events',
        description: 'Major League Hacking (MLH) 2026 season hackathons and events. Visit the MLH website for detailed event information, dates, and registration.',
        category: 'hackathon',
        location: 'online',
        organizer: 'Major League Hacking',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
        eventUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
        registrationUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
        registrationStart: new Date().toISOString(),
        registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        eventStart: new Date().toISOString(),
        eventEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'intermediate',
        tags: ['hackathon', 'mlh', '2026'],
        source: 'mlh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    }
    
    // Create a DOM parser to extract event information
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Look for event cards/containers - MLH typically uses specific class names
    const eventSelectors = [
      '.event-card',
      '.event',
      '.hackathon-card', 
      '.event-item',
      '.event-listing',
      '[data-event]',
      '.card',
      'article',
      'li'
    ];
    
    let eventElements: Element[] = [];
    
    // Try different selectors to find event elements
    for (const selector of eventSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        eventElements = Array.from(elements);
        break;
      }
    }
    
    // If no specific event elements found, try to find any content that looks like events
    if (eventElements.length === 0) {
      // Look for headings that might contain event names
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const eventHeadings = Array.from(headings).filter(heading => {
        const text = heading.textContent?.toLowerCase() || '';
        return text.includes('hackathon') || text.includes('event') || text.includes('mlh');
      });
      
      if (eventHeadings.length > 0) {
        eventElements = eventHeadings;
      }
    }
    
    // Extract event information from found elements
    const events: Event[] = [];
    
    for (let i = 0; i < Math.min(eventElements.length, 50); i++) {
      const element = eventElements[i];
      
      // Extract event title
      let title = '';
      const titleSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.title', '.event-title', '.name'];
      for (const selector of titleSelectors) {
        const titleEl = element.querySelector(selector);
        if (titleEl && titleEl.textContent?.trim()) {
          title = titleEl.textContent.trim();
          break;
        }
      }
      
      // If no title found in child elements, try the element itself
      if (!title && element.textContent) {
        title = element.textContent.trim().substring(0, 100);
      }
      
      // Skip if no meaningful title
      if (!title || title.length < 3) continue;
      
      // Extract event URL
      let eventUrl = '';
      const linkEl = element.querySelector('a');
      if (linkEl && linkEl.href) {
        eventUrl = linkEl.href;
      } else if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
        eventUrl = (element as HTMLAnchorElement).href;
      }
      
      // Extract image
      let image = '';
      const imgEl = element.querySelector('img');
      if (imgEl && imgEl.src) {
        image = imgEl.src;
      }
      
      // Extract location
      let location = 'online';
      const locationSelectors = ['.location', '.venue', '.place', '[data-location]'];
      for (const selector of locationSelectors) {
        const locEl = element.querySelector(selector);
        if (locEl && locEl.textContent?.trim()) {
          location = locEl.textContent.trim();
          break;
        }
      }
      
      // Extract date information
      let eventStart = new Date().toISOString();
      let eventEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const dateSelectors = ['.date', '.event-date', 'time', '[data-date]'];
      for (const selector of dateSelectors) {
        const dateEl = element.querySelector(selector);
        if (dateEl) {
          const dateText = dateEl.textContent?.trim() || dateEl.getAttribute('datetime') || '';
          if (dateText) {
            try {
              const parsedDate = new Date(dateText);
              if (!isNaN(parsedDate.getTime())) {
                eventStart = parsedDate.toISOString();
                eventEnd = new Date(parsedDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
                break;
              }
            } catch (e) {
              // Ignore date parsing errors
            }
          }
        }
      }
      
      // Extract description
      let description = title;
      const descSelectors = ['.description', '.event-description', '.summary', 'p'];
      for (const selector of descSelectors) {
        const descEl = element.querySelector(selector);
        if (descEl && descEl.textContent?.trim() && descEl.textContent.trim() !== title) {
          description = descEl.textContent.trim();
          break;
        }
      }
      
      // Create the event object
      const event: Event = {
        id: `mlh_${i}_${title.replace(/\s+/g, '_').toLowerCase().substring(0, 20)}`,
        title: title,
        description: description,
              category: 'hackathon',
        location: location,
              organizer: 'Major League Hacking',
        image: image || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
        eventUrl: eventUrl || `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
        registrationUrl: eventUrl || `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
        registrationStart: eventStart,
        registrationEnd: eventEnd,
        eventStart: eventStart,
        eventEnd: eventEnd,
              difficulty: 'intermediate',
        tags: ['hackathon', 'mlh', '2026'],
              source: 'mlh',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
      
      events.push(event);
    }
    
    // If we found events, return them
    if (events.length > 0) {
      return events;
    }
    
    // Fallback: try to extract any event-like information from the page
    const pageText = html.toLowerCase();
    const eventKeywords = ['hackathon', 'event', 'mlh', 'major league hacking'];
    
    if (eventKeywords.some(keyword => pageText.includes(keyword))) {
      // Create a basic event pointing to the MLH page
      return [{
        id: 'mlh_2026_season',
        title: 'MLH 2026 Season Events',
        description: 'Major League Hacking (MLH) 2026 season hackathons and events. Visit the MLH website for detailed event information, dates, and registration.',
            category: 'hackathon',
        location: 'online',
            organizer: 'Major League Hacking',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
        eventUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
        registrationUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
        registrationStart: new Date().toISOString(),
        registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        eventStart: new Date().toISOString(),
        eventEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: 'intermediate',
        tags: ['hackathon', 'mlh', '2026'],
            source: 'mlh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    }
    
    // Final fallback: always return at least one MLH event
    return [{
      id: 'mlh_fallback_final',
      title: 'MLH 2026 Season Events',
      description: 'Major League Hacking (MLH) 2026 season hackathons and events. Visit the MLH website for detailed event information, dates, and registration.',
        category: 'hackathon',
      location: 'online',
        organizer: 'Major League Hacking',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
      eventUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
      registrationUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
      registrationStart: new Date().toISOString(),
      registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      eventStart: new Date().toISOString(),
      eventEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'intermediate',
        tags: ['hackathon', 'mlh', '2026'],
        source: 'mlh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }];
    
  } catch (error) {
    // Return a fallback event if anything fails
    return [{
      id: 'mlh_error_fallback',
      title: 'MLH 2026 Season Events',
      description: 'Major League Hacking (MLH) 2026 season hackathons and events. Visit the MLH website for the latest event information and registration details.',
        category: 'hackathon',
      location: 'online',
        organizer: 'Major League Hacking',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
      eventUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
      registrationUrl: `${API_CONFIG.MLH.baseUrl}${API_CONFIG.MLH.endpoints.events}`,
      registrationStart: new Date().toISOString(),
      registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      eventStart: new Date().toISOString(),
      eventEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'intermediate',
      tags: ['hackathon', 'mlh', '2026'],
        source: 'mlh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  }
};

// fetchGitHubEvents removed

// Fetch all events from all sources
export const fetchAllExternalEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching all external events...');
    
    const [
      codeforcesEvents,
      kaggleEvents,
      //eventbriteEvents,
      mlhEvents
    ] = await Promise.allSettled([
      fetchCodeforcesEvents(),
      fetchKaggleEvents(),
      //fetchEventbriteEvents(),
      fetchMLHEvents()
    ]);

    const allEvents: Event[] = [];
    
    if (codeforcesEvents.status === 'fulfilled') {
      console.log(`Codeforces events: ${codeforcesEvents.value.length}`);
      allEvents.push(...codeforcesEvents.value);
    }
    if (kaggleEvents.status === 'fulfilled') {
      console.log(`Kaggle events: ${kaggleEvents.value.length}`);
      allEvents.push(...kaggleEvents.value);
    }
    // if (eventbriteEvents.status === 'fulfilled') {
    //   console.log(`Eventbrite events: ${eventbriteEvents.value.length}`);
    //   allEvents.push(...eventbriteEvents.value);
    // }
    if (mlhEvents.status === 'fulfilled') {
      console.log(`MLH events: ${mlhEvents.value.length}`);
      allEvents.push(...mlhEvents.value);
    }

    console.log(`Total events fetched: ${allEvents.length}`);

    // Sort by event start date
    const sortedEvents = allEvents.sort((a, b) => new Date(a.eventStart || a.registrationStart).getTime() - new Date(b.eventStart || b.registrationStart).getTime());
    
    console.log('Events sorted and ready to return');
    return sortedEvents;
  } catch (error) {
    console.error('Error fetching all external events:', error);
    return [];
  }
};

// Search events across all sources
export const searchExternalEvents = async (query: string): Promise<Event[]> => {
  try {
    const allEvents = await fetchAllExternalEvents();
    const lowercaseQuery = query.toLowerCase();
    
    return allEvents.filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.organizer.toLowerCase().includes(lowercaseQuery) ||
      event.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Error searching external events:', error);
    return [];
  }
};

// Fetch events by specific source
export const fetchEventsBySource = async (source: string): Promise<Event[]> => {
  try {
    switch (source) {
      case 'codeforces':
        return await fetchCodeforcesEvents();
      case 'kaggle':
        return await fetchKaggleEvents();
      // case 'eventbrite':
      //   return await fetchEventbriteEvents();
      case 'mlh':
        return await fetchMLHEvents();
      default:
        return await fetchAllExternalEvents();
    }
  } catch (error) {
    console.error(`Error fetching events from ${source}:`, error);
    return [];
  }
};
