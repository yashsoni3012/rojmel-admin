import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { env } from '../config/env.js';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F8FAFC',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: '#E2E8F0',
      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    },
    '&:hover': {
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#94A3B8',
      },
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 4px rgba(52, 84, 209, 0.12)',
      '& fieldset': {
        borderColor: '#3454D1',
        borderWidth: '1.5px',
      },
    },
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.2s ease',
    '&.Mui-focused': {
      color: '#3454D1',
      fontWeight: 600,
    },
  },
};

export default function Login() {
  const { isAuthed, login } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthed) return <Navigate to={location.state?.from?.pathname || '/'} replace />;

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = 'Enter a valid email address';
    if (!f.password) v.password = 'Enter your password';
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      await login(f);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    const email = env.demoEmail || 'admin@rojmel.app';
    const password = env.demoPassword || 'Admin@123';
    setF({ email, password });
    setErrors({});
    toast.info('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F4F6FB] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-200/35 rounded-full blur-3xl pointer-events-none" />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3.5, sm: 5 },
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          boxShadow: '0 20px 45px -12px rgba(24, 35, 63, 0.12), 0 0 1px 1px rgba(24, 35, 63, 0.04)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3454D1] to-[#4F6EF7] text-white flex items-center justify-center shadow-lg shadow-[#3454D1]/30 mx-auto mb-3.5">
            <AccountBalanceWalletRoundedIcon sx={{ fontSize: 28 }} />
          </div>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#18233F', letterSpacing: '-0.02em' }}>
            {env.appName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back! Enter your details to open your ledger.
          </Typography>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set('email')}
            error={!!errors.email}
            helperText={errors.email}
            sx={inputStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Input
            label="Password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            value={f.password}
            onChange={set('password')}
            error={!!errors.password}
            helperText={errors.password}
            sx={inputStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShow((s) => !s)}
                    edge="end"
                    aria-label="Toggle password visibility"
                    sx={{ color: '#94A3B8' }}
                  >
                    {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            size="large"
            fullWidth
            loading={loading}
            sx={{
              mt: 1,
              py: 1.4,
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3454D1 0%, #2942AC 100%)',
              boxShadow: '0 4px 14px rgba(52, 84, 209, 0.35)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #2D4ABF 0%, #223793 100%)',
                boxShadow: '0 6px 20px rgba(52, 84, 209, 0.45)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Sign in
          </Button>

          {/* Quick Demo Fill Card */}
          <div
            onClick={handleFillDemo}
            className="mt-5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 cursor-pointer transition-all duration-200 flex items-center justify-between group"
            role="button"
            title="Click to fill demo account credentials"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-slate-700 leading-tight">Quick Demo Login</p>
                <p className="text-[11px] text-slate-500 truncate">{env.demoEmail || 'admin@rojmel.app'}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#3454D1] group-hover:translate-x-0.5 transition-transform duration-200 shrink-0">
              Fill Details →
            </span>
          </div>
        </form>
      </Paper>

      {/* Subtle branding footer */}
      <p className="text-xs text-slate-400 mt-6 text-center relative z-10">
        © 2026 {env.appName} • Secure Daily Money Ledger
      </p>
    </div>
  );
}
