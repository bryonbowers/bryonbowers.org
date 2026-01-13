import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { Poem } from '../types';
import { motion } from 'framer-motion';

interface PoemDisplayProps {
  poem: Poem;
  compact?: boolean;
}

const MotionBox = motion(Box);

export const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, compact = false }) => {
  const formatPoemContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <Typography
        key={index}
        variant={compact ? "body2" : "body1"}
        component="p"
        sx={{
          mb: line.trim() === '' ? 2 : 0.5,
          textAlign: 'left',
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontStyle: line.trim().startsWith('—') ? 'italic' : 'normal',
          color: 'text.secondary',
          lineHeight: 1.8,
        }}
      >
        {line || '\u00A0'}
      </Typography>
    ));
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        mb: 4,
        p: compact ? 3 : 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        bgcolor: 'rgba(255, 255, 255, 0.02)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          bgcolor: 'rgba(255, 255, 255, 0.03)',
        },
      }}
    >
      {/* Title */}
      <Typography
        variant={compact ? "h5" : "h4"}
        component="h3"
        sx={{
          fontFamily: 'Cinzel',
          fontWeight: 700,
          mb: 3,
          letterSpacing: '0.05em',
        }}
      >
        {poem.title.toUpperCase()}
      </Typography>

      {/* Content */}
      <Box sx={{
        mb: 3,
        maxHeight: compact ? '200px' : 'none',
        overflow: compact ? 'hidden' : 'visible',
        position: 'relative',
        pl: 2,
        borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
      }}>
        {formatPoemContent(poem.content)}
        {compact && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'linear-gradient(transparent, var(--bg-color))',
            pointerEvents: 'none'
          }} />
        )}
      </Box>

      {/* Meta */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pt: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {poem.author}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(poem.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>
    </MotionBox>
  );
};
