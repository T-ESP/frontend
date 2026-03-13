import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Product,
  ProductWithSupplier,
  CreateProductDto,
  UpdateProductDto,
  ProductSearchParams,
} from '../../../domain/models/Product';

export const productService = {
  async getAll(params?: ProductSearchParams): Promise<Product[]> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${API_ENDPOINTS.products.getAll}${queryString}`
    );
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      API_ENDPOINTS.products.getById(id)
    );
    return response.data;
  },

  async getByReference(reference: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      API_ENDPOINTS.products.getByReference(reference)
    );
    return response.data;
  },

  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      API_ENDPOINTS.products.create,
      data
    );
    return response.data;
  },

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(
      API_ENDPOINTS.products.update(id),
      data
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.products.delete(id));
  },

  async updateStock(id: number, quantity: number): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<Product>>(
      API_ENDPOINTS.products.updateStock(id),
      { quantity }
    );
    return response.data;
  },

  async getLowStock(threshold: number = 10): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${API_ENDPOINTS.products.lowStock}?threshold=${threshold}`
    );
    return response.data;
  },

  async getAllWithSupplier(): Promise<ProductWithSupplier[]> {
    const response = await apiClient.get<ApiResponse<ProductWithSupplier[]>>(
      API_ENDPOINTS.products.withSupplier
    );
    return response.data;
  },

  async searchLight(query: string): Promise<{ id: number; name: string; category: string }[]> {
    const response = await apiClient.get<ApiResponse<{ id: number; name: string; category: string }[]>>(
      `${API_ENDPOINTS.products.searchLight}?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  async getAllKpis(id: number): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.products.getAllKpis(id)
    );
    return response.data;
  },
};
