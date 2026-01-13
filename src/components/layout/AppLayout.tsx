import React, { useEffect, useRef } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as ProjectsIcon,
  People as WorkersIcon,
  AttachMoney as SalaryIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Logout,
  Analytics as AnalyticsIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Topbar } from './Topbar';
import gsap from 'gsap';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 80;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Projects', path: '/projects', icon: <ProjectsIcon /> },
  { label: 'Team', path: '/workers', icon: <WorkersIcon /> },
  { label: 'Salary', path: '/salary', icon: <SalaryIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Calendar', path: '/calendar', icon: <CalendarIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { settings, toggleSidebar } = useTheme();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // On mobile, always collapse sidebar. On desktop, use settings
  const isCollapsed = isMobile || (settings.sidebarCollapsed && !isMobile);
  const drawerWidth = isCollapsed ? (isMobile ? 0 : SIDEBAR_COLLAPSED_WIDTH) : SIDEBAR_WIDTH;
  const shouldHideSidebarMobile = isMobile && !isCollapsed;

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: drawerWidth,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [drawerWidth]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: 'background.default' }}>
      {/* Sidebar - Hidden on mobile by default */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        ref={sidebarRef}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth || 'auto',
            boxSizing: 'border-box',
            bgcolor: 'hsl(222, 47%, 11%)',
            borderRight: '1px solid hsl(222, 40%, 20%)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            '@media (max-width: 768px)': {
              position: 'fixed',
              height: '100vh',
              zIndex: 1200,
            },
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid hsl(222, 40%, 20%)',
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {!isCollapsed && (
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                background: 'linear-gradient(135deg, hsl(173, 80%, 45%), hsl(195, 80%, 50%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              WorkLedger
            </Typography>
          )}
          {!isMobile && (
            <IconButton
              onClick={toggleSidebar}
              sx={{ color: 'hsl(210, 20%, 70%)', '&:hover': { color: '#fff' } }}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          )}
        </Box>

        {/* Navigation */}
        <List sx={{ px: { xs: 1, sm: 1.5 }, py: 1.5, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                title={isCollapsed ? item.label : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: isCollapsed ? { xs: 1.5, sm: 2 } : { xs: 2, sm: 2.5 },
                    py: { xs: 1.2, sm: 1.5 },
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    bgcolor: isActive ? 'hsl(173, 80%, 40%)' : 'transparent',
                    color: isActive ? '#fff' : 'hsl(210, 20%, 70%)',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    '&:hover': {
                      bgcolor: isActive ? 'hsl(173, 80%, 35%)' : 'hsl(222, 40%, 18%)',
                      color: '#fff',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: isCollapsed ? 0 : { xs: 36, sm: 40 },
                      fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        {/* User section */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderTop: '1px solid hsl(222, 40%, 20%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              bgcolor: 'hsl(173, 80%, 40%)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          {!isCollapsed && (
            <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ 
                  color: '#fff', 
                  fontWeight: 500, 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  color: 'hsl(210, 20%, 60%)', 
                  textTransform: 'capitalize',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {user?.role}
              </Typography>
            </Box>
          )}
          <Tooltip title="Logout" placement="top">
            <IconButton
              onClick={logout}
              size="small"
              sx={{ 
                color: 'hsl(210, 20%, 60%)', 
                '&:hover': { color: 'hsl(0, 84%, 60%)' },
                minWidth: '40px',
                minHeight: '40px',
              }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          transition: 'width 0.3s ease',
          '@media (max-width: 768px)': {
            marginLeft: 0,
          },
        }}
      >
        <Topbar />
        <Box
          ref={contentRef}
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            overflowY: 'auto',
            width: '100%',
            '@media (max-width: 480px)': {
              p: 1,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
