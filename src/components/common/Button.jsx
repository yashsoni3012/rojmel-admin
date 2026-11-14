import { Button as MuiButton, CircularProgress } from '@mui/material';

export default function Button({
  loading,
  disabled,
  startIcon,
  children,
  variant = 'contained',
  color = 'primary',
  sx,
  ...props
}) {
  const isContained = variant === 'contained';
  const isError = color === 'error';

  return (
    <MuiButton
      variant={variant}
      color={color}
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
          ? isError
            ? {
                bgcolor: '#E5484D',
                color: '#FFFFFF',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#DC2626',
                  boxShadow: 'none',
                },
              }
            : {
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
