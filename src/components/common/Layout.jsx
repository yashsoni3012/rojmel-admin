import { useState, Suspense } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageSkeleton from './PageSkeleton.jsx';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardIcon from '@mui/icons-material/SpaceDashboardRounded';
import CalendarIcon from '@mui/icons-material/CalendarMonthRounded';
import IncomeIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ExpenseIcon from '@mui/icons-material/ShoppingCartRounded';
import PetrolIcon from '@mui/icons-material/LocalGasStationRounded';
import SavingsIcon from '@mui/icons-material/SavingsRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSubscription } from '../../context/SubscriptionContext.jsx';

// Uniform dimensions matching Super Admin Panel
const SIDEBAR_WIDTH = 270;
const GAP = 12; // Uniform 12px grid boundary spacing

const NAV = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon },
  { to: '/daily', label: 'Day by day', icon: CalendarIcon },
  { to: '/income', label: 'Income', icon: IncomeIcon },
  { to: '/expenses', label: 'Expenses', icon: ExpenseIcon },
  { to: '/petrol', label: 'Petrol', icon: PetrolIcon },
  { to: '/savings', label: 'Savings', icon: SavingsIcon },
  { to: '/subscription', label: 'Subscription', icon: WorkspacePremiumRoundedIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:899px)');
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const askLogout = () => {
    setAnchor(null);
    setDrawer(false);
    setConfirm(true);
  };

  const handleMenuClick = (to) => {
    navigate(to);
    if (isMobile) setDrawer(false);
  };

  // Find current active page metadata for Topbar
  const currentNav = NAV.find((n) => (n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to))) || {
    to: location.pathname,
    label: 'Dashboard',
    icon: DashboardIcon,
  };
  const CurrentIcon = currentNav.icon;

  // 4 Mobile & Tablet Stylish Navigation Items: Day by day, Invest, Expense, Menu (opens sidebar)
  const mobileNavItems = [
    {
      label: 'Day by day',
      icon: CalendarIcon,
      isActive: location.pathname.startsWith('/daily'),
      onClick: () => handleMenuClick('/daily'),
    },
    {
      label: 'Invest',
      icon: TrendingUpRoundedIcon,
      isActive: location.pathname.startsWith('/savings'),
      onClick: () => handleMenuClick('/savings'),
    },
    {
      label: 'Expense',
      icon: ExpenseIcon,
      isActive: location.pathname.startsWith('/expenses'),
      onClick: () => handleMenuClick('/expenses'),
    },
    {
      label: drawer ? 'Close' : 'Menu',
      icon: drawer ? CloseRoundedIcon : MenuRoundedIcon,
      isActive: drawer,
      onClick: () => setDrawer((prev) => !prev),
    },
  ];

  // Sidebar with requested color #C8D9ED and active tabs #1761B6
  const sidebarContent = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#C8D9ED', // Requested sidebar color: #C8D9ED
        borderRadius: '22px',
        border: '1px solid #B0C4DD',
        px: 2.2,
        py: 2.6,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none', // Without any shadow
        color: '#18233F',
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
        onClick={() => handleMenuClick('/')}
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

      {/* Navigation Menu List */}
      <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1 }}>
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to);

          return (
            <ListItem key={n.to} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(n.to)}
                sx={{
                  borderRadius: '14px',
                  py: 1.25,
                  px: 1.8,
                  minHeight: 46,
                  // Active item: solid requested color #1761B6, zero shadow
                  bgcolor: isActive ? '#1761B6' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#18233F',
                  boxShadow: 'none',
                  transition: 'all 0.18s ease-in-out',
                  '&:hover': {
                    bgcolor: isActive ? '#1761B6' : 'rgba(23, 97, 182, 0.08)',
                    boxShadow: 'none',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#FFFFFF' : '#475E7B',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary={n.label}
                  primaryTypographyProps={{
                    fontSize: '1.02rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FFFFFF' : '#18233F',
                    letterSpacing: '0.01em',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Logout Menu Button */}
        <ListItem disablePadding sx={{ mt: 'auto', pt: 1 }}>
          <ListItemButton
            onClick={askLogout}
            sx={{
              borderRadius: '14px',
              py: 1.25,
              px: 1.8,
              minHeight: 46,
              color: '#18233F',
              transition: 'all 0.18s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                '& .MuiListItemIcon-root': { color: '#EF4444' },
                transform: 'translateX(2px)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: '#475E7B',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogoutIcon sx={{ fontSize: 24 }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '1.02rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F4F7F8' }}>
      {/* Desktop Floating Sidebar (Exact 12px boundary spacing) */}
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
        open={drawer}
        onClose={() => setDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH + 24,
            p: 1.5,
            pb: '90px',
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
          // Offset matching Super Admin layout: sidebar width (270px) + left (12px) + gap (12px) = 294px
          ml: { xs: 0, md: `${SIDEBAR_WIDTH + GAP * 2}px` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#F4F7F8',
          pr: { xs: 1.5, sm: 2, md: `${GAP}px` },
          pb: { xs: '100px', md: 2.5 },
          minWidth: 0,
        }}
      >
        {/* Sticky Topbar Container */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            bgcolor: '#F4F7F8',
            pt: `${GAP}px`,
            pb: 1.5,
          }}
        >
          {/* Floating Topbar Card matching requested color: #C8D9ED */}
          <Box
            sx={{
              mx: { xs: 1.5, md: 0 },
              minHeight: 74,
              bgcolor: '#C8D9ED', // Requested topbar color: same as sidebar #C8D9ED
              borderRadius: '18px',
              border: '1px solid #B0C4DD',
              boxShadow: '0 4px 20px rgba(23, 97, 182, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 2, sm: 3 },
              py: 1.2,
            }}
          >
          {/* Left Title & Mobile Hamburger Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawer(true)}
              sx={{
                display: { md: 'none' },
                bgcolor: '#FFFFFF',
                color: '#18233F',
                p: 1,
                borderRadius: '12px',
                border: '1px solid #B0C4DD',
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #B0C4DD',
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1761B6',
                }}
              >
                <CurrentIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    color: '#18233F',
                    fontSize: { xs: '1.15rem', sm: '1.28rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {currentNav.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#475E7B',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'block' },
                    mt: 0.2,
                  }}
                >
                  Your daily money ledger
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Status / Subscription & User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
            {/* Subscription Pill */}
            <Chip
              component={NavLink}
              to="/subscription"
              clickable
              icon={<CircleRoundedIcon sx={{ fontSize: '10px !important', color: '#1761B6 !important' }} />}
              label={subscription?.name || 'Pro Ledger'}
              size="medium"
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: '#FFFFFF',
                color: '#1761B6',
                border: '1px solid #B0C4DD',
                fontWeight: 700,
                fontSize: '0.8rem',
                py: 2,
                px: 1,
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            />

            {/* User Profile Pill */}
            <Box
              onClick={(e) => setAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                bgcolor: '#FFFFFF',
                border: '1px solid #B0C4DD',
                py: 0.6,
                px: 1.2,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                '&:hover': { bgcolor: '#F4F7FA' },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#1761B6',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: '2px solid #1761B6',
                }}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', lg: 'block' }, pr: 0.5 }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#18233F', lineHeight: 1.1, fontSize: '0.84rem' }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475E7B', fontSize: '0.72rem', lineHeight: 1, fontWeight: 600 }}>
                  {user?.email || 'Ledger Account'}
                </Typography>
              </Box>
            </Box>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchor}
              open={!!anchor}
              onClose={() => setAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.2,
                  borderRadius: '14px',
                  minWidth: 220,
                  border: '1px solid #C4D8CE',
                  p: 0.5,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: '#142B38' }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                component={NavLink}
                to="/subscription"
                onClick={() => setAnchor(null)}
                sx={{ py: 1, fontWeight: 600, gap: 1.5, borderRadius: '8px' }}
              >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 20, color: '#10A878' }} />
                Subscription Plans
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/settings"
                onClick={() => setAnchor(null)}
                sx={{ py: 1, fontWeight: 600, gap: 1.5, borderRadius: '8px' }}
              >
                <SettingsIcon sx={{ fontSize: 20, color: '#71838C' }} />
                Settings
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={askLogout}
                sx={{ py: 1, fontWeight: 600, color: '#EF4444', gap: 1.5, borderRadius: '8px' }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
                Log out
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Rojmel Page Content (kept 100% as is inside Outlet) */}
        <Box sx={{ px: { xs: 1.5, md: 0 }, flex: 1, width: '100%', maxWidth: '1600px', mx: 'auto' }}>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>

      {/* Mobile & Tablet Stylish Bottom Navigation Dock */}
      <Box
        component="nav"
        aria-label="Mobile Bottom Navigation"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: { xs: 10, sm: 14 },
          left: { xs: 12, sm: 24 },
          right: { xs: 12, sm: 24 },
          maxWidth: 500,
          mx: 'auto',
          height: 68,
          bgcolor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1.5px solid #C8D9ED',
          boxShadow: '0 12px 36px -4px rgba(23, 97, 182, 0.22), 0 4px 16px rgba(0, 0, 0, 0.06)',
          zIndex: 1400,
          alignItems: 'center',
          justifyContent: 'space-around',
          px: 1,
        }}
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Box
              key={item.label}
              component="button"
              type="button"
              onClick={item.onClick}
              sx={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.4,
                bgcolor: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                p: 0,
                transition: 'all 0.18s ease-in-out',
                '&:active': {
                  transform: 'scale(0.92)',
                },
              }}
            >
              {/* Active Pill Indicator */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: active ? 48 : 34,
                  height: 30,
                  borderRadius: '15px',
                  bgcolor: active ? '#1761B6' : 'transparent',
                  color: active ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: active ? '0 4px 12px rgba(23, 97, 182, 0.35)' : 'none',
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </Box>

              {/* Label */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: active ? 800 : 600,
                  color: active ? '#1761B6' : '#64748B',
                  letterSpacing: active ? '-0.01em' : 'normal',
                  lineHeight: 1,
                  transition: 'color 0.2s ease',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={confirm}
        danger
        title="Log out?"
        text="You will need to sign in again to see your ledger."
        confirmLabel="Log out"
        onConfirm={logout}
        onClose={() => setConfirm(false)}
      />
    </Box>
  );
}
