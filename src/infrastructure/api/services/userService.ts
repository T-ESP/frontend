import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
} from '../../../domain/models/User';

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.users.getAll
    );
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.users.getById(id)
    );
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.users.create,
      data
    );
    return response.data;
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.users.update(id),
      data
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.users.delete(id));
  },
};
