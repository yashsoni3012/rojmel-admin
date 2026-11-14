import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useToast } from '../context/ToastContext.jsx';
import { authService } from '../services/authService.js';

// Rojmel App Blue Palette: active tab #1761B6, sidebar #C8D9ED, border #B0C4DD
const ROJMEL_COLORS = {
  sidebarBg: '#C8D9ED',
  activeBlue: '#1761B6',
  border: '#B0C4DD',
  textPrimary: '#18233F',
  textSecondary: '#64748B',
  white: '#FFFFFF',
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      try {
        sessionStorage.setItem('pending_reset_email', trimmed);
        localStorage.setItem('rojmel_last_reset_email', trimmed);
      } catch {}
      const resData = await authService.forgotPassword(trimmed);
      if (resData?.resetToken) {
        try {
          localStorage.setItem('rojmel_reset_email_' + resData.resetToken, trimmed);
        } catch {}
      }
      setSubmitted(true);
      toast.success(`Password reset instructions sent to ${trimmed}!`);
    } catch (err) {
      const msg = err.message || 'Failed to send reset link';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.forgotPassword(email.trim());
      toast.info(`A new reset link has been dispatched to ${email.trim()}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to resend reset link');
    } finally {
      setResending(false);
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
        bgcolor: ROJMEL_COLORS.sidebarBg, // Matching Rojmel blue #C8D9ED
        position: 'relative',
      }}
    >
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
            cursor: 'pointer',
          }}
          onClick={() => navigate('/login')}
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
            {submitted ? 'Check Your Email' : 'Reset Password'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: ROJMEL_COLORS.textSecondary,
              textAlign: 'center',
              mt: 0.5,
              fontSize: '0.88rem',
              lineHeight: 1.4,
            }}
          >
            {submitted
              ? `We have sent reset instructions and verification code to ${email}`
              : 'Enter your registered email and we will send you instructions to regain access.'}
          </Typography>
        </Box>

        {/* Success Confirmation State */}
        {submitted ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: '16px',
                bgcolor: '#F0F6FD',
                border: '1px solid #D0E1F5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#DCE8F8',
                  color: ROJMEL_COLORS.activeBlue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(23, 97, 182, 0.15)',
                }}
              >
                <MarkEmailReadRoundedIcon sx={{ fontSize: 30 }} />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: ROJMEL_COLORS.textPrimary }}>
                  Email Sent Successfully!
                </Typography>
                <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary, display: 'block', mt: 0.5 }}>
                  Click the link in your email to reset your password. If you don't see it, check your spam or junk folder.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/login')}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                py: 1.4,
                minHeight: 48,
                borderRadius: '12px',
                fontSize: '0.96rem',
                fontWeight: 700,
                bgcolor: ROJMEL_COLORS.activeBlue, // #1761B6
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#134F94',
                  boxShadow: 'none',
                },
              }}
            >
              Return to Sign In
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: ROJMEL_COLORS.textSecondary }}>
                Didn't get the email?
              </Typography>
              <Button
                size="small"
                variant="text"
                disabled={resending}
                onClick={handleResend}
                startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: ROJMEL_COLORS.activeBlue,
                  p: 0,
                  minWidth: 0,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                }}
              >
                {resending ? 'Resending...' : 'Resend link'}
              </Button>
            </Box>
          </Box>
        ) : (
          /* Form State */
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: ROJMEL_COLORS.textPrimary, fontWeight: 700, display: 'block', mb: 0.75 }}
              >
                Registered Email
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type="email"
                placeholder="admin@rojmel.app"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                error={!!error}
                helperText={error}
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
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
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
                  '&:hover': { textDecoration: 'underline', color: '#134F94' },
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

