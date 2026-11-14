import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from './Button.jsx';

export default function ConfirmDialog({ open, title, text, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  const isDanger =
    Boolean(danger) ||
    confirmLabel?.toLowerCase().includes('log out') ||
    confirmLabel?.toLowerCase().includes('delete') ||
    confirmLabel?.toLowerCase().includes('remove');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '18px',
          p: 1,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
        },
      }}
    >
      <DialogTitle fontWeight={800} sx={{ fontSize: '1.25rem', pt: 2, pb: 1, color: '#18233F' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        <DialogContentText sx={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1.5, gap: 1 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={onClose}
          sx={{
            fontWeight: 700,
            color: '#64748B',
            minHeight: 44,
            px: 2.5,
            borderRadius: '10px',
            '&:hover': { bgcolor: '#F1F5F9', color: '#1E293B' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={isDanger ? 'error' : 'primary'}
          sx={{
            bgcolor: isDanger ? '#E5484D !important' : '#1761B6 !important',
            background: isDanger ? '#E5484D !important' : '#1761B6 !important',
            color: '#FFFFFF !important',
            fontWeight: 700,
            fontSize: '0.95rem',
            minHeight: 44,
            px: 3,
            borderRadius: '10px',
            boxShadow: isDanger
              ? '0 2px 8px rgba(229, 72, 77, 0.35)'
              : '0 2px 8px rgba(23, 97, 182, 0.25)',
            '&:hover': {
              bgcolor: isDanger ? '#DC2626 !important' : '#124E94 !important',
              background: isDanger ? '#DC2626 !important' : '#124E94 !important',
            },
          }}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
