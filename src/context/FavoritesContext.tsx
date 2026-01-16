import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[]; // Array of songIds
  loading: boolean;
  toggleFavorite: (songId: string, songTitle: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDocs, setFavoriteDocs] = useState<Map<string, string>>(new Map()); // songId -> docId
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading before checking favorites
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      setFavorites([]);
      setFavoriteDocs(new Map());
      setLoading(false);
      return;
    }

    // Subscribe to user's favorites
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songIds: string[] = [];
      const docMap = new Map<string, string>();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        songIds.push(data.songId);
        docMap.set(data.songId, doc.id);
      });

      setFavorites(songIds);
      setFavoriteDocs(docMap);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthenticated, authLoading]);

  const toggleFavorite = async (songId: string, songTitle: string) => {
    if (!user) {
      throw new Error('Must be logged in to favorite songs');
    }

    const existingDocId = favoriteDocs.get(songId);

    if (existingDocId) {
      // Remove favorite
      await deleteDoc(doc(db, 'favorites', existingDocId));
    } else {
      // Add favorite
      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        songId,
        songTitle,
        createdAt: serverTimestamp(),
      });
    }
  };

  const isFavorite = (songId: string): boolean => {
    return favorites.includes(songId);
  };

  const value = {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
