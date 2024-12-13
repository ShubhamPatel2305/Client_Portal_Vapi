import React from 'react';
import { AreaChart } from '@tremor/react';
import { formatMonthYear } from '../../utils/dateUtils';

interface CostAnalysisProps {
  monthlyData: Array<{
    date: string;
    calls: number;
    cost: number;
  }>;
}

export const CostAnalysis: React.FC<CostAnalysisProps> = ({ monthlyData }) => {
  return (
    <div className="h-[300px] w-full pl-4" style={{ minWidth: '200px', minHeight: '200px' }}>
      <AreaChart
        className="h-full w-full"
        data={monthlyData}
        index="date"
        categories={["calls", "cost"]}
        colors={["indigo", "emerald"]}
        valueFormatter={(value: number) => value.toFixed(2)}
        showLegend={false}
        showAnimation={true}
        showGridLines={false}
        showXAxis={true}
        showYAxis={true}
        yAxisWidth={40}
        startEndOnly={false}
        autoMinValue={true}
        connectNulls={true}
        curveType="monotone"
        customTooltip={({ payload }) => {
          if (!payload || !Array.isArray(payload) || payload.length === 0) return null;
          
          const date = payload[0]?.payload?.date;
          const calls = payload[0]?.value;
          const cost = payload[1]?.value;
          
          if (!date || typeof calls === 'undefined') return null;

          return (
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-lg">
              <div className="font-medium text-gray-900">
                {date}
              </div>
              <div className="mt-1 font-medium text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-sm text-gray-600">
                    {calls} calls
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-gray-600">
                    ${typeof cost === 'number' ? cost.toFixed(2) : '0.00'} cost
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
