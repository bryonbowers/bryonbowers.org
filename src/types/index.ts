export interface Song {
  id: string;
  title: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  trackNumber?: number;
  duration: number; // in seconds
  audioUrl: string;
  coverImageUrl?: string;
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

export interface Album {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string;
  releaseDate: string;
  genre?: string[];
  description?: string;
  songs: string[]; // song IDs
  totalTracks: number;
  totalDuration: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export interface Poem {
  id: string;
  title: string;
  content: string;
  songId?: string; // Associated song if applicable
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  favoriteSongs?: string[]; // song IDs
  timestamp: string;
  read: boolean;
  responded: boolean;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  artistName: string;
  artistBio: string;
  artistImage?: string;
  socialLinks: {
    youtube?: string;
    spotify?: string;
    appleMusic?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  contactEmail: string;
  featuredSongs: string[]; // song IDs
  updatedAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
}