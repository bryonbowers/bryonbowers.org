import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { PlayArrow, Pause, ExpandMore, ExpandLess, MusicNote } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { PoemSongPairing } from '../data/poemSongPairings';
import songsData from '../data/songs.json';
import { Song } from '../types';

interface PoemSongCardProps {
  pairing: PoemSongPairing;
  index: number;
}

const MotionBox = motion(Box);

const moodColors: Record<string, string> = {
  passionate: 'rgba(220, 38, 38, 0.15)',
  melancholic: 'rgba(59, 130, 246, 0.15)',
  mystical: 'rgba(139, 92, 246, 0.15)',
  romantic: 'rgba(236, 72, 153, 0.15)',
  reflective: 'rgba(34, 197, 94, 0.15)',
  intense: 'rgba(249, 115, 22, 0.15)',
};

const moodAccents: Record<string, string> = {
  passionate: '#dc2626',
  melancholic: '#3b82f6',
  mystical: '#8b5cf6',
  romantic: '#ec4899',
  reflective: '#22c55e',
  intense: '#f97316',
};

export const PoemSongCard: React.FC<PoemSongCardProps> = ({ pairing, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentSong, isPlaying, playSong, togglePlay } = useMusic();

  const song = songsData.find(s => s.id === pairing.songId);
  const isCurrent = currentSong?.id === pairing.songId;
  const isCurrentPlaying = isCurrent && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!song) return;

    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song as unknown as Song);
    }
  };

  const formatPoemLines = (content: string) => {
    const lines = content.split('\n');
    return lines.slice(0, expanded ? lines.length : 12);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        bgcolor: 'rgba(255,255,255,0.02)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          borderColor: moodAccents[pairing.mood],
          bgcolor: moodColors[pairing.mood],
          transform: 'translateY(-4px)',
        },
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Mood accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: moodAccents[pairing.mood],
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left side - Song Info */}
        <Box
          sx={{
            width: { xs: '100%', md: '35%' },
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: { md: '1px solid rgba(255,255,255,0.05)' },
            borderBottom: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' },
            position: 'relative',
          }}
        >
          {/* Album art / Play button */}
          <Box
            sx={{
              position: 'relative',
              width: 140,
              height: 140,
              mb: 3,
            }}
          >
            <Box
              component="img"
              src={song?.coverImageUrl}
              alt={pairing.songTitle}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                transition: 'filter 0.4s ease',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isHovered || isCurrent ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            >
              <IconButton
                onClick={handlePlayClick}
                sx={{
                  bgcolor: moodAccents[pairing.mood],
                  color: 'white',
                  width: 56,
                  height: 56,
                  '&:hover': {
                    bgcolor: moodAccents[pairing.mood],
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s',
                }}
              >
                {isCurrentPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
              </IconButton>
            </Box>

            {/* Playing indicator */}
            <AnimatePresence>
              {isCurrentPlaying && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: moodAccents[pairing.mood],
                    borderRadius: '50%',
                    p: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MusicNote sx={{ fontSize: 16, color: 'white' }} />
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>

          <Typography
            variant="caption"
            align="center"
            sx={{
              color: 'text.secondary',
              letterSpacing: '0.05em',
              mb: 1,
              fontSize: '0.65rem',
              opacity: 0.7,
            }}
          >
            lyrics = me, composition = ai+me, vocal+instrument = ai
          </Typography>

          <Typography
            variant="h5"
            align="center"
            sx={{
              fontFamily: 'Cinzel',
              fontWeight: 700,
              mb: 1,
              letterSpacing: '0.05em',
            }}
          >
            {pairing.songTitle.toUpperCase()}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: moodAccents[pairing.mood],
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {pairing.mood}
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              maxWidth: 200,
            }}
          >
            {pairing.theme}
          </Typography>
        </Box>

        {/* Right side - Poem */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'text.secondary',
                letterSpacing: '0.2em',
                flex: 1,
              }}
            >
              THE POEM
            </Typography>
            <IconButton
              size="small"
              sx={{ color: 'text.secondary' }}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Cinzel',
              fontWeight: 700,
              mb: 3,
              letterSpacing: '0.03em',
            }}
          >
            {pairing.poemTitle}
          </Typography>

          {/* Poem excerpt/teaser */}
          <Typography
            variant="h6"
            sx={{
              color: moodAccents[pairing.mood],
              fontStyle: 'italic',
              fontWeight: 300,
              mb: 3,
              borderLeft: `2px solid ${moodAccents[pairing.mood]}`,
              pl: 2,
            }}
          >
            "{pairing.poemExcerpt}"
          </Typography>

          {/* Poem content */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Collapse in={true} collapsedSize={expanded ? undefined : 200}>
              <Box sx={{ pl: 2, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                {formatPoemLines(pairing.poemContent).map((line, i) => (
                  <Typography
                    key={i}
                    variant="body1"
                    sx={{
                      fontFamily: '"Georgia", serif',
                      color: 'text.secondary',
                      lineHeight: 1.8,
                      mb: line.trim() === '' ? 1.5 : 0.25,
                      fontSize: '0.95rem',
                    }}
                  >
                    {line || '\u00A0'}
                  </Typography>
                ))}
              </Box>
            </Collapse>

            {/* Fade overlay when collapsed */}
            {!expanded && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  background: `linear-gradient(transparent, ${isHovered ? moodColors[pairing.mood] : 'var(--bg-color)'})`,
                  pointerEvents: 'none',
                  transition: 'background 0.3s',
                }}
              />
            )}
          </Box>

          {/* Expand prompt */}
          <Typography
            variant="caption"
            sx={{
              color: moodAccents[pairing.mood],
              mt: 2,
              textAlign: 'center',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            {expanded ? 'Click to collapse' : 'Click to read full poem'}
          </Typography>
        </Box>
      </Box>
    </MotionBox>
  );
};
