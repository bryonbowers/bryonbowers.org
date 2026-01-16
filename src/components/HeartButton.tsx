import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { AuthModal } from './AuthModal';

interface HeartButtonProps {
  songId: string;
  songTitle: string;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const MotionIconButton = motion(IconButton);

export const HeartButton: React.FC<HeartButtonProps> = ({
  songId,
  songTitle,
  size = 'medium',
  showTooltip = true,
}) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const liked = isFavorite(songId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsAnimating(true);
    try {
      await toggleFavorite(songId, songTitle);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const iconSize = size === 'small' ? 18 : size === 'large' ? 28 : 22;

  const button = (
    <MotionIconButton
      onClick={handleClick}
      size={size}
      animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.3 }}
      sx={{
        color: liked ? '#ff4d6d' : 'rgba(255, 255, 255, 0.6)',
        '&:hover': {
          color: liked ? '#ff758f' : 'rgba(255, 255, 255, 0.9)',
          bgcolor: 'rgba(255, 77, 109, 0.1)',
        },
      }}
    >
      <AnimatePresence mode="wait">
        {liked ? (
          <motion.div
            key="filled"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Favorite sx={{ fontSize: iconSize }} />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FavoriteBorder sx={{ fontSize: iconSize }} />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionIconButton>
  );

  return (
    <>
      {showTooltip ? (
        <Tooltip title={liked ? 'Remove from favorites' : 'Add to favorites'} arrow>
          {button}
        </Tooltip>
      ) : (
        button
      )}

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
