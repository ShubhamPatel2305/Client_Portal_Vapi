import React from 'react';
import { DonutChart, Title, Text } from '@tremor/react';

interface CallDistributionProps {
  callDistribution: Array<{
    name: string;
    value: number;
    count: number;
  }>;
}

export const CallDistribution: React.FC<CallDistributionProps> = ({ callDistribution }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title className="text-2xl font-bold">
            Total Call Ended
          </Title>
        </div>
        <div className="flex items-center gap-4">
          {callDistribution.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: index === 0 ? "#8b5cf6" : index === 1 ? "#10b981" : "#f59e0b" }}
              />
              <Text className="text-sm text-gray-600">
                {item.name.split('-')[0]}
              </Text>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative group">
        <div className="relative w-full max-w-[300px]">
          <DonutChart
            data={callDistribution}
            category="value"
            index="name"
            valueFormatter={(value: number) => `${value.toFixed(1)}%`}
            colors={["#8b5cf6", "#10b981", "#f59e0b"]}
            showAnimation={true}
            className="h-[300px]"
            showTooltip={false}
            variant="pie"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 p-4 rounded-lg shadow-lg border border-gray-100">
            {callDistribution.map((item, index) => (
              <div 
                key={item.name}
                className="flex items-center gap-2 mb-2 last:mb-0"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: index === 0 ? "#8b5cf6" : index === 1 ? "#10b981" : "#f59e0b" }}
                />
                <div className="flex items-center gap-2">
                  <Text className="text-gray-900 font-medium">
                    {item.value.toFixed(1)}%
                  </Text>
                  <Text className="text-gray-600">
                    {item.name.split('-').join(' ')}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
