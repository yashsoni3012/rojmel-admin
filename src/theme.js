import { createTheme } from '@mui/material/styles';

export default createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  palette: {
    primary: {
      main: '#1761B6', // Matched to Rojmel app active tab color
      light: '#3C7ECF',
      dark: '#104987',
      contrastText: '#FFFFFF',
    },
    success: { main: '#0E9F6E' },
    error: { main: '#E5484D' },
    warning: { main: '#F59E0B' },
    info: { main: '#1761B6' },
    background: { default: '#F4F6FB', paper: '#FFFFFF' },
    text: { primary: '#18233F', secondary: '#6B7592' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
    h4: { fontWeight: 800 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.94rem',
          padding: '10px 22px',
          minHeight: 44,
        },
        sizeSmall: {
          padding: '7px 16px',
          fontSize: '0.84rem',
          minHeight: 36,
        },
        sizeMedium: {
          padding: '10px 22px',
          fontSize: '0.94rem',
          minHeight: 44,
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
          minHeight: 48,
        },
        containedPrimary: {
          backgroundColor: '#1761B6',
          color: '#FFFFFF',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#124E94',
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          borderColor: '#1761B6',
          color: '#1761B6',
          '&:hover': {
            borderColor: '#104987',
            backgroundColor: 'rgba(23, 97, 182, 0.06)',
          },
        },
        textPrimary: {
          color: '#1761B6',
          '&:hover': {
            backgroundColor: 'rgba(23, 97, 182, 0.08)',
          },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 1px 2px rgba(24,35,63,.06), 0 8px 24px rgba(24,35,63,.05)' } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700, color: '#6B7592' } } },
  },
});
