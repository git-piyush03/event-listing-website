export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  organizer: string;
  image?: string;
  eventUrl: string;
  registrationUrl: string;
  registrationStart: string; // ISO date string
  registrationEnd: string; // ISO date string
  eventStart?: string; // ISO date string
  eventEnd?: string; // ISO date string
  prize?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  source: 'codeforces' | 'kaggle' | 'eventbrite' | 'meetup' | 'mlh' | 'manual' | 'github';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
