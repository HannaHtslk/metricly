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

const COUNTRY_COLORS = [
  '#22d3ee',
  '#06b6d4',
  '#0891b2',
  '#0e7490',
  '#14b8a6',
  '#10b981',
  '#34d399',
  '#6ee7b7',
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.25}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {payload[0].value} users
      </Typography>
    </Paper>
  );
};

const UsersByCountryChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];

    const counts: Record<string, number> = {};
    data.users.forEach((u) => {
      const c = u.address.country;
      counts[c] = (counts[c] ?? 0) + 1;
    });

    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [data]);

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Users by Country
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Top 8 countries by user count
      </Typography>

      {chartData.length === 0 ? (
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary" variant="body2">No data</Typography>
        </Box>
      ) : (
        <ResponsiveContainer debounce={300} width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
            barSize={18}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="country"
              width={90}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34,211,238,0.06)' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default UsersByCountryChart;
