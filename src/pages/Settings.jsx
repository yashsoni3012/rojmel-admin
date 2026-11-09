import { Avatar, Chip, Divider, Paper, Typography } from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PageHeader from '../components/common/PageHeader.jsx';
import Switch from '../components/common/Switch.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { env } from '../config/env.js';

export default function Settings() {
  const { user } = useAuth();
  const { settings, update } = useSettings();
  const toast = useToast();
  const change = (key, msg) => (v) => {
    update(key, v);
    toast.success(msg(v));
  };

  return (
    <div className="w-full">
      <PageHeader title="Settings" subtitle="Account details and application preferences" />

      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Account Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              gridColumn: { lg: 'span 2' },
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <PersonOutlineRoundedIcon sx={{ color: '#3454D1', fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700}>
                Account Profile
              </Typography>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
              <Avatar
                sx={{
                  bgcolor: '#3454D1',
                  width: 56,
                  height: 56,
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(52,84,209,0.25)',
                }}
              >
                {user?.name?.[0] || 'A'}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1E293B' }}>
                    {user?.name}
                  </Typography>
                  <Chip size="small" label="Administrator" color="primary" sx={{ fontWeight: 700, height: 22, fontSize: '0.75rem' }} />
                  <Chip size="small" label="Active" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700, height: 22, fontSize: '0.75rem' }} />
                </div>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                  ACCOUNT ROLE
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#1E293B', mt: 0.5 }}>
                  Primary Admin
                </Typography>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                  SESSION STATUS
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#1E293B', mt: 0.5 }}>
                  Authenticated & Active
                </Typography>
              </div>
            </div>
          </Paper>

          {/* System & Ledger Overview Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <InfoOutlinedIcon sx={{ color: '#3454D1', fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700}>
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
                <span className="text-slate-500 font-medium">Default Currency</span>
                <span className="font-bold text-slate-800">INR (₹)</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-slate-500 font-medium">Data Storage</span>
                <span className="font-bold text-emerald-600">Local Browser (Offline-Ready)</span>
              </div>
            </div>
          </Paper>
        </div>

        {/* Preferences Card - Full Width */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            width: '100%',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TuneRoundedIcon sx={{ color: '#3454D1', fontSize: 22 }} />
            <Typography variant="h6" fontWeight={700}>
              Display & Table Preferences
            </Typography>
          </div>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Customize your data viewing experience and deletion safety prompts across all module tables.
          </Typography>

          <Divider sx={{ my: 1 }} />

          <div className="divide-y divide-slate-100">
            <Switch
              label="Compact tables"
              hint="Show more rows on screen with tighter row spacing across all module tables."
              checked={settings.compactRows}
              onChange={change('compactRows', (v) => (v ? 'Compact tables turned on' : 'Compact tables turned off'))}
            />
            <Switch
              label="Confirm before deleting"
              hint="Ask for confirmation prompt once more before permanently removing an entry from your ledger."
              checked={settings.confirmDelete}
              onChange={change('confirmDelete', (v) => (v ? 'Delete confirmation enabled' : 'Delete confirmation disabled'))}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
}
