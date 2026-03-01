import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { signInWithEmail, signInWithGoogle, registerWithEmail } from '../../firebase/firebase';
import { useAuth } from '../../hooks/useAuth';

const FEATURES = [
  {
    icon: <BarChartRoundedIcon />,
    title: 'Visual Analytics',
    desc: 'Beautiful charts and dashboards that make data instantly understandable.',
  },
  {
    icon: <PeopleRoundedIcon />,
    title: 'User Insights',
    desc: 'Browse, filter, and analyze your entire user base in one place.',
  },
  {
    icon: <BoltRoundedIcon />,
    title: 'Real-time Data',
    desc: 'Live metrics that update as your users interact with your product.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleToggle = () => {
    setIsRegistering((prev) => !prev);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch {
      setError(
        isRegistering
          ? 'Registration failed. This email may already be in use.'
          : 'Invalid email or password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* ── Left branding panel ─────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          flex: '0 0 50%',
          px: 8,
          py: 6,
          cursor: 'default',
          background: 'linear-gradient(145deg, #18181b 55%, #1e1b4b 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ color: 'common.white', mb: 1, letterSpacing: '-1px' }}
        >
          Metricly
        </Typography>

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: 'common.white', mb: 1.5, lineHeight: 1.25, maxWidth: 380 }}
        >
          Analytics made simple.
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.5)', mb: 6, maxWidth: 360, lineHeight: 1.7 }}
        >
          Everything you need to understand your product, your users, and your
          growth — in one clean dashboard.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <Box
              key={title}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(4px)',
                cursor: 'default',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'scale(1.025)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 0 20px rgba(255,255,255,0.1)',
                },
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'rgba(99,102,241,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                }}
              >
                {icon}
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: 'common.white', mb: 0.3 }}
                >
                  {title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  {desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right sign-in panel ──────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 6 },
          bgcolor: 'background.default',
          overflowY: 'auto',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'default',
          }}
        >
          {/* Mobile-only logo */}
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ display: { md: 'none' }, mb: 2.5, color: 'primary.main' }}
          >
            Metricly
          </Typography>

          <Typography variant="h5" fontWeight={700} mb={0.5}>
            {isRegistering ? 'Create an account' : 'Welcome back'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {isRegistering
              ? 'Sign up to access your dashboard'
              : 'Sign in to access your dashboard'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{ py: 1.5, mb: 3 }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              {isRegistering ? 'or register with email' : 'or sign in with email'}
            </Typography>
          </Divider>

          <Box
            component="form"
            onSubmit={handleEmailSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {isRegistering && (
              <TextField
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                autoComplete="name"
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 0.5 }}
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center" mt={2.5}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Typography
              component="span"
              variant="body2"
              color="primary"
              fontWeight={600}
              onClick={handleToggle}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {isRegistering ? 'Sign in' : 'Create one'}
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandingPage;
