import { useMemo } from 'react';
import { Paper, Typography, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetUsersQuery } from '../../api/usersApi';

const COLORS = [
  '#6366f1', // indigo
  '#22d3ee', // cyan
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#94a3b8', // slate — used for "Others"
];

const TOP_N = 6;

interface TooltipPayload { value?: number; name?: string }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[] }

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.25}>
        {item.name}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {item.value} users
      </Typography>
    </Paper>
  );
};

const CountryDistributionChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];

    const counts: Record<string, number> = {};
    data.users.forEach((u) => {
      const c = u.address.state;
      counts[c] = (counts[c] ?? 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top    = sorted.slice(0, TOP_N).map(([name, value]) => ({ name, value }));
    const others = sorted.slice(TOP_N).reduce((sum, [, v]) => sum + v, 0);

    if (others > 0) top.push({ name: 'Others', value: others });
    return top;
  }, [data]);

  const legendStyle = { fontSize: '0.8rem', color: theme.palette.text.secondary };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        State Distribution
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        Top {TOP_N} US states · others grouped
      </Typography>

      <ResponsiveContainer debounce={300} width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="48%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={9}
            formatter={(value) => (
              <span style={legendStyle}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CountryDistributionChart;
