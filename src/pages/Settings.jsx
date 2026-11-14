import { useState, useEffect, useRef } from 'react';
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
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PageHeader from '../components/common/PageHeader.jsx';
import Switch from '../components/common/Switch.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { authService } from '../services/authService.js';
import { env } from '../config/env.js';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { settings, update } = useSettings();
  const { subscription } = useSubscription();
  const toast = useToast();
  const fileInputRef = useRef(null);

  // Edit Mode toggle: False by default (View Mode)
  const [isEditing, setIsEditing] = useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    _id: user?._id || '',
    name: user?.name || user?.ownerName || '',
    ownerName: user?.ownerName || user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    shopName: user?.shopName || '',
    businessType: user?.businessType || '',
    city: user?.city || '',
    address: user?.address || '',
    role: user?.role || 'owner',
    profileImage: user?.profileImage || null,
  });

  // Edit Form Draft State
  const [editForm, setEditForm] = useState({ ...profileData });
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Change Password Form State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  // Fetch full profile from API on mount
  useEffect(() => {
    let mounted = true;
    authService
      .getProfile()
      .then((data) => {
        if (!mounted || !data) return;
        const normalized = {
          _id: data._id || '',
          name: data.name || data.ownerName || '',
          ownerName: data.ownerName || data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          shopName: data.shopName || '',
          businessType: data.businessType || '',
          city: data.city || '',
          address: data.address || '',
          role: data.role || 'owner',
          profileImage: data.profileImage || null,
        };
        setProfileData(normalized);
        setEditForm(normalized);
        if (updateUser) {
          updateUser(normalized);
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

  // Start Editing
  const handleStartEdit = () => {
    setEditForm({ ...profileData });
    setIsEditing(true);
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  // Handle Image File Selection (converts to Data URL for instant preview & API payload)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditForm((prev) => ({ ...prev, profileImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Profile Submit: PATCH /api/auth/profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const effectiveName = (editForm.name || editForm.ownerName || '').trim();
    if (!effectiveName) {
      toast.error('Name cannot be empty');
      return;
    }

    setProfileLoading(true);
    try {
      const payload = {
        name: effectiveName,
        ownerName: effectiveName,
        mobile: editForm.mobile,
        shopName: editForm.shopName,
        businessType: editForm.businessType,
        city: editForm.city,
        address: editForm.address,
        profileImage: editForm.profileImage,
      };

      const updated = await authService.updateProfile(payload);
      const normalized = {
        ...profileData,
        ...updated,
        name: effectiveName,
        ownerName: effectiveName,
        profileImage: editForm.profileImage,
      };

      setProfileData(normalized);
      setEditForm(normalized);
      if (updateUser) {
        updateUser(normalized);
      }
      setIsEditing(false);
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
      errs.newPassword = 'Enter new password (min. 8 characters)';
    } else if (passwordForm.newPassword.length < 8) {
      errs.newPassword = 'Password must be at least 8 characters long';
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
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const displayName = profileData.name || profileData.ownerName || 'Admin User';

  return (
    <div className="w-full">
      <PageHeader
        title="Admin Profile & Settings"
        subtitle="View and manage your account details, security credentials, and application preferences"
      />

      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Main Left Column (2 Cols): Profile (View or Edit) & Change Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(24, 35, 63, 0.04)',
              }}
            >
              {/* Card Header with View/Edit toggle */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <PersonOutlineRoundedIcon sx={{ color: '#1761B6', fontSize: 26 }} />
                  <div>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#18233F' }}>
                      {isEditing ? 'Edit Profile' : 'Admin Profile'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      {isEditing
                        ? 'Modify your business and account credentials below'
                        : 'Your account credentials and business information'}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {fetchingProfile && (
                    <Chip
                      size="small"
                      icon={<CircularProgress size={12} color="inherit" />}
                      label="Syncing..."
                      sx={{ height: 24, fontSize: '0.72rem' }}
                    />
                  )}
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      onClick={handleStartEdit}
                      startIcon={<EditRoundedIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        borderRadius: '12px',
                        py: 1,
                        px: 2.5,
                        minHeight: 40,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        bgcolor: '#1761B6 !important',
                        background: '#1761B6 !important',
                        color: '#FFFFFF !important',
                        boxShadow: '0 2px 8px rgba(23, 97, 182, 0.25)',
                        '&:hover': {
                          bgcolor: '#124E94 !important',
                          background: '#124E94 !important',
                          boxShadow: '0 4px 12px rgba(23, 97, 182, 0.35)',
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      startIcon={<CloseRoundedIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        borderRadius: '12px',
                        py: 0.9,
                        px: 2.2,
                        minHeight: 40,
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        textTransform: 'none',
                        borderColor: '#CBD5E1',
                        color: '#64748B',
                        '&:hover': {
                          borderColor: '#94A3B8',
                          bgcolor: '#F8FAFC',
                          color: '#1E293B',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              <Divider sx={{ mb: 3 }} />

              {/* ========================================================= */}
              {/* MODE 1: CLEAN VIEW MODE (Default when visiting profile)   */}
              {/* ========================================================= */}
              {!isEditing ? (
                <div className="space-y-5">
                  {/* Avatar & Header Summary Banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Avatar
                      src={profileData.profileImage || undefined}
                      alt={displayName}
                      sx={{
                        bgcolor: '#1761B6',
                        width: 72,
                        height: 72,
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        boxShadow: '0 4px 16px rgba(23, 97, 182, 0.25)',
                        border: '3px solid #FFFFFF',
                      }}
                    >
                      {!profileData.profileImage && (displayName[0] || 'A').toUpperCase()}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#1E293B', lineHeight: 1.2 }}>
                          {displayName}
                        </Typography>
                        <Chip
                          size="small"
                          label={(profileData.role || 'owner').toUpperCase()}
                          sx={{
                            fontWeight: 800,
                            height: 22,
                            fontSize: '0.72rem',
                            bgcolor: '#EBF3FB',
                            color: '#1761B6',
                          }}
                        />
                        <Chip
                          size="small"
                          icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: '14px !important', color: '#B45309 !important' }} />}
                          label={subscription?.name || 'Pro Ledger'}
                          sx={{
                            bgcolor: '#FEF3C7',
                            color: '#B45309',
                            fontWeight: 800,
                            height: 22,
                            fontSize: '0.72rem',
                          }}
                        />
                        <Chip
                          size="small"
                          label="Active"
                          sx={{
                            bgcolor: '#DCFCE7',
                            color: '#15803D',
                            fontWeight: 700,
                            height: 22,
                            fontSize: '0.72rem',
                          }}
                        />
                      </div>

                      <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                        {profileData.email || 'No email associated'}
                      </Typography>
                    </div>
                  </div>

                  {/* Clean Read-Only Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <PersonOutlineRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          FULL NAME
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {displayName || '—'}
                        </Typography>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <EmailRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          EMAIL ADDRESS
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {profileData.email || '—'}
                        </Typography>
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <PhoneRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          MOBILE NUMBER
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {profileData.mobile || '—'}
                        </Typography>
                      </div>
                    </div>

                    {/* Shop / Business Name */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <StorefrontRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          SHOP / BUSINESS NAME
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {profileData.shopName || '—'}
                        </Typography>
                      </div>
                    </div>

                    {/* Business Category / Type */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <CategoryRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          BUSINESS TYPE
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {profileData.businessType || '—'}
                        </Typography>
                      </div>
                    </div>

                    {/* City */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <LocationCityRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          CITY
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {profileData.city || '—'}
                        </Typography>
                      </div>
                    </div>

                    {/* Shop Address (Spans 2 columns) */}
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                      <HomeWorkRoundedIcon sx={{ color: '#1761B6', fontSize: 22, mt: 0.25 }} />
                      <div>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
                          SHOP / BUSINESS ADDRESS
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 700, mt: 0.25 }}>
                          {profileData.address || '—'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ========================================================= */
                /* MODE 2: EDIT MODE (Only when user clicks "Edit Profile") */
                /* ========================================================= */
                <Box component="form" onSubmit={handleProfileSubmit} noValidate>
                  {/* Profile Image Upload Section */}
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/70 mb-5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                      <Avatar
                        src={editForm.profileImage || undefined}
                        alt={editForm.name || 'User'}
                        sx={{
                          bgcolor: '#1761B6',
                          width: 80,
                          height: 80,
                          fontSize: '1.9rem',
                          fontWeight: 800,
                          boxShadow: '0 4px 14px rgba(23, 97, 182, 0.25)',
                          border: '3px solid #FFFFFF',
                        }}
                      >
                        {!editForm.profileImage && ((editForm.name || editForm.ownerName)?.[0] || 'A').toUpperCase()}
                      </Avatar>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#18233F' }}>
                        Profile Photo
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1.5 }}>
                        Upload a photo or logo for your business account (PNG, JPG, max 5MB)
                      </Typography>

                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CameraAltRoundedIcon sx={{ fontSize: 16 }} />}
                          onClick={() => fileInputRef.current?.click()}
                          sx={{
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            textTransform: 'none',
                            color: '#1761B6',
                            borderColor: '#1761B6',
                            '&:hover': { bgcolor: 'rgba(23, 97, 182, 0.06)', borderColor: '#124E94' },
                          }}
                        >
                          {editForm.profileImage ? 'Change Photo' : 'Upload Photo'}
                        </Button>

                        {editForm.profileImage && (
                          <Button
                            variant="text"
                            size="small"
                            color="error"
                            startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                            onClick={handleRemoveImage}
                            sx={{
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              textTransform: 'none',
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Grid container spacing={2.5}>
                    {/* Full Name / Owner Name */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                        Full Name *
                      </Typography>
                      <TextField
                        fullWidth
                        size="medium"
                        placeholder="e.g. Yash Ranpura"
                        value={editForm.name || editForm.ownerName || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value, ownerName: e.target.value })}
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

                    {/* Email (Read-Only) */}
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
                        value={editForm.email}
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
                        placeholder="e.g. 9737126164"
                        value={editForm.mobile}
                        onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
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
                        value={editForm.shopName}
                        onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })}
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
                        value={editForm.businessType}
                        onChange={(e) => setEditForm({ ...editForm, businessType: e.target.value })}
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
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
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

                    {/* Shop Address */}
                    <Grid item xs={12}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#1E293B', display: 'block', mb: 0.75 }}>
                        Shop / Business Address
                      </Typography>
                      <TextField
                        fullWidth
                        size="medium"
                        placeholder="e.g. Maninagar, Ahmedabad"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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

                    {/* Action Buttons: Cancel & Save Changes */}
                    <Grid item xs={12}>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                          variant="outlined"
                          disabled={profileLoading}
                          onClick={handleCancelEdit}
                          sx={{
                            borderRadius: '12px',
                            py: 1.25,
                            px: 3,
                            minHeight: 46,
                            fontWeight: 700,
                            borderColor: '#CBD5E1',
                            color: '#64748B',
                            textTransform: 'none',
                            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC', color: '#1E293B' },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={profileLoading}
                          startIcon={profileLoading ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                          sx={{
                            py: 1.25,
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
                          {profileLoading ? 'Saving Profile...' : 'Save Changes'}
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            {/* Change Password Card */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(24, 35, 63, 0.04)',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
                <div className="flex items-center gap-2.5">
                  <LockResetRoundedIcon sx={{ color: '#1761B6', fontSize: 26 }} />
                  <div>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#18233F' }}>
                      Security & Change Password
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Ensure your account is using a strong password (minimum 8 characters)
                    </Typography>
                  </div>
                </div>

                {!isChangingPassword ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsChangingPassword(true);
                      setPasswordErrors({});
                    }}
                    startIcon={<LockResetRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      borderRadius: '12px',
                      py: 1,
                      px: 2.5,
                      minHeight: 40,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      bgcolor: '#1761B6 !important',
                      background: '#1761B6 !important',
                      color: '#FFFFFF !important',
                      boxShadow: '0 2px 8px rgba(23, 97, 182, 0.25)',
                      '&:hover': {
                        bgcolor: '#124E94 !important',
                        background: '#124E94 !important',
                        boxShadow: '0 4px 12px rgba(23, 97, 182, 0.35)',
                      },
                    }}
                  >
                    Change Password
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordErrors({});
                    }}
                    startIcon={<CloseRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      borderRadius: '12px',
                      py: 0.9,
                      px: 2.2,
                      minHeight: 40,
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textTransform: 'none',
                      borderColor: '#CBD5E1',
                      color: '#64748B',
                      '&:hover': {
                        borderColor: '#94A3B8',
                        bgcolor: '#F8FAFC',
                        color: '#1E293B',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {isChangingPassword && (
                <>
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
                          placeholder="Min. 8 characters"
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

                      {/* Actions: Cancel and Submit Button */}
                      <Grid item xs={12}>
                        <div className="flex items-center justify-end gap-3 pt-1">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                              setPasswordErrors({});
                            }}
                            sx={{
                              borderRadius: '12px',
                              py: 1.1,
                              px: 3,
                              minHeight: 44,
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              textTransform: 'none',
                              borderColor: '#CBD5E1',
                              color: '#64748B',
                              '&:hover': {
                                borderColor: '#94A3B8',
                                bgcolor: '#F8FAFC',
                                color: '#1E293B',
                              },
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={passwordLoading}
                            startIcon={passwordLoading ? <CircularProgress size={18} color="inherit" /> : <LockResetRoundedIcon />}
                            sx={{
                              py: 1.25,
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
                </>
              )}
            </Paper>
          </div>

          {/* Right Column (1 Col): System Info & Preferences */}
          <div className="space-y-6">
            {/* System Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(24, 35, 63, 0.04)',
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
                  <span className="text-slate-500 font-medium">Account ID</span>
                  <span className="font-bold text-slate-800">#{profileData._id || '3'}</span>
                </div>
              </div>
            </Paper>

            {/* Display & Table Preferences Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(24, 35, 63, 0.04)',
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
