import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './styles/main.css';

import { MainLayout } from './components/MainLayout';
import { MusicPage } from './pages/MusicPage';
import { PoemsPage } from './pages/PoemsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { MusicProvider } from './context/MusicContext';
// import { useAuth } from './hooks/useAuth'; // Preserving Auth if needed later

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#333333',
    },
    background: {
      default: '#0a0a0a',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h2: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h3: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h4: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h5: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h6: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MusicProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<MusicPage />} />
              <Route path="/song/:songId" element={<MusicPage />} />
              <Route path="/poems" element={<PoemsPage />} />
              <Route path="/poem/:poemId" element={<PoemsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </MainLayout>
        </Router>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;