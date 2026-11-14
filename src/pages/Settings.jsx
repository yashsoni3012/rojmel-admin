import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import PageHeader from '../components/common/PageHeader.jsx';
import Switch from '../components/common/Switch.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { authService } from '../services/authService.js';
import { env } from '../config/env.js';
import { prettyDate } from '../utils.js';

export default function Settings() {
  const { user, updateUser, fetchProfile } = useAuth();
  const { settings, update } = useSettings();
  const { subscription } = useSubscription();
  const toast = useToast();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    ownerName: user?.ownerName || user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    shopName: user?.shopName || '',
    businessType: user?.businessType || '',
    city: user?.city || '',
    address: user?.address || '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load profile from API on mount
  useEffect(() => {
    let mounted = true;
    authService
      .getProfile()
      .then((data) => {
        if (!mounted || !data) return;
        setProfileForm({
          ownerName: data.ownerName || data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          shopName: data.shopName || '',
          businessType: data.businessType || '',
          city: data.city || '',
          address: data.address || '',
        });
        if (updateUser) {
          updateUser(data);
        }
      })
      .catch(() => {
        // Fallback to local session
      })
      .finally(() => {
        if (mounted) setFetchingProfile(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const changeSetting = (key, msg) => (v) => {
    update(key, v);
    toast.success(msg(v));
  };

  // Handle Profile Update: PATCH /api/auth/profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.ownerName.trim()) {
      toast.error('Owner name cannot be empty');
      return;
    }

    setProfileLoading(true);
    try {
      const updated = await authService.updateProfile(profileForm);
      if (updateUser) {
        updateUser(updated);
      }
      toast.success('Admin profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Change Password: PATCH /api/auth/change-password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!passwordForm.currentPassword) {
      errs.currentPassword = 'Enter current password';
    }
    if (!passwordForm.newPassword) {
      errs.newPassword = 'Enter new password (min. 6 characters)';
    } else if (passwordForm.newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordForm.confirmPassword) {
      errs.confirmPassword = 'Confirm your new password';
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }

    setPasswordErrors({});
    setPasswordLoading(true);

    try {
      await authService.changePassword(passwordForm);
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Admin Profile & Settings"
        subtitle="Manage your business profile details, security credentials, and ledger preferences"
      />

      <div className="w-full space-y-6">
        {/* Top Profile Summary Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                sx={{
                  bgcolor: '#1761B6',
                  width: 60,
                  height: 60,
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(23, 97, 182, 0.28)',
                }}
              >
                {profileForm.ownerName?.[0] || user?.name?.[0] || 'A'}
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#1E293B', lineHeight: 1.2 }}>
                    {profileForm.ownerName || user?.name || 'Administrator'}
                  </Typography>
                  <Chip size="small" label="Primary Admin" color="primary" sx={{ fontWeight: 700, height: 22, fontSize: '0.75rem', bgcolor: '#1761B6' }} />
                  <Chip
                    size="small"
                    icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: '15px !important', color: '#B45309 !important' }} />}
                    label={subscription.name}
                    sx={{
                      bgcolor: '#FEF3C7',
                      color: '#B45309',
                      fontWeight: 800,
                      height: 22,
                      fontSize: '0.75rem',
                    }}
                  />
                  <Chip size="small" label="Active" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700, height: 22, fontSize: '0.75rem' }} />
                </div>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                  {profileForm.email || user?.email || 'admin@rojmel.app'}
                  {profileForm.shopName ? ` • ${profileForm.shopName}` : ''}
                </Typography>
              </div>
            </div>

            <Button
              component={NavLink}
              to="/subscription"
              variant="outlined"
              sx={{
                borderRadius: '10px',
                borderColor: '#1761B6',
                color: '#1761B6',
                fontWeight: 700,
                textTransform: 'none',
                minHeight: 40,
                px: 2,
                '&:hover': { borderColor: '#124E94', bgcolor: 'rgba(23, 97, 182, 0.05)' },
              }}
            >
              Subscription Plan ({subscription?.name || 'Pro'}) →
            </Button>
          </div>
        </Paper>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Main Left Column (2 Cols): Admin Profile Edit & Change Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Admin Profile Edit Form (GET & PATCH /api/auth/profile) */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
              }}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <StorefrontRoundedIcon sx={{ color: '#1761B6', fontSize: 24 }} />
                  <div>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#18233F' }}>
                      Admin Profile & Business Details
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Update your owner information, store name, and business address
                    </Typography>
                  </div>
                </div>
                {fetchingProfile && (
                  <Chip
                    size="small"
                    icon={<CircularProgress size={12} color="inherit" />}
                    label="Syncing..."
                    sx={{ height: 22, fontSize: '0.72rem' }}
                  />
                )}
              </div>

              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={handleProfileSubmit} noValidate>
                <Grid container spacing={2.5}>
                  {/* Owner Name */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Owner Name *
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="e.g. Yash Ranpura"
                      value={profileForm.ownerName}
                      onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Registered Email (Read-Only) */}
                  <Grid item xs={12} sm={6}>
                    <div className="flex items-center justify-between mb-1.5">
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B' }}>
                        Email Address
                      </Typography>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                        Read Only
                      </span>
                    </div>
                    <TextField
                      fullWidth
                      size="medium"
                      value={profileForm.email}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F1F5F9',
                          cursor: 'not-allowed',
                          '& input': { color: '#64748B', fontWeight: 600, cursor: 'not-allowed' },
                          '& fieldset': { borderColor: '#CBD5E1' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Mobile Number */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Mobile Number
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="e.g. 9876543210"
                      value={profileForm.mobile}
                      onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Shop / Business Name */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Shop / Business Name
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="e.g. Yash General Store"
                      value={profileForm.shopName}
                      onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StorefrontRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Business Type */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Business Type
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="e.g. Kirana, Grocery, Retail Store"
                      value={profileForm.businessType}
                      onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* City */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      City
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="e.g. Ahmedabad"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationCityRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Shop / Business Address
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="e.g. Maninagar, Ahmedabad"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeWorkRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Save Profile Button */}
                  <Grid item xs={12}>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={profileLoading}
                        startIcon={profileLoading ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                        sx={{
                          py: 1.35,
                          px: 3.5,
                          minHeight: 46,
                          borderRadius: '12px',
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          bgcolor: '#1761B6 !important',
                          background: '#1761B6 !important',
                          color: '#FFFFFF !important',
                          boxShadow: '0 2px 8px rgba(23, 97, 182, 0.28)',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: '#124E94 !important',
                            background: '#124E94 !important',
                            boxShadow: '0 4px 12px rgba(23, 97, 182, 0.38)',
                          },
                        }}
                      >
                        {profileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* 2. Change Password Form (PATCH /api/auth/change-password) */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <LockResetRoundedIcon sx={{ color: '#1761B6', fontSize: 24 }} />
                <div>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#18233F' }}>
                    Security & Change Password
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Ensure your account is using a secure password (minimum 6 characters)
                  </Typography>
                </div>
              </div>

              <Divider sx={{ my: 2.5 }} />

              <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                <Grid container spacing={2.5}>
                  {/* Current Password */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Current Password *
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                        if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                      }}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                            >
                              {showCurrentPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* New Password */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      New Password *
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                        if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: '' });
                      }}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Confirm New Password */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                      Confirm New Password *
                    </Typography>
                    <TextField
                      fullWidth
                      size="medium"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                        if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                      }}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRoundedIcon sx={{ color: '#1761B6', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8FAFC',
                          '&:hover fieldset': { borderColor: '#1761B6' },
                          '&.Mui-focused': { bgcolor: '#FFFFFF', '& fieldset': { borderColor: '#1761B6' } },
                        },
                      }}
                    />
                  </Grid>

                  {/* Submit Change Password */}
                  <Grid item xs={12}>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={passwordLoading}
                        startIcon={passwordLoading ? <CircularProgress size={18} color="inherit" /> : <LockResetRoundedIcon />}
                        sx={{
                          py: 1.35,
                          px: 3.5,
                          minHeight: 46,
                          borderRadius: '12px',
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          bgcolor: '#1761B6 !important',
                          background: '#1761B6 !important',
                          color: '#FFFFFF !important',
                          boxShadow: '0 2px 8px rgba(23, 97, 182, 0.28)',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: '#124E94 !important',
                            background: '#124E94 !important',
                            boxShadow: '0 4px 12px rgba(23, 97, 182, 0.38)',
                          },
                        }}
                      >
                        {passwordLoading ? 'Updating Password...' : 'Change Password'}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </div>

          {/* Right Column (1 Col): System Info & Preferences */}
          <div className="space-y-6">
            {/* System Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <InfoOutlinedIcon sx={{ color: '#1761B6', fontSize: 22 }} />
                <Typography variant="h6" fontWeight={800} sx={{ color: '#18233F' }}>
                  Ledger Info
                </Typography>
              </div>

              <div className="space-y-3.5 divide-y divide-slate-100 text-sm">
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 font-medium">Application</span>
                  <span className="font-bold text-slate-800">{env.appName}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-500 font-medium">Version</span>
                  <span className="font-bold text-slate-800">2.0.0</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-500 font-medium">Active Plan</span>
                  <span className="font-bold text-[#1761B6]">{subscription?.name || 'Pro'}</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-500 font-medium">Validity</span>
                  <span className="font-bold text-emerald-600">
                    {subscription?.expiryDate === 'Lifetime'
                      ? 'Lifetime'
                      : `${subscription?.daysLeft ?? 365} days left`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-500 font-medium">Currency</span>
                  <span className="font-bold text-slate-800">INR (₹)</span>
                </div>
              </div>
            </Paper>

            {/* Display & Table Preferences Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TuneRoundedIcon sx={{ color: '#1761B6', fontSize: 22 }} />
                <Typography variant="h6" fontWeight={800} sx={{ color: '#18233F' }}>
                  Preferences
                </Typography>
              </div>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                Customize your viewing experience and deletion safety prompts.
              </Typography>

              <Divider sx={{ my: 1 }} />

              <div className="divide-y divide-slate-100">
                <Switch
                  label="Compact tables"
                  hint="Show more rows on screen with tighter row spacing."
                  checked={settings.compactRows}
                  onChange={changeSetting('compactRows', (v) => (v ? 'Compact tables enabled' : 'Compact tables disabled'))}
                />
                <Switch
                  label="Confirm before deleting"
                  hint="Prompt confirmation before permanently deleting an entry."
                  checked={settings.confirmDelete}
                  onChange={changeSetting('confirmDelete', (v) => (v ? 'Delete confirmation enabled' : 'Delete confirmation disabled'))}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}
