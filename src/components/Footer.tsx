import React from 'react';
import { Box, Container, Typography, IconButton, Grid, Link as MuiLink } from '@mui/material';
import { Instagram, Twitter, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <Instagram />, url: 'https://instagram.com/elonsakdsh', label: 'Instagram' },
        { icon: <Twitter />, url: 'https://twitter.com/elonsakdsh', label: 'Twitter' },
        { icon: <YouTube />, url: 'https://youtube.com/@BryonBowersMindStream', label: 'YouTube' },
    ];

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

                    {/* Social Links */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                            {socialLinks.map((social) => (
                                <IconButton
                                    key={social.label}
                                    component="a"
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    sx={{
                                        color: 'text.secondary',
                                        transition: 'color 0.3s',
                                        '&:hover': { color: 'white' },
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
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
            </Container>
        </Box>
    );
};
