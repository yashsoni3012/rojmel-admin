import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ADMIN_COLORS } from '../theme/adminTheme.js';

const STATS = [
  {
    title: 'Total Platform Users',
    value: '1,428',
    change: '+14% this month',
    icon: PeopleAltRoundedIcon,
    accent: ADMIN_COLORS.darkTeal, // Dark Teal
    bg: ADMIN_COLORS.softMint, // Soft Mint
  },
  {
    title: 'Active Pro Subscriptions',
    value: '842',
    change: '₹1,26,300 MRR',
    icon: WorkspacePremiumRoundedIcon,
    accent: ADMIN_COLORS.emerald, // Emerald Green
    bg: 'rgba(16, 168, 120, 0.12)',
  },
  {
    title: 'Platform Ledger Volume',
    value: '₹48,25,900',
    change: '84,920 Total Entries',
    icon: AccountBalanceRoundedIcon,
    accent: ADMIN_COLORS.darkTeal,
    bg: ADMIN_COLORS.softMint,
  },
  {
    title: 'Server Cluster Status',
    value: 'Optimal (24ms)',
    change: '99.98% Uptime',
    icon: DnsRoundedIcon,
    accent: ADMIN_COLORS.emerald,
    bg: 'rgba(16, 168, 120, 0.12)',
  },
];

// Charts data: Emerald (#10A878) + Teal (#075B59)
const CHART_BARS = [
  { day: 'Mon', entries: 1240, tealShare: 65, emeraldShare: 35, height: '58%' },
  { day: 'Tue', entries: 1890, tealShare: 55, emeraldShare: 45, height: '74%' },
  { day: 'Wed', entries: 2340, tealShare: 60, emeraldShare: 40, height: '90%' },
  { day: 'Thu', entries: 1670, tealShare: 50, emeraldShare: 50, height: '68%' },
  { day: 'Fri', entries: 2120, tealShare: 70, emeraldShare: 30, height: '82%' },
  { day: 'Sat', entries: 2560, tealShare: 62, emeraldShare: 38, height: '96%' },
  { day: 'Sun', entries: 1420, tealShare: 45, emeraldShare: 55, height: '60%' },
];

const INITIAL_USERS = [
  {
    id: 'USR-8921',
    name: 'Rajesh Patel',
    email: 'rajesh.patel@gmail.com',
    plan: 'Pro Plan',
    entries: '1,240',
    status: 'Active',
    date: '12 Nov 2026',
    avatar: 'RP',
  },
  {
    id: 'USR-8920',
    name: 'Amit Shah',
    email: 'amit.shah@business.in',
    plan: 'Enterprise',
    entries: '3,890',
    status: 'Active',
    date: '10 Nov 2026',
    avatar: 'AS',
  },
  {
    id: 'USR-8919',
    name: 'Pooja Dave',
    email: 'pooja.dave@outlook.com',
    plan: 'Pro Plan',
    entries: '650',
    status: 'Active',
    date: '08 Nov 2026',
    avatar: 'PD',
  },
  {
    id: 'USR-8918',
    name: 'Ketan Mehta',
    email: 'ketan.mehta@yahoo.com',
    plan: 'Free Trial',
    entries: '124',
    status: 'Trial (5 days left)',
    date: '04 Nov 2026',
    avatar: 'KM',
  },
  {
    id: 'USR-8917',
    name: 'Bhavin Joshi',
    email: 'bhavin.j@gmail.com',
    plan: 'Pro Plan',
    entries: '840',
    status: 'Active',
    date: '01 Nov 2026',
    avatar: 'BJ',
  },
];

const RECENT_LOGS = [
  {
    event: 'Master Super Admin login session established',
    user: 'admin@gmail.com',
    time: 'Just now',
    type: 'success',
  },
  {
    event: 'Automated database snapshot completed (32MB)',
    user: 'System Cron',
    time: '24 mins ago',
    type: 'info',
  },
  {
    event: 'Tenant USR-8920 upgraded from Free to Enterprise',
    user: 'Payment Gateway',
    time: '2 hours ago',
    type: 'success',
  },
  {
    event: 'Invoice PDF generated and dispatched for subscription',
    user: 'Billing Worker',
    time: '5 hours ago',
    type: 'info',
  },
];

