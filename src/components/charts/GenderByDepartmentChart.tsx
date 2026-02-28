import { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetUsersQuery } from '../../api/usersApi';

const MALE_COLOR   = '#3b82f6';
const FEMALE_COLOR = '#ec4899';

interface TooltipPayload { value?: number; name?: string; fill?: string }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const total = (payload[0].value ?? 0) + (payload[1]?.value ?? 0);
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.fill, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
            {p.name}
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            {p.value}
          </Typography>
        </Box>
      ))}
      <Box sx={{ mt: 0.75, pt: 0.75, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Total: <strong>{total}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

const GenderByDepartmentChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];

    const deptMap: Record<string, { male: number; female: number }> = {};
    data.users.forEach((u) => {
      const d = u.company.department;
      if (!deptMap[d]) deptMap[d] = { male: 0, female: 0 };
      if (u.gender === 'male') deptMap[d].male++;
      else deptMap[d].female++;
    });

    return Object.entries(deptMap)
      .map(([dept, counts]) => ({ dept, ...counts, total: counts.male + counts.female }))
      .sort((a, b) => b.total - a.total);
  }, [data]);

  const chartHeight = Math.max(260, chartData.length * 34);
  const legendStyle = { fontSize: '0.8rem', color: theme.palette.text.secondary };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Gender by Department
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Male / female split across teams
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
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
            barSize={20}
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
            <Legend
              iconType="circle"
              iconSize={9}
              formatter={(value) => (
                <span style={{ ...legendStyle, textTransform: 'capitalize' }}>{value}</span>
              )}
            />
            <Bar dataKey="male"   stackId="a" fill={MALE_COLOR}   radius={[0, 0, 0, 0]} />
            <Bar dataKey="female" stackId="a" fill={FEMALE_COLOR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default GenderByDepartmentChart;
