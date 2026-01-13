import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, IconButton, useMediaQuery, useTheme, Snackbar } from '@mui/material';
import {
  PlayArrow,
  Pause,
  ChevronLeft,
  ChevronRight,
  VolumeUp,
  Share,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { PoemSongPairing, poemSongPairings } from '../data/poemSongPairings';
import songsData from '../data/songs.json';
import { Song } from '../types';

const MotionBox = motion(Box);

// Antique color palette
const antiqueColors = {
  parchment: '#f4e4c1',
  parchmentDark: '#e8d4a8',
  parchmentLight: '#faf6eb',
  inkBrown: '#3d2914',
  inkFaded: '#5c4033',
  leather: '#654321',
  leatherDark: '#3d2817',
  gold: '#c9a227',
  goldDim: '#8b7355',
  rust: '#8b4513',
  sepia: '#704214',
};

interface BookPageProps {
  pairing: PoemSongPairing;
  direction: number;
  isActive: boolean;
  pageNumber: number;
}

// Decorative ornament component
const Ornament: React.FC<{ color?: string }> = ({ color = antiqueColors.inkFaded }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      my: 2,
      color,
    }}
  >
    <Box sx={{ width: 40, height: 1, bgcolor: color, opacity: 0.5 }} />
    <Typography sx={{ fontSize: '1.2rem', fontFamily: 'serif' }}>&#10087;</Typography>
    <Box sx={{ width: 40, height: 1, bgcolor: color, opacity: 0.5 }} />
  </Box>
);

