# Bryon Bowers Music Website

Official website for musician and poet Bryon Bowers, built with React, TypeScript, and Firebase.

## Features

- **Music Player**: Interactive music player with full metadata display, playlist support, and embedded audio playback
- **Poetry Integration**: Dedicated poetry section with poems that accompany songs
- **Admin Dashboard**: Full admin interface for managing songs, poems, and user messages (restricted to bryon.bowers@gmail.com)
- **Contact System**: Users can send messages directly to Bryon about favorite songs and music feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Firebase Integration**: Fully hosted on Firebase with real-time data synchronization

## Technology Stack

- **Frontend**: React 18, TypeScript, Material-UI 5, Vite
- **Backend**: Firebase (Firestore, Authentication, Storage, Hosting)
- **Audio Player**: React H5 Audio Player
- **Animations**: Framer Motion
- **Routing**: React Router 6

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase CLI
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bryonbowers.org
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore, Authentication, Storage, and Hosting
   - Update `src/firebase/config.ts` with your Firebase configuration
   
4. **Set up Firebase Authentication**
   - Enable Email/Password authentication
   - Add bryon.bowers@gmail.com as the admin user

5. **Deploy Firestore rules**
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   firebase deploy --only storage
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Firebase Configuration

Update `src/firebase/config.ts` with your Firebase project configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Content Management

### Admin Access

- Only the email `bryon.bowers@gmail.com` has admin access
- Admin can add/edit/delete songs and poems
- Admin can view and manage contact messages
- Access admin panel through the "Admin" button in the navigation

### Adding Music

1. Upload audio files to Firebase Storage (`/audio/` folder)
2. Upload cover images to Firebase Storage (`/images/` folder)
3. Use the admin dashboard to create song entries with:
   - Song metadata (title, artist, album, etc.)
   - Audio file URL from Firebase Storage
   - Cover image URL
   - Genre tags and descriptions

### Adding Poems

1. Use the admin dashboard to create poem entries
2. Support for multi-line poems with proper formatting
3. Can associate poems with specific songs

## Database Structure

### Songs Collection
```typescript
{
  id: string;
  title: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  trackNumber?: number;
  duration: number; // in seconds
  audioUrl: string; // Firebase Storage URL
  coverImageUrl?: string; // Firebase Storage URL
  releaseDate: string;
  genre?: string[];
  lyrics?: string;
  description?: string;
  metadata: {
    bitrate?: number;
    sampleRate?: number;
    format?: string;
    fileSize?: number;
  };
  plays: number;
  createdAt: string;
  updatedAt: string;
}
```

### Poems Collection
```typescript
{
  id: string;
  title: string;
  content: string;
  songId?: string; // Optional association with a song
  author: string;
  createdAt: string;
  updatedAt: string;
}
```

### Contact Messages Collection
```typescript
{
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  favoriteSongs?: string[]; // Array of song IDs
  timestamp: string;
  read: boolean;
  responded: boolean;
}
```

## Deployment

### Deploy to Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   # Select your Firebase project
   # Set public directory to: dist
   # Configure as SPA: Yes
   # Don't overwrite index.html
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Security

- Firestore security rules ensure only admin can write content
- All user data (contact messages) can only be read by admin
- Public read access for songs and poems
- Storage rules protect audio and image uploads

## Contact & Support

For questions about this website or to report issues:
- Email: bryon.bowers@gmail.com
- Use the contact form on the website

## License

© 2024 Bryon Bowers. All rights reserved.