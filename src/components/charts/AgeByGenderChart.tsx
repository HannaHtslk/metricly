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

const AGE_BUCKETS = [
  { label: '<25',   min: 0,  max: 24  },
  { label: '25–29', min: 25, max: 29  },
  { label: '30–34', min: 30, max: 34  },
  { label: '35–39', min: 35, max: 39  },
  { label: '40–44', min: 40, max: 44  },
  { label: '45–49', min: 45, max: 49  },
  { label: '50+',   min: 50, max: 999 },
];

interface TooltipPayload { value?: number; name?: string; fill?: string }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', minWidth: 130 }}>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
        Age {label}
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
    </Paper>
  );
};

const AgeByGenderChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];

    return AGE_BUCKETS.map(({ label, min, max }) => {
      const bucket = data.users.filter((u) => u.age >= min && u.age <= max);
      return {
        ageGroup: label,
        male:   bucket.filter((u) => u.gender === 'male').length,
        female: bucket.filter((u) => u.gender === 'female').length,
      };
    });
  }, [data]);

  const legendStyle = { fontSize: '0.8rem', color: theme.palette.text.secondary };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Age Distribution by Gender
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Male vs female count across age groups
      </Typography>

      {chartData.length === 0 ? (
        <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary" variant="body2">No data</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
            barSize={22}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
              vertical={false}
            />
            <XAxis
              dataKey="ageGroup"
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
            <Legend
              iconType="circle"
              iconSize={9}
              formatter={(value) => (
                <span style={{ ...legendStyle, textTransform: 'capitalize' }}>{value}</span>
              )}
            />
            <Bar dataKey="male"   fill={MALE_COLOR}   radius={[4, 4, 0, 0]} />
            <Bar dataKey="female" fill={FEMALE_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default AgeByGenderChart;
