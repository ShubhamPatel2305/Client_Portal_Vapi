import { Card, Text, Metric } from '@tremor/react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  metric: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatCard = ({ title, metric, icon: Icon, trend }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <Text>{title}</Text>
            <Metric>{metric}</Metric>
          </div>
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
