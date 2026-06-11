import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Alert,
  AlertSummary,
  AlertFilters,
  UpdateAlertStatusDto,
  BulkUpdateAlertStatusDto,
} from '@/domain/models/Alert';

export const alertService = {
  async getAll(filters?: AlertFilters): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.model_type) params.append('model_type', filters.model_type);
    if (filters?.product_id) params.append('product_id', String(filters.product_id));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.from_date) params.append('from_date', filters.from_date);
    if (filters?.to_date) params.append('to_date', filters.to_date);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const query = params.toString();
    const url = query ? `${API_ENDPOINTS.alerts.getAll}?${query}` : API_ENDPOINTS.alerts.getAll;
    const response = await apiClient.get<ApiResponse<Alert[]>>(url);
    return response.data;
  },

  async getSummary(): Promise<AlertSummary> {
    const response = await apiClient.get<ApiResponse<AlertSummary>>(API_ENDPOINTS.alerts.getSummary);
    return response.data;
  },

  async getById(id: number): Promise<Alert> {
    const response = await apiClient.get<ApiResponse<Alert>>(API_ENDPOINTS.alerts.getById(id));
    return response.data;
  },

  async updateStatus(id: number, dto: UpdateAlertStatusDto): Promise<Alert> {
    const response = await apiClient.put<ApiResponse<Alert>>(API_ENDPOINTS.alerts.updateStatus(id), dto);
    return response.data;
  },

  async bulkUpdateStatus(dto: BulkUpdateAlertStatusDto): Promise<void> {
    await apiClient.put<ApiResponse<void>>(API_ENDPOINTS.alerts.bulkUpdateStatus, dto);
  },

  async cleanup(): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.alerts.cleanup);
  },
};
