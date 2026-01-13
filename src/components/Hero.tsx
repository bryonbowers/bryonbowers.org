import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    return (
        <Box
            sx={{
                height: '80vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Placeholder background - replace with artist image
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center', color: 'white' }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontSize: { xs: '3rem', md: '5rem' },
                        mb: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        className: 'fade-in'
                    }}
                >
                    BRYON BOWERS
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 4,
                        fontWeight: 300,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase'
                    }}
                >
                    The Dead Fish Poet
                </Typography>
                <Button
                    component={Link}
                    to="/music"
                    variant="outlined"
                    color="inherit"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                        py: 1.5,
                        px: 4,
                        borderColor: 'white',
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                            bgcolor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    Listen Now
                </Button>
            </Container>
        </Box>
    );
};
