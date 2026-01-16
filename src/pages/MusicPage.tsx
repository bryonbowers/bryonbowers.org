import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, IconButton, Snackbar } from '@mui/material';
import { PlayArrow, Pause, Share, Album, Shuffle, Favorite, Search, Cyclone, RocketLaunch, Hub } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { useFavorites } from '../context/FavoritesContext';
import songsData from '../data/songs.json';
import { Song } from '../types';
import { HeartButton } from '../components/HeartButton';

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

// Apple Music icon component
const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.401-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.384-2.16-1.213-.376-.83-.238-1.81.465-2.47.396-.37.874-.605 1.407-.716.323-.067.653-.12.98-.18.406-.073.77-.244.98-.632.096-.176.134-.374.134-.578V8.09c0-.237-.063-.453-.266-.6-.12-.088-.257-.12-.4-.098-.203.03-.404.07-.603.113-.747.158-1.493.32-2.24.477l-3.037.643-.016.004c-.294.063-.587.134-.838.316-.251.183-.4.444-.438.76-.012.1-.015.2-.015.3v7.592c0 .39-.047.778-.215 1.138-.278.6-.744.988-1.378 1.18-.34.104-.69.16-1.048.183-.952.06-1.82-.335-2.22-1.188-.4-.852-.243-1.876.507-2.53.39-.34.85-.567 1.355-.675.378-.082.76-.144 1.14-.216.36-.068.66-.2.873-.504.147-.21.19-.448.19-.696V6.942c0-.317.058-.622.237-.895.236-.363.58-.575.994-.67.334-.076.672-.133 1.008-.2l2.836-.6c.954-.202 1.91-.404 2.865-.605l1.78-.376c.163-.034.328-.063.494-.08.32-.035.596.087.788.338.107.14.17.3.193.47.013.095.017.19.017.287v4.503z"/>
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
  rotationDirection: number; // 1 for clockwise, -1 for counter-clockwise
  orbitSpeed: number; // Random speed multiplier for variety
}

const SPHERE_SIZE = 75;
const SPHERE_SIZE_MOBILE = 52;

