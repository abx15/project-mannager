import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Settings, DEFAULT_SETTINGS } from '@/types';

interface ThemeContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? 'hsl(173, 80%, 40%)' : 'hsl(173, 80%, 45%)',
      light: mode === 'light' ? 'hsl(173, 80%, 50%)' : 'hsl(173, 80%, 55%)',
      dark: mode === 'light' ? 'hsl(173, 80%, 30%)' : 'hsl(173, 80%, 35%)',
      contrastText: mode === 'light' ? '#fff' : 'hsl(222, 47%, 11%)',
    },
    secondary: {
      main: mode === 'light' ? 'hsl(215, 20%, 65%)' : 'hsl(215, 20%, 40%)',
      contrastText: mode === 'light' ? 'hsl(222, 47%, 11%)' : 'hsl(210, 20%, 95%)',
    },
    background: {
      default: mode === 'light' ? 'hsl(210, 20%, 98%)' : 'hsl(222, 47%, 6%)',
      paper: mode === 'light' ? '#fff' : 'hsl(222, 47%, 9%)',
    },
    text: {
      primary: mode === 'light' ? 'hsl(222, 47%, 11%)' : 'hsl(210, 20%, 95%)',
      secondary: mode === 'light' ? 'hsl(215, 16%, 47%)' : 'hsl(215, 16%, 60%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)',
    },
    success: {
      main: 'hsl(142, 76%, 36%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)',
    },
    info: {
      main: 'hsl(217, 91%, 60%)',
    },
    divider: mode === 'light' ? 'hsl(215, 20%, 91%)' : 'hsl(222, 40%, 18%)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 0 0 1px hsl(215, 20%, 91%), 0 4px 12px rgba(0,0,0,0.08)'
            : '0 0 0 1px hsl(222, 40%, 18%), 0 4px 12px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'light' ? 'hsl(215, 20%, 96%)' : 'hsl(222, 40%, 12%)',
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('workledger_settings', DEFAULT_SETTINGS);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const toggleSidebar = () => {
    setSettings((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  // Apply theme class to document with animated transition
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transitioning class for smooth animation
    root.classList.add('theme-transitioning');
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Remove transitioning class after animation completes
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);
    
    return () => clearTimeout(timeout);
  }, [settings.theme]);

  const muiTheme: Theme = useMemo(
    () => createTheme(getDesignTokens(settings.theme)),
    [settings.theme]
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      toggleTheme,
      toggleSidebar,
    }),
    [settings]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
