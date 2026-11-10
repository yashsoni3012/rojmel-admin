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
    primary: { main: '#3454D1' },
    success: { main: '#0E9F6E' },
    error: { main: '#E5484D' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
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
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 1px 2px rgba(24,35,63,.06), 0 8px 24px rgba(24,35,63,.05)' } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700, color: '#6B7592' } } },
  },
});
