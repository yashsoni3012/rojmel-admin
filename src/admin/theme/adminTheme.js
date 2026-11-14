import { createTheme } from '@mui/material/styles';

export const ADMIN_COLORS = {
  deepNavy: '#062B3A',
  darkTeal: '#075B59',
  emerald: '#10A878',
  softMint: '#DDF5EC',
  sidebar: '#D7E6DF',
  background: '#F4F7F8',
  white: '#FFFFFF',
  textPrimary: '#142B38',
  textSecondary: '#71838C',
  border: '#E3EAED',
};

export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: ADMIN_COLORS.darkTeal, // Buttons: Dark Teal
      light: '#0E7C79',
      dark: '#043D3C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: ADMIN_COLORS.emerald, // Active / Accents: Emerald Green
      light: ADMIN_COLORS.softMint, // Soft Mint
      dark: '#0A7855',
      contrastText: '#FFFFFF',
    },
    success: {
      main: ADMIN_COLORS.emerald,
      light: ADMIN_COLORS.softMint,
      dark: '#0A7855',
      contrastText: '#FFFFFF',
    },
    background: {
      default: ADMIN_COLORS.background, // Light Grey
      paper: ADMIN_COLORS.white, // Matte White
    },
    text: {
      primary: ADMIN_COLORS.textPrimary,
      secondary: ADMIN_COLORS.textSecondary,
    },
    divider: ADMIN_COLORS.border,
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: ADMIN_COLORS.textPrimary,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: ADMIN_COLORS.textPrimary,
    },
    h6: {
      fontWeight: 700,
      color: ADMIN_COLORS.textPrimary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: ADMIN_COLORS.white,
          border: `1px solid ${ADMIN_COLORS.border}`,
          boxShadow: '0 1px 3px 0 rgba(20, 43, 56, 0.04), 0 1px 2px -1px rgba(20, 43, 56, 0.03)',
          borderRadius: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 18px',
          fontWeight: 700,
        },
        containedPrimary: {
          backgroundColor: ADMIN_COLORS.darkTeal,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#054846',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: ADMIN_COLORS.background,
          color: ADMIN_COLORS.textSecondary,
          fontWeight: 700,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: `1px solid ${ADMIN_COLORS.border}`,
        },
        body: {
          fontSize: '0.875rem',
          color: ADMIN_COLORS.textPrimary,
          borderBottom: `1px solid ${ADMIN_COLORS.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});
