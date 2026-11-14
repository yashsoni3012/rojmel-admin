import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { env } from '../config/env.js';

// Rojmel App Blue Palette: active tab #1761B6, sidebar #C8D9ED, border #B0C4DD
const ROJMEL_COLORS = {
  activeBlue: '#1761B6',
  sidebarBg: '#C8D9ED',
  border: '#B0C4DD',
  textPrimary: '#18233F',
  textSecondary: '#475E7B',
  white: '#FFFFFF',
};

export default function Login() {
  const { isAuthed, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthed) {
    const dest = location.state?.from?.pathname || '/';
    return <Navigate to={dest} replace />;
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleQuickFill = () => {
    const email = env.demoEmail || 'admin@rojmel.app';
    const password = env.demoPassword || 'Admin@123';
    setForm({ email, password });
    setErrors({});
    toast.info('Demo credentials filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(form);
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2.5, sm: 3 },
        bgcolor: ROJMEL_COLORS.sidebarBg, // Requested background: #C8D9ED
        position: 'relative',
      }}
    >
      {/* Focused Centered Login Form Card with Rojmel Logo on Top */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: '24px',
          bgcolor: ROJMEL_COLORS.white,
          border: `1px solid ${ROJMEL_COLORS.border}`,
          p: { xs: 3.5, sm: 4.5 },
          boxShadow: '0 8px 30px rgba(23, 97, 182, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Rojmel Logo Centered on Top */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            component="img"
            src="/rojmel-full-logo.png"
            alt="Rojmel Logo"
            onError={(e) => {
              e.currentTarget.src = '/rojmel-logo.jpg';
            }}
            sx={{
              width: '100%',
              maxWidth: 200,
              maxHeight: 65,
              objectFit: 'contain',
              mb: 1.5,
            }}
          />

          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: ROJMEL_COLORS.textPrimary,
              letterSpacing: '-0.01em',
              textAlign: 'center',
              fontSize: '1.35rem',
            }}
          >
            Sign in to Rojmel
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: ROJMEL_COLORS.textSecondary,
              textAlign: 'center',
              fontSize: '0.84rem',
              mt: 0.3,
            }}
          >
            Welcome back! Enter your details to open your ledger.
          </Typography>
        </Box>

        {/* Fill Up Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}>
              Email address
            </Typography>
            <TextField
              fullWidth
              size="medium"
              placeholder={env.demoEmail || 'admin@rojmel.app'}
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F4F7FB',
                  borderRadius: '12px',
                  color: ROJMEL_COLORS.textPrimary,
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                  '&.Mui-focused': {
                    bgcolor: ROJMEL_COLORS.white,
                    '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue, borderWidth: '1.5px' },
                  },
                },
              }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700 }}>
                Password
              </Typography>
              <Typography
                component={Link}
                to="/forgot-password"
                variant="caption"
                sx={{
                  color: ROJMEL_COLORS.activeBlue,
                  fontWeight: 700,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  '&:hover': { textDecoration: 'underline', color: '#134F94' },
                }}
              >
                Forgot password?
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="medium"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••"
              value={form.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: ROJMEL_COLORS.textSecondary }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F4F7FB',
                  borderRadius: '12px',
                  color: ROJMEL_COLORS.textPrimary,
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                  '&.Mui-focused': {
                    bgcolor: ROJMEL_COLORS.white,
                    '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue, borderWidth: '1.5px' },
                  },
                },
              }}
            />
          </Box>

          {/* Submit Button in requested active tab blue #1761B6 */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              mt: 0.5,
              py: 1.4,
              minHeight: 48,
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              bgcolor: ROJMEL_COLORS.activeBlue, // #1761B6
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#134F94',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Opening ledger...' : 'Sign in to Ledger'}
          </Button>
        </Box>

        {/* Quick Auto-Fill Demo Credentials Card in #C8D9ED */}
        <Box
          onClick={handleQuickFill}
          sx={{
            mt: 2.8,
            p: 1.6,
            borderRadius: '12px',
            bgcolor: ROJMEL_COLORS.sidebarBg, // #C8D9ED
            border: `1px solid ${ROJMEL_COLORS.border}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.18s ease',
            '&:hover': {
              bgcolor: '#BDD2EA',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ROJMEL_COLORS.activeBlue,
              }}
            >
              <KeyRoundedIcon sx={{ fontSize: 17 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                Quick Demo Login
              </Typography>
              <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: '0.72rem', fontWeight: 600 }}>
                {env.demoEmail || 'admin@rojmel.app'}
              </Typography>
            </Box>
          </Box>
          <Chip
            label="Fill Details →"
            size="small"
            sx={{
              bgcolor: ROJMEL_COLORS.activeBlue,
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.68rem',
              cursor: 'pointer',
            }}
          />
        </Box>

        <Divider sx={{ my: 2.5, borderColor: '#E2E8F0' }} />

        {/* Link to Super Admin Console */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/admin')}
            startIcon={<LaunchRoundedIcon sx={{ fontSize: '15px !important' }} />}
            sx={{
              color: ROJMEL_COLORS.textSecondary,
              fontSize: '0.82rem',
              fontWeight: 600,
              '&:hover': { color: ROJMEL_COLORS.activeBlue, bgcolor: '#F4F7FB' },
            }}
          >
            Open Super Admin Panel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
