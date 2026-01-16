import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export const UserMenu: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  const handleAdminClick = () => {
    handleClose();
    navigate('/admin');
  };

  if (!user) return null;

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0.5 }}>
        <Avatar
          src={user.photoURL || undefined}
          alt={user.displayName || 'User'}
          sx={{
            width: 36,
            height: 36,
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-secondary)',
            color: 'white',
            mt: 1,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              py: 1.5,
            },
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user.displayName || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Favorites count */}
        <MenuItem disabled sx={{ opacity: 0.7 }}>
          <ListItemIcon>
            <FavoriteIcon sx={{ color: '#ff4d6d', fontSize: 20 }} />
          </ListItemIcon>
          <Typography variant="body2">
            {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
          </Typography>
        </MenuItem>

        {/* Admin link - only for admin */}
        {isAdmin && (
          <MenuItem onClick={handleAdminClick}>
            <ListItemIcon>
              <AdminIcon sx={{ color: '#89CFF0', fontSize: 20 }} />
            </ListItemIcon>
            <Typography variant="body2">Admin Dashboard</Typography>
          </MenuItem>
        )}

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Logout */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'grey.400', fontSize: 20 }} />
          </ListItemIcon>
          <Typography variant="body2">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
