import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Link as MuiLink,
  Snackbar,
  Alert,
} from '@mui/material';
import { Email, Instagram, Twitter, YouTube, Send, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const ContactPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In production, this would submit to a backend/newsletter service
      setSubscribed(true);
      setShowSnackbar(true);
      setEmail('');
    }
  };

  const socialLinks = [
    { icon: <Instagram sx={{ fontSize: 28 }} />, label: 'Instagram', url: 'https://instagram.com/elonsakdsh' },
    { icon: <Twitter sx={{ fontSize: 28 }} />, label: 'Twitter', url: 'https://twitter.com/elonsakdsh' },
    { icon: <YouTube sx={{ fontSize: 28 }} />, label: 'YouTube', url: 'https://youtube.com/@BryonBowersMindStream' },
  ];

  return (
    <Container maxWidth="md" className="section fade-in">
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: 'center', mb: 8 }}
      >
        <Typography variant="h2" gutterBottom>
          CONTACT
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 300,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          Let's create something meaningful together
        </Typography>
      </MotionBox>

      {/* Main Contact Box */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{
          textAlign: 'center',
          p: 6,
          border: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(255,255,255,0.02)',
          mb: 6,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', letterSpacing: '0.2em', mb: 2, display: 'block' }}
        >
          MANAGEMENT & INQUIRIES
        </Typography>

        <Box sx={{ my: 4 }}>
          <Email sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
          <Typography variant="h4" sx={{ wordBreak: 'break-word' }}>
            <MuiLink
              href="mailto:bryon.bowers@gmail.com"
              color="inherit"
              underline="none"
              sx={{
                fontWeight: 700,
                transition: 'opacity 0.3s',
                '&:hover': { opacity: 0.7 },
              }}
            >
              bryon.bowers@gmail.com
            </MuiLink>
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          For booking, collaborations, press inquiries, or just to say hello —
          reach out directly via email.
        </Typography>
      </MotionBox>

      {/* Newsletter Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{
          p: 6,
          border: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(255,255,255,0.02)',
          mb: 6,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            STAY CONNECTED
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Subscribe to receive updates on new music, poetry, and upcoming events
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubscribe}
          sx={{
            display: 'flex',
            gap: 2,
            maxWidth: 500,
            mx: 'auto',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="outlined"
            endIcon={subscribed ? <CheckCircle /> : <Send />}
            sx={{
              borderRadius: 0,
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              minWidth: { xs: '100%', sm: 'auto' },
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </Box>
      </MotionBox>

      {/* Social Links */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            letterSpacing: '0.2em',
            textAlign: 'center',
            display: 'block',
            mb: 4,
          }}
        >
          FOLLOW ALONG
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {socialLinks.map((social) => (
            <Grid item key={social.label}>
              <Box
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  p: 3,
                  border: '1px solid transparent',
                  '&:hover': {
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.1)',
                    bgcolor: 'rgba(255,255,255,0.02)',
                  },
                }}
              >
                {social.icon}
                <Typography
                  variant="caption"
                  sx={{ mt: 1, letterSpacing: '0.15em' }}
                >
                  {social.label.toUpperCase()}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Snackbar for subscription confirmation */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            '& .MuiAlert-icon': { color: 'white' },
          }}
        >
          Thanks for subscribing! You'll hear from us soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};
