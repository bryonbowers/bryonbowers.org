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
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { MusicPlayer } from '../components/MusicPlayer';
import { Footer } from '../components/Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 'var(--player-height)' }}>
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

                    <Typography
                        variant="h5"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            fontFamily: 'Cinzel',
                            letterSpacing: '0.1em',
                            fontWeight: 700
                        }}
                    >
                        BRYON BOWERS
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
        </Box>
    );
};
