import React from 'react';
import { Box, Container, Typography, IconButton, Grid, Link as MuiLink } from '@mui/material';
import { Instagram, Twitter, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { text: 'Music', path: '/' },
        { text: 'Poems', path: '/poems' },
        { text: 'Contact', path: '/contact' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'var(--bg-secondary)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                py: 6,
                mt: 'auto',
                mb: 'var(--player-height)', // Space for the fixed music player
                position: 'relative',
                zIndex: 1,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                    {/* Brand */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'Cinzel',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                mb: 1,
                            }}
                        >
                            BRYON BOWERS
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            The Dead Fish Poet
                        </Typography>
                    </Grid>

                    {/* Navigation */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 3, flexWrap: 'wrap' }}>
                            {navLinks.map((link) => (
                                <Typography
                                    key={link.path}
                                    component={Link}
                                    to={link.path}
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'none',
                                        letterSpacing: '0.05em',
                                        transition: 'color 0.3s',
                                        '&:hover': { color: 'white' },
                                    }}
                                >
                                    {link.text.toUpperCase()}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>

                </Grid>

                {/* Copyright */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        &copy; {currentYear} Bryon Bowers. All rights reserved.
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <MuiLink
                            href="mailto:bryon.bowers@gmail.com"
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                fontSize: '0.75rem',
                                '&:hover': { color: 'white' },
                            }}
                        >
                            bryon.bowers@gmail.com
                        </MuiLink>
                    </Box>
                </Box>

                {/* Follow Section - Bottom right */}
                <Box sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1.5,
                }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Follow:
                    </Typography>
                    {/* Instagram */}
                    <IconButton
                        component="a"
                        href="https://instagram.com/elonsakdsh"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        title="Follow on Instagram"
                        sx={{
                            color: '#E4405F',
                            bgcolor: 'rgba(228, 64, 95, 0.1)',
                            '&:hover': { bgcolor: 'rgba(228, 64, 95, 0.2)' },
                        }}
                    >
                        <Instagram sx={{ fontSize: 20 }} />
                    </IconButton>
                    {/* Twitter/X */}
                    <IconButton
                        component="a"
                        href="https://twitter.com/elonsakdsh"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        title="Follow on X"
                        sx={{
                            color: '#1DA1F2',
                            bgcolor: 'rgba(29, 161, 242, 0.1)',
                            '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.2)' },
                        }}
                    >
                        <Twitter sx={{ fontSize: 20 }} />
                    </IconButton>
                    {/* Spotify */}
                    <IconButton
                        component="a"
                        href="https://open.spotify.com/artist/1hKZRgd8uxrTAPFcxoad7u"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        title="Follow on Spotify"
                        sx={{
                            color: '#1DB954',
                            bgcolor: 'rgba(29, 185, 84, 0.1)',
                            '&:hover': { bgcolor: 'rgba(29, 185, 84, 0.2)' },
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                    </IconButton>
                    {/* YouTube */}
                    <IconButton
                        component="a"
                        href="https://www.youtube.com/channel/UCv4yflWc567jvsh238l4frw?sub_confirmation=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        title="Subscribe on YouTube"
                        sx={{
                            color: '#FF0000',
                            bgcolor: 'rgba(255, 0, 0, 0.1)',
                            '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.2)' },
                        }}
                    >
                        <YouTube sx={{ fontSize: 20 }} />
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
                            bgcolor: 'rgba(252, 60, 68, 0.1)',
                            '&:hover': { bgcolor: 'rgba(252, 60, 68, 0.2)' },
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.401-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.384-2.16-1.213-.376-.83-.238-1.81.465-2.47.396-.37.874-.605 1.407-.716.323-.067.653-.12.98-.18.406-.073.77-.244.98-.632.096-.176.134-.374.134-.578V8.09c0-.237-.063-.453-.266-.6-.12-.088-.257-.12-.4-.098-.203.03-.404.07-.603.113-.747.158-1.493.32-2.24.477l-3.037.643-.016.004c-.294.063-.587.134-.838.316-.251.183-.4.444-.438.76-.012.1-.015.2-.015.3v7.592c0 .39-.047.778-.215 1.138-.278.6-.744.988-1.378 1.18-.34.104-.69.16-1.048.183-.952.06-1.82-.335-2.22-1.188-.4-.852-.243-1.876.507-2.53.39-.34.85-.567 1.355-.675.378-.082.76-.144 1.14-.216.36-.068.66-.2.873-.504.147-.21.19-.448.19-.696V6.942c0-.317.058-.622.237-.895.236-.363.58-.575.994-.67.334-.076.672-.133 1.008-.2l2.836-.6c.954-.202 1.91-.404 2.865-.605l1.78-.376c.163-.034.328-.063.494-.08.32-.035.596.087.788.338.107.14.17.3.193.47.013.095.017.19.017.287v4.503z"/>
                        </svg>
                    </IconButton>
                </Box>
            </Container>
        </Box>
    );
};
