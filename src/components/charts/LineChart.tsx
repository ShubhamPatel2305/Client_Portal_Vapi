import React from 'react';
import { ResponsiveLine } from '@nivo/line';

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartData {
  id: string;
  data: DataPoint[];
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  enablePoints?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY';
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
  lineWidth?: number;
  pointSize?: number;
  pointBorderWidth?: number;
  pointBorderColor?: string;
  enableArea?: boolean;
  areaOpacity?: number;
}

export default function LineChart({
  data,
  height = 400,
  enablePoints = true,
  enableGridX = true,
  enableGridY = true,
  curve = 'natural',
  margin = { top: 50, right: 110, bottom: 50, left: 60 },
  colors = ['#3b82f6', '#10b981', '#ef4444'],
  lineWidth = 2,
  pointSize = 8,
  pointBorderWidth = 2,
  pointBorderColor = '#ffffff',
  enableArea = false,
  areaOpacity = 0.2
}: LineChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={data}
        margin={margin}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false
        }}
        curve={curve}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Time',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        enablePoints={enablePoints}
        enableGridX={enableGridX}
        enableGridY={enableGridY}
        colors={colors}
        lineWidth={lineWidth}
        pointSize={pointSize}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={pointBorderWidth}
        pointBorderColor={pointBorderColor}
        pointLabelYOffset={-12}
        enableArea={enableArea}
        areaOpacity={areaOpacity}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 12,
                fill: '#6B7280'
              }
            },
            legend: {
              text: {
                fontSize: 12,
                fill: '#4B5563'
              }
            }
          },
          grid: {
            line: {
              stroke: '#E5E7EB',
              strokeWidth: 1
            }
          },
          legends: {
            text: {
              fontSize: 12,
              fill: '#4B5563'
            }
          },
          tooltip: {
            container: {
              background: '#ffffff',
              fontSize: 12,
              borderRadius: 4,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
            }
          }
        }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}