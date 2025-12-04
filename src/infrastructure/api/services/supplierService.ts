import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../../../domain/models/Supplier';

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const response = await apiClient.get<ApiResponse<Supplier[]>>(
      API_ENDPOINTS.suppliers.getAll
    );
    return response.data;
  },

  async getById(id: number): Promise<Supplier> {
    const response = await apiClient.get<ApiResponse<Supplier>>(
      API_ENDPOINTS.suppliers.getById(id)
    );
    return response.data;
  },

  async create(data: CreateSupplierDto): Promise<Supplier> {
    const response = await apiClient.post<ApiResponse<Supplier>>(
      API_ENDPOINTS.suppliers.create,
      data
    );
    return response.data;
  },

  async update(id: number, data: UpdateSupplierDto): Promise<Supplier> {
    const response = await apiClient.put<ApiResponse<Supplier>>(
      API_ENDPOINTS.suppliers.update(id),
      data
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.suppliers.delete(id));
  },
};
