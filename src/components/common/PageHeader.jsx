import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from './Button.jsx';
import Input from './Input.jsx';

export default function PageHeader({
  title,
  subtitle,
  month,
  onMonth,
  onAdd,
  addLabel = 'Add entry',
  accent = '#3454D1',
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 },
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.45rem', sm: '1.75rem', md: '2.1rem' },
            fontWeight: 800,
            color: '#18233F',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.82rem', sm: '0.9rem' },
              mt: 0.5,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        {onMonth && (
          <Input
            type="month"
            size="small"
            fullWidth={false}
            value={month}
            onChange={(e) => onMonth(e.target.value)}
            sx={{
              background: '#FFFFFF',
              borderRadius: 3,
              minWidth: { xs: '100%', sm: 160 },
              maxWidth: { xs: '100%', sm: 200 },
            }}
          />
        )}
        {onAdd && (
          <Button
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              background: accent,
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              py: 1,
              px: 2.2,
              '&:hover': { background: accent, filter: 'brightness(.92)' },
            }}
          >
            {addLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}
