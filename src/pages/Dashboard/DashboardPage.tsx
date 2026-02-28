import { useMemo } from 'react';
import { Box } from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import WcRoundedIcon from '@mui/icons-material/WcRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import { useGetUsersQuery } from '../../api/usersApi';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/cards/MetricCard';
import MetricCardSkeleton from '../../components/ui/MetricCardSkeleton';
import ChartSkeleton from '../../components/ui/ChartSkeleton';
import UserGrowthChart from '../../components/charts/UserGrowthChart';
import AgeDistributionChart from '../../components/charts/AgeDistributionChart';
import UsersByCountryChart from '../../components/charts/UsersByCountryChart';

// Simulated month-over-month trends — representative of a real growing product
const TRENDS = {
  totalUsers:  { value: 12.5, label: 'vs last month' },
  avgAge:      { value: 0.8,  label: 'vs last month' },
  genderRatio: { value: -1.4, label: 'vs last month' },
  topCountry:  { value: 3.2,  label: 'vs last month' },
};

const CARD_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: 2.5,
  mb: 2.5,
};

const CHART_ROW_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: 2.5,
};

const DashboardPage = () => {
  const { data, isLoading } = useGetUsersQuery();

  const metrics = useMemo(() => {
    if (!data) return null;
    const users = data.users;

    // Total users (API reports full dataset size)
    const totalUsers = data.total;

    // Average age
    const avgAge = users.reduce((sum, u) => sum + u.age, 0) / users.length;

    // Gender split
    const maleCount = users.filter((u) => u.gender === 'male').length;
    const malePct = Math.round((maleCount / users.length) * 100);
    const femalePct = 100 - malePct;

    // Top country
    const countryCounts: Record<string, number> = {};
    users.forEach((u) => {
      const c = u.address.country;
      countryCounts[c] = (countryCounts[c] ?? 0) + 1;
    });
    const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];
    const topCountryPct = Math.round((topCountry[1] / users.length) * 100);

    return { totalUsers, avgAge, malePct, femalePct, topCountry: topCountry[0], topCountryPct };
  }, [data]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Business overview · last updated just now"
      />

      {/* ── KPI Cards ── */}
      <Box sx={CARD_GRID_SX}>
        {isLoading || !metrics ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers.toLocaleString()}
              subtitle="Across all regions"
              icon={<PeopleAltRoundedIcon fontSize="small" />}
              accentGradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
              trend={TRENDS.totalUsers}
            />

            <MetricCard
              title="Average Age"
              value={`${metrics.avgAge.toFixed(1)} yrs`}
              subtitle="Median user age"
              icon={<CakeRoundedIcon fontSize="small" />}
              accentGradient="linear-gradient(135deg, #f59e0b, #f97316)"
              trend={TRENDS.avgAge}
            />

            <MetricCard
              title="Gender Split"
              value={`${metrics.malePct}% Male`}
              subtitle={`${metrics.femalePct}% Female`}
              icon={<WcRoundedIcon fontSize="small" />}
              accentGradient="linear-gradient(135deg, #ec4899, #8b5cf6)"
              trend={TRENDS.genderRatio}
            />

            <MetricCard
              title="Top Country"
              value={metrics.topCountry}
              subtitle={`${metrics.topCountryPct}% of users`}
              icon={<PublicRoundedIcon fontSize="small" />}
              accentGradient="linear-gradient(135deg, #10b981, #22d3ee)"
              trend={TRENDS.topCountry}
            />
          </>
        )}
      </Box>

      {/* ── Growth Chart (full width) ── */}
      {isLoading ? <ChartSkeleton height={260} /> : <UserGrowthChart />}

      {/* ── Age + Country Charts ── */}
      <Box sx={{ ...CHART_ROW_SX, mt: 2.5 }}>
        {isLoading ? (
          <>
            <ChartSkeleton height={240} />
            <ChartSkeleton height={240} />
          </>
        ) : (
          <>
            <AgeDistributionChart />
            <UsersByCountryChart />
          </>
        )}
      </Box>
    </>
  );
};

export default DashboardPage;
