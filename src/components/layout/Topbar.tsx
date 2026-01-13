import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  NotificationsNone,
  Menu as MenuIcon,
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
  '/calendar': 'Calendar',
  '/settings': 'Settings',
};

export function Topbar() {
  const { settings, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const currentTitle = pageTitles[location.pathname] || 'WorkLedger';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, sm: 2 },
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%',
        gap: { xs: 1, sm: 2 },
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, minWidth: 0, flex: 1 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {currentTitle}
        </Typography>
        <Chip
          label={isAdmin ? 'Admin' : 'Viewer'}
          size="small"
          color={isAdmin ? 'primary' : 'default'}
          sx={{
            fontWeight: 500,
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            height: { xs: 24, sm: 28 },
            '& .MuiChip-label': {
              px: { xs: 0.5, sm: 1 },
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
        <Tooltip title="Notifications">
          <IconButton 
            size={isMobile ? 'small' : 'medium'} 
            sx={{ 
              color: 'text.secondary',
              minWidth: '40px',
              minHeight: '40px',
            }}
          >
            <NotificationsNone />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton 
            onClick={toggleTheme} 
            size={isMobile ? 'small' : 'medium'} 
            sx={{ 
              color: 'text.secondary',
              minWidth: '40px',
              minHeight: '40px',
            }}
          >
            {settings.theme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
