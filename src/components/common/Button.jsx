import { Button as MuiButton, CircularProgress } from '@mui/material';

export default function Button({ loading, disabled, startIcon, children, ...props }) {
  return (
    <MuiButton
      variant="contained" disableElevation disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
