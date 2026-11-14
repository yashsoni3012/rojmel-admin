import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from './Button.jsx';

export default function ConfirmDialog({ open, title, text, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={800}>{title}</DialogTitle>
      <DialogContent><DialogContentText>{text}</DialogContentText></DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="text" color="inherit" onClick={onClose}>Cancel</Button>
        <Button
          color={danger ? 'error' : 'primary'}
          sx={
            danger
              ? {
                  bgcolor: '#E5484D !important',
                  background: '#E5484D !important',
                  color: '#FFFFFF !important',
                  '&:hover': {
                    bgcolor: '#DC2626 !important',
                    background: '#DC2626 !important',
                  },
                }
              : {}
          }
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
