import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
} from '../../../domain/models/Staff';

export const staffService = {
  async getAll(): Promise<Staff[]> {
    const response = await apiClient.get<ApiResponse<Staff[]>>(
      API_ENDPOINTS.staff.getAll
    );
    return response.data;
  },

  async getById(id: number): Promise<Staff> {
    const response = await apiClient.get<ApiResponse<Staff>>(
      API_ENDPOINTS.staff.getById(id)
    );
    return response.data;
  },

  async create(data: CreateStaffDto): Promise<Staff> {
    const response = await apiClient.post<ApiResponse<Staff>>(
      API_ENDPOINTS.staff.create,
      data
    );
    return response.data;
  },

  async update(id: number, data: UpdateStaffDto): Promise<Staff> {
    const response = await apiClient.put<ApiResponse<Staff>>(
      API_ENDPOINTS.staff.update(id),
      data
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.staff.delete(id));
  },
};
