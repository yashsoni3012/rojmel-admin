import { Box, Paper, Skeleton } from '@mui/material';

export default function PageSkeleton() {
  return (
    <Box sx={{ width: '100%', animation: 'fadeIn 0.2s ease-in-out' }}>
      {/* Top Header / Search & Action Controls Skeleton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3.5,
        }}
      >
        <Skeleton
          variant="rounded"
          height={40}
          sx={{
            borderRadius: '12px',
            width: { xs: '100%', md: 420 },
            bgcolor: '#FFFFFF',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        />
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Skeleton
            variant="rounded"
            width={160}
            height={40}
            sx={{ borderRadius: 3, bgcolor: '#FFFFFF' }}
          />
          <Skeleton
            variant="rounded"
            width={130}
            height={40}
            sx={{ borderRadius: 3, bgcolor: '#FFFFFF' }}
          />
        </Box>
      </Box>

      {/* Stat Cards Skeleton Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 2.5 },
          mb: 3,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2.5 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="55%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="85%" height={32} />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Filter Toolbar Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" width={220} height={38} sx={{ borderRadius: '10px' }} />
        </Box>
        <Skeleton variant="text" width={130} height={24} />
      </Paper>

      {/* Table Skeleton */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
          p: 2.5,
        }}
      >
        {/* Table Header Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid #F1F5F9' }}>
          <Skeleton variant="text" width="18%" height={24} />
          <Skeleton variant="text" width="18%" height={24} />
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="16%" height={24} />
          <Skeleton variant="text" width="10%" height={24} />
        </Box>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <Box
            key={row}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: row < 5 ? '1px solid #F8FAFC' : 'none',
            }}
          >
            <Skeleton variant="text" width="16%" height={24} />
            <Skeleton variant="rounded" width="14%" height={28} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" width="32%" height={24} />
            <Skeleton variant="text" width="14%" height={24} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

