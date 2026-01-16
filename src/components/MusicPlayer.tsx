import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { useMusic } from '../context/MusicContext';
import { HeartButton } from './HeartButton';

export const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    duration,
    currentTime,
    seek,
    volume,
    setVolume
  } = useMusic();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!currentSong) return null;

  const handleSeek = (_: Event, newValue: number | number[]) => {
    seek(newValue as number);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--player-height)',
        bgcolor: 'rgba(18, 18, 18, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        px: 3,
        zIndex: 1000,
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Song Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '30%' : '25%' }}>
        {currentSong.coverImageUrl && (
          <Box
            component="img"
            src={currentSong.coverImageUrl}
            alt={currentSong.title}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              mr: 2,
              display: { xs: 'none', sm: 'block' }
            }}
          />
        )}
        <Box sx={{ overflow: 'hidden', mr: 1 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
            {currentSong.title}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
            {currentSong.artistName}
          </Typography>
        </Box>
        <HeartButton
          songId={currentSong.id}
          songTitle={currentSong.title}
          size="small"
        />
      </Box>

      {/* Controls & Progress */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 600,
        mx: 'auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <IconButton onClick={prevSong} size="small" sx={{ color: 'text.primary' }}>
            <SkipPrevious />
          </IconButton>
          <IconButton
            onClick={togglePlay}
            sx={{
              mx: 2,
              color: 'text.primary',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={nextSong} size="small" sx={{ color: 'text.primary' }}>
            <SkipNext />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'right', mr: 1, color: 'text.secondary' }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            size="small"
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                width: 0,
                height: 0,
                transition: '0.2s',
              },
              '&:hover .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
              }
            }}
          />
          <Typography variant="caption" sx={{ minWidth: 40, ml: 1, color: 'text.secondary' }}>
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Volume - Hide on mobile */}
      {!isMobile && (
        <Box sx={{ width: '25%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box sx={{ width: 120, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 1, color: 'text.secondary' }}>
              {volume === 0 ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
            </Typography>
            <Slider
              size="small"
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              sx={{
                color: 'white',
                '& .MuiSlider-rail': { opacity: 0.3 }
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};