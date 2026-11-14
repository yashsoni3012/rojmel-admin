import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Button from './Button.jsx';
import Input from './Input.jsx';

export default function PageHeader({
  searchValue,
  onSearch,
  searchPlaceholder = 'Search transactions, notes, amounts...',
  month,
  onMonth,
  onAdd,
  addLabel = 'Add entry',
  accent = '#1761B6',
  title,
  subtitle,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 2.5 },
        mb: { xs: 3, sm: 3.5 },
      }}
    >
      {/* If onSearch is provided, render the modern search bar instead of big redundant headings */}
      {onSearch ? (
        <Box sx={{ minWidth: 0, flex: 1, maxWidth: { xs: '100%', md: 440, lg: 520 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue || ''}
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 0.5, mr: 0.5 }}>
                  <SearchRoundedIcon sx={{ color: '#1761B6', fontSize: 22 }} />
                </InputAdornment>
              ),
              endAdornment: searchValue ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onSearch('')}
                    edge="end"
                    aria-label="clear search"
                    sx={{ color: '#94A3B8', p: 0.5 }}
                  >
                    <ClearRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                minHeight: 46,
                bgcolor: '#FFFFFF',
                fontSize: '0.92rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                '& fieldset': { borderColor: '#E2E8F0', transition: 'border-color 0.2s' },
                '&:hover fieldset': { borderColor: '#94A3B8' },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 3px rgba(23, 97, 182, 0.12)',
                  '& fieldset': { borderColor: '#1761B6', borderWidth: '1.5px' },
                },
              },
            }}
          />
        </Box>
      ) : title ? (
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
      ) : null}

      {/* Right Action Controls: Month selector & Add entry button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
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
              borderRadius: '12px',
              minWidth: { xs: '100%', sm: 165 },
              maxWidth: { xs: '100%', sm: 195 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                minHeight: 46,
                fontSize: '0.92rem',
                fontWeight: 600,
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#94A3B8' },
                '&.Mui-focused fieldset': { borderColor: '#1761B6', borderWidth: '1.5px' },
              },
            }}
          />
        )}
        {onAdd && (
          <Button
            startIcon={<AddIcon sx={{ fontSize: 24 }} />}
            onClick={onAdd}
            sx={{
              background: '#1761B6 !important',
              bgcolor: '#1761B6 !important',
              color: '#FFFFFF !important',
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              py: 1.45,
              px: 3.4,
              minHeight: 48,
              fontSize: '0.98rem',
              fontWeight: 700,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(23, 97, 182, 0.28)',
              transition: 'all 0.18s ease-in-out',
              '&:hover': {
                background: '#124E94 !important',
                bgcolor: '#124E94 !important',
                boxShadow: '0 4px 14px rgba(23, 97, 182, 0.38)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {addLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}
