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
import { useGetUsersQuery } from '../../api/usersApi';

// Indigo → cyan gradient across bars
const BAR_COLORS = [
  '#6366f1', '#7c3aed', '#8b5cf6', '#a78bfa',
  '#22d3ee', '#06b6d4', '#0891b2', '#14b8a6',
  '#10b981', '#34d399',
];

interface TooltipPayload { value?: number }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }

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

const DepartmentHeadcountChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];

    const counts: Record<string, number> = {};
    data.users.forEach((u) => {
      const d = u.company.department;
      counts[d] = (counts[d] ?? 0) + 1;
    });

    return Object.entries(counts)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Dynamic height so every bar gets ~34px
  const chartHeight = Math.max(260, chartData.length * 34);

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Department Headcount
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Users per department · sorted by size
      </Typography>

      {chartData.length === 0 ? (
        <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary" variant="body2">No data</Typography>
        </Box>
      ) : (
        <ResponsiveContainer debounce={300} width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
            barSize={20}
            style={{ cursor: 'default' }}
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
              dataKey="dept"
              width={130}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
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

export default DepartmentHeadcountChart;
