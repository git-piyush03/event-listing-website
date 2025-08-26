import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  type QuerySnapshot,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Event } from '../types/Event';

// Convert Firestore timestamp to ISO string
const convertTimestamp = (timestamp: any): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Convert Event object to Firestore document
type EventWithoutId = Omit<Event, 'id'>;

const eventToFirestore = (event: Event | EventWithoutId): any => {
  const raw: any = { ...(event as any) };
  if ('id' in raw) {
    delete raw.id;
  }
  return {
    ...raw,
    registrationStart: Timestamp.fromDate(new Date(raw.registrationStart)),
    registrationEnd: Timestamp.fromDate(new Date(raw.registrationEnd)),
    eventStart: raw.eventStart ? Timestamp.fromDate(new Date(raw.eventStart)) : null,
    eventEnd: raw.eventEnd ? Timestamp.fromDate(new Date(raw.eventEnd)) : null,
    createdAt: Timestamp.fromDate(new Date(raw.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(raw.updatedAt))
  };
};

// Convert Firestore document to Event object
const firestoreToEvent = (doc: DocumentData): Event => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    organizer: data.organizer,
    image: data.image,
    eventUrl: data.eventUrl,
    registrationUrl: data.registrationUrl,
    registrationStart: convertTimestamp(data.registrationStart),
    registrationEnd: convertTimestamp(data.registrationEnd),
    eventStart: data.eventStart ? convertTimestamp(data.eventStart) : undefined,
    eventEnd: data.eventEnd ? convertTimestamp(data.eventEnd) : undefined,
    prize: data.prize,
    maxParticipants: data.maxParticipants,
    currentParticipants: data.currentParticipants,
    difficulty: data.difficulty,
    tags: data.tags || [],
    source: data.source,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt)
  };
};

// Fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => firestoreToEvent(doc));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch events by source
export const fetchEventsBySource = async (source: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef, 
      where('source', '==', source),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => firestoreToEvent(doc));
  } catch (error) {
    console.error(`Error fetching events from ${source}:`, error);
    throw error;
  }
};

// Search events
export const searchEvents = async (queryText: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const events = querySnapshot.docs.map(doc => firestoreToEvent(doc));
    const lowercaseQuery = queryText.toLowerCase();
    
    return events.filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.organizer.toLowerCase().includes(lowercaseQuery) ||
      event.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

// Fetch event by ID
export const fetchEventById = async (id: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, 'events', id);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return firestoreToEvent(eventSnap);
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Add new event
export const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const eventData = {
      ...event,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'events'), eventToFirestore(eventData as EventWithoutId));
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

// Update event
export const updateEvent = async (id: string, updates: Partial<Event>): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', id);
    const updateData: Record<string, any> = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Convert date fields if they exist
    if (updates.registrationStart) {
      updateData.registrationStart = Timestamp.fromDate(new Date(updates.registrationStart));
    }
    if (updates.registrationEnd) {
      updateData.registrationEnd = Timestamp.fromDate(new Date(updates.registrationEnd));
    }
    if (updates.eventStart) {
      updateData.eventStart = Timestamp.fromDate(new Date(updates.eventStart));
    }
    if (updates.eventEnd) {
      updateData.eventEnd = Timestamp.fromDate(new Date(updates.eventEnd));
    }
    
    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Real-time listener for events
export const subscribeToEvents = (
  callback: (events: Event[]) => void,
  errorCallback?: (error: Error) => void
): (() => void) => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const events = querySnapshot.docs.map(doc => firestoreToEvent(doc));
        callback(events);
      },
      (error) => {
        console.error('Error in events subscription:', error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up events subscription:', error);
    if (errorCallback) {
      errorCallback(error as Error);
    }
    return () => {};
  }
};

// Real-time listener for events by source
export const subscribeToEventsBySource = (
  source: string,
  callback: (events: Event[]) => void,
  errorCallback?: (error: Error) => void
): (() => void) => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef, 
      where('source', '==', source),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const events = querySnapshot.docs.map(doc => firestoreToEvent(doc));
        callback(events);
      },
      (error) => {
        console.error(`Error in ${source} events subscription:`, error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error(`Error setting up ${source} events subscription:`, error);
    if (errorCallback) {
      errorCallback(error as Error);
    }
    return () => {};
  }
};
