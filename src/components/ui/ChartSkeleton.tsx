import { Box, Paper, Skeleton } from '@mui/material';

interface ChartSkeletonProps {
  height?: number;
}

const ChartSkeleton = ({ height = 300 }: ChartSkeletonProps) => (
  <Paper
    elevation={0}
    sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
  >
    {/* Chart title area */}
    <Skeleton variant="text" width={160} height={24} sx={{ mb: 0.5 }} />
    <Skeleton variant="text" width={100} height={16} sx={{ mb: 2.5 }} />

    {/* Fake chart body with varying bar heights */}
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height, px: 1 }}>
      {[65, 80, 50, 90, 70, 85, 60, 75, 55, 88, 45, 72].map((h, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          sx={{
            flex: 1,
            height: `${h}%`,
            borderRadius: '4px 4px 0 0',
          }}
        />
      ))}
    </Box>
  </Paper>
);

export default ChartSkeleton;