export default function AdminDashboard() {
  const { adminUser } = useAdminAuth();
  const toast = useToast();
  const [users] = useState(INITIAL_USERS);

  const handleAction = (label) => {
    toast.info(`${label} action triggered`);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Super Admin Welcome Banner: Deep Navy (#062B3A) */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.2, sm: 2.8 },
          borderRadius: '16px',
          bgcolor: ADMIN_COLORS.deepNavy, // Deep Navy (#062B3A)
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid rgba(227, 234, 237, 0.15)`,
          boxShadow: '0 4px 20px rgba(6, 43, 58, 0.15)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(16, 168, 120, 0.22) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Chip
                icon={<ShieldRoundedIcon sx={{ fontSize: '14px !important', color: `${ADMIN_COLORS.emerald} !important` }} />}
                label="Super Admin Role"
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 168, 120, 0.15)',
                  color: ADMIN_COLORS.emerald,
                  border: `1px solid rgba(16, 168, 120, 0.35)`,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
              <Typography variant="caption" sx={{ color: '#9BB1BC' }}>
                Session: {adminUser?.email || 'admin@gmail.com'}
              </Typography>
            </Box>

            <Typography variant="h4" fontWeight={800} sx={{ color: '#FFFFFF', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Super Administrator Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#D4E2E8', mt: 0.5, maxWidth: 650 }}>
              Live overview of all Rojmel platform tenants, financial activity volumes, and system health.
            </Typography>
          </Box>

          {/* Buttons: Dark Teal (#075B59) */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAction('System Backup')}
              startIcon={<BackupRoundedIcon />}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(227, 234, 237, 0.3)',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: '#FFFFFF' },
              }}
            >
              Backup DB
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleAction('Add Tenant')}
              startIcon={<PersonAddRoundedIcon />}
              sx={{
                bgcolor: ADMIN_COLORS.darkTeal,
                color: '#FFFFFF',
                border: `1px solid rgba(16, 168, 120, 0.35)`,
                '&:hover': { bgcolor: '#054846' },
              }}
            >
              Add Tenant
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* KPI Stats Grid: Matte White Cards */}
      <Grid container spacing={2}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={stat.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: `1px solid ${ADMIN_COLORS.border}`,
                  bgcolor: ADMIN_COLORS.white, // Cards: Matte White (#FFFFFF)
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px -4px rgba(20, 43, 56, 0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: ADMIN_COLORS.textSecondary }}>
                    {stat.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: stat.bg,
                      color: stat.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color: ADMIN_COLORS.textPrimary, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <TrendingUpRoundedIcon sx={{ fontSize: 16, color: ADMIN_COLORS.emerald }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: ADMIN_COLORS.emerald }}>
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Section: Emerald + Teal */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '16px',
          border: `1px solid ${ADMIN_COLORS.border}`,
          bgcolor: ADMIN_COLORS.white, // Cards: Matte White
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChartRoundedIcon sx={{ color: ADMIN_COLORS.darkTeal }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: ADMIN_COLORS.textPrimary }}>
                Platform Activity & Ledger Volume
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: ADMIN_COLORS.textSecondary }}>
              Weekly transaction volume breakdown (Emerald: Savings/Income, Dark Teal: Expenses)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: ADMIN_COLORS.darkTeal }} />
              <Typography variant="caption" fontWeight={600} sx={{ color: ADMIN_COLORS.textSecondary }}>
                Dark Teal (Transactions)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: ADMIN_COLORS.emerald }} />
              <Typography variant="caption" fontWeight={600} sx={{ color: ADMIN_COLORS.textSecondary }}>
                Emerald (Growth Volume)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Visual Chart Bars (Emerald + Teal) */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, pt: 2, px: { xs: 1, sm: 3 } }}>
          {CHART_BARS.map((bar) => (
            <Box key={bar.day} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '11%' }}>
              <Box sx={{ width: '100%', height: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 36,
                    height: bar.height,
                    borderRadius: '8px 8px 4px 4px',
                    background: `linear-gradient(180deg, ${ADMIN_COLORS.emerald} 0%, ${ADMIN_COLORS.darkTeal} 100%)`,
                    boxShadow: '0 4px 10px rgba(7, 91, 89, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.9,
                      transform: 'scaleY(1.05)',
                    },
                  }}
                  title={`${bar.day}: ${bar.entries} entries`}
                />
              </Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: ADMIN_COLORS.textSecondary, fontSize: '0.75rem' }}>
                {bar.day}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Main Content Grid: Tenants Table & System Logs */}
      <Grid container spacing={2}>
        {/* Platform Tenants Table: White with subtle borders */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: `1px solid ${ADMIN_COLORS.border}`,
              bgcolor: ADMIN_COLORS.white, // Tables: White with subtle borders
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${ADMIN_COLORS.border}`,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: ADMIN_COLORS.textPrimary }}>
                  Platform Tenants & Users
                </Typography>
                <Typography variant="caption" sx={{ color: ADMIN_COLORS.textSecondary }}>
                  Manage registered accounts, subscription plans and ledger volumes
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleAction('Export CSV')}
                  startIcon={<FileDownloadRoundedIcon />}
                  sx={{
                    fontSize: '0.75rem',
                    borderColor: ADMIN_COLORS.border,
                    color: ADMIN_COLORS.textPrimary,
                    '&:hover': {
                      borderColor: ADMIN_COLORS.darkTeal,
                      bgcolor: ADMIN_COLORS.background,
                    },
                  }}
                >
                  Export
                </Button>
                <IconButton size="small" onClick={() => toast.info('Refreshed user records')}>
                  <RefreshRoundedIcon fontSize="small" sx={{ color: ADMIN_COLORS.textSecondary }} />
                </IconButton>
              </Box>
            </Box>

            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>User / Tenant</TableCell>
                    <TableCell>Plan Tier</TableCell>
                    <TableCell>Entries</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              bgcolor: ADMIN_COLORS.darkTeal,
                              color: '#FFFFFF',
                            }}
                          >
                            {row.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ color: ADMIN_COLORS.textPrimary }}>
                              {row.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: ADMIN_COLORS.textSecondary }}>
                              {row.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={row.plan}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            bgcolor: row.plan === 'Enterprise' ? ADMIN_COLORS.softMint : 'rgba(7, 91, 89, 0.08)',
                            color: row.plan === 'Enterprise' ? ADMIN_COLORS.darkTeal : ADMIN_COLORS.textPrimary,
                            border: `1px solid ${ADMIN_COLORS.border}`,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600} sx={{ color: ADMIN_COLORS.textPrimary }}>
                          {row.entries}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={<CheckCircleRoundedIcon sx={{ fontSize: '12px !important', color: `${ADMIN_COLORS.emerald} !important` }} />}
                          label={row.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            bgcolor: row.status.includes('Active') ? ADMIN_COLORS.softMint : '#FFFBEB',
                            color: row.status.includes('Active') ? ADMIN_COLORS.darkTeal : '#B45309',
                            border: `1px solid ${row.status.includes('Active') ? 'rgba(16, 168, 120, 0.3)' : '#FDE68A'}`,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" sx={{ color: ADMIN_COLORS.textSecondary }}>
                          {row.date}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Manage Tenant">
                          <IconButton size="small" onClick={() => handleAction(`Manage ${row.name}`)}>
                            <MoreVertRoundedIcon fontSize="small" sx={{ color: ADMIN_COLORS.textSecondary }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* System Activity & Diagnostics Feed: Matte White Card */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.8,
              borderRadius: '16px',
              border: `1px solid ${ADMIN_COLORS.border}`,
              bgcolor: ADMIN_COLORS.white,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: ADMIN_COLORS.textPrimary }}>
                Live System Activity
              </Typography>
              <Typography variant="caption" sx={{ color: ADMIN_COLORS.textSecondary }}>
                Audit trail & super admin security logs
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {RECENT_LOGS.map((log, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.8,
                    borderRadius: '12px',
                    bgcolor: ADMIN_COLORS.background,
                    border: `1px solid ${ADMIN_COLORS.border}`,
                  }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ color: ADMIN_COLORS.textPrimary, mb: 0.5 }}>
                    {log.event}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: ADMIN_COLORS.darkTeal }}>
                      {log.user}
                    </Typography>
                    <Typography variant="caption" sx={{ color: ADMIN_COLORS.textSecondary }}>
                      {log.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Quick credentials card */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: ADMIN_COLORS.softMint, // Soft Mint
                border: `1px solid rgba(16, 168, 120, 0.35)`,
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ color: ADMIN_COLORS.darkTeal, display: 'block', mb: 0.5 }}>
                SUPER ADMIN CREDENTIALS
              </Typography>
              <Typography variant="body2" sx={{ color: ADMIN_COLORS.textPrimary, fontSize: '0.82rem' }}>
                Email: <strong>admin@gmail.com</strong>
                <br />
                Password: <strong>123456</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
