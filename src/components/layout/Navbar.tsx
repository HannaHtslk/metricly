import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  useTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { signOut } from '../../firebase/firebase';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Users', to: '/users' },
  { label: 'Analytics', to: '/analytics' },
];

const Navbar = ({ onToggleTheme }: NavbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSignOut = async () => {
    setAnchorEl(null);
    await signOut();
    navigate('/login');
  };

  const avatarLetter = user?.displayName?.[0] ?? user?.email?.[0] ?? '?';

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
          Metricly
        </Typography>

        <Box display="flex" gap={1} flexGrow={1}>
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                padding: '4px 8px',
                borderRadius: theme.shape.borderRadius,
              })}
            >
              {label}
            </NavLink>
          ))}
        </Box>

        <Tooltip title="Toggle theme">
          <IconButton onClick={onToggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={user?.displayName ?? user?.email ?? ''}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
            <Avatar
              src={user?.photoURL ?? undefined}
              sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}
            >
              {avatarLetter.toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
