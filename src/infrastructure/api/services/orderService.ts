import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Order,
  OrderWithItems,
  CreateOrderDto,
  UpdateOrderDto,
  LineItem,
  OrderStats
} from '@/domain/models/Order';

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.orders.getAll);
    return response.data;
  },

  async getById(id: number): Promise<OrderWithItems> {
    const response = await apiClient.get<ApiResponse<OrderWithItems>>(API_ENDPOINTS.orders.getById(id));
    return response.data;
  },

  async getOrderItems(id: number): Promise<LineItem[]> {
    const response = await apiClient.get<ApiResponse<LineItem[]>>(API_ENDPOINTS.orders.getItems(id));
    return response.data;
  },

  async getByUser(userId: number): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.orders.getByUser(userId));
    return response.data;
  },

  async getStats(): Promise<OrderStats> {
    const response = await apiClient.get<ApiResponse<OrderStats>>(API_ENDPOINTS.orders.getStats);
    return response.data;
  },



  async create(data: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.orders.create, data);
    return response.data;
  },

  async update(id: number, data: UpdateOrderDto): Promise<Order> {
    const response = await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.orders.update(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.orders.delete(id));
  },
};
