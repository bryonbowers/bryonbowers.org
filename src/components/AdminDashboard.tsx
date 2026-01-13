import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MusicNote as Music,
  Book,
  Message
} from '@mui/icons-material';
import { useCollection, useFirestoreOperations } from '../hooks/useFirestore';
import { Song, Poem, ContactMessage } from '../types';
import { orderBy } from 'firebase/firestore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [songDialog, setSongDialog] = useState<{ open: boolean; song?: Song }>({ open: false });
  const [poemDialog, setPoemDialog] = useState<{ open: boolean; poem?: Poem }>({ open: false });
  const [newSong, setNewSong] = useState({
    title: '',
    artistName: 'Bryon Bowers',
    albumTitle: '',
    duration: 0,
    audioUrl: '',
    coverImageUrl: '',
    releaseDate: new Date().toISOString().split('T')[0],
    genre: [] as string[],
    description: ''
  });
  const [newPoem, setNewPoem] = useState({
    title: '',
    content: '',
    author: 'Bryon Bowers'
  });

  const { data: songs, loading: songsLoading } = useCollection<Song>('songs', [orderBy('releaseDate', 'desc')]);
  const { data: poems, loading: poemsLoading } = useCollection<Poem>('poems', [orderBy('createdAt', 'desc')]);
  const { data: messages, loading: messagesLoading } = useCollection<ContactMessage>('messages', [orderBy('timestamp', 'desc')]);

  const { addDocument, updateDocument, deleteDocument } = useFirestoreOperations();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSong = async () => {
    try {
      const songData = {
        ...newSong,
        duration: Number(newSong.duration),
        plays: 0,
        metadata: {
          format: 'mp3',
          bitrate: 320,
          sampleRate: 44100
        }
      };

      if (songDialog.song) {
        await updateDocument('songs', songDialog.song.id, songData);
      } else {
        await addDocument('songs', songData);
      }

      setSongDialog({ open: false });
      setNewSong({
        title: '',
        artistName: 'Bryon Bowers',
        albumTitle: '',
        duration: 0,
        audioUrl: '',
        coverImageUrl: '',
        releaseDate: new Date().toISOString().split('T')[0],
        genre: [],
        description: ''
      });
    } catch (error) {
      console.error('Error saving song:', error);
    }
  };

  const handleSavePoem = async () => {
    try {
      if (poemDialog.poem) {
        await updateDocument('poems', poemDialog.poem.id, newPoem);
      } else {
        await addDocument('poems', newPoem);
      }

      setPoemDialog({ open: false });
      setNewPoem({
        title: '',
        content: '',
        author: 'Bryon Bowers'
      });
    } catch (error) {
      console.error('Error saving poem:', error);
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      await deleteDocument('songs', id);
    }
  };

  const handleDeletePoem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this poem?')) {
      await deleteDocument('poems', id);
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    await updateDocument('messages', id, { read: true });
  };

  const openSongDialog = (song?: Song) => {
    if (song) {
      setNewSong({
        title: song.title,
        artistName: song.artistName,
        albumTitle: song.albumTitle || '',
        duration: song.duration,
        audioUrl: song.audioUrl,
        coverImageUrl: song.coverImageUrl || '',
        releaseDate: song.releaseDate,
        genre: song.genre || [],
        description: song.description || ''
      });
    }
    setSongDialog({ open: true, song });
  };

  const openPoemDialog = (poem?: Poem) => {
    if (poem) {
      setNewPoem({
        title: poem.title,
        content: poem.content,
        author: poem.author
      });
    }
    setPoemDialog({ open: true, poem });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Music />} label="Songs" />
          <Tab icon={<Book />} label="Poems" />
          <Tab icon={<Message />} label="Messages" />
        </Tabs>
      </Box>

      {/* Songs Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Manage Songs</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openSongDialog()}
          >
            Add Song
          </Button>
        </Box>

        {songsLoading ? (
          <Typography>Loading songs...</Typography>
        ) : (
          <List>
            {songs?.map((song) => (
              <Card key={song.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={song.title}
                    secondary={`${song.artistName} • ${song.albumTitle} • ${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => openSongDialog(song)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSong(song.id)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Poems Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Manage Poems</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openPoemDialog()}
          >
            Add Poem
          </Button>
        </Box>

        {poemsLoading ? (
          <Typography>Loading poems...</Typography>
        ) : (
          <List>
            {poems?.map((poem) => (
              <Card key={poem.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={poem.title}
                    secondary={`by ${poem.author} • ${new Date(poem.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => openPoemDialog(poem)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePoem(poem.id)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Messages Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" sx={{ mb: 3 }}>Contact Messages</Typography>

        {messagesLoading ? (
          <Typography>Loading messages...</Typography>
        ) : (
          <List>
            {messages?.map((message) => (
              <Card key={message.id} sx={{ mb: 2, bgcolor: message.read ? 'grey.50' : 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">{message.name}</Typography>
                    <Box>
                      {!message.read && (
                        <Chip label="New" color="primary" size="small" sx={{ mr: 1 }} />
                      )}
                      <Button
                        size="small"
                        onClick={() => handleMarkMessageRead(message.id)}
                        disabled={message.read}
                      >
                        Mark Read
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {message.email} • {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                  {message.subject && (
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {message.subject}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {message.message}
                  </Typography>
                  {message.favoriteSongs && message.favoriteSongs.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Favorite Songs: {message.favoriteSongs.join(', ')}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Song Dialog */}
      <Dialog open={songDialog.open} onClose={() => setSongDialog({ open: false })} maxWidth="md" fullWidth>
        <DialogTitle>{songDialog.song ? 'Edit Song' : 'Add New Song'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Song Title"
            fullWidth
            variant="outlined"
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Artist Name"
            fullWidth
            variant="outlined"
            value={newSong.artistName}
            onChange={(e) => setNewSong({ ...newSong, artistName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Album Title"
            fullWidth
            variant="outlined"
            value={newSong.albumTitle}
            onChange={(e) => setNewSong({ ...newSong, albumTitle: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Duration (seconds)"
            type="number"
            fullWidth
            variant="outlined"
            value={newSong.duration}
            onChange={(e) => setNewSong({ ...newSong, duration: Number(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Audio URL"
            fullWidth
            variant="outlined"
            value={newSong.audioUrl}
            onChange={(e) => setNewSong({ ...newSong, audioUrl: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Cover Image URL"
            fullWidth
            variant="outlined"
            value={newSong.coverImageUrl}
            onChange={(e) => setNewSong({ ...newSong, coverImageUrl: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Release Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newSong.releaseDate}
            onChange={(e) => setNewSong({ ...newSong, releaseDate: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newSong.description}
            onChange={(e) => setNewSong({ ...newSong, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSongDialog({ open: false })}>Cancel</Button>
          <Button onClick={handleSaveSong} variant="contained">
            {songDialog.song ? 'Update' : 'Add'} Song
          </Button>
        </DialogActions>
      </Dialog>

      {/* Poem Dialog */}
      <Dialog open={poemDialog.open} onClose={() => setPoemDialog({ open: false })} maxWidth="md" fullWidth>
        <DialogTitle>{poemDialog.poem ? 'Edit Poem' : 'Add New Poem'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Poem Title"
            fullWidth
            variant="outlined"
            value={newPoem.title}
            onChange={(e) => setNewPoem({ ...newPoem, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            variant="outlined"
            value={newPoem.author}
            onChange={(e) => setNewPoem({ ...newPoem, author: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Poem Content"
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            value={newPoem.content}
            onChange={(e) => setNewPoem({ ...newPoem, content: e.target.value })}
            placeholder="Enter the poem content here. Use line breaks to separate verses."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPoemDialog({ open: false })}>Cancel</Button>
          <Button onClick={handleSavePoem} variant="contained">
            {poemDialog.poem ? 'Update' : 'Add'} Poem
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};