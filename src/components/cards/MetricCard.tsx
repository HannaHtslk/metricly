import { Box, Chip, Paper, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import type { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  /** CSS gradient string, e.g. "linear-gradient(135deg, #6366f1, #8b5cf6)" */
  accentGradient: string;
  trend: {
    value: number;  // positive = up, negative = down
    label: string;  // e.g. "vs last month"
  };
}

const MetricCard = ({ title, value, subtitle, icon, accentGradient, trend }: MetricCardProps) => {
  const isPositive = trend.value >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // Colored top-accent bar
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accentGradient,
        },
      }}
    >
      {/* Header row: title + icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accentGradient,
            color: 'white',
            flexShrink: 0,
            ml: 1,
          }}
        >
          {icon}
        </Box>
      </Box>

      {/* Main value */}
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ lineHeight: 1, mb: subtitle ? 0.75 : 0, fontSize: { xs: '1.6rem', md: '2rem' } }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}

      {/* Footer: trend chip + label */}
      <Box
        sx={{
          mt: 'auto',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Chip
          icon={
            isPositive ? (
              <TrendingUpRoundedIcon sx={{ fontSize: '0.9rem !important' }} />
            ) : (
              <TrendingDownRoundedIcon sx={{ fontSize: '0.9rem !important' }} />
            )
          }
          label={`${isPositive ? '+' : ''}${trend.value}%`}
          size="small"
          sx={{
            bgcolor: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: isPositive ? '#10b981' : '#ef4444',
            border: '1px solid',
            borderColor: isPositive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {trend.label}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MetricCard;
