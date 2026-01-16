import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  TableSortLabel,
  Collapse,
  IconButton,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ExpandMore, ExpandLess, Email as EmailIcon, Search as SearchIcon, Send as SendIcon } from '@mui/icons-material';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date | null;
  lastLoginAt: Date | null;
  provider: string;
}

interface SongFavorites {
  songId: string;
  songTitle: string;
  count: number;
}

interface Subscriber {
  id: string;
  email: string;
  displayName: string | null;
  subscribedAt: Date | null;
  source: string;
}

export const AdminPage: React.FC = () => {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [songFavorites, setSongFavorites] = useState<SongFavorites[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [usersExpanded, setUsersExpanded] = useState(false);
  const [subscribersExpanded, setSubscribersExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('News from Bryon Bowers');
  const [emailBody, setEmailBody] = useState('');
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);

  // Debug: Log admin status
  useEffect(() => {
    console.log('Admin Page - Auth state:', {
      authLoading,
      isAdmin,
      userEmail: user?.email,
      userId: user?.uid,
    });
  }, [authLoading, isAdmin, user]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      console.log('Not admin, redirecting to home');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) {
        console.log('Not admin, skipping data fetch');
        return;
      }

      console.log('Fetching admin data...');

      try {
        // Fetch all users
        const usersSnapshot = await getDocs(
          query(collection(db, 'users'), orderBy('createdAt', 'desc'))
        );
        const usersList: UserData[] = usersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            email: data.email || '',
            displayName: data.displayName || '',
            photoURL: data.photoURL || '',
            createdAt: data.createdAt?.toDate() || null,
            lastLoginAt: data.lastLoginAt?.toDate() || null,
            provider: data.provider || 'unknown',
          };
        });
        setUsers(usersList);
        console.log('Fetched users:', usersList.length);

        // Fetch all subscribers
        const subscribersSnapshot = await getDocs(
          query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'))
        );
        const subscribersList: Subscriber[] = subscribersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || '',
            displayName: data.displayName || null,
            subscribedAt: data.subscribedAt?.toDate() || null,
            source: data.source || 'unknown',
          };
        });
        setSubscribers(subscribersList);
        console.log('Fetched subscribers:', subscribersList.length);

        // Fetch all favorites
        const favoritesSnapshot = await getDocs(
          query(collection(db, 'favorites'), orderBy('createdAt', 'desc'))
        );

        // Group by song - just count, no user details needed
        const songMap = new Map<string, SongFavorites>();
        favoritesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const songId = data.songId;

          if (!songMap.has(songId)) {
            songMap.set(songId, {
              songId,
              songTitle: data.songTitle || `Song ${songId}`,
              count: 0,
            });
          }

          const song = songMap.get(songId)!;
          song.count++;
        });

        // Convert to array and sort by count
        const sortedSongs = Array.from(songMap.values()).sort(
          (a, b) => b.count - a.count
        );

        setSongFavorites(sortedSongs);
        console.log('Fetched favorites for songs:', sortedSongs.length);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin data. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleSort = () => {
    const newDirection = orderDirection === 'asc' ? 'desc' : 'asc';
    setOrderDirection(newDirection);

    const sorted = [...songFavorites].sort((a, b) =>
      newDirection === 'asc' ? a.count - b.count : b.count - a.count
    );
    setSongFavorites(sorted);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.displayName.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filter subscribers based on search
  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
    (sub.displayName || '').toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  // Open email compose dialog
  const handleEmailSubscribers = (useFiltered: boolean) => {
    const emailList = useFiltered ? filteredSubscribers : subscribers;
    const emails = emailList.map(s => s.email);
    setEmailRecipients(emails);
    setEmailSubject('News from Bryon Bowers');
    setEmailBody('');
    setEmailDialogOpen(true);
  };

  // Send the composed email via Gmail
  const handleSendEmail = () => {
    const bcc = emailRecipients.join(',');
    // Use Gmail compose URL directly
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(bcc)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
    setEmailDialogOpen(false);
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {authLoading ? 'Checking admin access...' : 'Loading dashboard...'}
        </Typography>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You must be logged in as an admin to view this page.
          <br />
          Current user: {user?.email || 'Not logged in'}
        </Alert>
      </Container>
    );
  }

  const totalFavorites = songFavorites.reduce((sum, song) => sum + song.count, 0);
  const totalUsers = users.length;
  const totalSubscribers = subscribers.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Cinzel',
          fontWeight: 700,
          mb: 4,
          letterSpacing: '0.05em',
        }}
      >
        ADMIN DASHBOARD
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper
          sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            flex: '1 1 150px',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff4d6d' }}>
            {totalFavorites}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Favorites
          </Typography>
        </Paper>

        <Paper
          onClick={() => setUsersExpanded(!usersExpanded)}
          sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            flex: '1 1 150px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#89CFF0' }}>
                {totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registered Users
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#89CFF0' }}>
              {usersExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Paper>

        <Paper
          onClick={() => setSubscribersExpanded(!subscribersExpanded)}
          sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            flex: '1 1 150px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#FFD700' }}>
                {totalSubscribers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subscribers
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#FFD700' }}>
              {subscribersExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            flex: '1 1 150px',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#90EE90' }}>
            {songFavorites.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Songs with Favorites
          </Typography>
        </Paper>
      </Box>

      {/* Users Section (Collapsible) */}
      <Collapse in={usersExpanded}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6">
              Registered Users
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Showing {filteredUsers.length} of {users.length}
              </Typography>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', mb: 4 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    User
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Provider
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Registered
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Last Login
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.uid}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={user.photoURL}
                          alt={user.displayName}
                          sx={{ width: 32, height: 32 }}
                        >
                          {user.displayName?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="body2">
                          {user.displayName || 'Unknown'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.provider}
                        size="small"
                        sx={{
                          bgcolor:
                            user.provider === 'google.com'
                              ? 'rgba(66, 133, 244, 0.2)'
                              : 'rgba(255, 255, 255, 0.1)',
                          color:
                            user.provider === 'google.com' ? '#4285F4' : 'white',
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {formatDate(user.lastLoginAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {userSearch ? 'No users match your search.' : 'No registered users yet.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>

      {/* Subscribers Section (Collapsible) */}
      <Collapse in={subscribersExpanded}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6">
              Newsletter Subscribers
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search subscribers..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Showing {filteredSubscribers.length} of {subscribers.length}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SendIcon />}
                onClick={() => handleEmailSubscribers(false)}
                disabled={subscribers.length === 0}
                sx={{
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  '&:hover': {
                    borderColor: '#FFD700',
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Email All ({subscribers.length})
              </Button>
              {subscriberSearch && filteredSubscribers.length !== subscribers.length && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={() => handleEmailSubscribers(true)}
                  disabled={filteredSubscribers.length === 0}
                  sx={{
                    bgcolor: '#FFD700',
                    color: 'black',
                    '&:hover': {
                      bgcolor: '#FFC000',
                    },
                  }}
                >
                  Email Filtered ({filteredSubscribers.length})
                </Button>
              )}
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', mb: 4 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Source
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Subscribed
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow
                    key={subscriber.id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                        <Typography variant="body2">
                          {subscriber.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {subscriber.displayName || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subscriber.source === 'logged_in' ? 'Logged In' : 'Anonymous'}
                        size="small"
                        sx={{
                          bgcolor:
                            subscriber.source === 'logged_in'
                              ? 'rgba(66, 133, 244, 0.2)'
                              : 'rgba(255, 255, 255, 0.1)',
                          color:
                            subscriber.source === 'logged_in' ? '#4285F4' : 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {formatDate(subscriber.subscribedAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredSubscribers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {subscriberSearch ? 'No subscribers match your search.' : 'No subscribers yet.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>

      {/* Favorites Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Favorites by Song
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Rank
              </TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Song Title
              </TableCell>
              <TableCell
                sx={{ color: 'text.secondary', fontWeight: 600 }}
                sortDirection={orderDirection}
              >
                <TableSortLabel
                  active
                  direction={orderDirection}
                  onClick={handleSort}
                  sx={{
                    '&.MuiTableSortLabel-root': { color: 'text.secondary' },
                    '&.MuiTableSortLabel-root:hover': { color: 'white' },
                    '&.Mui-active': { color: 'white' },
                  }}
                >
                  Favorites
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songFavorites.map((song, index) => (
              <TableRow
                key={song.songId}
                sx={{
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                }}
              >
                <TableCell>
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      bgcolor:
                        index === 0
                          ? 'gold'
                          : index === 1
                          ? 'silver'
                          : index === 2
                          ? '#cd7f32'
                          : 'rgba(255, 255, 255, 0.1)',
                      color: index < 3 ? 'black' : 'white',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{song.songTitle}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={
                      <Box
                        component="span"
                        sx={{ color: '#ff4d6d', fontSize: '14px', ml: 0.5 }}
                      >
                        ♥
                      </Box>
                    }
                    label={song.count}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 77, 109, 0.2)',
                      color: '#ff4d6d',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {songFavorites.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No favorites yet. Users will appear here when they start
                    liking songs.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Email Compose Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon sx={{ color: '#FFD700' }} />
            <Typography variant="h6">
              Compose Email to {emailRecipients.length} Subscriber{emailRecipients.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
            }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={8}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Write your message here..."
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Recipients (BCC): {emailRecipients.slice(0, 3).join(', ')}
            {emailRecipients.length > 3 && ` and ${emailRecipients.length - 3} more...`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button
            onClick={() => setEmailDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendEmail}
            disabled={!emailSubject.trim()}
            sx={{
              bgcolor: '#FFD700',
              color: 'black',
              '&:hover': {
                bgcolor: '#FFC000',
              },
            }}
          >
            Open in Gmail
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
