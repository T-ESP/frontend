import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  TotalRevenueResponse,
  EvolutionResponse,
  EvolutionByGrainResponse,
  ComparisonResponse,
  AverageBasketResponse,
  AverageBasketByClientTypeResponse,
  PeriodQuery,
} from '@/domain/models/Sales';

export const salesService = {
  async getTotalRevenue(params: PeriodQuery): Promise<TotalRevenueResponse> {
    const queryString = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    }).toString();
    const response = await apiClient.get<ApiResponse<TotalRevenueResponse>>(
      `${API_ENDPOINTS.sales.totalRevenue}?${queryString}`
    );
    console.log("🚀 ~ response:", response)
    return response.data;
  },

  async getEvolution(params: PeriodQuery): Promise<EvolutionResponse> {
    const queryString = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    }).toString();
    const response = await apiClient.get<ApiResponse<EvolutionResponse>>(
      `${API_ENDPOINTS.sales.evolution}?${queryString}`
    );
    return response.data;
  },

  async getEvolutionByGrain(params: PeriodQuery): Promise<EvolutionByGrainResponse> {
    const queryParams: Record<string, string> = {
      start_date: params.start_date,
      end_date: params.end_date,
    };
    if (params.grain) {
      queryParams.grain = params.grain;
    }
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await apiClient.get<ApiResponse<EvolutionByGrainResponse>>(
      `${API_ENDPOINTS.sales.evolution}?${queryString}`
    );
    return response.data;
  },

  async getComparison(params: PeriodQuery): Promise<ComparisonResponse> {
    const queryString = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    }).toString();
    const response = await apiClient.get<ApiResponse<ComparisonResponse>>(
      `${API_ENDPOINTS.sales.comparison}?${queryString}`
    );
    return response.data;
  },

  async getAverageBasket(params: PeriodQuery): Promise<AverageBasketResponse> {
    const queryString = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    }).toString();
    const response = await apiClient.get<ApiResponse<AverageBasketResponse>>(
      `${API_ENDPOINTS.sales.averageBasket}?${queryString}`
    );
    return response.data;
  },

  async getAverageBasketByClientType(params: PeriodQuery): Promise<AverageBasketByClientTypeResponse> {
    const queryString = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    }).toString();
    const response = await apiClient.get<ApiResponse<AverageBasketByClientTypeResponse>>(
      `${API_ENDPOINTS.sales.averageBasketByClientType}?${queryString}`
    );
    return response.data;
  },
};
