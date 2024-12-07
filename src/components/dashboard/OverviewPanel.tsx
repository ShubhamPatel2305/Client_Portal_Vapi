import { Grid } from '@tremor/react';
import { PhoneCall, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import { calculateTotals } from '../../utils/dateUtils';

interface OverviewPanelProps {
  monthlyData: any[];
}

const OverviewPanel = ({ monthlyData }: OverviewPanelProps) => {
  const { totalCalls, totalDuration, totalCost } = calculateTotals(monthlyData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <StatCard
          title="Total Calls"
          metric={totalCalls.toString()}
          icon={PhoneCall}
        />
        <StatCard
          title="Total Duration"
          metric={`${Math.round(totalDuration / 60)} mins`}
          icon={Clock}
        />
        <StatCard
          title="Total Cost"
          metric={`$${totalCost.toFixed(2)}`}
          icon={DollarSign}
        />
      </Grid>
    </motion.div>
  );
};

export default OverviewPanel;
