import { Button as MuiButton, CircularProgress } from '@mui/material';

export default function Button({ loading, disabled, startIcon, children, variant = 'contained', sx, ...props }) {
  const isContained = variant === 'contained';
  return (
    <MuiButton
      variant={variant}
      disableElevation
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      sx={{
        borderRadius: '12px',
        fontWeight: 700,
        textTransform: 'none',
        fontSize: '0.94rem',
        py: 1.25,
        px: 2.6,
        minHeight: 44,
        ...(isContained
          ? {
              bgcolor: '#1761B6',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#124E94',
                boxShadow: 'none',
              },
            }
          : {}),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
