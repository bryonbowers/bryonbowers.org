import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { Menu as MenuIcon, AdminPanelSettings } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { MusicPlayer } from '../components/MusicPlayer';
import { Footer } from '../components/Footer';
import { UserMenu } from '../components/UserMenu';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { text: 'Music', path: '/' },
        { text: 'Poems', path: '/poems' },
        { text: 'Contact', path: '/contact' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', bgcolor: 'var(--bg-secondary)', height: '100%', color: 'white' }}>
            <Typography variant="h6" sx={{ my: 2, fontFamily: 'Cinzel' }}>
                BRYON BOWERS
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontFamily: 'Montserrat' } }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'Cinzel',
                                letterSpacing: '0.1em',
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
                        >
                            BRYON BOWERS
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontStyle: 'italic',
                                opacity: 0.7,
                                letterSpacing: '0.05em',
                            }}
                        >
                            The Dead Fish Poet
                        </Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                        <Box>
                            {navItems.map((item) => (
                                <Button
                                    key={item.text}
                                    component={Link}
                                    to={item.path}
                                    color="inherit"
                                    sx={{
                                        mx: 1,
                                        fontFamily: 'Montserrat',
                                        opacity: location.pathname === item.path ? 1 : 0.7,
                                        borderBottom: location.pathname === item.path ? '1px solid white' : 'none',
                                        borderRadius: 0,
                                        '&:hover': { opacity: 1 }
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#89CFF0',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                            }}
                        >
                            poems=me, lyrics=me, composition=me+ai, voice+instrument=ai
                        </Typography>
                        <Typography
                            variant="caption"
                            component="a"
                            href="https://a3austin.org/donate/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'block',
                                color: '#89CFF0',
                                fontSize: '0.75rem',
                                letterSpacing: '0.05em',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            [ donate to local artists ]
                        </Typography>
                    </Box>

                    {/* Admin Button - only show for admin users */}
                    {isAdmin && (
                        <IconButton
                            component={Link}
                            to="/admin"
                            sx={{
                                ml: 1,
                                color: '#89CFF0',
                                '&:hover': {
                                    bgcolor: 'rgba(137, 207, 240, 0.1)',
                                },
                            }}
                            title="Admin Dashboard"
                        >
                            <AdminPanelSettings />
                        </IconButton>
                    )}

                    {/* Login/User Menu */}
                    <Box sx={{ ml: 1 }}>
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setShowAuthModal(true)}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    },
                                }}
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
                {children}
            </Box>

            <Footer />
            <MusicPlayer />

            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </Box>
    );
};