export const MusicPage: React.FC = () => {
  const { songId } = useParams<{ songId?: string }>();
  const { currentSong, isPlaying, playSong, togglePlay } = useMusic();
  const { isFavorite } = useFavorites();
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [poppingId, setPoppingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [arrangeByAlbum, setArrangeByAlbum] = useState(true);
  const [arrangeByFavorites, setArrangeByFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isWhirlpoolActive, setIsWhirlpoolActive] = useState(false);
  const [shootingSphere, setShootingSphere] = useState<{ id: string; y: number; song: typeof songsData[0]; startTime: number } | null>(null);
  const [elasticStrings, setElasticStrings] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prevArrangeByAlbum = useRef(false);
  const whirlpoolPrevArrangeByAlbum = useRef(false);
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

  // Track anchor spheres for each album cluster (the sphere others rotate around)
  const clusterAnchors = useRef<Record<string, string>>({});

  // Trigger shooting sphere function
  const triggerShootingSphere = useCallback(() => {
    if (shootingSphere) return; // Don't trigger if one is already active

    // Pick a random song for the shooting sphere
    const randomSong = songsData[Math.floor(Math.random() * songsData.length)];
    const footerHeight = 120;
    const usableHeight = dimensions.height - footerHeight - 200; // Leave room for sphere size
    const randomY = 100 + Math.random() * usableHeight;

    setShootingSphere({
      id: `shooting-${Date.now()}`,
      y: randomY,
      song: randomSong,
      startTime: Date.now(),
    });

    // Remove the sphere after animation completes
    setTimeout(() => {
      setShootingSphere(null);
    }, 32000);
  }, [shootingSphere, dimensions.height]);

  // Random shooting sphere effect - automatic triggers
  useEffect(() => {
    // Initial delay before first shooting sphere (15-30 seconds)
    const initialDelay = setTimeout(() => {
      triggerShootingSphere();
    }, 15000 + Math.random() * 15000);

    // Set up interval for subsequent shooting spheres (20-45 seconds apart)
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance each interval
        triggerShootingSphere();
      }
    }, 20000 + Math.random() * 25000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [triggerShootingSphere]);

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
        rotationDirection: Math.random() > 0.5 ? 1 : -1, // Random clockwise or counter-clockwise
        orbitSpeed: 0.5 + Math.random() * 0.5, // Random speed between 0.5 and 1.0
      };
    });

    // Assign random anchor spheres for each album cluster
    const albumGroups: Record<string, string[]> = {};
    initialSpheres.forEach(sphere => {
      const album = (() => {
        const lower = sphere.song.albumTitle.toLowerCase();
        if (lower === 'single' || lower === "the devil's suit" || lower === "the devil's stew") return 'Singles';
        return sphere.song.albumTitle;
      })();
      if (!albumGroups[album]) albumGroups[album] = [];
      albumGroups[album].push(sphere.id);
    });

    // Pick a random anchor for each album
    const anchors: Record<string, string> = {};
    Object.entries(albumGroups).forEach(([album, sphereIds]) => {
      anchors[album] = sphereIds[Math.floor(Math.random() * sphereIds.length)];
    });
    clusterAnchors.current = anchors;

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
            // Check if a single is currently playing
            const playingSingleAtCenter = playingSphere && normalizeAlbum(playingSphere.song.albumTitle) === 'Singles';
            const thisSphereIsSingle = normalizeAlbum(sphere.song.albumTitle) === 'Singles';

            // Don't pull singles to center if another single is playing (let repel work)
            if (playingSingleAtCenter && thisSphereIsSingle) {
              // Skip cluster attraction - repel force will push this single away
            } else {
              const dx = albumPos.x - (x + size / 2);
              const dy = albumPos.y - (y + size / 2);
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist > 10) {
                const pullStrength = 0.25;
                vx += (dx / dist) * pullStrength;
                vy += (dy / dist) * pullStrength;
              }

              // Orbital rotation when music is playing (only for non-anchor spheres)
              const albumName = normalizeAlbum(sphere.song.albumTitle);
              const anchorId = clusterAnchors.current[albumName];
              const isAnchor = sphere.id === anchorId;

              if (isPlaying && currentSong && !isAnchor) {
                // Find the anchor sphere to rotate around
                const anchorSphere = prevSpheres.find(s => s.id === anchorId);
                if (anchorSphere) {
                  const anchorX = anchorSphere.x + anchorSphere.size / 2;
                  const anchorY = anchorSphere.y + anchorSphere.size / 2;
                  const toAnchorX = anchorX - (x + size / 2);
                  const toAnchorY = anchorY - (y + size / 2);
                  const distToAnchor = Math.sqrt(toAnchorX * toAnchorX + toAnchorY * toAnchorY);

                  if (distToAnchor > 15) {
                    // Calculate perpendicular force for orbital motion around anchor
                    const orbitStrength = 0.25 * sphere.orbitSpeed; // Faster and more noticeable
                    const perpX = -toAnchorY / distToAnchor; // Perpendicular vector
                    const perpY = toAnchorX / distToAnchor;

                    // Apply rotational force based on sphere's random direction
                    vx += perpX * orbitStrength * sphere.rotationDirection;
                    vy += perpY * orbitStrength * sphere.rotationDirection;

                    // Gentle pull towards anchor to maintain orbit
                    const pullToAnchor = 0.03;
                    vx += (toAnchorX / distToAnchor) * pullToAnchor;
                    vy += (toAnchorY / distToAnchor) * pullToAnchor;
                  }
                }
              }
            }
          }
        } else if (arrangeByFavorites) {
          // In favorites mode: pull favorites to center, push non-favorites to edges
          const dx = centerX - (x + size / 2);
          const dy = centerY - (y + size / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const sphereIsFav = isFavorite(sphere.song.id);

          if (sphereIsFav) {
            // Favorites are strongly attracted to center
            if (dist > 30) {
              const pullStrength = 0.35;
              vx += (dx / dist) * pullStrength;
              vy += (dy / dist) * pullStrength;
            }
          } else {
            // Non-favorites are pushed to edges
            if (dist < 300) {
              const pushStrength = 0.15;
              vx -= (dx / dist) * pushStrength;
              vy -= (dy / dist) * pushStrength;
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

        // Shooting sphere collision - SLAM spheres out of the way
        if (shootingSphere && !isThisPlaying) {
          const animationDuration = 28000; // 28 seconds to cross screen
          const elapsed = Date.now() - shootingSphere.startTime;
          const progress = Math.min(elapsed / animationDuration, 1);

          // Calculate shooting sphere position (linear for consistent speed)
          const shootingSize = isMobile ? SPHERE_SIZE_MOBILE * 3 : SPHERE_SIZE * 3;
          const shootingX = -250 + progress * (dimensions.width + 300);
          const shootingY = shootingSphere.y;

          // Check collision with shooting sphere
          const shootingCenterX = shootingX + shootingSize / 2;
          const shootingCenterY = shootingY + shootingSize / 2;
          const sphereCenterX = x + size / 2;
          const sphereCenterY = y + size / 2;

          const dx = sphereCenterX - shootingCenterX;
          const dy = sphereCenterY - shootingCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const collisionDist = (shootingSize + size) / 2 + 50; // Bigger collision zone

          if (dist < collisionDist && dist > 0) {
            // MASSIVE push - really knock them out of the way
            const overlap = collisionDist - dist;
            const pushStrength = 35 + (overlap / collisionDist) * 25;

            // Push in direction away from shooting sphere
            vx += (dx / dist) * pushStrength;
            vy += (dy / dist) * pushStrength;

            // Add forward momentum from the shooting sphere moving right
            vx += 15;

            // Add some vertical scatter
            vy += (Math.random() - 0.5) * 20;
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

          // Elastic strings - strong spring force between same album spheres
          if (elasticStrings && sameAlbum && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const restLength = 80; // Ideal distance between connected spheres
            const displacement = dist - restLength;
            const springStrength = 0.8; // Strong spring constant

            // Spring force: F = k * displacement
            const force = displacement * springStrength;

            s1.vx += nx * force * 0.5;
            s1.vy += ny * force * 0.5;
            s2.vx -= nx * force * 0.5;
            s2.vy -= ny * force * 0.5;

            // Add damping to prevent oscillation
            const dampingFactor = 0.85;
            s1.vx *= dampingFactor;
            s1.vy *= dampingFactor;
            s2.vx *= dampingFactor;
            s2.vy *= dampingFactor;
          }

          // Favorites clustering logic
          if (arrangeByFavorites && dist > 0) {
            const s1IsFav = isFavorite(s1.song.id);
            const s2IsFav = isFavorite(s2.song.id);
            const bothFavorites = s1IsFav && s2IsFav;
            const nx = dx / dist;
            const ny = dy / dist;

            if (bothFavorites && dist > minDist && dist < 250) {
              // Favorites attract each other
              const attractStrength = 0.2;
              s1.vx += nx * attractStrength;
              s1.vy += ny * attractStrength;
              s2.vx -= nx * attractStrength;
              s2.vy -= ny * attractStrength;
            } else if (s1IsFav !== s2IsFav && dist < 200) {
              // Favorites and non-favorites repel each other
              const repelStrength = (1 - dist / 200) * 0.4;
              if (s1IsFav) {
                s2.vx += nx * repelStrength;
                s2.vy += ny * repelStrength;
              } else {
                s1.vx -= nx * repelStrength;
                s1.vy -= ny * repelStrength;
              }
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
  }, [dimensions, draggedId, currentSong, isPlaying, arrangeByAlbum, arrangeByFavorites, isFavorite, getAlbumClusterPositions, searchQuery, shootingSphere, isMobile, elasticStrings]);

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

  // Whirlpool effect handler
  const handleWhirlpool = useCallback(() => {
    if (isWhirlpoolActive) return;

    const centerX = dimensions.width / 2;
    const footerHeight = 120;
    const centerY = (dimensions.height - footerHeight) / 2;

    // Remember current arrangeByAlbum state
    whirlpoolPrevArrangeByAlbum.current = arrangeByAlbum;

    // Turn off arrange by album during whirlpool
    setArrangeByAlbum(false);
    setArrangeByFavorites(false);
    setIsWhirlpoolActive(true);

    // Initial massive burst - violent spin
    setSpheres(prev => prev.map(sphere => {
      const dx = (sphere.x + sphere.size / 2) - centerX;
      const dy = (sphere.y + sphere.size / 2) - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Calculate perpendicular (tangential) direction for rotation
      const perpX = -dy / dist;
      const perpY = dx / dist;

      // Massive initial whirlpool force
      const whirlStrength = 25 + (dist / 50) * 15;

      // Pull everything towards center initially
      const inwardStrength = 8;

      return {
        ...sphere,
        vx: perpX * whirlStrength - (dx / dist) * inwardStrength,
        vy: perpY * whirlStrength - (dy / dist) * inwardStrength,
      };
    }));

    // Apply continuous powerful rotation - 5 full rotations worth
    let waveCount = 0;
    const maxWaves = 50; // Many waves for ~5 rotations
    const waveInterval = setInterval(() => {
      waveCount++;

      setSpheres(prev => prev.map(sphere => {
        const dx = (sphere.x + sphere.size / 2) - centerX;
        const dy = (sphere.y + sphere.size / 2) - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const perpX = -dy / dist;
        const perpY = dx / dist;

        // Strong consistent rotation force throughout
        const rotationStrength = 12 + (dist / 100) * 8;

        // Add chaos - random bursts
        const chaosBurst = Math.random() > 0.85 ? (Math.random() - 0.5) * 15 : 0;

        // Pulsing inward/outward to keep things mixed up
        const breathPhase = Math.sin((waveCount / maxWaves) * Math.PI * 5);
        const radialStrength = breathPhase * 5;

        // Add some randomness to completely disrupt positions
        const randomX = (Math.random() - 0.5) * 3;
        const randomY = (Math.random() - 0.5) * 3;

        return {
          ...sphere,
          vx: sphere.vx + perpX * rotationStrength + (dx / dist) * radialStrength + randomX + chaosBurst,
          vy: sphere.vy + perpY * rotationStrength + (dy / dist) * radialStrength + randomY + chaosBurst,
        };
      }));

      if (waveCount >= maxWaves) {
        clearInterval(waveInterval);

        // Final explosive scatter in all directions
        setSpheres(prev => prev.map(sphere => {
          const dx = (sphere.x + sphere.size / 2) - centerX;
          const dy = (sphere.y + sphere.size / 2) - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Random explosive direction
          const angle = Math.random() * Math.PI * 2;
          const explosionStrength = 10 + Math.random() * 8;

          return {
            ...sphere,
            vx: sphere.vx + Math.cos(angle) * explosionStrength + (dx / dist) * 5,
            vy: sphere.vy + Math.sin(angle) * explosionStrength + (dy / dist) * 5,
          };
        }));

        // After whirlpool ends, restore arrangeByAlbum if it was on before
        setTimeout(() => {
          setIsWhirlpoolActive(false);
          if (whirlpoolPrevArrangeByAlbum.current) {
            setArrangeByAlbum(true);
          }
        }, 2500);
      }
    }, 80); // Fast interval for smooth powerful rotation
  }, [isWhirlpoolActive, dimensions, arrangeByAlbum]);

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
        zIndex: 10,
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

            // Check if sphere matches search query (only currently PLAYING song bypasses filter)
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
              sphere.song.title.toLowerCase().includes(query) ||
              sphere.song.albumTitle.toLowerCase().includes(query) ||
              isCurrentPlaying;

            // Check if sphere should be visible based on favorites filter
            const matchesFavorites = !arrangeByFavorites || isFavorite(sphere.song.id) || isCurrentPlaying;

            // Sphere is visible if it matches both search and favorites filters
            const isVisible = matchesSearch && matchesFavorites;

            return (
              <MotionBox
                key={sphere.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isVisible ? (isDragged ? 1.1 : isCurrentPlaying ? 1.25 : 1) : 0,
                  opacity: isVisible ? 1 : 0,
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
                  pointerEvents: isVisible ? 'auto' : 'none',
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

                  {/* Favorite heart indicator */}
                  {isFavorite(sphere.song.id) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '8%',
                        right: '8%',
                        width: sphere.size * 0.22,
                        height: sphere.size * 0.22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        animation: 'heartPulse 1.5s ease-in-out infinite',
                        '@keyframes heartPulse': {
                          '0%, 100%': {
                            transform: 'scale(1)',
                            filter: 'drop-shadow(0 0 3px rgba(255, 77, 109, 0.8))',
                          },
                          '50%': {
                            transform: 'scale(1.15)',
                            filter: 'drop-shadow(0 0 8px rgba(255, 77, 109, 1))',
                          },
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: '#ff4d6d',
                          fontSize: sphere.size * 0.18,
                          textShadow: '0 0 6px rgba(255, 77, 109, 0.9), 0 0 12px rgba(255, 77, 109, 0.6)',
                        }}
                      >
                        ♥
                      </Box>
                    </Box>
                  )}

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
                        <HeartButton
                          songId={sphere.song.id}
                          songTitle={sphere.song.title}
                          size="small"
                          showTooltip={false}
                        />
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
                        {/* Follow/Subscribe links */}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {/* Spotify Follow */}
                        <IconButton
                          component="a"
                          href="https://open.spotify.com/artist/1hKZRgd8uxrTAPFcxoad7u"
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          title="Follow on Spotify"
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
                        {/* YouTube Music Subscribe */}
                        <IconButton
                          component="a"
                          href="https://www.youtube.com/channel/UCv4yflWc567jvsh238l4frw?sub_confirmation=1"
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          title="Subscribe on YouTube"
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
                        {/* Apple Music */}
                        <IconButton
                          component="a"
                          href="https://music.apple.com/us/artist/bryon-bowers/1785977294"
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          title="Listen on Apple Music"
                          sx={{
                            color: '#FC3C44',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            p: 0.5,
                            '&:hover': { bgcolor: 'rgba(252,60,68,0.3)', transform: 'scale(1.1)' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <AppleMusicIcon />
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

      {/* Search and arrange controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 100, md: 120 },
          left: { xs: 10, md: 20 },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 1000,
        }}
      >
        {/* Search Icon/Input */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              setSearchExpanded(!searchExpanded);
              if (!searchExpanded) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              } else {
                setSearchQuery('');
              }
            }}
            title="Search songs"
            sx={{
              bgcolor: searchExpanded ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              width: 40,
              height: 40,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: searchExpanded ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.7)',
                borderColor: 'rgba(255,255,255,0.5)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Search />
          </IconButton>
          {searchExpanded && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) {
                  setSearchExpanded(false);
                }
              }}
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
                width: '120px',
                height: '40px',
                boxSizing: 'border-box',
                marginLeft: '8px',
              }}
            />
          )}
        </Box>

        {/* Arrange by Album button */}
        <IconButton
          onClick={() => {
            setArrangeByAlbum(!arrangeByAlbum);
            if (!arrangeByAlbum) setArrangeByFavorites(false);
          }}
          title={arrangeByAlbum ? 'Free float' : 'Arrange by album'}
          sx={{
            bgcolor: arrangeByAlbum ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            width: 40,
            height: 40,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: arrangeByAlbum ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.7)',
              borderColor: 'rgba(255,255,255,0.5)',
              transform: 'scale(1.1)',
            },
          }}
        >
          {arrangeByAlbum ? <Shuffle /> : <Album />}
        </IconButton>

        {/* Arrange by Favorites button */}
        <IconButton
          onClick={() => {
            setArrangeByFavorites(!arrangeByFavorites);
            if (!arrangeByFavorites) setArrangeByAlbum(false);
          }}
          title={arrangeByFavorites ? 'Show all' : 'Show favorites'}
          sx={{
            bgcolor: arrangeByFavorites ? 'rgba(255,77,109,0.3)' : 'rgba(0,0,0,0.5)',
            border: arrangeByFavorites ? '1px solid rgba(255,77,109,0.5)' : '1px solid rgba(255,255,255,0.3)',
            color: arrangeByFavorites ? '#ff4d6d' : 'white',
            width: 40,
            height: 40,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: arrangeByFavorites ? 'rgba(255,77,109,0.4)' : 'rgba(0,0,0,0.7)',
              borderColor: arrangeByFavorites ? 'rgba(255,77,109,0.7)' : 'rgba(255,255,255,0.5)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <Favorite />
        </IconButton>
      </Box>

      {/* Elastic strings visualization */}
      {elasticStrings && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {spheres.flatMap((s1, i) =>
            spheres.slice(i + 1).map((s2) => {
              const sameAlbum = normalizeAlbum(s1.song.albumTitle) === normalizeAlbum(s2.song.albumTitle);
              if (!sameAlbum) return null;

              const x1 = s1.x + s1.size / 2;
              const y1 = s1.y + s1.size / 2;
              const x2 = s2.x + s2.size / 2;
              const y2 = s2.y + s2.size / 2;
              const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

              // Only draw if within reasonable distance
              if (dist > 400) return null;

              // String tension affects appearance
              const tension = Math.min(dist / 150, 1);
              const opacity = 0.3 + (1 - tension) * 0.4;
              const strokeWidth = 1 + (1 - tension) * 2;

              return (
                <line
                  key={`${s1.id}-${s2.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={`rgba(255, 255, 255, ${opacity})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.3))',
                  }}
                />
              );
            })
          )}
        </svg>
      )}

      {/* Shooting sphere - random large sphere crossing screen */}
      <AnimatePresence>
        {shootingSphere && (
          <MotionBox
            key={shootingSphere.id}
            initial={{ x: -250, y: shootingSphere.y, scale: 0.5, opacity: 0 }}
            animate={{
              x: dimensions.width + 50,
              y: [shootingSphere.y, shootingSphere.y - 20, shootingSphere.y, shootingSphere.y + 15, shootingSphere.y, shootingSphere.y - 18, shootingSphere.y, shootingSphere.y + 12, shootingSphere.y, shootingSphere.y - 15, shootingSphere.y],
              scale: 1,
              opacity: [0, 1, 1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 28,
              ease: 'linear',
              opacity: { duration: 28, times: [0, 0.01, 0.5, 0.99, 1] },
            }}
            onClick={() => {
              // Find the first song from this album and play it
              const albumSongs = songsData.filter(s =>
                s.albumTitle.toLowerCase() === shootingSphere.song.albumTitle.toLowerCase()
              );
              if (albumSongs.length > 0) {
                const firstSong = albumSongs[0];
                setPoppingId(firstSong.id);
                setTimeout(() => setPoppingId(null), 600);
                playSong(firstSong as unknown as Song);
              }
            }}
            sx={{
              position: 'absolute',
              width: isMobile ? SPHERE_SIZE_MOBILE * 3 : SPHERE_SIZE * 3,
              height: isMobile ? SPHERE_SIZE_MOBILE * 3 : SPHERE_SIZE * 3,
              zIndex: 50,
              pointerEvents: 'auto',
              cursor: 'pointer',
              '&:hover': {
                filter: 'brightness(1.2)',
              },
            }}
          >
            {/* Inner rotating container */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                animation: 'slowRotate 8s linear infinite',
                '@keyframes slowRotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 0 50px 20px rgba(255,255,255,0.5), 0 0 100px 40px rgba(255,255,255,0.25), inset 0 0 30px rgba(0,0,0,0.3)',
                border: '4px solid rgba(255,255,255,0.6)',
              }}
            >
              <Box
                component="img"
                src={shootingSphere.song.coverImageUrl}
                alt=""
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(1.1) saturate(1.2)',
                }}
              />
              {/* Bubble highlight - enhanced spherical sheen */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `
                    radial-gradient(ellipse 60% 40% at 25% 15%, rgba(255,255,255,0.7) 0%, transparent 50%),
                    radial-gradient(ellipse 40% 25% at 20% 20%, rgba(255,255,255,0.9) 0%, transparent 40%),
                    radial-gradient(ellipse 20% 10% at 15% 15%, rgba(255,255,255,1) 0%, transparent 60%),
                    radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.3) 100%)
                  `,
                  pointerEvents: 'none',
                }}
              />
              {/* Bottom reflection */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `
                    radial-gradient(ellipse 50% 20% at 70% 85%, rgba(255,255,255,0.15) 0%, transparent 70%)
                  `,
                  pointerEvents: 'none',
                }}
              />
            </Box>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Right side buttons */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 100, md: 120 },
          right: { xs: 10, md: 20 },
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* Elastic strings button */}
        <IconButton
          onClick={() => setElasticStrings(!elasticStrings)}
          title={elasticStrings ? "Remove strings" : "Connect albums"}
          sx={{
            bgcolor: elasticStrings ? 'rgba(150,255,150,0.3)' : 'rgba(0,0,0,0.5)',
            border: elasticStrings ? '1px solid rgba(150,255,150,0.5)' : '1px solid rgba(255,255,255,0.3)',
            color: elasticStrings ? '#96ff96' : 'white',
            width: 44,
            height: 44,
            transition: 'all 0.3s',
            animation: elasticStrings ? 'stringPulse 2s ease-in-out infinite' : 'none',
            '@keyframes stringPulse': {
              '0%, 100%': { boxShadow: '0 0 10px rgba(150,255,150,0.4)' },
              '50%': { boxShadow: '0 0 20px rgba(150,255,150,0.7)' },
            },
            '&:hover': {
              bgcolor: elasticStrings ? 'rgba(150,255,150,0.4)' : 'rgba(0,0,0,0.7)',
              borderColor: elasticStrings ? 'rgba(150,255,150,0.7)' : 'rgba(255,255,255,0.5)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <Hub />
        </IconButton>

        {/* Launch sphere button */}
        <IconButton
          onClick={triggerShootingSphere}
          disabled={!!shootingSphere}
          title="Launch surprise!"
          sx={{
            bgcolor: shootingSphere ? 'rgba(255,150,50,0.3)' : 'rgba(0,0,0,0.5)',
            border: shootingSphere ? '1px solid rgba(255,150,50,0.5)' : '1px solid rgba(255,255,255,0.3)',
            color: shootingSphere ? '#ff9632' : 'white',
            width: 44,
            height: 44,
            transition: 'all 0.3s',
            animation: shootingSphere ? 'rocketPulse 1s ease-in-out infinite' : 'none',
            '@keyframes rocketPulse': {
              '0%, 100%': { transform: 'translateX(0)', boxShadow: '0 0 10px rgba(255,150,50,0.5)' },
              '50%': { transform: 'translateX(3px)', boxShadow: '0 0 20px rgba(255,150,50,0.8)' },
            },
            '&:hover': {
              bgcolor: shootingSphere ? 'rgba(255,150,50,0.4)' : 'rgba(0,0,0,0.7)',
              borderColor: shootingSphere ? 'rgba(255,150,50,0.7)' : 'rgba(255,255,255,0.5)',
              transform: shootingSphere ? undefined : 'scale(1.1) rotate(-15deg)',
            },
            '&:disabled': {
              color: '#ff9632',
            },
          }}
        >
          <RocketLaunch sx={{ transform: 'rotate(-45deg)' }} />
        </IconButton>

        {/* Whirlpool button */}
        <IconButton
          onClick={handleWhirlpool}
          disabled={isWhirlpoolActive}
          title="Mix it up!"
          sx={{
            bgcolor: isWhirlpoolActive ? 'rgba(100,200,255,0.3)' : 'rgba(0,0,0,0.5)',
            border: isWhirlpoolActive ? '1px solid rgba(100,200,255,0.5)' : '1px solid rgba(255,255,255,0.3)',
            color: isWhirlpoolActive ? '#64c8ff' : 'white',
            width: 44,
            height: 44,
            transition: 'all 0.3s',
            animation: isWhirlpoolActive ? 'spin 1s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
            '&:hover': {
              bgcolor: isWhirlpoolActive ? 'rgba(100,200,255,0.4)' : 'rgba(0,0,0,0.7)',
              borderColor: isWhirlpoolActive ? 'rgba(100,200,255,0.7)' : 'rgba(255,255,255,0.5)',
              transform: isWhirlpoolActive ? undefined : 'scale(1.1)',
            },
            '&:disabled': {
              color: '#64c8ff',
            },
          }}
        >
          <Cyclone />
        </IconButton>
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
