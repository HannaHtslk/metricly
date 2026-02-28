import { Paper, Typography, useTheme } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TooltipPayload { value?: number }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }

// Simulated monthly new user sign-ups (sums to 100 — our API sample size)
const MONTHLY_DATA = [
  { month: 'Jan', newUsers: 8,  total: 8   },
  { month: 'Feb', newUsers: 10, total: 18  },
  { month: 'Mar', newUsers: 7,  total: 25  },
  { month: 'Apr', newUsers: 12, total: 37  },
  { month: 'May', newUsers: 9,  total: 46  },
  { month: 'Jun', newUsers: 11, total: 57  },
  { month: 'Jul', newUsers: 8,  total: 65  },
  { month: 'Aug', newUsers: 7,  total: 72  },
  { month: 'Sep', newUsers: 10, total: 82  },
  { month: 'Oct', newUsers: 9,  total: 91  },
  { month: 'Nov', newUsers: 5,  total: 96  },
  { month: 'Dec', newUsers: 4,  total: 100 },
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper
      elevation={4}
      sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', minWidth: 130 }}
    >
      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
        {label} 2025
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {payload[0].value?.toLocaleString()} total users
      </Typography>
      <Typography variant="caption" color="text.secondary">
        +{payload[1]?.value} new this month
      </Typography>
    </Paper>
  );
};

const UserGrowthChart = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const gradientId = 'growthGradient';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        borderRadius: 3,
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: 'default',
      }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        User Growth
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Cumulative registered users · Jan – Dec 2025
      </Typography>

      <ResponsiveContainer debounce={300} width="100%" height={260}>
        <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} style={{ cursor: 'default' }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={isDark ? 0.4 : 0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />

          {/* Area for cumulative total */}
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 5, fill: '#6366f1', stroke: theme.palette.background.paper, strokeWidth: 2 }}
          />

          {/* Hidden area just to include newUsers in tooltip payload */}
          <Area
            type="monotone"
            dataKey="newUsers"
            stroke="transparent"
            fill="transparent"
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default UserGrowthChart;