const BookPage: React.FC<BookPageProps> = ({ pairing, isActive, pageNumber }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = useMusic();
  const poemRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const song = songsData.find(s => s.id === pairing.songId);
  const isCurrent = currentSong?.id === pairing.songId;
  const isCurrentPlaying = isCurrent && isPlaying;

  const handlePlayClick = () => {
    if (!song) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song as unknown as Song);
    }
  };

  useEffect(() => {
    if (isActive && poemRef.current) {
      poemRef.current.scrollTop = 0;
    }
  }, [isActive]);

  const poemLines = pairing.poemContent.split('\n');

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        // Main book background
        bgcolor: antiqueColors.leatherDark,
      }}
    >
      {/* Book cover/frame */}
      <Box
        sx={{
          position: 'absolute',
          inset: { xs: 8, md: 20 },
          bgcolor: antiqueColors.leather,
          borderRadius: 2,
          boxShadow: `
            inset 0 0 30px rgba(0,0,0,0.4),
            0 10px 40px rgba(0,0,0,0.5),
            0 0 0 3px ${antiqueColors.gold}30
          `,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Left Page - Poem */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            // Parchment texture
            background: `
              linear-gradient(135deg, ${antiqueColors.parchmentLight} 0%, ${antiqueColors.parchment} 50%, ${antiqueColors.parchmentDark} 100%)
            `,
            // Aged paper effect
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 20% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 40%),
                radial-gradient(ellipse at 80% 80%, rgba(139, 69, 19, 0.08) 0%, transparent 30%),
                radial-gradient(ellipse at 40% 60%, rgba(101, 67, 33, 0.05) 0%, transparent 35%)
              `,
              pointerEvents: 'none',
            },
            // Page edge shadow
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 30,
              background: `linear-gradient(to left, rgba(0,0,0,0.15), transparent)`,
              pointerEvents: 'none',
            },
          }}
        >
          {/* Worn edge top */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(139, 69, 19, 0.1) 2px,
                rgba(139, 69, 19, 0.1) 4px
              )`,
            }}
          />

          {/* Poem Header */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              pb: 1,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"IM Fell English SC", "Palatino Linotype", "Book Antiqua", serif',
                fontWeight: 400,
                fontSize: { xs: '1.4rem', md: '2rem' },
                letterSpacing: '0.08em',
                lineHeight: 1.3,
                color: antiqueColors.inkBrown,
                textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
              }}
            >
              {pairing.poemTitle}
            </Typography>
            <Ornament />
          </Box>

          {/* Poem Content - Scrollable */}
          <Box
            ref={poemRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              px: { xs: 3, md: 4 },
              pb: 3,
              position: 'relative',
              zIndex: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: antiqueColors.parchmentDark,
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                background: antiqueColors.goldDim,
                borderRadius: 4,
                border: `2px solid ${antiqueColors.parchmentDark}`,
              },
            }}
          >
            <Box
              sx={{
                maxWidth: 480,
                mx: 'auto',
              }}
            >
              {poemLines.map((line, i) => (
                <Typography
                  key={i}
                  component="p"
                  sx={{
                    fontFamily: '"IM Fell English", "Palatino", "Georgia", serif',
                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                    lineHeight: 1.6,
                    color: antiqueColors.inkFaded,
                    fontWeight: 400,
                    mb: line.trim() === '' ? 1 : 0.15,
                    letterSpacing: '0.02em',
                  }}
                >
                  {line || '\u00A0'}
                </Typography>
              ))}
            </Box>

            {/* Page number */}
            <Typography
              sx={{
                fontFamily: '"IM Fell English", serif',
                fontSize: '0.75rem',
                color: antiqueColors.goldDim,
                textAlign: 'center',
                mt: 4,
                letterSpacing: '0.2em',
              }}
            >
              ~ {pageNumber * 2 - 1} ~
            </Typography>
          </Box>
        </Box>

        {/* Center binding/spine */}
        {!isMobile && (
          <Box
            sx={{
              width: 30,
              bgcolor: antiqueColors.leatherDark,
              position: 'relative',
              boxShadow: `
                inset 4px 0 8px rgba(0,0,0,0.4),
                inset -4px 0 8px rgba(0,0,0,0.4)
              `,
              // Stitching effect
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: 20,
                bottom: 20,
                width: 2,
                transform: 'translateX(-50%)',
                background: `repeating-linear-gradient(
                  to bottom,
                  ${antiqueColors.gold}60,
                  ${antiqueColors.gold}60 8px,
                  transparent 8px,
                  transparent 16px
                )`,
              },
            }}
          />
        )}

        {/* Right Page - Song */}
        <Box
          sx={{
            width: { xs: '100%', md: '42%' },
            minHeight: { xs: '40vh', md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 4 },
            position: 'relative',
            // Parchment texture (slightly different shade)
            background: `
              linear-gradient(225deg, ${antiqueColors.parchmentLight} 0%, ${antiqueColors.parchment} 50%, ${antiqueColors.parchmentDark} 100%)
            `,
            // Aged paper effect
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 80% 20%, rgba(139, 69, 19, 0.08) 0%, transparent 35%),
                radial-gradient(ellipse at 20% 70%, rgba(139, 69, 19, 0.1) 0%, transparent 40%)
              `,
              pointerEvents: 'none',
            },
            // Page edge shadow (left side)
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 30,
              background: `linear-gradient(to right, rgba(0,0,0,0.12), transparent)`,
              pointerEvents: 'none',
            },
          }}
        >
          {/* Decorative corner flourishes */}
          <Box
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              color: antiqueColors.goldDim,
              fontSize: '1.5rem',
              fontFamily: 'serif',
              opacity: 0.6,
            }}
          >
            &#10048;
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 15,
              left: 15,
              color: antiqueColors.goldDim,
              fontSize: '1.5rem',
              fontFamily: 'serif',
              opacity: 0.6,
              transform: 'rotate(180deg)',
            }}
          >
            &#10048;
          </Box>

          {/* Album Art with vintage frame */}
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            sx={{
              position: 'relative',
              width: { xs: 160, md: 200 },
              height: { xs: 160, md: 200 },
              mb: 3,
              // Vintage photo frame
              border: `4px solid ${antiqueColors.gold}`,
              boxShadow: `
                0 0 0 2px ${antiqueColors.leatherDark},
                0 0 0 6px ${antiqueColors.gold}50,
                4px 4px 15px rgba(0,0,0,0.3)
              `,
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -4,
                border: `1px solid ${antiqueColors.gold}30`,
              },
            }}
          >
            {/* Spinning ring when playing (more subtle) */}
            {isCurrentPlaying && (
              <MotionBox
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                sx={{
                  position: 'absolute',
                  inset: -20,
                  border: `1px dashed ${antiqueColors.gold}`,
                  borderRadius: '50%',
                  opacity: 0.6,
                }}
              />
            )}

            <Box
              component="img"
              src={song?.coverImageUrl}
              alt={pairing.songTitle}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isCurrentPlaying
                  ? 'sepia(20%) contrast(1.05)'
                  : 'sepia(60%) grayscale(30%)',
                transition: 'filter 0.5s ease',
              }}
            />

            {/* Play overlay */}
            <Box
              onClick={handlePlayClick}
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(61, 41, 20, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(61, 41, 20, 0.5)',
                },
              }}
            >
              <IconButton
                sx={{
                  bgcolor: antiqueColors.leather,
                  color: antiqueColors.gold,
                  width: { xs: 50, md: 60 },
                  height: { xs: 50, md: 60 },
                  border: `2px solid ${antiqueColors.gold}`,
                  '&:hover': {
                    bgcolor: antiqueColors.leatherDark,
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s',
                }}
              >
                {isCurrentPlaying ? (
                  <Pause sx={{ fontSize: { xs: 24, md: 30 } }} />
                ) : (
                  <PlayArrow sx={{ fontSize: { xs: 24, md: 30 } }} />
                )}
              </IconButton>
            </Box>
          </MotionBox>

          {/* Song Title - Vintage typography */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: '"IM Fell English SC", "Palatino Linotype", serif',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              letterSpacing: '0.12em',
              color: antiqueColors.inkBrown,
              mb: 1,
              textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            {pairing.songTitle}
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{
              fontFamily: '"IM Fell English", serif',
              color: antiqueColors.inkFaded,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
            }}
          >
            ~ Bryon Bowers ~
          </Typography>

          {/* Now Playing indicator */}
          {isCurrentPlaying && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 3,
                color: antiqueColors.gold,
                bgcolor: antiqueColors.leatherDark,
                px: 2,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              <VolumeUp sx={{ fontSize: 14 }} />
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: '0.15em',
                  fontFamily: '"IM Fell English", serif',
                  fontSize: '0.65rem',
                }}
              >
                NOW PLAYING
              </Typography>
            </MotionBox>
          )}

          {/* Page number */}
          <Typography
            sx={{
              position: 'absolute',
              bottom: 15,
              right: 20,
              fontFamily: '"IM Fell English", serif',
              fontSize: '0.75rem',
              color: antiqueColors.goldDim,
              letterSpacing: '0.2em',
            }}
          >
            ~ {pageNumber * 2} ~
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const BookReader: React.FC = () => {
  const { poemId } = useParams<{ poemId?: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasNavigatedToPoem = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalPages = poemSongPairings.length;

  // Navigate to poem from URL parameter
  useEffect(() => {
    if (poemId && !hasNavigatedToPoem.current) {
      const poemIndex = poemSongPairings.findIndex(p => p.id.toString() === poemId);
      if (poemIndex !== -1) {
        hasNavigatedToPoem.current = true;
        setCurrentPage(poemIndex);
      }
    }
  }, [poemId]);

  const goToPage = useCallback((newPage: number, dir?: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setDirection(dir ?? (newPage > currentPage ? 1 : -1));
      setCurrentPage(newPage);
    }
  }, [currentPage, totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1, 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1, -1);
    }
  }, [currentPage, goToPage]);

  const handleSharePoem = async () => {
    const currentPoem = poemSongPairings[currentPage];
    const url = `${window.location.origin}/poem/${currentPoem.id}`;
    const shareData = {
      title: `${currentPoem.poemTitle} - Bryon Bowers`,
      text: `Read "${currentPoem.poemTitle}" paired with "${currentPoem.songTitle}" by Bryon Bowers - The Dead Fish Poet`,
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  // Wheel navigation with debounce
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      if (Math.abs(e.deltaY) > 50) {
        isScrolling = true;

        if (e.deltaY > 0) {
          nextPage();
        } else {
          prevPage();
        }

        timeout = setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      clearTimeout(timeout);
    };
  }, [nextPage, prevPage]);

  // Page turn animation variants
  const pageVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 15 : -15,
      x: direction > 0 ? '5%' : '-5%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -15 : 15,
      x: direction > 0 ? '-5%' : '5%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'fixed',
        inset: 0,
        top: 64,
        // Dark wood desk background
        background: `
          linear-gradient(180deg, #1a1209 0%, #2d1f12 50%, #1a1209 100%)
        `,
        overflow: 'hidden',
        pb: 'var(--player-height)',
        // Wood grain texture
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 100px,
              rgba(0,0,0,0.03) 100px,
              rgba(0,0,0,0.03) 200px
            )
          `,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Page Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <MotionBox
          key={currentPage}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            opacity: { duration: 0.3 },
          }}
          sx={{
            position: 'absolute',
            inset: 0,
            perspective: 2000,
          }}
        >
          <BookPage
            pairing={poemSongPairings[currentPage]}
            direction={direction}
            isActive={true}
            pageNumber={currentPage + 1}
          />
        </MotionBox>
      </AnimatePresence>

      {/* Navigation Arrows - Antique style */}
      {!isMobile && (
        <>
          <IconButton
            onClick={prevPage}
            disabled={currentPage === 0}
            sx={{
              position: 'absolute',
              left: { md: 30, lg: 50 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: antiqueColors.leather,
              color: antiqueColors.gold,
              opacity: currentPage === 0 ? 0.3 : 0.8,
              border: `2px solid ${antiqueColors.gold}50`,
              width: 48,
              height: 48,
              '&:hover': {
                bgcolor: antiqueColors.leatherDark,
                opacity: 1,
              },
              '&:disabled': {
                bgcolor: antiqueColors.leather,
                color: antiqueColors.goldDim,
              },
              transition: 'all 0.3s',
              zIndex: 10,
            }}
          >
            <ChevronLeft sx={{ fontSize: 28 }} />
          </IconButton>

          <IconButton
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            sx={{
              position: 'absolute',
              right: { md: 30, lg: 50 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: antiqueColors.leather,
              color: antiqueColors.gold,
              opacity: currentPage === totalPages - 1 ? 0.3 : 0.8,
              border: `2px solid ${antiqueColors.gold}50`,
              width: 48,
              height: 48,
              '&:hover': {
                bgcolor: antiqueColors.leatherDark,
                opacity: 1,
              },
              '&:disabled': {
                bgcolor: antiqueColors.leather,
                color: antiqueColors.goldDim,
              },
              transition: 'all 0.3s',
              zIndex: 10,
            }}
          >
            <ChevronRight sx={{ fontSize: 28 }} />
          </IconButton>
        </>
      )}

      {/* Page Indicator - Antique style */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 100, md: 25 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          zIndex: 10,
          bgcolor: antiqueColors.leatherDark,
          px: 3,
          py: 1,
          borderRadius: 2,
          border: `1px solid ${antiqueColors.gold}40`,
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"IM Fell English", serif',
            fontSize: '0.75rem',
            color: antiqueColors.gold,
            letterSpacing: '0.15em',
          }}
        >
          Chapter
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {poemSongPairings.map((pairing, index) => (
            <Box
              key={pairing.id}
              onClick={() => goToPage(index)}
              sx={{
                width: index === currentPage ? 20 : 8,
                height: 8,
                borderRadius: 1,
                bgcolor: index === currentPage
                  ? antiqueColors.gold
                  : `${antiqueColors.gold}40`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: index === currentPage ? `1px solid ${antiqueColors.gold}` : 'none',
                '&:hover': {
                  bgcolor: antiqueColors.gold,
                },
              }}
            />
          ))}
        </Box>

        <Typography
          sx={{
            fontFamily: '"IM Fell English", serif',
            fontSize: '0.8rem',
            color: antiqueColors.parchment,
            minWidth: 45,
            textAlign: 'right',
          }}
        >
          {currentPage + 1} of {totalPages}
        </Typography>

        {/* Share button */}
        <IconButton
          onClick={handleSharePoem}
          size="small"
          sx={{
            color: antiqueColors.gold,
            ml: 2,
            border: `1px solid ${antiqueColors.gold}`,
            borderRadius: 1,
            p: 0.75,
            '&:hover': {
              bgcolor: `${antiqueColors.gold}30`,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s',
          }}
        >
          <Share sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Mobile swipe hint */}
      {isMobile && currentPage === 0 && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          sx={{
            position: 'absolute',
            bottom: 150,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: antiqueColors.parchment,
            bgcolor: antiqueColors.leatherDark,
            px: 2,
            py: 1,
            borderRadius: 1,
            border: `1px solid ${antiqueColors.gold}30`,
          }}
        >
          <ChevronLeft sx={{ fontSize: 14 }} />
          <Typography
            variant="caption"
            sx={{ fontFamily: '"IM Fell English", serif' }}
          >
            Scroll to turn pages
          </Typography>
          <ChevronRight sx={{ fontSize: 14 }} />
        </MotionBox>
      )}

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
