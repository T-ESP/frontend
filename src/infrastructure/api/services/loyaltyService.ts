import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  LoyaltyConfig,
  LoyaltyUserStats,
  UpdateLoyaltyConfigDto,
  AdjustPointsDto,
} from '../../../domain/models/Loyalty';

export const loyaltyService = {
  async getConfig(): Promise<LoyaltyConfig> {
    const response = await apiClient.get<ApiResponse<LoyaltyConfig>>(
      API_ENDPOINTS.loyalty.getConfig
    );
    return response.data;
  },

  async updateConfig(data: UpdateLoyaltyConfigDto): Promise<LoyaltyConfig> {
    const response = await apiClient.put<ApiResponse<LoyaltyConfig>>(
      API_ENDPOINTS.loyalty.updateConfig,
      data
    );
    return response.data;
  },

  async getUserStats(userId: number): Promise<LoyaltyUserStats> {
    const response = await apiClient.get<ApiResponse<LoyaltyUserStats>>(
      API_ENDPOINTS.loyalty.getUserStats(userId)
    );
    return response.data;
  },

  async adjustPoints(userId: number, data: AdjustPointsDto): Promise<LoyaltyUserStats> {
    const response = await apiClient.post<ApiResponse<LoyaltyUserStats>>(
      API_ENDPOINTS.loyalty.adjustPoints(userId),
      data
    );
    return response.data;
  },
};
