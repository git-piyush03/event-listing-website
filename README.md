# EventHub - Real-time Event Discovery Platform

A modern React TypeScript application that aggregates events from multiple platforms including Codeforces, Kaggle, Eventbrite, Meetup, MLH, and GitHub. Features Google authentication via Firebase and real-time event data from external APIs.

## Features

- 🔐 **Google Authentication** via Firebase
- 🌐 **Real-time Event Data** from multiple platforms
- 📱 **Responsive Design** with modern UI/UX
- 🔍 **Smart Search & Filtering** across all event sources
- 📅 **Event Management** with detailed information
- 🎯 **Source-based Filtering** (Codeforces, Kaggle, MLH, etc.)

## Event Sources

- **Codeforces** - Competitive programming contests
- **Kaggle** - Data science competitions
- **Eventbrite** - General events and meetups
- **Meetup** - Community events
- **MLH** - Hackathons and innovation events
- **GitHub** - Development and open-source events

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Authentication**: Firebase (Google Sign-in)
- **Styling**: CSS3 with modern design patterns
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup
- API keys for external services (optional)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd event-listing-website
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication
3. Copy your Firebase config to `.env` file:

```env
# Firebase Configuration (for Google Authentication)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. External API Keys (Optional)

For enhanced functionality, add API keys for external services:

```env
# External API Keys (for real-time event data)
VITE_MEETUP_API_KEY=your_meetup_api_key_here
VITE_EVENTBRITE_API_KEY=your_eventbrite_api_key_here
VITE_KAGGLE_API_KEY=your_kaggle_api_key_here
```

**Note**: Some APIs (Codeforces, MLH, GitHub) work without authentication, while others require API keys for full functionality.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── pages/             # Page components
├── services/          # API services
│   ├── externalEventService.ts  # External API integration
│   ├── authService.ts           # Firebase authentication
│   └── eventService.ts          # Main event service
├── types/             # TypeScript type definitions
└── config/            # Configuration files
    └── firebase.ts    # Firebase configuration
```

## API Integration Details

### Codeforces
- **Endpoint**: `https://codeforces.com/api/contest.list`
- **Authentication**: None required
- **Rate Limit**: Generous limits
- **Data**: Upcoming competitive programming contests

### MLH (Major League Hacking)
- **Endpoint**: `https://mlh.io/api/seasons/2025/events`
- **Authentication**: None required
- **Data**: Hackathons and innovation events

### GitHub Events
- **Endpoint**: `https://api.github.com/events`
- **Authentication**: None required (limited rate)
- **Data**: Public repository events and activities

### Meetup
- **Endpoint**: `https://api.meetup.com/find/upcoming_events`
- **Authentication**: API key required
- **Data**: Local community events

### Eventbrite & Kaggle
- **Authentication**: API keys required
- **Data**: General events and data science competitions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Event Sources

1. Add API configuration to `externalEventService.ts`
2. Create conversion function for the new source
3. Implement fetch function
4. Add to `fetchAllExternalEvents` function
5. Update environment variables if needed

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
