import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  DemandForecast,
  UrgentRestock,
  ProductClassification,
  PriceAnomaly,
  SalesAnomaly,
  PriceSuggestion,
  SupplierScore,
} from '@/domain/models/AiPredictions';

export const aiPredictionsService = {
  async getForecasts(): Promise<DemandForecast[]> {
    const response = await apiClient.get<ApiResponse<DemandForecast[]>>(API_ENDPOINTS.ai.forecasts);
    return response.data;
  },

  async getForecastByProduct(productId: number): Promise<DemandForecast> {
    const response = await apiClient.get<ApiResponse<DemandForecast>>(API_ENDPOINTS.ai.forecastByProduct(productId));
    return response.data;
  },

  async getUrgentRestocks(): Promise<UrgentRestock[]> {
    const response = await apiClient.get<ApiResponse<UrgentRestock[]>>(API_ENDPOINTS.ai.urgentRestocks);
    return response.data;
  },

  async getClassifications(): Promise<ProductClassification[]> {
    const response = await apiClient.get<ApiResponse<ProductClassification[]>>(API_ENDPOINTS.ai.classifications);
    return response.data;
  },

  async getClassificationByProduct(productId: number): Promise<ProductClassification> {
    const response = await apiClient.get<ApiResponse<ProductClassification>>(API_ENDPOINTS.ai.classificationByProduct(productId));
    return response.data;
  },

  async getPriceAnomalies(onlyAnomalies = true): Promise<PriceAnomaly[]> {
    const url = `${API_ENDPOINTS.ai.priceAnomalies}?only_anomalies=${onlyAnomalies}`;
    const response = await apiClient.get<ApiResponse<PriceAnomaly[]>>(url);
    return response.data;
  },

  async getSalesAnomalies(onlyAnomalies = true): Promise<SalesAnomaly[]> {
    const url = `${API_ENDPOINTS.ai.salesAnomalies}?only_anomalies=${onlyAnomalies}`;
    const response = await apiClient.get<ApiResponse<SalesAnomaly[]>>(url);
    return response.data;
  },

  async getPriceSuggestions(): Promise<PriceSuggestion[]> {
    const response = await apiClient.get<ApiResponse<PriceSuggestion[]>>(API_ENDPOINTS.ai.priceSuggestions);
    return response.data;
  },

  async getSupplierScores(): Promise<SupplierScore[]> {
    const response = await apiClient.get<ApiResponse<SupplierScore[]>>(API_ENDPOINTS.ai.supplierScores);
    return response.data;
  },
};
