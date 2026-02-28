import { Box } from '@mui/material';
import { useGetUsersQuery } from '../../api/usersApi';
import PageHeader from '../../components/ui/PageHeader';
import ChartSkeleton from '../../components/ui/ChartSkeleton';
import GenderRatioChart from '../../components/charts/GenderRatioChart';
import CountryDistributionChart from '../../components/charts/CountryDistributionChart';
import DepartmentHeadcountChart from '../../components/charts/DepartmentHeadcountChart';
import GenderByDepartmentChart from '../../components/charts/GenderByDepartmentChart';
import AgeByGenderChart from '../../components/charts/AgeByGenderChart';

const TWO_COL = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: 2.5,
};

const AnalyticsPage = () => {
  const { isLoading } = useGetUsersQuery();

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Deep-dive insights computed from user data"
      />

      {/* Row 1 — Gender + Country donuts */}
      <Box sx={{ ...TWO_COL, mb: 2.5 }}>
        {isLoading ? (
          <>
            <ChartSkeleton height={280} />
            <ChartSkeleton height={280} />
          </>
        ) : (
          <>
            <GenderRatioChart />
            <CountryDistributionChart />
          </>
        )}
      </Box>

      {/* Row 2 — Department headcount + Gender by department */}
      <Box sx={{ ...TWO_COL, mb: 2.5 }}>
        {isLoading ? (
          <>
            <ChartSkeleton height={300} />
            <ChartSkeleton height={300} />
          </>
        ) : (
          <>
            <DepartmentHeadcountChart />
            <GenderByDepartmentChart />
          </>
        )}
      </Box>

      {/* Row 3 — Age by gender (full width) */}
      {isLoading ? (
        <ChartSkeleton height={260} />
      ) : (
        <AgeByGenderChart />
      )}
    </>
  );
};

export default AnalyticsPage;
