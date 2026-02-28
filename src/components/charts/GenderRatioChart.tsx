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

const MALE_COLOR   = '#3b82f6';
const FEMALE_COLOR = '#ec4899';

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

const GenderRatioChart = () => {
  const theme = useTheme();
  const { data } = useGetUsersQuery();

  const chartData = useMemo(() => {
    if (!data) return [];
    const male   = data.users.filter((u) => u.gender === 'male').length;
    const female = data.users.filter((u) => u.gender === 'female').length;
    return [
      { name: 'Male',   value: male   },
      { name: 'Female', value: female },
    ];
  }, [data]);

  const legendStyle = { fontSize: '0.8rem', color: theme.palette.text.secondary };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Gender Ratio
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        Male vs female user split
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="48%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={MALE_COLOR}   />
            <Cell fill={FEMALE_COLOR} />
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

export default GenderRatioChart;
