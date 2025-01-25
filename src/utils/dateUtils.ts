import { format } from 'date-fns';
import { Analytics, MonthlyStats } from '../types/dashboard';

export const formatMonthYear = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'MMMM yyyy');
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  } else if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return format(now, 'yyyy-MM');
};

export const getAllMonthsInRange = (data: Analytics | null): string[] => {
  if (!data || !data.monthlyData) return [];
  return Object.keys(data.monthlyData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
};

export const calculateTotals = (monthlyData: MonthlyStats[] | undefined) => {
  if (!monthlyData) return { totalCalls: 0, totalDuration: 0, totalCost: 0 };
  
  return monthlyData.reduce(
    (acc, curr) => ({
      totalCalls: acc.totalCalls + curr.totalCalls,
      totalDuration: acc.totalDuration + (curr.averageDuration || 0),
      totalCost: acc.totalCost + curr.totalCost,
    }),
    { totalCalls: 0, totalDuration: 0, totalCost: 0 }
  );
};
