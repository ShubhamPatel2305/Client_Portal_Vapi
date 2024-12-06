export { analyticsApi } from './analytics';
export { authApi } from './auth';
export { callsApi } from './calls';
export { billingApi } from './billing';

export const fetchDashboardData = async () => {
  const data = await analyticsApi.getDashboardData();
  return [data];
};