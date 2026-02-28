import { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
interface TooltipPayload { value?: number }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }
import { useGetUsersQuery } from '../../api/usersApi';

const AGE_BUCKETS = [
  { label: '<25',   min: 0,  max: 24  },
  { label: '25–29', min: 25, max: 29  },
  { label: '30–34', min: 30, max: 34  },
  { label: '35–39', min: 35, max: 39  },
  { label: '40–44', min: 40, max: 44  },
  { label: '45–49', min: 45, max: 49  },
  { label: '50+',   min: 50, max: 999 },
];

const BAR_COLORS = [
  '#818cf8',
  '#6366f1',
  '#4f46e5',
  '#7c3aed',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.25}>
        Age {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {payload[0].value} users
      </Typography>
    </Paper>
  );
};

const AgeDistributionChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];
    return AGE_BUCKETS.map(({ label, min, max }) => ({
      label,
      count: data.users.filter((u) => u.age >= min && u.age <= max).length,
    }));
  }, [data]);

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Age Distribution
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Users grouped by age range
      </Typography>

      {chartData.length === 0 ? (
        <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary" variant="body2">No data</Typography>
        </Box>
      ) : (
        <ResponsiveContainer debounce={300} width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default AgeDistributionChart;
