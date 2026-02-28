import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Sidebar, { DRAWER_WIDTH, MINI_WIDTH } from './Sidebar';

interface AppLayoutProps {
  onToggleTheme: () => void;
}

const AppLayout = ({ onToggleTheme }: AppLayoutProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        onToggle={() => setOpen((o) => !o)}
        onMobileClose={() => setMobileOpen(false)}
        onToggleTheme={onToggleTheme}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${open ? DRAWER_WIDTH : MINI_WIDTH}px` },
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Mobile top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { md: 'none' },
            backdropFilter: 'blur(8px)',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>
              Metricly
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
