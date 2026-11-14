import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useToast } from '../context/ToastContext.jsx';
import { authService } from '../services/authService.js';
import { env } from '../config/env.js';

// Rojmel Theme Colors
const ROJMEL_COLORS = {
  sidebarBg: '#C8D9ED',
  activeBlue: '#1761B6',
  hoverBlue: '#134F94',
  border: '#B0C4DD',
  textPrimary: '#18233F',
  textSecondary: '#64748B',
  white: '#FFFFFF',
};

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Smart multi-layer email detection
  const [email, setEmail] = useState(() => {
    // 1. From URL query param: ?email=user@example.com
    const paramEmail = searchParams.get('email');
    if (paramEmail && paramEmail.includes('@')) return paramEmail.trim();

    // 2. From router location state
    if (location.state?.email && location.state.email.includes('@')) {
      return location.state.email.trim();
    }

    // 3. From token-specific localStorage entry
    if (token) {
      try {
        const tokenEmail = localStorage.getItem('rojmel_reset_email_' + token);
        if (tokenEmail && tokenEmail.includes('@')) return tokenEmail.trim();
      } catch {}
    }

    // 4. From sessionStorage if requested on same browser
    try {
      const saved = sessionStorage.getItem('pending_reset_email');
      if (saved && saved.includes('@')) return saved.trim();
    } catch {}

    // 5. From last forgot password request in localStorage
    try {
      const lastEmail = localStorage.getItem('rojmel_last_reset_email');
      if (lastEmail && lastEmail.includes('@')) return lastEmail.trim();
    } catch {}

    // 6. Try parsing JWT payload if token is structured as a JWT
    if (token && token.includes('.')) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
          const payload = JSON.parse(payloadJson);
          if (payload.email && typeof payload.email === 'string') return payload.email;
          if (payload.sub && typeof payload.sub === 'string' && payload.sub.includes('@')) {
            return payload.sub;
          }
        }
      } catch {}
    }

    return '';
  });

  const [fetchingEmail, setFetchingEmail] = useState(!email && !!token);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(4);

  // Fetch verified user email from Backend API via token
  useEffect(() => {
    if (!email && token) {
      setFetchingEmail(true);
      const base = env.apiUrl ? env.apiUrl.replace(/\/$/, '') : '';
      const endpoint = `${base}/api/auth/reset-password/${encodeURIComponent(token)}`;

      fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;
          const foundEmail =
            data.email ||
            data.data?.email ||
            data.user?.email ||
            data.userEmail;
          if (foundEmail) {
            setEmail(foundEmail);
            try {
              localStorage.setItem('rojmel_reset_email_' + token, foundEmail);
            } catch {}
          }
        })
        .catch(() => {})
        .finally(() => {
          setFetchingEmail(false);
        });
    }
  }, [email, token]);

  // Auto-redirect to /login on success
  useEffect(() => {
    let timer;
    if (submitted) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [submitted, navigate]);

  const validate = () => {
    const errs = {};
    if (!password) {
      errs.password = 'Please enter a new password';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!token) {
      setServerError('Reset token is missing from the URL. Please use the exact link sent to your email.');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      await authService.resetPassword(token, password, confirmPassword);
      // Clean up temporary reset email markers
      try {
        sessionStorage.removeItem('pending_reset_email');
        localStorage.removeItem('rojmel_last_reset_email');
        if (token) localStorage.removeItem('rojmel_reset_email_' + token);
      } catch {}

      setSubmitted(true);
      toast.success('Your password has been successfully reset!');
    } catch (err) {
      const msg = err.message || 'Failed to reset password. Link may be invalid or expired.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const displayEmail = email || (fetchingEmail ? 'Loading account email...' : 'Account Email');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2.5, sm: 3 },
        bgcolor: ROJMEL_COLORS.sidebarBg,
        position: 'relative',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          borderRadius: '24px',
          bgcolor: ROJMEL_COLORS.white,
          border: `1px solid ${ROJMEL_COLORS.border}`,
          p: { xs: 3.5, sm: 4.5 },
          boxShadow: '0 8px 30px rgba(23, 97, 182, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Header / Brand */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: 'rgba(23, 97, 182, 0.1)',
              color: ROJMEL_COLORS.activeBlue,
              mb: 1.5,
            }}
          >
            {submitted ? (
              <CheckCircleRoundedIcon sx={{ fontSize: 32, color: '#0E9F6E' }} />
            ) : (
              <LockRoundedIcon sx={{ fontSize: 28 }} />
            )}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: ROJMEL_COLORS.textPrimary,
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            {submitted ? 'Password Updated!' : 'Set New Password'}
          </Typography>
          <Typography variant="body2" sx={{ color: ROJMEL_COLORS.textSecondary, lineHeight: 1.5 }}>
            {submitted
              ? 'Your password has been changed successfully. You can now log in.'
              : 'Create a new, strong password for your Rojmel account.'}
          </Typography>
        </Box>

        {/* Missing Token Warning */}
        {!token && (
          <Alert
            severity="error"
            icon={<ErrorOutlineRoundedIcon fontSize="inherit" />}
            sx={{ borderRadius: '12px' }}
          >
            Reset token is missing. Please check your reset link or{' '}
            <Link to="/forgot-password" style={{ color: ROJMEL_COLORS.activeBlue, fontWeight: 700 }}>
              request a new link
            </Link>
            .
          </Alert>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>
            {serverError}
          </Alert>
        )}

        {/* Success View */}
        {submitted ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, textAlign: 'center' }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: '#F0FDF4',
                borderRadius: '16px',
                border: '1px solid #BBF7D0',
              }}
            >
              <Typography variant="body2" sx={{ color: '#15803D', fontWeight: 600 }}>
                Redirecting you to sign in in {countdown}s...
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/login"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                py: 1.4,
                minHeight: 48,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                bgcolor: ROJMEL_COLORS.activeBlue,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: ROJMEL_COLORS.hoverBlue,
                  boxShadow: 'none',
                },
              }}
            >
              Sign In Now
            </Button>
          </Box>
        ) : (
          /* Form View */
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Read-Only Account Email Display */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography
                  variant="caption"
                  sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, fontSize: '0.85rem' }}
                >
                  Account Email
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: '#EBF3FB',
                    color: ROJMEL_COLORS.activeBlue,
                    px: 1,
                    py: 0.25,
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <LockRoundedIcon sx={{ fontSize: 13 }} />
                  Read Only
                </Box>
              </Box>

              <TextField
                fullWidth
                size="medium"
                value={displayEmail}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon sx={{ color: ROJMEL_COLORS.activeBlue, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F1F5F9', // clean neutral read-only styling
                    borderRadius: '12px',
                    cursor: 'not-allowed',
                    '& input': {
                      color: '#1E293B',
                      fontWeight: 700,
                      fontSize: '0.94rem',
                      cursor: 'not-allowed',
                      WebkitTextFillColor: '#1E293B !important',
                    },
                    '& fieldset': {
                      borderColor: '#CBD5E1',
                      borderStyle: 'solid',
                    },
                    '&:hover fieldset': {
                      borderColor: '#94A3B8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#94A3B8',
                      borderWidth: '1px',
                    },
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary, mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                Password reset is securely tied to this registered email address.
              </Typography>
            </Box>

            {/* New Password Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}
              >
                New Password
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password (min. 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
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
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                        ) : (
                          <Visibility sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                        )}
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

            {/* Confirm New Password Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}
              >
                Confirm New Password
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                        ) : (
                          <Visibility sx={{ color: ROJMEL_COLORS.textSecondary, fontSize: 20 }} />
                        )}
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !token}
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
              {loading ? 'Updating Password...' : 'Reset Password'}
            </Button>

            {/* Back to Login link */}
            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{
                  color: ROJMEL_COLORS.activeBlue,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.88rem',
                  '&:hover': { textDecoration: 'underline', color: ROJMEL_COLORS.hoverBlue },
                }}
              >
                <ArrowBackRoundedIcon sx={{ fontSize: 16 }} /> Back to Sign In
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
