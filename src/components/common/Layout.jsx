import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DashboardIcon from '@mui/icons-material/SpaceDashboardRounded';
import CalendarIcon from '@mui/icons-material/CalendarMonthRounded';
import IncomeIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ExpenseIcon from '@mui/icons-material/ShoppingCartRounded';
import PetrolIcon from '@mui/icons-material/LocalGasStationRounded';
import SavingsIcon from '@mui/icons-material/SavingsRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { env } from '../../config/env.js';

const NAV = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/daily', label: 'Day by day', icon: <CalendarIcon /> },
  { to: '/income', label: 'Income', icon: <IncomeIcon /> },
  { to: '/expenses', label: 'Expenses', icon: <ExpenseIcon /> },
  { to: '/petrol', label: 'Petrol', icon: <PetrolIcon /> },
  { to: '/savings', label: 'Savings', icon: <SavingsIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

const itemSx = {
  borderRadius: '12px',
  color: '#C3CFEC',
  py: 1.1,
  px: 2,
  mb: 0.5,
  '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 38 },
  '&:hover': { background: 'rgba(255,255,255,.08)', color: '#FFFFFF' },
  '&.active': { background: '#3454D1', color: '#FFFFFF', fontWeight: 700 },
};

function Sidebar({ onNavigate, onLogout, onClose, isDrawer }) {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col bg-[#18233F] text-white">
      {/* Brand Header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            {env.appName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#9FB0D9', display: 'block', mt: 0.2 }}>
            Your daily money ledger
          </Typography>
        </div>
        {isDrawer && (
          <IconButton
            onClick={onClose}
            sx={{
              color: '#9FB0D9',
              p: 1,
              '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
            aria-label="close sidebar"
          >
            <CloseRoundedIcon />
          </IconButton>
        )}
      </div>

      {/* User profile on drawer */}
      {isDrawer && user && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <Avatar sx={{ bgcolor: '#3454D1', width: 40, height: 40, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <div className="min-w-0 flex-1">
            <Typography variant="body2" fontWeight={700} noWrap sx={{ color: '#FFFFFF' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#9FB0D9', display: 'block' }}>
              {user.email}
            </Typography>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <List className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((n) => (
          <ListItemButton
            key={n.to}
            component={NavLink}
            to={n.to}
            end={n.to === '/'}
            onClick={onNavigate}
            sx={itemSx}
          >
            <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>{n.icon}</ListItemIcon>
            <ListItemText
              primary={n.label}
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Logout button at bottom */}
      <div className="mt-auto p-3 border-t border-white/10">
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: '10px',
            color: '#9FB0D9',
            py: 1,
            px: 1.5,
            transition: 'all 0.15s ease',
            '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 32 },
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.14)',
              color: '#F87171',
              '& .MuiListItemIcon-root': { color: '#F87171' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600 }} />
        </ListItemButton>
      </div>
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const paper = { width: 256, border: 0, background: '#18233F' };

  const askLogout = () => {
    setAnchor(null);
    setDrawer(false);
    setConfirm(true);
  };

  const currentNav = NAV.find((n) => (n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to))) || {
    to: location.pathname,
    label: 'Dashboard',
    icon: <DashboardIcon />,
  };

  // Determine active item in mobile bottom navigation
  const getBottomNavValue = () => {
    if (drawer) return 'menu';
    if (location.pathname === '/daily') return '/daily';
    if (location.pathname === '/income') return '/income';
    if (location.pathname === '/expenses') return '/expenses';
    return false;
  };

  const handleBottomNavChange = (event, newValue) => {
    if (newValue === 'menu') {
      setDrawer(true);
    } else if (newValue) {
      setDrawer(false);
      navigate(newValue);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F6FB' }}>
      {/* Desktop Permanent Drawer (>= 1024px / lg) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': paper,
        }}
      >
        <Sidebar onLogout={askLogout} />
      </Drawer>

      {/* Mobile & Tablet Temporary Drawer (< 1024px / < lg) */}
      <Drawer
        variant="temporary"
        open={drawer}
        onClose={() => setDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': paper,
        }}
      >
        <Sidebar
          onNavigate={() => setDrawer(false)}
          onClose={() => setDrawer(false)}
          onLogout={askLogout}
          isDrawer
        />
      </Drawer>

      {/* Main Content Area: Responsive margin-left matching the drawer breakpoint exactly */}
      <Box
        sx={{
          ml: { xs: 0, lg: '256px' },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { xs: '100%', lg: 'calc(100% - 256px)' },
        }}
      >
        {/* Top Navigation Bar / AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #E2E8F0',
            color: '#18233F',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 58, sm: 64 }, px: { xs: 2, sm: 3, lg: 4 }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              {/* Sidebar Hamburger Toggle on Mobile & Tablet (< 1024px) */}
              <IconButton
                edge="start"
                onClick={() => setDrawer(true)}
                sx={{
                  display: { xs: 'inline-flex', lg: 'none' },
                  color: '#18233F',
                  bgcolor: 'rgba(0,0,0,0.03)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                  p: 1,
                  mr: 0.5,
                }}
                aria-label="open menu"
              >
                <MenuRoundedIcon />
              </IconButton>

              {/* Current Page Indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3454D1',
                    bgcolor: 'rgba(52, 84, 209, 0.08)',
                    p: 0.8,
                    borderRadius: '10px',
                    '& .MuiSvgIcon-root': { fontSize: { xs: 20, sm: 22 } },
                  }}
                >
                  {currentNav.icon}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  noWrap
                  sx={{
                    color: '#18233F',
                    letterSpacing: '-0.01em',
                    fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.25rem' },
                  }}
                >
                  {currentNav.label}
                </Typography>
              </Box>
            </Box>

            {/* Right User Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', lineHeight: 1.2 }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#18233F' }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7592' }}>
                  {user?.email}
                </Typography>
              </Box>
              <IconButton
                onClick={(e) => setAnchor(e.currentTarget)}
                size="small"
                sx={{
                  p: 0.5,
                  border: '2px solid transparent',
                  '&:hover': { borderColor: '#3454D1' },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#3454D1',
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 190,
                    border: '1px solid #E2E8F0',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, display: { xs: 'block', sm: 'none' } }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {user?.email}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
                <MenuItem
                  component={NavLink}
                  to="/settings"
                  onClick={() => setAnchor(null)}
                  sx={{ py: 1, fontWeight: 600, gap: 1.5 }}
                >
                  <SettingsIcon sx={{ fontSize: 20, color: '#6B7592' }} />
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={askLogout}
                  sx={{ py: 1, fontWeight: 600, color: 'error.main', gap: 1.5 }}
                >
                  <LogoutIcon sx={{ fontSize: 20 }} />
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content: pb-24 on mobile/tablet ensures bottom bar does not overlap content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            p: { xs: 2, sm: 3, lg: 4 },
            pb: { xs: 12, lg: 4 },
            maxWidth: '1600px',
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Mobile & Tablet Bottom Navigation Bar (Material UI) */}
      <Paper
        elevation={8}
        sx={{
          display: { xs: 'block', lg: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderTop: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          pb: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <BottomNavigation
          showLabels
          value={getBottomNavValue()}
          onChange={handleBottomNavChange}
          sx={{
            height: 62,
            bgcolor: '#FFFFFF',
            maxWidth: '600px',
            mx: 'auto',
            '& .MuiBottomNavigationAction-root': {
              color: '#64748B',
              minWidth: 0,
              py: 0.75,
              px: 1,
              transition: 'all 0.15s ease-in-out',
              '&.Mui-selected': {
                color: '#3454D1',
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 700,
                  fontSize: '0.74rem',
                },
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontWeight: 600,
                fontSize: '0.71rem',
                mt: 0.4,
                letterSpacing: '-0.01em',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 23,
                transition: 'transform 0.15s ease',
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Day by Day"
            value="/daily"
            icon={<CalendarIcon />}
          />
          <BottomNavigationAction
            label="Income"
            value="/income"
            icon={<IncomeIcon />}
          />
          <BottomNavigationAction
            label="Expense"
            value="/expenses"
            icon={<ExpenseIcon />}
          />
          <BottomNavigationAction
            label="Menu"
            value="menu"
            icon={<MenuRoundedIcon />}
          />
        </BottomNavigation>
      </Paper>

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
