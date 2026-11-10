import { Box, Paper, Typography } from '@mui/material';

export default function StatCard({ label, value, color, icon, hint }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(24,35,63,.06)',
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 42, sm: 48 },
          height: { xs: 42, sm: 48 },
          borderRadius: 2.5,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          background: color + '18',
          color: color,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          noWrap
          sx={{ fontSize: { xs: '0.78rem', sm: '0.85rem' }, mb: 0.2 }}
        >
          {label}
        </Typography>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            color: '#18233F',
            fontSize: { xs: '1.15rem', sm: '1.3rem', md: '1.45rem' },
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
        {hint && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', fontSize: '0.72rem', mt: 0.3 }}
            noWrap
          >
            {hint}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
