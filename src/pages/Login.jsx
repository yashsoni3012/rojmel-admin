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
  MenuItem,
} from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { env } from '../config/env.js';

// Rojmel App Blue Palette: active tab #1761B6, sidebar #C8D9ED, border #B0C4DD
const ROJMEL_COLORS = {
  sidebarBg: '#C8D9ED',
  activeBlue: '#1761B6',
  hoverBlue: '#124E94',
  border: '#B0C4DD',
  textPrimary: '#18233F',
  textSecondary: '#475E7B',
  white: '#FFFFFF',
};

const BUSINESS_TYPES = [
  'Grocery',
  'Retail Store',
  'Wholesale & Distribution',
  'Services & Freelance',
  'Restaurant & Cafe',
  'Manufacturing',
  'Electronics & Hardware',
  'Textile & Garments',
  'Other Business',
];

export default function Login() {
  const { isAuthed, login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state matching exact user payload format
  const [registerForm, setRegisterForm] = useState({
    ownerName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    businessType: 'Grocery',
    city: '',
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);

  if (isAuthed) {
    const dest = location.state?.from?.pathname || '/';
    return <Navigate to={dest} replace />;
  }

  // Handle Login input changes
  const handleLoginChange = (field) => (e) => {
    setLoginForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle Register input changes
  const handleRegisterChange = (field) => (e) => {
    setRegisterForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (registerErrors[field]) {
      setRegisterErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Quick 1-click Demo Credentials for Login
  const handleQuickFillLogin = () => {
    const email = env.demoEmail || 'admin@rojmel.app';
    const password = env.demoPassword || 'Admin@123';
    setLoginForm({ email, password });
    setLoginErrors({});
    toast.info('Demo login credentials filled!');
  };

  // Quick 1-click Demo Fill for Register matching exact requested user format
  const handleQuickFillRegister = () => {
    setRegisterForm({
      ownerName: 'Yash Ranpura',
      email: 'yash@gmail.com',
      mobile: '9876543210',
      password: 'Strong@123',
      confirmPassword: 'Strong@123',
      shopName: 'Yash General Store',
      businessType: 'Grocery',
      city: 'Ahmedabad',
    });
    setRegisterErrors({});
    toast.info('Demo registration data filled!');
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginForm.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!loginForm.password) {
      newErrors.password = 'Password is required';
    }

    setLoginErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoginLoading(true);
    try {
      await login(loginForm);
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!registerForm.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!registerForm.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!registerForm.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(registerForm.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!registerForm.shopName.trim()) {
      newErrors.shopName = 'Shop / Business name is required';
    }

    if (!registerForm.businessType.trim()) {
      newErrors.businessType = 'Please select a business type';
    }

    if (!registerForm.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!registerForm.password) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (registerForm.confirmPassword !== registerForm.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setRegisterLoading(true);
    try {
      await register(registerForm);
      toast.success(`Account created for ${registerForm.shopName}!`);

      // Auto-login newly registered user
      await login({
        email: registerForm.email,
        password: registerForm.password,
      });

      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        bgcolor: ROJMEL_COLORS.sidebarBg, // Requested background: #C8D9ED
        position: 'relative',
      }}
    >
      {/* Focused Centered Auth Card */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: activeTab === 'register' ? { xs: 440, sm: 600 } : 440,
          borderRadius: '24px',
          bgcolor: ROJMEL_COLORS.white,
          border: `1px solid ${ROJMEL_COLORS.border}`,
          p: { xs: 3, sm: 4.5 },
          boxShadow: '0 8px 30px rgba(23, 97, 182, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'max-width 0.25s ease-in-out',
        }}
      >
        {/* Rojmel Logo Centered on Top */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
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
              mb: 1.2,
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
            {activeTab === 'login' ? 'Welcome Back' : 'Create Business Account'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: ROJMEL_COLORS.textSecondary,
              textAlign: 'center',
              mt: 0.3,
              fontSize: '0.86rem',
            }}
          >
            {activeTab === 'login'
              ? 'Sign in to access your business ledger & accounts'
              : 'Register your shop or business to start tracking transactions'}
          </Typography>
        </Box>

        {/* Tab Switcher: Login vs Register */}
        <Box
          sx={{
            display: 'flex',
            p: 0.6,
            bgcolor: '#F0F5FA',
            borderRadius: '16px',
            mb: 3,
            border: '1px solid #D2E2F2',
          }}
        >
          <Button
            onClick={() => setActiveTab('login')}
            startIcon={<LoginRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              flex: 1,
              py: 1,
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.92rem',
              textTransform: 'none',
              bgcolor: activeTab === 'login' ? ROJMEL_COLORS.activeBlue : 'transparent',
              color: activeTab === 'login' ? '#FFFFFF' : ROJMEL_COLORS.textSecondary,
              boxShadow: activeTab === 'login' ? '0 3px 10px rgba(23, 97, 182, 0.25)' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeTab === 'login' ? ROJMEL_COLORS.hoverBlue : 'rgba(23, 97, 182, 0.06)',
                color: activeTab === 'login' ? '#FFFFFF' : ROJMEL_COLORS.activeBlue,
              },
            }}
          >
            Sign In
          </Button>
          <Button
            onClick={() => setActiveTab('register')}
            startIcon={<AppRegistrationRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              flex: 1,
              py: 1,
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.92rem',
              textTransform: 'none',
              bgcolor: activeTab === 'register' ? ROJMEL_COLORS.activeBlue : 'transparent',
              color: activeTab === 'register' ? '#FFFFFF' : ROJMEL_COLORS.textSecondary,
              boxShadow: activeTab === 'register' ? '0 3px 10px rgba(23, 97, 182, 0.25)' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeTab === 'register' ? ROJMEL_COLORS.hoverBlue : 'rgba(23, 97, 182, 0.06)',
                color: activeTab === 'register' ? '#FFFFFF' : ROJMEL_COLORS.activeBlue,
              },
            }}
          >
            Register
          </Button>
        </Box>

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            {/* Email Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type="email"
                placeholder="admin@rojmel.app"
                value={loginForm.email}
                onChange={handleLoginChange('email')}
                error={!!loginErrors.email}
                helperText={loginErrors.email}
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

            {/* Password Field + Forgot password link */}
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
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="••••••"
                value={loginForm.password}
                onChange={handleLoginChange('password')}
                error={!!loginErrors.password}
                helperText={loginErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: ROJMEL_COLORS.textSecondary }}
                      >
                        {showLoginPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
              disabled={loginLoading}
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
                  bgcolor: ROJMEL_COLORS.hoverBlue,
                  boxShadow: 'none',
                },
              }}
            >
              {loginLoading ? 'Opening ledger...' : 'Sign in to Ledger'}
            </Button>

            {/* Quick Auto-Fill Demo Credentials Card */}
            <Box
              onClick={handleQuickFillLogin}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: '14px',
                bgcolor: '#F0F6FD',
                border: '1px dashed #B0C4DD',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#E4EFFC',
                  borderColor: ROJMEL_COLORS.activeBlue,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <KeyRoundedIcon sx={{ color: ROJMEL_COLORS.activeBlue, fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" fontWeight={700} sx={{ color: ROJMEL_COLORS.textPrimary, display: 'block' }}>
                    1-Click Demo Login
                  </Typography>
                  <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary }}>
                    {env.demoEmail || 'admin@rojmel.app'} • Admin@123
                  </Typography>
                </Box>
              </Box>
              <Chip
                size="small"
                label="Fill"
                sx={{
                  bgcolor: ROJMEL_COLORS.activeBlue,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  height: 24,
                  fontSize: '0.75rem',
                }}
              />
            </Box>

            {/* Prompt to register */}
            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: '0.88rem' }}>
                Don't have a business account?{' '}
                <Typography
                  component="span"
                  onClick={() => setActiveTab('register')}
                  sx={{
                    color: ROJMEL_COLORS.activeBlue,
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Register here
                </Typography>
              </Typography>
            </Box>
          </Box>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <Box component="form" onSubmit={handleRegisterSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 2-Column Responsive Grid for 8 Fields */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.8,
              }}
            >
              {/* 1. Owner Name */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Owner Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Yash Ranpura"
                  value={registerForm.ownerName}
                  onChange={handleRegisterChange('ownerName')}
                  error={!!registerErrors.ownerName}
                  helperText={registerErrors.ownerName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>

              {/* 2. Email */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Email Address *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  placeholder="yash@gmail.com"
                  value={registerForm.email}
                  onChange={handleRegisterChange('email')}
                  error={!!registerErrors.email}
                  helperText={registerErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>

              {/* 3. Mobile Number */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Mobile Number *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="tel"
                  placeholder="9876543210"
                  value={registerForm.mobile}
                  onChange={handleRegisterChange('mobile')}
                  error={!!registerErrors.mobile}
                  helperText={registerErrors.mobile}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>

              {/* 4. City */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  City *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ahmedabad"
                  value={registerForm.city}
                  onChange={handleRegisterChange('city')}
                  error={!!registerErrors.city}
                  helperText={registerErrors.city}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>

              {/* 5. Shop / Business Name */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Shop / Business Name *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Yash General Store"
                  value={registerForm.shopName}
                  onChange={handleRegisterChange('shopName')}
                  error={!!registerErrors.shopName}
                  helperText={registerErrors.shopName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StorefrontRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>

              {/* 6. Business Type */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Business Type *
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={registerForm.businessType}
                  onChange={handleRegisterChange('businessType')}
                  error={!!registerErrors.businessType}
                  helperText={registerErrors.businessType}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                >
                  {BUSINESS_TYPES.map((bt) => (
                    <MenuItem key={bt} value={bt}>
                      {bt}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* 7. Password */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Password *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="Strong@123"
                  value={registerForm.password}
                  onChange={handleRegisterChange('password')}
                  error={!!registerErrors.password}
                  helperText={registerErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowRegisterPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: ROJMEL_COLORS.textSecondary }}
                        >
                          {showRegisterPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>

              {/* 8. Confirm Password */}
              <Box>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Confirm Password *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Strong@123"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange('confirmPassword')}
                  error={!!registerErrors.confirmPassword}
                  helperText={registerErrors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: ROJMEL_COLORS.textSecondary }}
                        >
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F4F7FB',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: ROJMEL_COLORS.activeBlue },
                      '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: ROJMEL_COLORS.activeBlue } },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={registerLoading}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 1,
                py: 1.4,
                minHeight: 48,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                bgcolor: ROJMEL_COLORS.activeBlue, // #1761B6
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: ROJMEL_COLORS.hoverBlue,
                  boxShadow: 'none',
                },
              }}
            >
              {registerLoading ? 'Creating Account...' : 'Create Business Account'}
            </Button>

            {/* Quick 1-Click Demo Register Fill */}
            <Box
              onClick={handleQuickFillRegister}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.3,
                borderRadius: '12px',
                bgcolor: '#F0F6FD',
                border: '1px dashed #B0C4DD',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#E4EFFC',
                  borderColor: ROJMEL_COLORS.activeBlue,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <KeyRoundedIcon sx={{ color: ROJMEL_COLORS.activeBlue, fontSize: 18 }} />
                <Box>
                  <Typography variant="caption" fontWeight={700} sx={{ color: ROJMEL_COLORS.textPrimary, display: 'block' }}>
                    1-Click Fill Yash Ranpura Demo Data
                  </Typography>
                  <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary }}>
                    yash@gmail.com • Yash General Store
                  </Typography>
                </Box>
              </Box>
              <Chip
                size="small"
                label="Fill All"
                sx={{
                  bgcolor: ROJMEL_COLORS.activeBlue,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  height: 22,
                  fontSize: '0.72rem',
                }}
              />
            </Box>

            {/* Prompt to login */}
            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: '0.88rem' }}>
                Already registered?{' '}
                <Typography
                  component="span"
                  onClick={() => setActiveTab('login')}
                  sx={{
                    color: ROJMEL_COLORS.activeBlue,
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign in here
                </Typography>
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2.5 }} />

        {/* Footer Link to Super Admin Login */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary }}>
            Platform Manager?
          </Typography>
          <Typography
            component={Link}
            to="/admin/login"
            variant="caption"
            sx={{
              color: ROJMEL_COLORS.activeBlue,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.4,
              '&:hover': { textDecoration: 'underline', color: '#134F94' },
            }}
          >
            Super Admin Portal <LaunchRoundedIcon sx={{ fontSize: 13 }} />
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
