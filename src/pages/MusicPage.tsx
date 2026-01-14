import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, IconButton, Snackbar } from '@mui/material';
import { PlayArrow, Pause, Share } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import songsData from '../data/songs.json';
import { Song } from '../types';

// Spotify icon component
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// YouTube Music icon component
const YouTubeMusicIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
);

const MotionBox = motion(Box);

interface Sphere {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  song: typeof songsData[0];
}

const SPHERE_SIZE = 75;
const SPHERE_SIZE_MOBILE = 52;

export const MusicPage: React.FC = () => {
  const { songId } = useParams<{ songId?: string }>();
  const { currentSong, isPlaying, playSong, togglePlay } = useMusic();
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [poppingId, setPoppingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [arrangeByAlbum, setArrangeByAlbum] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);
  const prevArrangeByAlbum = useRef(false);
  const hasAutoPlayed = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // For tracking drag velocity
  const dragPositions = useRef<{ x: number; y: number; time: number }[]>([]);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Track previous playing song to detect playback changes
  const prevPlayingSongId = useRef<string | null>(null);

  // Explosion effect when switching to arrange by album
  useEffect(() => {
    if (arrangeByAlbum && !prevArrangeByAlbum.current) {
      // Explode spheres outward from center
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      setSpheres(prev => prev.map(sphere => {
        const dx = (sphere.x + sphere.size / 2) - centerX;
        const dy = (sphere.y + sphere.size / 2) - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const explosionStrength = 15;

        return {
          ...sphere,
          vx: (dx / dist) * explosionStrength,
          vy: (dy / dist) * explosionStrength,
        };
      }));
    }
    prevArrangeByAlbum.current = arrangeByAlbum;
  }, [arrangeByAlbum, dimensions]);

  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        setIsMobile(window.innerWidth < 768);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-play song from URL parameter
  useEffect(() => {
    if (songId && !hasAutoPlayed.current) {
      const song = songsData.find(s => s.id === songId);
      if (song) {
        hasAutoPlayed.current = true;
        // Small delay to ensure spheres are initialized
        setTimeout(() => {
          setPoppingId(song.id);
          setTimeout(() => setPoppingId(null), 600);
          playSong(song as unknown as Song);
        }, 500);
      }
    }
  }, [songId, playSong]);

  // Initialize spheres - position near album clusters
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const size = isMobile ? SPHERE_SIZE_MOBILE : SPHERE_SIZE;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Calculate album cluster positions for initial placement
    const allAlbums = [...new Set(songsData.map(s => {
      const lower = s.albumTitle.toLowerCase();
      if (lower === 'single' || lower === "the devil's suit") return 'Singles';
      return s.albumTitle;
    }))];

    const albumPositions: Record<string, { x: number; y: number }> = {};
    albumPositions['Singles'] = { x: centerX, y: centerY };

    const otherAlbums = allAlbums.filter(a => a !== 'Singles');
    const radius = Math.min(dimensions.width, dimensions.height) * 0.32;

    otherAlbums.forEach((album, index) => {
      const angle = (index / otherAlbums.length) * Math.PI * 2 - Math.PI / 2;
      albumPositions[album] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    const initialSpheres: Sphere[] = songsData.map((song) => {
      // Get normalized album name
      const lower = song.albumTitle.toLowerCase();
      const normalizedAlbum = (lower === 'single' || lower === "the devil's suit") ? 'Singles' : song.albumTitle;

      // Position near album cluster with some randomness
      const clusterPos = albumPositions[normalizedAlbum] || { x: centerX, y: centerY };
      const spread = 80;
      const x = clusterPos.x + (Math.random() - 0.5) * spread - size / 2;
      const y = clusterPos.y + (Math.random() - 0.5) * spread - size / 2;

      return {
        id: song.id,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
        song,
      };
    });

    setSpheres(initialSpheres);
  }, [dimensions, isMobile]);

  // Normalize album title - treat all Singles as one group
  const normalizeAlbum = (albumTitle: string) => {
    const lower = albumTitle.toLowerCase();
    if (lower === 'single' || lower === "the devil's suit" || lower === "the devil's stew") return 'Singles';
    return albumTitle;
  };

  // Calculate album cluster positions
  const getAlbumClusterPositions = useCallback(() => {
    const allAlbums = [...new Set(songsData.map(s => normalizeAlbum(s.albumTitle)))];
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = dimensions.width / 2;
    const footerHeight = 120; // Account for player footer
    const usableHeight = dimensions.height - footerHeight;
    const centerY = usableHeight / 2;

    // Singles go to center
    positions['Singles'] = { x: centerX, y: centerY };

    // Other albums arranged in an ellipse - wider horizontally
    const otherAlbums = allAlbums.filter(a => a !== 'Singles');
    const radiusX = dimensions.width * 0.38; // Wider horizontal spread
    const radiusY = usableHeight * 0.32; // Tighter vertical to stay above footer

    otherAlbums.forEach((album, index) => {
      const angle = (index / otherAlbums.length) * Math.PI * 2 - Math.PI / 2;
      positions[album] = {
        x: centerX + Math.cos(angle) * radiusX,
        y: centerY + Math.sin(angle) * radiusY,
      };
    });

    return positions;
  }, [dimensions]);

  // Force playing sphere to center when playback starts/changes
  useEffect(() => {
    const currentPlayingId = (currentSong && isPlaying) ? currentSong.id : null;
    const prevId = prevPlayingSongId.current;

    // Detect new song starting to play
    if (currentPlayingId && currentPlayingId !== prevId) {
      const centerX = dimensions.width / 2;
      const footerHeight = 120;
      const centerY = (dimensions.height - footerHeight) / 2;
      const size = isMobile ? SPHERE_SIZE_MOBILE : SPHERE_SIZE;

      setSpheres(prev => prev.map(sphere => {
        if (sphere.id === currentPlayingId) {
          // Teleport playing sphere to center immediately
          return {
            ...sphere,
            x: centerX - size / 2,
            y: centerY - size / 2,
            vx: 0,
            vy: 0,
          };
        } else {
          // Repel all other spheres away from center
          const dx = (sphere.x + sphere.size / 2) - centerX;
          const dy = (sphere.y + sphere.size / 2) - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const repelStrength = 12;

          return {
            ...sphere,
            vx: (dx / dist) * repelStrength,
            vy: (dy / dist) * repelStrength,
          };
        }
      }));
    }

    // Return previous playing sphere to its album cluster when playback changes
    if (prevId && prevId !== currentPlayingId && arrangeByAlbum) {
      const albumPositions = getAlbumClusterPositions();
      setSpheres(prev => prev.map(sphere => {
        if (sphere.id === prevId) {
          const albumPos = albumPositions[normalizeAlbum(sphere.song.albumTitle)];
          if (albumPos) {
            // Give it velocity towards its album cluster
            const dx = albumPos.x - (sphere.x + sphere.size / 2);
            const dy = albumPos.y - (sphere.y + sphere.size / 2);
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            return {
              ...sphere,
              vx: (dx / dist) * 8,
              vy: (dy / dist) * 8,
            };
          }
        }
        return sphere;
      }));
    }

    prevPlayingSongId.current = currentPlayingId;
  }, [currentSong, isPlaying, dimensions, isMobile, arrangeByAlbum, getAlbumClusterPositions]);

  // Animation loop - spheres gravitate towards center, playing sphere floats away and repels others
  const animate = useCallback(() => {
    const centerX = dimensions.width / 2;
    const footerHeight = 120;
    const usableHeight = dimensions.height - footerHeight;
    const centerY = usableHeight / 2;

    // Target position for playing sphere (exact center of usable area)
    const playingTargetX = centerX;
    const playingTargetY = centerY;
    const repelRadius = 300; // How far the playing sphere repels others

    // Get album cluster positions if in arrange by album mode
    const albumPositions = arrangeByAlbum ? getAlbumClusterPositions() : null;

    // Increment time for wave animation
    timeRef.current += 0.02;

    setSpheres(prevSpheres => {
      // Find the playing sphere
      const playingSphere = prevSpheres.find(s => currentSong?.id === s.id && isPlaying);

      const newSpheres = prevSpheres.map(sphere => {
        // Skip physics for dragged sphere
        if (sphere.id === draggedId) {
          return sphere;
        }

        let { x, y, vx, vy, size } = sphere;

        const isThisPlaying = currentSong?.id === sphere.id && isPlaying;

        // Gentle drift
        vx += (Math.random() - 0.5) * 0.05;
        vy += (Math.random() - 0.5) * 0.05;

        // Wave physics - very weak bobbing like floating on water
        const waveOffsetX = x / 500;
        const waveAmplitude = 0.012;
        const waveFreq = timeRef.current * 0.4 + waveOffsetX;
        vy += Math.sin(waveFreq) * waveAmplitude;

        // Playing sphere is LOCKED to center - no physics, just snap to position
        if (isThisPlaying) {
          // Hard lock to center - override position directly
          x = playingTargetX - size / 2;
          y = playingTargetY - size / 2;
          vx = 0;
          vy = 0;
        } else if (arrangeByAlbum && albumPositions) {
          // Pull towards album cluster position
          const albumPos = albumPositions[normalizeAlbum(sphere.song.albumTitle)];
          if (albumPos) {
            const dx = albumPos.x - (x + size / 2);
            const dy = albumPos.y - (y + size / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 10) {
              const pullStrength = 0.25;
              vx += (dx / dist) * pullStrength;
              vy += (dy / dist) * pullStrength;
            }
          }
        } else {
          // Non-playing spheres gravitate towards center (only in free float mode)
          // Pull stronger when search is active (fewer spheres visible)
          const dx = centerX - (x + size / 2);
          const dy = centerY - (y + size / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 50) {
            const pullStrength = searchQuery.trim() ? 0.15 : 0.02;
            vx += (dx / dist) * pullStrength;
            vy += (dy / dist) * pullStrength;
          }
        }

        // Repel ALL non-playing spheres from the playing sphere (applies in any mode)
        if (!isThisPlaying && playingSphere) {
          const psx = playingSphere.x + playingSphere.size / 2;
          const psy = playingSphere.y + playingSphere.size / 2;
          const rpx = (x + size / 2) - psx;
          const rpy = (y + size / 2) - psy;
          const repelDist = Math.sqrt(rpx * rpx + rpy * rpy);

          if (repelDist < repelRadius && repelDist > 0) {
            // Strong repulsion closer to playing sphere
            const repelStrength = (1 - repelDist / repelRadius) * 0.8;
            vx += (rpx / repelDist) * repelStrength;
            vy += (rpy / repelDist) * repelStrength;
          }
        }

        x += vx;
        y += vy;

        // Bounce off walls (with bottom margin for footer player)
        const bottomMargin = 120; // Keep spheres above the footer
        if (x <= 0) { vx = Math.abs(vx) * 0.8; x = 0; }
        if (x >= dimensions.width - size) { vx = -Math.abs(vx) * 0.8; x = dimensions.width - size; }
        if (y <= 0) { vy = Math.abs(vy) * 0.8; y = 0; }
        if (y >= dimensions.height - size - bottomMargin) { vy = -Math.abs(vy) * 0.8; y = dimensions.height - size - bottomMargin; }

        // Friction
        vx *= 0.97;
        vy *= 0.97;

        // Limit velocity
        const maxVel = isThisPlaying ? 3 : 2;
        vx = Math.max(-maxVel, Math.min(maxVel, vx));
        vy = Math.max(-maxVel, Math.min(maxVel, vy));

        return { ...sphere, x, y, vx, vy };
      });

      // Collision detection - spheres push each other apart
      // When arrangeByAlbum is on, spheres from different albums repel, same albums attract
      const albumRepelRadius = 200; // Distance at which different albums repel
      const sameAlbumAttractRadius = 180; // Distance at which same album spheres attract

      for (let i = 0; i < newSpheres.length; i++) {
        for (let j = i + 1; j < newSpheres.length; j++) {
          const s1 = newSpheres[i];
          const s2 = newSpheres[j];

          const dx = (s2.x + s2.size / 2) - (s1.x + s1.size / 2);
          const dy = (s2.y + s2.size / 2) - (s1.y + s1.size / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (s1.size + s2.size) / 2 + 10; // Add some spacing

          const sameAlbum = normalizeAlbum(s1.song.albumTitle) === normalizeAlbum(s2.song.albumTitle);

          if (arrangeByAlbum && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            if (sameAlbum && dist > minDist && dist < sameAlbumAttractRadius) {
              // Same album attraction - pull together
              const attractStrength = 0.15;
              s1.vx += nx * attractStrength;
              s1.vy += ny * attractStrength;
              s2.vx -= nx * attractStrength;
              s2.vy -= ny * attractStrength;
            } else if (!sameAlbum && dist < albumRepelRadius) {
              // Different album repulsion - push apart
              const repelStrength = (1 - dist / albumRepelRadius) * 0.6;
              s1.vx -= nx * repelStrength;
              s1.vy -= ny * repelStrength;
              s2.vx += nx * repelStrength;
              s2.vy += ny * repelStrength;
            }
          }

          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            s1.x -= nx * overlap / 2;
            s1.y -= ny * overlap / 2;
            s2.x += nx * overlap / 2;
            s2.y += ny * overlap / 2;

            const dvx = s1.vx - s2.vx;
            const dvy = s1.vy - s2.vy;
            const dvn = dvx * nx + dvy * ny;

            if (dvn > 0) {
              s1.vx -= dvn * nx * 0.3;
              s1.vy -= dvn * ny * 0.3;
              s2.vx += dvn * nx * 0.3;
              s2.vy += dvn * ny * 0.3;
            }
          }
        }
      }

      return newSpheres;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, draggedId, currentSong, isPlaying, arrangeByAlbum, getAlbumClusterPositions, searchQuery]);

  useEffect(() => {
    if (spheres.length > 0 && dimensions.width > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, spheres.length, dimensions.width]);

  const handleSphereClick = (sphere: Sphere) => {
    // Don't trigger click if we just finished dragging
    if (draggedId) return;

    if (currentSong?.id === sphere.id) {
      togglePlay();
    } else {
      setPoppingId(sphere.id);
      setTimeout(() => setPoppingId(null), 600);
      playSong(sphere.song as unknown as Song);
    }
  };

  const handleShareSong = async (e: React.MouseEvent, song: typeof songsData[0]) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/song/${song.id}`;
    const shareData = {
      title: `${song.title} - Bryon Bowers`,
      text: `Listen to "${song.title}" by Bryon Bowers - The Dead Fish Poet`,
      url: url,
    };

    try {
      // Try native Web Share API first (works on mobile and some desktop browsers)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
      }
    } catch (err) {
      // If share was cancelled or failed, try clipboard
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          setShowShareToast(true);
        } catch {
          // Final fallback using textarea
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setShowShareToast(true);
        }
      }
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, sphereId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const sphere = spheres.find(s => s.id === sphereId);
    if (!sphere) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate offset from sphere center
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    dragOffset.current = {
      x: mouseX - sphere.x - sphere.size / 2,
      y: mouseY - sphere.y - sphere.size / 2
    };

    dragPositions.current = [{ x: mouseX, y: mouseY, time: Date.now() }];
    setDraggedId(sphereId);

    // Update sphere to stop its velocity
    setSpheres(prev => prev.map(s =>
      s.id === sphereId ? { ...s, vx: 0, vy: 0 } : s
    ));
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggedId) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Track positions for velocity calculation (keep last 5)
    const now = Date.now();
    dragPositions.current.push({ x: mouseX, y: mouseY, time: now });
    if (dragPositions.current.length > 5) {
      dragPositions.current.shift();
    }

    // Update sphere position
    setSpheres(prev => prev.map(s => {
      if (s.id !== draggedId) return s;

      const newX = mouseX - dragOffset.current.x - s.size / 2;
      const newY = mouseY - dragOffset.current.y - s.size / 2;

      return { ...s, x: newX, y: newY, vx: 0, vy: 0 };
    }));
  }, [draggedId]);

  const handleDragEnd = useCallback(() => {
    if (!draggedId) return;

    // Calculate throw velocity from recent positions
    const positions = dragPositions.current;
    let vx = 0;
    let vy = 0;

    if (positions.length >= 2) {
      const recent = positions[positions.length - 1];
      const older = positions[0];
      const dt = (recent.time - older.time) / 1000; // Convert to seconds

      if (dt > 0) {
        vx = ((recent.x - older.x) / dt) * 0.02; // Scale down for game physics
        vy = ((recent.y - older.y) / dt) * 0.02;

        // Limit throw velocity
        const maxThrowVel = 8;
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxThrowVel) {
          vx = (vx / speed) * maxThrowVel;
          vy = (vy / speed) * maxThrowVel;
        }
      }
    }

    // Apply velocity to sphere
    setSpheres(prev => prev.map(s =>
      s.id === draggedId ? { ...s, vx, vy } : s
    ));

    dragPositions.current = [];
    setDraggedId(null);
  }, [draggedId]);

  // Global mouse/touch event listeners for drag
  useEffect(() => {
    if (draggedId) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [draggedId, handleDragMove, handleDragEnd]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        top: 64,
        bgcolor: '#0a0a0a',
        overflow: 'hidden',
        pb: 'var(--player-height)',
      }}
    >
      {/* Title */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 10, md: 20 },
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Cinzel',
            fontWeight: 700,
            letterSpacing: { xs: '0.3em', md: '0.5em' },
            color: 'rgba(255,255,255,0.1)',
            fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
            lineHeight: 1.2,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          DEMOCRACY DIES
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Cinzel',
            fontWeight: 700,
            letterSpacing: { xs: '0.3em', md: '0.5em' },
            color: 'rgba(255,255,255,0.1)',
            fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
            lineHeight: 1.2,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          IN SILENCE
        </Typography>
      </Box>

      {/* Spheres container */}
      <Box
        ref={containerRef}
        sx={{
          position: 'absolute',
          inset: 0,
          top: { xs: 80, md: 120 },
        }}
      >
        <AnimatePresence>
          {spheres.map((sphere) => {
            const isCurrent = currentSong?.id === sphere.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isHovered = hoveredId === sphere.id;
            const isPopping = poppingId === sphere.id;
            const isDragged = draggedId === sphere.id;

            // Check if sphere matches search query or is currently playing
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
              sphere.song.title.toLowerCase().includes(query) ||
              sphere.song.albumTitle.toLowerCase().includes(query) ||
              isCurrent;

            return (
              <MotionBox
                key={sphere.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: matchesSearch ? (isDragged ? 1.1 : isCurrentPlaying ? 1.25 : 1) : 0,
                  opacity: matchesSearch ? 1 : 0,
                  x: sphere.x,
                  y: sphere.y,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  x: { type: 'tween', duration: isDragged ? 0 : 0.016, ease: 'linear' },
                  y: { type: 'tween', duration: isDragged ? 0 : 0.016, ease: 'linear' },
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                  opacity: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoveredId(sphere.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseDown={(e) => handleDragStart(e, sphere.id)}
                onTouchStart={(e) => handleDragStart(e, sphere.id)}
                onClick={() => handleSphereClick(sphere)}
                sx={{
                  position: 'absolute',
                  width: sphere.size,
                  height: sphere.size,
                  cursor: isDragged ? 'grabbing' : 'grab',
                  zIndex: isDragged ? 500 : isPopping ? 200 : isCurrentPlaying ? 100 : isHovered ? 50 : 1,
                  pointerEvents: matchesSearch ? 'auto' : 'none',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              >
                {/* Pop effect */}
                {isPopping && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <MotionBox
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.6)',
                          pointerEvents: 'none',
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Sphere with album art */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: isCurrentPlaying
                      ? '0 0 30px 10px rgba(255,255,255,0.6), 0 0 60px 20px rgba(255,255,255,0.3)'
                      : isHovered
                      ? '0 0 20px 5px rgba(255,255,255,0.3)'
                      : '0 4px 20px rgba(0,0,0,0.5)',
                    border: isCurrentPlaying ? '3px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src={sphere.song.coverImageUrl}
                    alt={sphere.song.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isCurrentPlaying ? 'brightness(1.1)' : isHovered ? 'brightness(1)' : 'brightness(0.7) grayscale(30%)',
                      transition: 'filter 0.3s ease',
                    }}
                  />

                  {/* Bubble highlight */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: `
                        radial-gradient(ellipse 50% 30% at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 70%),
                        radial-gradient(ellipse 30% 20% at 25% 25%, rgba(255,255,255,0.7) 0%, transparent 50%)
                      `,
                      opacity: isCurrentPlaying ? 0.7 : 1,
                    }}
                  />

                  {/* Play/Pause overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: isCurrentPlaying ? 'rgba(0,0,0,0.2)' : isHovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isCurrentPlaying || isHovered ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {isCurrentPlaying ? (
                      <Pause sx={{ color: 'white', fontSize: sphere.size * 0.4 }} />
                    ) : (
                      <PlayArrow sx={{ color: 'white', fontSize: sphere.size * 0.4 }} />
                    )}
                  </Box>
                </Box>

                {/* Hover info */}
                <AnimatePresence>
                  {(isHovered || isCurrentPlaying) && (
                    <>
                      <MotionBox
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        sx={{
                          position: 'absolute',
                          top: -30,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          pointerEvents: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          onClick={(e) => handleShareSong(e, sphere.song)}
                          size="small"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            p: 0.3,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <Share sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            fontFamily: 'Cinzel',
                            letterSpacing: '0.1em',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                          }}
                        >
                          {sphere.song.title.toUpperCase()}
                        </Typography>
                      </MotionBox>
                      <MotionBox
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        sx={{
                          position: 'absolute',
                          bottom: -55,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                          pointerEvents: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Album name */}
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            fontFamily: 'Montserrat',
                            letterSpacing: '0.05em',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            whiteSpace: 'nowrap',
                            textTransform: 'uppercase',
                          }}
                        >
                          {sphere.song.albumTitle}
                        </Typography>
                        {/* Streaming links */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Spotify */}
                        <IconButton
                          component="a"
                          href={(sphere.song as any).spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{
                            color: '#1DB954',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            p: 0.5,
                            '&:hover': { bgcolor: 'rgba(29,185,84,0.3)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <SpotifyIcon />
                        </IconButton>
                        {/* YouTube Music */}
                        <IconButton
                          component="a"
                          href={(sphere.song as any).youtubeMusicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{
                            color: '#FF0000',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            p: 0.5,
                            '&:hover': { bgcolor: 'rgba(255,0,0,0.3)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <YouTubeMusicIcon />
                        </IconButton>
                        </Box>
                      </MotionBox>
                    </>
                  )}
                </AnimatePresence>

                {/* Playing pulse */}
                {isCurrentPlaying && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: -10,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.5)',
                      animation: 'pulse 2s ease-in-out infinite',
                      pointerEvents: 'none',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                        '50%': { transform: 'scale(1.15)', opacity: 0 },
                      },
                    }}
                  />
                )}
              </MotionBox>
            );
          })}
        </AnimatePresence>
      </Box>

      {/* Search Input */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 140, md: 160 },
          left: { xs: 10, md: 20 },
          zIndex: 1000,
        }}
      >
        <input
          type="text"
          placeholder="search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '0.8rem',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.05em',
            outline: 'none',
            width: '140px',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.7)';
            e.target.style.borderColor = 'rgba(255,255,255,0.5)';
            e.target.style.width = '180px';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.5)';
            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            if (!e.target.value) e.target.style.width = '140px';
          }}
        />
      </Box>

      {/* Arrange by Album button */}
      <Box
        onClick={() => setArrangeByAlbum(!arrangeByAlbum)}
        sx={{
          position: 'absolute',
          bottom: { xs: 100, md: 120 },
          left: { xs: 10, md: 20 },
          px: 2,
          py: 1,
          bgcolor: arrangeByAlbum ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 1,
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1000,
          '&:hover': {
            bgcolor: arrangeByAlbum ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.7)',
            borderColor: 'rgba(255,255,255,0.5)',
          },
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            fontFamily: 'Montserrat',
            letterSpacing: '0.05em',
            textTransform: 'lowercase',
            userSelect: 'none',
          }}
        >
          {arrangeByAlbum ? 'free float' : 'arrange by album'}
        </Typography>
      </Box>

      {/* Share toast */}
      <Snackbar
        open={showShareToast}
        autoHideDuration={2000}
        onClose={() => setShowShareToast(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
