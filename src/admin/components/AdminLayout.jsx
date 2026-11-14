import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  useMediaQuery,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { adminTheme, ADMIN_COLORS } from '../theme/adminTheme.js';

// Optimized sidebar width & uniform 12px boundary space
const SIDEBAR_WIDTH = 270;
const GAP = 12; // Clean, uniform 12px boundary spacing

// Exact items matching user's sidebar
const MENU_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: HomeRoundedIcon },
  { label: 'Users', path: '/admin/users', icon: PeopleAltOutlinedIcon },
  { label: 'Subscriptions', path: '/admin/subscriptions', icon: ConfirmationNumberOutlinedIcon },
  { label: 'Transactions', path: '/admin/transactions', icon: SwapHorizRoundedIcon },
  { label: 'Plans', path: '/admin/plans', icon: WorkspacePremiumOutlinedIcon },
  { label: 'Reports', path: '/admin/reports', icon: LeaderboardOutlinedIcon },
  { label: 'Settings', path: '/admin/settings', icon: SettingsOutlinedIcon },
  { label: 'Logout', path: 'logout', icon: LogoutRoundedIcon, isLogout: true },
];

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(adminTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      logout();
      navigate('/admin/login');
      return;
    }
    navigate(item.path);
    if (isMobile) setMobileOpen(false);
  };

  // Refined Sidebar with #D7E6DF background
  const sidebarContent = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#D7E6DF', // Requested sidebar color: #D7E6DF
        borderRadius: '22px',
        border: '1px solid #C4D8CE',
        px: 2.2,
        py: 2.6,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none', // Without any shadow
        color: ADMIN_COLORS.textPrimary,
        overflowY: 'auto',
      }}
    >
      {/* Brand Logo Header - ONLY the uploaded Logo, no extra text */}
      <Box
        sx={{
          mb: 3,
          pt: 0.5,
          px: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/admin')}
      >
        <Box
          component="img"
          src="/rojmel-full-logo.png"
          alt="Rojmel"
          onError={(e) => {
            e.currentTarget.src = '/rojmel-logo.jpg';
          }}
          sx={{
            width: '100%',
            maxWidth: 220,
            maxHeight: 64,
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Navigation Menu List with larger fonts and comfortable height */}
      <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1 }}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            !item.isLogout &&
            (location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path)));

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                sx={{
                  borderRadius: '14px',
                  py: 1.25,
                  px: 1.8,
                  minHeight: 46,
                  // Active item: solid #10A878, zero shadow
                  bgcolor: isActive ? '#10A878' : 'transparent',
                  color: isActive ? '#FFFFFF' : ADMIN_COLORS.textPrimary,
                  boxShadow: 'none', // Without any shadow
                  transition: 'all 0.18s ease-in-out',
                  '&:hover': {
                    bgcolor: isActive ? '#10A878' : 'rgba(16, 168, 120, 0.08)',
                    boxShadow: 'none',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#FFFFFF' : ADMIN_COLORS.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '1.02rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FFFFFF' : ADMIN_COLORS.textPrimary,
                    letterSpacing: '0.01em',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: ADMIN_COLORS.background }}>
        {/* Desktop Floating Sidebar (Exact 12px outer spacing) */}
        <Box
          component="nav"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            position: 'fixed',
            top: `${GAP}px`,
            bottom: `${GAP}px`,
            left: `${GAP}px`,
            height: `calc(100vh - ${GAP * 2}px)`,
            zIndex: 1200,
          }}
        >
          {sidebarContent}
        </Box>

        {/* Mobile Slide-out Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH + 24,
              p: 1.5,
              bgcolor: 'transparent',
              border: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // Precise offset: sidebar width (270px) + left gap (12px) + gap between sidebar and content (12px) = 294px
            ml: { xs: 0, md: `${SIDEBAR_WIDTH + GAP * 2}px` },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: ADMIN_COLORS.background,
            pr: { xs: 1.5, sm: 2, md: `${GAP}px` },
            pb: 2.5,
          }}
        >
          {/* Prominent, Increased Height Floating TopBar Card with #D7E6DF background */}
          <Box
            sx={{
              mt: `${GAP}px`,
              mb: 2,
              mx: { xs: 1.5, md: 0 },
              minHeight: 74, // Increased height for clear visibility
              bgcolor: '#D7E6DF', // Same color as sidebar: #D7E6DF
              borderRadius: '18px',
              border: '1px solid #C4D8CE',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 2, sm: 3 },
              py: 1.2,
            }}
          >
            {/* Left Title & Mobile Menu with bigger fonts */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
                  bgcolor: '#FFFFFF',
                  color: ADMIN_COLORS.textPrimary,
                  p: 1,
                  borderRadius: '12px',
                }}
              >
                <MenuRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    color: ADMIN_COLORS.textPrimary,
                    fontSize: { xs: '1.15rem', sm: '1.28rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Super Admin Console
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#4B6359',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'block' },
                    mt: 0.2,
                  }}
                >
                  Rojmel Platform Management & Control
                </Typography>
              </Box>
            </Box>

            {/* Right Status Badge & Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
              {/* System Online Badge */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: 0.9,
                  bgcolor: '#FFFFFF',
                  color: ADMIN_COLORS.darkTeal,
                  px: 1.8,
                  py: 0.7,
                  borderRadius: '12px',
                  border: '1px solid #C4D8CE',
                }}
              >
                <CircleRoundedIcon sx={{ fontSize: 10, color: ADMIN_COLORS.emerald }} />
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>
                  System Online
                </Typography>
              </Box>

              {/* Notification icon */}
              <Tooltip title="Notifications">
                <IconButton
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1px solid #C4D8CE',
                    color: ADMIN_COLORS.textPrimary,
                    p: 1,
                    borderRadius: '12px',
                    '&:hover': { bgcolor: '#F4F7FA' },
                  }}
                >
                  <NotificationsNoneRoundedIcon sx={{ fontSize: 21 }} />
                </IconButton>
              </Tooltip>

              {/* Admin Profile pill */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #C4D8CE',
                  py: 0.6,
                  px: 1.2,
                  borderRadius: '12px',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: ADMIN_COLORS.deepNavy,
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: `2px solid ${ADMIN_COLORS.emerald}`,
                  }}
                >
                  SA
                </Avatar>
                <Box sx={{ display: { xs: 'none', lg: 'block' }, pr: 0.5 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: ADMIN_COLORS.textPrimary, lineHeight: 1.1, fontSize: '0.84rem' }}>
                    {adminUser?.name || 'Super Admin'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#4B6359', fontSize: '0.72rem', lineHeight: 1, fontWeight: 600 }}>
                    Master Admin
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Page Body Content */}
          <Box sx={{ px: { xs: 1.5, md: 0 }, flex: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
