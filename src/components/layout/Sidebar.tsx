import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { signOut } from '../../firebase/firebase';
import { useAuth } from '../../hooks/useAuth';

export const DRAWER_WIDTH = 240;
export const MINI_WIDTH = 64;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Users', to: '/users', icon: <PeopleRoundedIcon /> },
  { label: 'Analytics', to: '/analytics', icon: <BarChartRoundedIcon /> },
];

interface SidebarProps {
  open: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
  onToggleTheme: () => void;
}

const Sidebar = ({ open, mobileOpen, onToggle, onMobileClose, onToggleTheme }: SidebarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const avatarLetter = (user?.displayName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();
  const displayName = user?.displayName ?? user?.email ?? '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const drawerContent = (isMobile: boolean) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Brand header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open || isMobile ? 'space-between' : 'center',
          px: open || isMobile ? 2 : 0,
          py: 1.5,
          minHeight: 56,
        }}
      >
        {(open || isMobile) && (
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: 'common.white',
              letterSpacing: '-0.5px',
            }}
          >
            Metricly
          </Typography>
        )}
        {!isMobile && (
          <Tooltip title={open ? 'Collapse' : 'Expand'} placement="right">
            <IconButton
              onClick={onToggle}
              size="small"
              sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'common.white' } }}
            >
              {open ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Nav links */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map(({ label, to, icon }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Tooltip
                title={!open && !isMobile ? label : ''}
                placement="right"
                disableHoverListener={open || isMobile}
              >
                <ListItemButton
                  sx={{
                    justifyContent: open || isMobile ? 'flex-start' : 'center',
                    px: open || isMobile ? 2 : 1,
                    py: 1,
                    ...(isActive && {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      borderRadius: '0 8px 8px 0',
                      ml: 0,
                    }),
                    ...(!isActive && {
                      ml: '3px',
                    }),
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.07)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open || isMobile ? 36 : 'auto',
                      color: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {(open || isMobile) && (
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.85)',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Bottom: theme toggle */}
      <Box sx={{ px: open || isMobile ? 1 : 0, py: 0.5 }}>
        <Tooltip title={!open && !isMobile ? 'Toggle theme' : ''} placement="right" disableHoverListener={open || isMobile}>
          <ListItemButton
            onClick={onToggleTheme}
            sx={{
              justifyContent: open || isMobile ? 'flex-start' : 'center',
              px: open || isMobile ? 2 : 1,
              py: 1,
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open || isMobile ? 36 : 'auto',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            {(open || isMobile) && (
              <ListItemText
                primary={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.85)',
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Bottom: user info + logout */}
      <Box
        sx={{
          px: open || isMobile ? 1.5 : 0,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open || isMobile ? 'space-between' : 'center',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Avatar
            src={user?.photoURL ?? undefined}
            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem', flexShrink: 0 }}
          >
            {avatarLetter}
          </Avatar>
          {(open || isMobile) && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Typography>
          )}
        </Box>

        <Tooltip title="Sign out" placement={open || isMobile ? 'top' : 'right'}>
          <IconButton
            onClick={handleSignOut}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, '&:hover': { color: 'common.white' } }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : MINI_WIDTH,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {drawerContent(false)}
      </Drawer>

      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent(true)}
      </Drawer>
    </>
  );
};

export default Sidebar;
