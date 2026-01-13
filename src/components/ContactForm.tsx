import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useFirestoreOperations } from '../hooks/useFirestore';
import { useCollection } from '../hooks/useFirestore';
import { Song } from '../types';
import { orderBy } from 'firebase/firestore';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    favoriteSongs: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: songs } = useCollection<Song>('songs', [orderBy('title')]);
  const { addDocument } = useFirestoreOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDocument('messages', {
        ...formData,
        timestamp: new Date().toISOString(),
        read: false,
        responded: false
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        favoriteSongs: []
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSongSelection = (event: any) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      favoriteSongs: typeof value === 'string' ? value.split(',') : value
    }));
  };

  if (success) {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Message Sent Successfully!
            </Typography>
            <Typography>
              Thank you for reaching out! Your message has been sent to Bryon Bowers and you should receive a response soon.
            </Typography>
          </Alert>
          <Button
            variant="outlined"
            onClick={() => setSuccess(false)}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Contact Bryon Bowers
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Share your thoughts about the music, request specific songs, or just say hello!
          Messages are sent directly to bryon.bowers@gmail.com.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Your Name"
            value={formData.name}
            onChange={handleChange('name')}
            sx={{ mb: 2 }}
          />

          <TextField
            required
            fullWidth
            type="email"
            label="Your Email"
            value={formData.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Subject (Optional)"
            value={formData.subject}
            onChange={handleChange('subject')}
            sx={{ mb: 2 }}
          />

          {songs && songs.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Favorite Songs (Optional)</InputLabel>
              <Select
                multiple
                value={formData.favoriteSongs}
                onChange={handleSongSelection}
                input={<OutlinedInput label="Favorite Songs (Optional)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const song = songs.find(s => s.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={song?.title || value} 
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {songs.map((song) => (
                  <MenuItem key={song.id} value={song.id}>
                    <Checkbox checked={formData.favoriteSongs.indexOf(song.id) > -1} />
                    <ListItemText primary={song.title} secondary={song.albumTitle} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            required
            fullWidth
            multiline
            rows={6}
            label="Your Message"
            value={formData.message}
            onChange={handleChange('message')}
            placeholder="Tell Bryon about your favorite songs, share your thoughts on his music, or ask any questions you have..."
            sx={{ mb: 3 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Send />}
              disabled={loading || !formData.name || !formData.email || !formData.message}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          Your message will be sent directly to bryon.bowers@gmail.com
        </Typography>
      </CardContent>
    </Card>
  );
};