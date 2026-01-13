import React from 'react';
import { Box, Typography, Container, Grid, Button, Card, CardContent } from '@mui/material';
import { Hero } from '../components/Hero';
import { ArrowForward, PlayArrow, MenuBook, FormatQuote } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const HomePage: React.FC = () => {
  return (
    <Box>
      <Hero />

      {/* The Sound Section */}
      <Container maxWidth="lg" className="section">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1598518142144-8cb554ac8253?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Bryon performing"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 0,
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.3s ease',
                  '&:hover': {
                    filter: 'grayscale(0%)'
                  }
                }}
              />
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" gutterBottom>
                THE SOUND
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Exploring the depths of emotion through sonic landscapes.
                Bryon Bowers brings a unique fusion of raw lyrical power and melodic intricacy.
              </Typography>
              <Button
                component={Link}
                to="/music"
                endIcon={<ArrowForward />}
                sx={{
                  mt: 2,
                  color: 'white',
                  borderBottom: '1px solid white',
                  borderRadius: 0,
                  px: 0,
                  '&:hover': {
                    bgcolor: 'transparent',
                    opacity: 0.7
                  }
                }}
              >
                Explore Discography
              </Button>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', letterSpacing: '0.2em', mb: 2, display: 'block' }}
                >
                  THE ARTIST
                </Typography>
                <Typography variant="h3" gutterBottom>
                  THE DEAD FISH POET
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Bryon Bowers - The Dead Fish Poet - is a multifaceted artist whose work transcends
                  traditional boundaries between music and poetry. With a voice that carries the weight
                  of lived experience and a pen that captures the human condition in its rawest form.
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Drawing inspiration from personal journey, social commentary, and the universal
                  search for meaning, each piece is crafted with intention and authenticity.
                </Typography>
                <Button
                  component={Link}
                  to="/contact"
                  endIcon={<ArrowForward />}
                  sx={{
                    mt: 2,
                    color: 'white',
                    borderBottom: '1px solid white',
                    borderRadius: 0,
                    px: 0,
                    '&:hover': {
                      bgcolor: 'transparent',
                      opacity: 0.7
                    }
                  }}
                >
                  Get in Touch
                </Button>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Bryon Bowers portrait"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 0,
                    filter: 'grayscale(100%)',
                    transition: 'filter 0.3s ease',
                    '&:hover': {
                      filter: 'grayscale(0%)'
                    }
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Quote Section */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FormatQuote sx={{ fontSize: 60, color: 'rgba(255,255,255,0.1)', transform: 'rotate(180deg)' }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Cinzel',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'text.secondary',
              my: 3,
            }}
          >
            "Music is the language of the soul, poetry is its translation for the mind."
          </Typography>
          <Typography variant="body2" sx={{ letterSpacing: '0.2em', color: 'text.secondary' }}>
            — BRYON BOWERS
          </Typography>
        </MotionBox>
      </Container>

      {/* Quick Links Section */}
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card
                  component={Link}
                  to="/music"
                  sx={{
                    bgcolor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'white',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <PlayArrow sx={{ fontSize: 40, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h5" gutterBottom>
                      LISTEN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Explore the full discography and discover new sounds
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  component={Link}
                  to="/poems"
                  sx={{
                    bgcolor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'white',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <MenuBook sx={{ fontSize: 40, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h5" gutterBottom>
                      READ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dive into poetry that speaks to the soul
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  component={Link}
                  to="/contact"
                  sx={{
                    bgcolor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'white',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <ArrowForward sx={{ fontSize: 40, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h5" gutterBottom>
                      CONNECT
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reach out for collaborations and inquiries
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};