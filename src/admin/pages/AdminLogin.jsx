import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  ThemeProvider,
  CssBaseline,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { adminTheme, ADMIN_COLORS } from '../theme/adminTheme.js';
import { ADMIN_CREDENTIALS } from '../services/adminAuthService.js';

export default function AdminLogin() {
  const { isAdminAuthed, login } = useAdminAuth();
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

  if (isAdminAuthed) {
    const dest = location.state?.from?.pathname || '/admin';
    return <Navigate to={dest} replace />;
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleQuickFill = () => {
    setForm({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
    });
    setErrors({});
    toast.info('Super Admin credentials filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Admin email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Admin password is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(form);
      const dest = location.state?.from?.pathname || '/admin';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 3 },
          bgcolor: '#D7E6DF', // Requested color theme: #D7E6DF
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
            bgcolor: ADMIN_COLORS.white,
            border: '1px solid #C4D8CE',
            p: { xs: 3.5, sm: 4.5 },
            boxShadow: '0 8px 30px rgba(7, 91, 89, 0.08)',
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
                color: ADMIN_COLORS.textPrimary,
                letterSpacing: '-0.01em',
                textAlign: 'center',
                fontSize: '1.35rem',
              }}
            >
              Super Admin Login
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: ADMIN_COLORS.textSecondary,
                textAlign: 'center',
                fontSize: '0.84rem',
                mt: 0.3,
              }}
            >
              Sign in to manage platform tenants & logs
            </Typography>
          </Box>

          {/* Fill Up Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: ADMIN_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}>
                Admin Email
              </Typography>
              <TextField
                fullWidth
                size="medium"
                placeholder="admin@gmail.com"
                value={form.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon sx={{ color: ADMIN_COLORS.textSecondary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F4F7FA',
                    borderRadius: '12px',
                    color: ADMIN_COLORS.textPrimary,
                    '& fieldset': { borderColor: '#E3EAED' },
                    '&:hover fieldset': { borderColor: '#10A878' },
                    '&.Mui-focused': {
                      bgcolor: ADMIN_COLORS.white,
                      '& fieldset': { borderColor: '#10A878', borderWidth: '1.5px' },
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: ADMIN_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}>
                Password
              </Typography>
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
                      <LockRoundedIcon sx={{ color: ADMIN_COLORS.textSecondary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: ADMIN_COLORS.textSecondary }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F4F7FA',
                    borderRadius: '12px',
                    color: ADMIN_COLORS.textPrimary,
                    '& fieldset': { borderColor: '#E3EAED' },
                    '&:hover fieldset': { borderColor: '#10A878' },
                    '&.Mui-focused': {
                      bgcolor: ADMIN_COLORS.white,
                      '& fieldset': { borderColor: '#10A878', borderWidth: '1.5px' },
                    },
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 0.5,
                py: 1.35,
                borderRadius: '12px',
                fontSize: '0.96rem',
                fontWeight: 700,
                bgcolor: '#10A878', // Emerald Green matching active tab
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#0E9469',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign in to Console'}
            </Button>
          </Box>

          {/* Quick Auto-Fill Demo Credentials Card */}
          <Box
            onClick={handleQuickFill}
            sx={{
              mt: 2.8,
              p: 1.6,
              borderRadius: '12px',
              bgcolor: '#D7E6DF', // Themed soft mint #D7E6DF
              border: '1px solid #C4D8CE',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.18s ease',
              '&:hover': {
                bgcolor: '#CCE0D6',
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
                  color: '#10A878',
                }}
              >
                <KeyRoundedIcon sx={{ fontSize: 17 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: ADMIN_COLORS.textPrimary, fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                  Quick Auto-Fill Details
                </Typography>
                <Typography variant="caption" sx={{ color: '#4B6359', fontSize: '0.72rem', fontWeight: 600 }}>
                  {ADMIN_CREDENTIALS.email} • {ADMIN_CREDENTIALS.password}
                </Typography>
              </Box>
            </Box>
            <Chip
              label="Fill →"
              size="small"
              sx={{
                bgcolor: '#10A878',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.68rem',
                cursor: 'pointer',
              }}
            />
          </Box>

          <Divider sx={{ my: 2.5, borderColor: '#E3EAED' }} />

          {/* Return to normal Rojmel app */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/')}
              startIcon={<LaunchRoundedIcon sx={{ fontSize: '15px !important' }} />}
              sx={{
                color: ADMIN_COLORS.textSecondary,
                fontSize: '0.82rem',
                fontWeight: 600,
                '&:hover': { color: '#10A878', bgcolor: '#F4F7FA' },
              }}
            >
              Go to Rojmel App
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
