import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Avatar, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  borderRadius: '10px',
  color: '#C3CFEC',
  py: 1,
  px: 1.5,
  '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 36 },
  '&:hover': { background: 'rgba(255,255,255,.08)' },
  '&.active': { background: '#3454D1', color: '#fff' },
};

function Sidebar({ onNavigate, onLogout }) {
  return (
    <div className="h-full flex flex-col bg-ink text-white px-3 py-5">
      <div className="px-3 pb-6">
        <Typography variant="h5" fontWeight={800}>{env.appName}</Typography>
        <Typography variant="body2" sx={{ color: '#9FB0D9' }}>Your daily money ledger</Typography>
      </div>
      <List className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map((n) => (
          <ListItemButton key={n.to} component={NavLink} to={n.to} end={n.to === '/'} onClick={onNavigate} sx={itemSx}>
            <ListItemIcon>{n.icon}</ListItemIcon>
            <ListItemText primary={n.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>
      <div className="mt-auto pt-3 border-t border-white/10">
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: '10px',
            color: '#9FB0D9',
            py: 0.85,
            px: 1.5,
            transition: 'all 0.15s ease',
            '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 32 },
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#F87171',
              '& .MuiListItemIcon-root': { color: '#F87171' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutIcon sx={{ fontSize: 19 }} />
          </ListItemIcon>
          <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
        </ListItemButton>
      </div>
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const paper = { width: 248, border: 0, background: '#18233F' };
  const askLogout = () => { setAnchor(null); setDrawer(false); setConfirm(true); };

  const currentNav = NAV.find((n) => (n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to))) || {
    to: location.pathname,
    label: 'Dashboard',
    icon: <DashboardIcon />,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': paper }}>
        <Sidebar onLogout={askLogout} />
      </Drawer>
      <Drawer variant="temporary" open={drawer} onClose={() => setDrawer(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': paper }}>
        <Sidebar onNavigate={() => setDrawer(false)} onLogout={askLogout} />
      </Drawer>

      <div className="md:ml-[248px] flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between gap-4 px-4 md:px-8 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <IconButton className="md:!hidden -ml-2 text-slate-700" onClick={() => setDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <div className="flex items-center gap-2.5">
              <span className="text-[#3454D1] flex items-center justify-center">
                {currentNav.icon}
              </span>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#18233F', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                {currentNav.label}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-right leading-tight">
              <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </div>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
              <Avatar sx={{ bgcolor: '#3454D1', width: 36, height: 36, fontWeight: 700 }}>{user?.name?.[0]}</Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
              <MenuItem component={NavLink} to="/settings" onClick={() => setAnchor(null)}>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={askLogout} sx={{ color: 'error.main' }}>Log out</MenuItem>
            </Menu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 w-full"><Outlet /></main>
      </div>

      <ConfirmDialog open={confirm} danger title="Log out?" text="You will need to sign in again to see your ledger." confirmLabel="Log out" onConfirm={logout} onClose={() => setConfirm(false)} />
    </div>
  );
}
