import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  NotificationsNone,
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/workers': 'Team Members',
  '/salary': 'Salary Overview',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function Topbar() {
  const { settings, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const currentTitle = pageTitles[location.pathname] || 'WorkLedger';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 2,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {currentTitle}
        </Typography>
        <Chip
          label={isAdmin ? 'Admin' : 'Viewer'}
          size="small"
          color={isAdmin ? 'primary' : 'default'}
          sx={{
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <NotificationsNone />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
            {settings.theme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
