import { Card, Title, DonutChart, AreaChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { Analytics, MonthlyStats } from '../../types/dashboard';
import { formatMonthYear } from '../../utils/dateUtils';

interface AnalyticsPanelProps {
  data: Analytics;
}

const AnalyticsPanel = ({ data }: AnalyticsPanelProps) => {
  const chartdata = Object.entries(data.monthlyData).map(([month, stats]) => ({
    date: formatMonthYear(month),
    "Total Calls": stats.totalCalls,
    "Average Duration": stats.averageDuration,
    "Total Cost": stats.totalCost,
  }));

  const statusData = [
    { name: 'Completed', value: data.completedCalls || 0 },
    { name: 'Failed', value: data.failedCalls || 0 },
    { name: 'Ongoing', value: data.ongoingCalls || 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-50 border border-gray-200">
          <Title>Call Status Distribution</Title>
          <DonutChart
            className="mt-6"
            data={statusData}
            category="value"
            index="name"
            valueFormatter={(value) => value.toString()}
            colors={["green", "red", "yellow"]}
          />
        </Card>

        <Card className="bg-gray-50 border border-gray-200">
          <Title>Monthly Trends</Title>
          <AreaChart
            className="mt-6"
            data={chartdata}
            index="date"
            categories={["Total Calls", "Average Duration", "Total Cost"]}
            colors={["blue", "green", "red"]}
            valueFormatter={(value) => value.toString()}
          />
        </Card>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;
