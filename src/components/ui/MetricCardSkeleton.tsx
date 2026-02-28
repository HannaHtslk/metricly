import { Box, Paper, Skeleton } from '@mui/material';

const MetricCardSkeleton = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      height: '100%',
    }}
  >
    {/* Header row */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Skeleton variant="text" width={90} height={16} />
      <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: 2 }} />
    </Box>

    {/* Value */}
    <Skeleton variant="text" width={120} height={48} sx={{ mb: 0.5 }} />

    {/* Subtitle */}
    <Skeleton variant="text" width={80} height={16} />

    {/* Footer */}
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
      <Skeleton variant="rounded" width={68} height={24} sx={{ borderRadius: 12 }} />
      <Skeleton variant="text" width={80} height={14} />
    </Box>
  </Paper>
);

export default MetricCardSkeleton;
