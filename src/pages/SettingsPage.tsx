import React, { useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import {
  Palette,
  Business,
  AttachMoney,
  Storage,
  RestartAlt,
  Download,
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DEFAULT_PROJECTS, DEFAULT_WORKERS, DEFAULT_SETTINGS } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportToJSON } from '@/utils/exportData';
import { usePageAnimation } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

export function SettingsPage() {
  const { settings, updateSettings, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const { projects, workers } = useData();
  const pageRef = usePageAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setProjects] = useLocalStorage('workledger_projects', DEFAULT_PROJECTS);
  const [, setWorkers] = useLocalStorage('workledger_workers', DEFAULT_WORKERS);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      setProjects(DEFAULT_PROJECTS);
      setWorkers(DEFAULT_WORKERS);
      updateSettings(DEFAULT_SETTINGS);
    }
  };

  const handleExportAll = () => {
    exportToJSON({ projects, workers, settings }, 'workledger-backup');
  };

  return (
    <Box ref={pageRef} sx={{ width: '100%', maxWidth: 800 }}>
      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are viewing settings as a regular user. Some options may be read-only.
        </Alert>
      )}

      <Box ref={containerRef}>
        {/* Appearance */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Palette color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Appearance
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.theme === 'dark'}
                    onChange={toggleTheme}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Dark Mode</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Switch between light and dark theme
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, alignItems: 'flex-start' }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onChange={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Collapsed Sidebar</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Show sidebar in compact mode by default
                    </Typography>
                  </Box>
                }
                sx={{ ml: 0, alignItems: 'flex-start' }}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Company Settings */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Business color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Company Settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={settings.companyName}
                onChange={(e) => updateSettings({ companyName: e.target.value })}
                disabled={!isAdmin}
                helperText={!isAdmin ? 'Only admins can modify this setting' : ''}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Regional Settings */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <AttachMoney color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Regional Settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth disabled={!isAdmin}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.currency}
                  label="Currency"
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                  <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                  <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                  <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Data Management */}
        {isAdmin && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Storage color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Data Management
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              All data is stored locally in your browser. Use the options below to manage your data.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportAll}
              >
                Export All Data
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RestartAlt />}
                onClick={handleResetData}
              >
                Reset All Data
              </Button>
            </Box>

            <Alert severity="warning" sx={{ mt: 3 }}>
              Resetting data will restore all projects, workers, and settings to their default values.
              This action cannot be undone.
            </Alert>
          </Card>
        )}
      </Box>
    </Box>
  );
}
