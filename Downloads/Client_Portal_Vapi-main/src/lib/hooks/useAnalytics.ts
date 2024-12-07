import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analytics';

interface AnalyticsData {
  trends: any[];
  distribution: any[];
  performance: {
    successRate: number;
    avgResponseTime: number;
    satisfaction: number;
  };
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const analyticsData = await analyticsApi.getAnalyticsData();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return { data, loading, error };
}