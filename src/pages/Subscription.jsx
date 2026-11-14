import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import PageHeader from '../components/common/PageHeader.jsx';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { inr, prettyDate } from '../utils.js';
import { downloadDirectInvoicePdf } from '../utils/invoicePdf.js';

export default function Subscription() {
  const { subscription = {}, plans = [], history = [], updatePlan } = useSubscription() || {};
  const { user } = useAuth();
  const toast = useToast();
  const [cycle, setCycle] = useState('yearly');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('demo');

  const handleOpenUpgrade = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleConfirmUpgrade = () => {
    if (selectedPlan && updatePlan) {
      updatePlan(selectedPlan.id, selectedPlan.isLifetime ? 'lifetime' : cycle);
      setDialogOpen(false);
      setSelectedPlan(null);
    }
  };

  const handleDownloadInvoice = (inv) => {
    try {
      if (!inv) return;
      downloadDirectInvoicePdf(inv, user);
      toast?.success?.(`Invoice ${inv.invoiceId || 'record'}.pdf downloaded!`);
    } catch (err) {
      console.error('Invoice download error:', err);
      toast?.error?.('Failed to download invoice PDF.');
    }
  };

  const currentPlan = (plans || []).find((p) => p.id === subscription?.id) || plans?.[1] || plans?.[0];

  const q = (search || '').trim().toLowerCase();

  const filteredPlans = (plans || []).filter((p) => {
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.features?.some((f) => f.toLowerCase().includes(q))
    );
  });

  const filteredHistory = (history || []).filter((inv) => {
    if (!q) return true;
    return (
      inv?.invoiceId?.toLowerCase().includes(q) ||
      inv?.planName?.toLowerCase().includes(q) ||
      inv?.cycle?.toLowerCase().includes(q) ||
      String(inv?.amount || '').includes(q) ||
      String(inv?.date || '').includes(q) ||
      inv?.status?.toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* Search Bar replaces the redundant module heading */}
      <PageHeader
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Search plans, features, or billing history..."
      />

      {/* Active Subscription Overview Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 5,
          borderRadius: 3.5,
          border: '1px solid #E2E8F0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(24, 35, 63, 0.04)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>
                CURRENT ACTIVE PLAN
              </Typography>
              <Chip
                icon={<VerifiedRoundedIcon sx={{ fontSize: 16 }} />}
                label={subscription?.status?.toUpperCase() || 'ACTIVE'}
                size="small"
                sx={{
                  bgcolor: '#DCFCE7',
                  color: '#15803D',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#18233F', mb: 1 }}>
              {subscription?.name || 'Pro Ledger'}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
              {currentPlan?.description || 'Active subscription ledger plan.'}
            </Typography>
          </Box>

          {/* Validity & Countdown Box */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: 'rgba(23, 97, 182, 0.08)',
                color: '#1761B6',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <AccessTimeRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                PLAN VALIDITY
              </Typography>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#18233F' }}>
                {subscription?.expiryDate === 'Lifetime'
                  ? 'Lifetime Access (Never Expires)'
                  : `Valid till ${prettyDate(subscription?.expiryDate)}`}
              </Typography>
              {subscription?.expiryDate !== 'Lifetime' && (
                <Typography variant="caption" sx={{ color: '#1761B6', fontWeight: 700 }}>
                  ⏳ {subscription?.daysLeft ?? 365} days remaining
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Billing Cycle Switcher */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 0.6,
            borderRadius: '12px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => setCycle('monthly')}
            sx={{
              px: 3,
              py: 1,
              minHeight: 42,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              bgcolor: cycle === 'monthly' ? '#1761B6' : 'transparent',
              color: cycle === 'monthly' ? '#FFFFFF' : '#64748B',
              '&:hover': {
                bgcolor: cycle === 'monthly' ? '#124E94' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Monthly Billing
          </Button>
          <Button
            onClick={() => setCycle('yearly')}
            sx={{
              px: 3,
              py: 1,
              minHeight: 42,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              bgcolor: cycle === 'yearly' ? '#1761B6' : 'transparent',
              color: cycle === 'yearly' ? '#FFFFFF' : '#64748B',
              '&:hover': {
                bgcolor: cycle === 'yearly' ? '#124E94' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Yearly Billing
          </Button>
        </Paper>

        <Chip
          icon={<BoltRoundedIcon sx={{ fontSize: 16 }} />}
          label="Save up to 30% on Annual Plans"
          size="small"
          sx={{
            bgcolor: '#FEF3C7',
            color: '#B45309',
            fontWeight: 700,
            fontSize: '0.78rem',
            height: 28,
          }}
        />
      </Box>

      {/* Subscription Plans Cards Grid */}
      {filteredPlans.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 3.5,
            border: '1px dashed #CBD5E1',
            textAlign: 'center',
            bgcolor: '#F8FAFC',
          }}
        >
          <Typography variant="body1" fontWeight={700} color="#475569">
            No subscription plans found matching "{search}"
          </Typography>
          <Button
            size="small"
            onClick={() => setSearch('')}
            sx={{ mt: 1, textTransform: 'none', fontWeight: 700, color: '#1761B6' }}
          >
            Clear Search Filter
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {filteredPlans.map((p) => {
            const isCurrent = subscription?.id === p?.id;
            const price = p?.isLifetime
              ? p?.monthlyPrice
              : cycle === 'yearly'
              ? p?.yearlyPrice
              : p?.monthlyPrice;

            return (
              <Paper
                key={p.id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3.5,
                  border: isCurrent
                    ? '2px solid #1761B6'
                    : p.popular
                    ? '2px solid #3B82F6'
                    : '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent
                    ? '0 10px 30px rgba(23, 97, 182, 0.12)'
                    : '0 2px 10px rgba(0,0,0,0.02)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(24, 35, 63, 0.08)',
                  },
                }}
              >
                {/* Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={p.badge}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      bgcolor: p.popular ? 'rgba(23, 97, 182, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: p.popular ? '#1761B6' : '#475569',
                    }}
                  />
                  {isCurrent && (
                    <Chip
                      label="Current Plan"
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                    />
                  )}
                </Box>

                {/* Title & Description */}
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#18233F', mb: 0.5 }}>
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, fontSize: '0.82rem', mb: 2 }}>
                  {p.description}
                </Typography>

                {/* Price */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#18233F' }}>
                    {inr(price)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {p.isLifetime ? '/ one-time' : cycle === 'yearly' ? '/ year' : '/ month'}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                {/* Features List */}
                <Box sx={{ flex: 1, mb: 3 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    INCLUDED FEATURES:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {(p.features || []).map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CheckCircleRoundedIcon sx={{ fontSize: 18, color: '#0E9F6E', flexShrink: 0, mt: 0.2 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

              {/* Action Button */}
              {isCurrent ? (
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 700,
                    minHeight: 46,
                    py: 1.3,
                    fontSize: '0.96rem',
                    borderColor: '#1761B6',
                    color: '#1761B6 !important',
                  }}
                >
                  ✓ Active Plan
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleOpenUpgrade(p)}
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 700,
                    minHeight: 46,
                    py: 1.3,
                    fontSize: '0.96rem',
                    bgcolor: p.popular ? '#1761B6' : '#18233F',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: p.popular ? '#124E94' : '#0F172A',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {p.id === 'free' ? 'Downgrade to Free' : `Upgrade to ${p.name}`}
                </Button>
              )}
            </Paper>
          );
        })}
      </Box>
      )}

      {/* Subscription Billing & Invoices History Table */}
      <Box sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <ReceiptLongRoundedIcon sx={{ color: '#1761B6', fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700} sx={{ color: '#18233F' }}>
            Subscription & Billing History
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
          }}
        >
          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 720 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Invoice ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Plan Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Billing Cycle</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Date Activated</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Valid Until</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Invoice PDF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#94A3B8', fontSize: '0.9rem' }}>
                      No billing invoices found matching "{search}".
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((inv, idx) => (
                    <TableRow key={inv?.invoiceId || `inv-${idx}`} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#18233F' }}>{inv?.invoiceId || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1761B6' }}>{inv?.planName || 'Plan'}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize', color: '#64748B', fontWeight: 600 }}>
                        {inv?.cycle || 'yearly'}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{inr(inv?.amount)}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{prettyDate(inv?.date)}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>
                        {inv?.expiryDate === 'Lifetime' ? 'Lifetime' : prettyDate(inv?.expiryDate)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={inv?.status || 'Active'}
                          size="small"
                          sx={{
                            bgcolor: '#DCFCE7',
                            color: '#15803D',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PictureAsPdfRoundedIcon sx={{ fontSize: 18, color: '#E5484D' }} />}
                          onClick={() => handleDownloadInvoice(inv)}
                          sx={{
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderColor: '#E2E8F0',
                            color: '#18233F',
                            textTransform: 'none',
                            py: 0.5,
                            px: 1.5,
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              borderColor: '#1761B6',
                              bgcolor: 'rgba(23, 97, 182, 0.05)',
                              color: '#1761B6',
                            },
                          }}
                        >
                          Download PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Plan Upgrade / Activation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Confirm Plan Update
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You are updating your subscription to <strong>{selectedPlan.name}</strong>.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  mb: 2.5,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Plan:</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>{selectedPlan.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Billing:</Typography>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                    {selectedPlan.isLifetime ? 'Lifetime' : cycle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Validity:</Typography>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1761B6' }}>
                    {selectedPlan.isLifetime
                      ? 'Lifetime (Never Expires)'
                      : cycle === 'yearly'
                      ? '365 Days (1 Year)'
                      : '30 Days (1 Month)'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={700}>Total Payable:</Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#0E9F6E' }}>
                    {inr(
                      selectedPlan.isLifetime
                        ? selectedPlan.monthlyPrice
                        : cycle === 'yearly'
                        ? selectedPlan.yearlyPrice
                        : selectedPlan.monthlyPrice
                    )}
                  </Typography>
                </Box>
              </Paper>

              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>
                SELECT PAYMENT METHOD
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel
                    value="demo"
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCardRoundedIcon sx={{ fontSize: 18, color: '#1761B6' }} />
                        <Typography variant="body2" fontWeight={600}>
                          Instant Demo Activation (No real card required)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="upi"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">UPI / GPay / PhonePe</Typography>}
                  />
                  <FormControlLabel
                    value="card"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">Debit / Credit Card</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button variant="text" color="inherit" onClick={() => setDialogOpen(false)} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmUpgrade}
            sx={{
              fontWeight: 700,
              bgcolor: '#1761B6',
              px: 3.5,
              py: 1.3,
              minHeight: 46,
              fontSize: '0.96rem',
              borderRadius: '12px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#124E94', boxShadow: 'none' },
            }}
          >
            Confirm & Activate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

