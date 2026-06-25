import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Discount,
  CreateDiscountDto,
  UpdateDiscountDto,
  CheckDiscountDto,
  CheckDiscountResponse,
  DiscountOrderSummary,
  OrderDiscountSummary,
} from '@/domain/models/Discount';

export const discountService = {
  async getAll(): Promise<Discount[]> {
    const response = await apiClient.get<ApiResponse<Discount[]>>(API_ENDPOINTS.discounts.getAll);
    return response.data;
  },

  async getById(id: number): Promise<Discount> {
    const response = await apiClient.get<ApiResponse<Discount>>(API_ENDPOINTS.discounts.getById(id));
    return response.data;
  },

  async create(data: CreateDiscountDto): Promise<Discount> {
    const response = await apiClient.post<ApiResponse<Discount>>(API_ENDPOINTS.discounts.create, data);
    return response.data;
  },

  async update(id: number, data: UpdateDiscountDto): Promise<Discount> {
    const response = await apiClient.put<ApiResponse<Discount>>(API_ENDPOINTS.discounts.update(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.discounts.delete(id));
  },

  async check(data: CheckDiscountDto): Promise<CheckDiscountResponse> {
    const response = await apiClient.post<ApiResponse<CheckDiscountResponse>>(
      API_ENDPOINTS.discounts.check,
      data,
    );
    return response.data;
  },

  async getOrders(id: number): Promise<DiscountOrderSummary[]> {
    const response = await apiClient.get<ApiResponse<DiscountOrderSummary[]>>(
      API_ENDPOINTS.discounts.getOrders(id),
    );
    return response.data;
  },

  async getOrderApplied(orderId: number): Promise<OrderDiscountSummary[]> {
    const response = await apiClient.get<ApiResponse<OrderDiscountSummary[]>>(
      API_ENDPOINTS.discounts.getOrderApplied(orderId),
    );
    return response.data;
  },
};
