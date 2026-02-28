import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Sidebar from './Sidebar';

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
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        {/* Mobile top bar */}
        <AppBar
          position="sticky"
          color="default"
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
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              Metricly
            </Typography>
            {/* Theme toggle visible on mobile — sidebar toggle is hidden at xs/sm */}
            <IconButton color="inherit" onClick={onToggleTheme} aria-label="Toggle colour theme">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
