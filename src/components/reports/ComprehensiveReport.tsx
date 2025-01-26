import { Card, Grid, Metric, Text, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { Analytics } from '../../lib/api/vapiService';
import PerformanceReport from './PerformanceReport';
import CallAnalyticsReport from './CallAnalyticsReport';
import UserEngagementReport from './UserEngagementReport';
// import RegionalReport from './RegionalReport';

interface ComprehensiveReportProps {
  data: Analytics | null;
  loading: boolean;
  dateRange: { from: Date; to: Date };
}

export default function ComprehensiveReport({ data, loading, dateRange }: ComprehensiveReportProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card
          className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-none"
          decoration="top"
          decorationColor="blue"
        >
          <Text className="text-blue-600">Total Call Minutes</Text>
          <Metric className="mt-2 text-blue-900">{data.totalCallMinutes.toFixed(0)}</Metric>
          <Text className="mt-2 text-blue-600">
            {data.totalCallMinutesTrend >= 0 ? '↑' : '↓'} {Math.abs(data.totalCallMinutesTrend)}%
          </Text>
        </Card>
        <Card
          className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-none"
          decoration="top"
          decorationColor="purple"
        >
          <Text className="text-purple-600">Number of Calls</Text>
          <Metric className="mt-2 text-purple-900">{data.numberOfCalls}</Metric>
          <Text className="mt-2 text-purple-600">
            {data.numberOfCallsTrend >= 0 ? '↑' : '↓'} {Math.abs(data.numberOfCallsTrend)}%
          </Text>
        </Card>
        <Card
          className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-none"
          decoration="top"
          decorationColor="emerald"
        >
          <Text className="text-emerald-600">Total Spent</Text>
          <Metric className="mt-2 text-emerald-900">${data.totalSpent.toFixed(2)}</Metric>
          <Text className="mt-2 text-emerald-600">
            {data.totalSpentTrend >= 0 ? '↑' : '↓'} {Math.abs(data.totalSpentTrend)}%
          </Text>
        </Card>
        <Card
          className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-none"
          decoration="top"
          decorationColor="amber"
        >
          <Text className="text-amber-600">Avg Cost per Call</Text>
          <Metric className="mt-2 text-amber-900">${data.avgCostPerCall.toFixed(2)}</Metric>
          <Text className="mt-2 text-amber-600">
            {data.avgCostPerCallTrend >= 0 ? '↑' : '↓'} {Math.abs(data.avgCostPerCallTrend)}%
          </Text>
        </Card>
      </Grid>

      <Card>
        <TabGroup>
          <TabList className="mt-2">
            <Tab>Performance</Tab>
            <Tab>Call Analytics</Tab>
            <Tab>User Engagement</Tab>
            {/* <Tab>Regional</Tab> */}
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="mt-4">
                <PerformanceReport data={data} dateRange={dateRange} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-4">
                <CallAnalyticsReport data={data} loading={loading} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-4">
                <UserEngagementReport data={data} loading={loading} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-4">
                {/* <RegionalReport data={data} loading={loading} /> */}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}
