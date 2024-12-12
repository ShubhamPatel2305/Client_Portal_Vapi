import { Card, Grid, BarList, DonutChart, Title, Text, AreaChart, BarChart, Color, Flex, Badge } from '@tremor/react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { Analytics } from '../../lib/api/vapiService';

interface RegionalReportProps {
  data: Analytics | null;
  loading?: boolean;
}

const containerAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const colors: { [key: string]: Color } = {
  primary: 'blue',
  secondary: 'emerald',
  tertiary: 'violet',
  quaternary: 'amber',
  quinary: 'rose',
  senary: 'cyan',
};

export default function RegionalReport({ data }: RegionalReportProps) {
  if (!data) return null;

  // Process regional data with trends
  const regionalData = data.callDistribution.map((item, index) => {
    const trend = Number(item.trend) || 0;
    const colorKey = Object.keys(colors)[index % Object.keys(colors).length];
    return {
      name: `Region ${item.name}`,
      value: item.count,
      trend,
      color: colors[colorKey],
      icon: MapPin,
    };
  });

  // Sort regions by value for the bar list
  const sortedRegions = [...regionalData].sort((a, b) => b.value - a.value);

  return (
    <motion.div
      className="space-y-6"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <motion.div variants={itemAnimation}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Flex alignItems="center" className="space-x-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <Title>Regional Distribution</Title>
                </Flex>
                <Text className="mt-2 text-gray-500">
                  Call distribution across regions
                </Text>
              </div>
              <Badge size="xl" color="blue">
                {regionalData.length} Regions
              </Badge>
            </div>
            <DonutChart
              className="mt-8 h-80"
              data={regionalData}
              category="value"
              index="name"
              colors={Object.values(colors)}
              valueFormatter={(value) => `${value.toLocaleString()} calls`}
              showAnimation={true}
            />
            <Flex className="mt-8" justifyContent="center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {regionalData.map((region) => (
                  <div
                    key={region.name}
                    className="flex items-center space-x-2"
                  >
                    <div className={`w-3 h-3 rounded-full bg-${region.color}-500`} />
                    <Text className="text-sm truncate">{region.name}</Text>
                  </div>
                ))}
              </div>
            </Flex>
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="p-6">
            <Flex alignItems="center" className="space-x-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <Title>Top Performing Regions</Title>
            </Flex>
            <Text className="mt-2 text-gray-500">
              Regions ranked by call volume
            </Text>
            <div className="mt-8">
              {sortedRegions.map((item) => (
                <div key={item.name} className="mb-4">
                  <Flex>
                    <Text className="truncate">{item.name}</Text>
                    <div className="flex items-center space-x-2">
                      <Text>
                        {item.value.toLocaleString()}
                      </Text>
                      <div className="flex items-center space-x-1">
                        {item.trend >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                        )}
                        <Text
                          className={
                            item.trend >= 0
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }
                        >
                          {Math.abs(item.trend).toFixed(1)}%
                        </Text>
                      </div>
                    </div>
                  </Flex>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div
                      className={`h-full bg-${item.color}-500 rounded-full transition-all duration-500`}
                      style={{
                        width: `${(item.value / sortedRegions[0].value) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </Grid>

      <Grid numItems={1} numItemsSm={2} className="gap-6">
        <motion.div variants={itemAnimation}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title>Regional Performance Trend</Title>
                <Text className="text-gray-500">Monthly call volume by region</Text>
              </div>
            </div>
            <AreaChart
              className="h-72"
              data={data.monthlyCallData}
              index="date"
              categories={['totalCalls']}
              colors={[colors.primary]}
              valueFormatter={(number: number) =>
                number.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
              showAnimation={true}
            />
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title>Cost by Region</Title>
                <Text className="text-gray-500">Total cost distribution</Text>
              </div>
            </div>
            <BarChart
              className="h-72"
              data={data.costAnalysis}
              index="category"
              categories={['amount']}
              colors={[colors.tertiary]}
              valueFormatter={(number: number) =>
                `$${number.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
              }
              showAnimation={true}
            />
          </Card>
        </motion.div>
      </Grid>
    </motion.div>
  );
}
