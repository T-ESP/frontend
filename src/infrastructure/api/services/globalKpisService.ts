import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';

export interface TopFlopProduct {
  product_id: number;
  product_name: string;
  category: string;
  value: number;
}

export interface TopFlopResponse {
  top_10_by_revenue: TopFlopProduct[];
  top_10_by_profit: TopFlopProduct[];
  top_10_by_volume: TopFlopProduct[];
  top_10_by_turnover: TopFlopProduct[];
  flop_10_by_sales: TopFlopProduct[];
  flop_10_by_profit: TopFlopProduct[];
  at_risk_products: TopFlopProduct[];
}

export interface ForecastKpis {
  forecasted_revenue_next_month: number | null;
  forecasted_revenue_next_3_months: number | null;
  cash_needed_for_restocks: number;
  predicted_stockouts_count: number;
  optimization_opportunities_count: number;
}

export const globalKpisService = {
  async getTopFlop(params?: { start_date?: string; end_date?: string }): Promise<TopFlopResponse> {
    const query = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    const response = await apiClient.get<ApiResponse<TopFlopResponse>>(
      `${API_ENDPOINTS.kpis.topFlop}${query}`
    );
    return response.data;
  },

  async getForecast(params?: { start_date?: string; end_date?: string }): Promise<ForecastKpis> {
    const query = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    const response = await apiClient.get<ApiResponse<ForecastKpis>>(
      `${API_ENDPOINTS.kpis.forecast}${query}`
    );
    return response.data;
  },
};
