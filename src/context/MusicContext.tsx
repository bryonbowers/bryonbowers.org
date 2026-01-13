import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import songsData from '../data/songs.json';

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const allSongs = songsData as unknown as Song[];
  const [currentSong, setCurrentSong] = useState<Song | null>(allSongs.length > 0 ? allSongs[0] : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const pendingPlayRef = useRef(false);


  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      pendingPlayRef.current = true;
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (!currentSong || allSongs.length === 0) return;
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % allSongs.length;
    pendingPlayRef.current = true;
    setCurrentSong(allSongs[nextIndex]);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (!currentSong || allSongs.length === 0) return;
    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    pendingPlayRef.current = true;
    setCurrentSong(allSongs[prevIndex]);
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // Safe play function that handles the play promise properly
  const safePlay = async (audio: HTMLAudioElement) => {
    try {
      // Wait for any pending play promise to resolve/reject
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Ignore errors from previous play attempt
        }
      }

      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
      playPromiseRef.current = null;
    } catch (err) {
      playPromiseRef.current = null;
      // Only log if it's not an AbortError (user changed song)
      if ((err as Error).name !== 'AbortError') {
        console.error("Playback failed:", err);
      }
    }
  };

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => nextSong();

    // When audio is ready to play after loading new source
    const onCanPlay = () => {
      if (pendingPlayRef.current && isPlaying) {
        pendingPlayRef.current = false;
        safePlay(audio);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [currentSong, isPlaying]);

  // Handle Play/Pause side effects (only for toggle, not song changes)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Skip if we're waiting for a new song to load
    if (pendingPlayRef.current) return;

    if (isPlaying) {
      safePlay(audio);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      playSong,
      togglePlay,
      nextSong,
      prevSong,
      audioRef,
      duration,
      currentTime,
      seek,
      volume,
      setVolume
    }}>
      {children}
      <audio ref={audioRef} src={currentSong?.audioUrl} />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
