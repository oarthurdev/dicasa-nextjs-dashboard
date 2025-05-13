import { apiRequest } from './queryClient';

// Broker related queries
export async function getBrokerRankings(companyId: string) {
  return apiRequest(`/api/${companyId}/brokers/rankings`, 'GET');
}

export async function getBrokerById(companyId: string, id: number) {
  return apiRequest(`/api/${companyId}/brokers/${id}`, 'GET');
}

export async function getBrokerRankPosition(id: number) {
  const response = await apiRequest<{ position: number }>(`/api/brokers/${id}/rank-position`, 'GET');
  return response.position;
}

export async function getBrokerPoints(id: number) {
  return apiRequest(`/api/brokers/${id}/points`, 'GET');
}

export async function getBrokerLeads(id: number) {
  return apiRequest(`/api/brokers/${id}/leads`, 'GET');
}

export async function getBrokerActivities(id: number) {
  return apiRequest(`/api/brokers/${id}/activities`, 'GET');
}

// Analytics related queries
export async function getBrokerPerformance(brokerId: number) {
  return apiRequest(`/api/brokers/${brokerId}/performance`, 'GET');
}

export async function getActivityHeatmap(brokerId: number) {
  return apiRequest(`/api/brokers/${brokerId}/heatmap`, 'GET');
}

export async function getBrokerAlerts(brokerId: number) {
  return apiRequest(`/api/brokers/${brokerId}/alerts`, 'GET');
}

// Dashboard metrics
export async function getDashboardMetrics() {
  return apiRequest('/api/dashboard/metrics', 'GET');
}