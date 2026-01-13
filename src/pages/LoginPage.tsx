import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuth, DEMO_CREDENTIALS } from '@/contexts/AuthContext';
import gsap from 'gsap';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (containerRef.current && cardRef.current) {
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      ).fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const fillCredentials = (type: 'admin' | 'user') => {
    const creds = type === 'admin' ? DEMO_CREDENTIALS.admin : DEMO_CREDENTIALS.user;
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, hsl(222, 47%, 8%) 0%, hsl(173, 60%, 25%) 100%)',
        p: { xs: 1.5, sm: 2, md: 2 },
        gap: 2,
      }}
    >
      {/* Desktop Notice - Only visible on larger screens */}
      <Box
        sx={{
          display: 'none',
          '@media (min-width: 769px)': {
            display: 'flex',
          },
          maxWidth: 500,
          p: 2,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          color: 'white',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}
      >
        💡 For optimal experience, please open this application on a desktop or laptop
      </Box>

      <Card
        ref={cardRef}
        sx={{
          width: '100%',
          maxWidth: { xs: '95vw', sm: '420px', md: 460 },
          p: { xs: 2.5, sm: 4, md: 5 },
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.2rem' },
              background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1.5,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            WorkLedger
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500, 
              letterSpacing: '0.5px',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
            }}
          >
            Professional Project & Team Management
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                padding: '10px 14px',
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{
              mb: { xs: 3, sm: 3.5 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                padding: '10px 14px',
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'action.hover' },
                      padding: '8px',
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<LoginIcon />}
            sx={{
              py: { xs: 1.5, sm: 1.8 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(173, 80%, 40%, 0.3)',
              minHeight: '44px',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(173, 80%, 35%), hsl(195, 80%, 40%))',
                boxShadow: '0 12px 28px rgba(173, 80%, 40%, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, hsl(215, 16%, 47%), hsl(215, 16%, 60%))',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo credentials */}
        <Box sx={{ mt: { xs: 4, sm: 5 }, pt: { xs: 3, sm: 4 }, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mb: 2.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            Demo Credentials
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => fillCredentials('user')}
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 600,
                borderRadius: 1.5,
                py: { xs: 1, sm: 1.2 },
                textTransform: 'none',
                minHeight: '40px',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              Quick Login
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 }, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                mb: 0.5,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              Email: user@workledger.com
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              Password: user123
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
