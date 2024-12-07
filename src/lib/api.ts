import { mockDataService } from "./mockData";
import { vapiService, Analytics } from "./api/vapiService";

export const fetchDashboardData = async (): Promise<Analytics> => {
  try {
    // Get analytics data from Vapi
    const analytics = await vapiService.getAnalytics();
    
    // Only return mock data if analytics is null or undefined
    if (!analytics) {
      throw new Error('No analytics data received');
    }
    
    return analytics;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Fallback to mock data if API fails
    return mockDataService.getAnalytics();
  }
};

export const fetchAnalyticsData = async (startDate: Date, endDate: Date): Promise<Analytics> => {
  try {
    const analytics = await vapiService.getAnalytics(startDate, endDate);
    if (!analytics) {
      throw new Error('No analytics data received');
    }
    return analytics;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return mockDataService.getAnalytics();
  }
};

export async function exportData(): Promise<Blob> {
  // Implementation for exporting data
  return new Blob(['Export not implemented'], { type: 'text/plain' });
}

export async function updateSchedule(schedule: Record<string, unknown>): Promise<void> {
  // Implementation for updating schedule
  console.log('Schedule update not implemented', schedule);
}

export async function updateAlertSettings(settings: Record<string, unknown>): Promise<void> {
  // Implementation for updating alert settings
  console.log('Alert settings update not implemented', settings);
}