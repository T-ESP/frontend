import { apiClient } from '../client';
import type { ApiResponse } from '../client';

// KPI Types based on backend responses
export interface PricingMarginKPI {
  product_id: number;
  product_name: string;
  current_price: number;
  cost_price: number;
  margin_amount: number;
  margin_percentage: number;
  market_position: string;
  price_history?: Array<{
    date: string;
    price: number;
  }>;
}

export interface StockAvailabilityKPI {
  product_id: number;
  product_name: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  min_stock_threshold: number;
  max_stock_threshold: number;
  stock_status: 'critical' | 'low' | 'optimal' | 'excess';
  days_until_stockout: number | null;
  stock_coverage_days: number;
}

export interface SalesRotationKPI {
  product_id: number;
  product_name: string;
  total_sales_quantity: number;
  total_sales_value: number;
  sales_last_30_days: number;
  sales_last_90_days: number;
  rotation_rate: number;
  average_daily_sales: number;
  turnover_ratio: number;
  rotation_category: 'fast' | 'medium' | 'slow';
  sales_trend: 'increasing' | 'stable' | 'decreasing';
}

export interface ProfitabilityKPI {
  product_id: number;
  product_name: string;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  profit_margin_percentage: number;
  roi: number;
  contribution_to_total_profit: number;
  profitability_score: number;
  profitability_rank: number;
}

export interface RestockKPI {
  product_id: number;
  product_name: string;
  current_stock: number;
  optimal_stock_level: number;
  reorder_point: number;
  economic_order_quantity: number;
  suggested_restock_quantity: number;
  urgency_level: 'immediate' | 'soon' | 'normal' | 'not_needed';
  next_suggested_order_date: string | null;
  supplier_lead_time_days: number;
  last_restock_date: string | null;
}

export interface PredictionsAlertsKPI {
  product_id: number;
  product_name: string;
  predicted_demand_7_days: number;
  predicted_demand_30_days: number;
  stockout_risk_percentage: number;
  overstock_risk_percentage: number;
  alerts: Array<{
    type: 'stockout' | 'overstock' | 'price_anomaly' | 'demand_spike' | 'demand_drop';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    action_required: boolean;
  }>;
  seasonality_factor: number | null;
  demand_trend: 'increasing' | 'stable' | 'decreasing';
}

export interface ScoringClassificationKPI {
  product_id: number;
  product_name: string;
  abc_classification: 'A' | 'B' | 'C';
  xyz_classification: 'X' | 'Y' | 'Z';
  performance_score: number;
  strategic_importance: 'high' | 'medium' | 'low';
  revenue_contribution_percentage: number;
  sales_frequency: number;
  demand_variability: number;
  recommendation: string;
}

export interface ComparativeKPI {
  product_id: number;
  product_name: string;
  category: string;
  rank_by_revenue: number;
  rank_by_profit: number;
  rank_by_rotation: number;
  overall_performance_rank: number;
  category_average_price: number;
  price_vs_category_avg: number;
  sales_vs_category_avg: number;
  margin_vs_category_avg: number;
  performance_vs_category: 'above' | 'average' | 'below';
  top_competitors?: Array<{
    product_id: number;
    product_name: string;
    metric_value: number;
  }>;
}

export interface PriceEvolutionKPI {
  product_id: number;
  product_name: string;
  current_price: number;
  price_changes: Array<{
    date: string;
    old_price: number;
    new_price: number;
    change_percentage: number;
    reason?: string;
  }>;
  average_price_last_30_days: number;
  average_price_last_90_days: number;
  price_volatility: number;
  price_trend: 'increasing' | 'stable' | 'decreasing';
  optimal_price_suggestion: number | null;
}

export const productKpisService = {
  async getPricingMargin(productId: number): Promise<PricingMarginKPI> {
    const response = await apiClient.get<ApiResponse<PricingMarginKPI>>(
      `/products/${productId}/kpis/pricing-margin`
    );
    return response.data;
  },

  async getStockAvailability(productId: number): Promise<StockAvailabilityKPI> {
    const response = await apiClient.get<ApiResponse<StockAvailabilityKPI>>(
      `/products/${productId}/kpis/stock-availability`
    );
    return response.data;
  },

  async getSalesRotation(productId: number): Promise<SalesRotationKPI> {
    const response = await apiClient.get<ApiResponse<SalesRotationKPI>>(
      `/products/${productId}/kpis/sales-rotation`
    );
    return response.data;
  },

  async getProfitability(productId: number): Promise<ProfitabilityKPI> {
    const response = await apiClient.get<ApiResponse<ProfitabilityKPI>>(
      `/products/${productId}/kpis/profitability`
    );
    return response.data;
  },

  async getRestock(productId: number): Promise<RestockKPI> {
    const response = await apiClient.get<ApiResponse<RestockKPI>>(
      `/products/${productId}/kpis/restock`
    );
    return response.data;
  },

  async getPredictionsAlerts(productId: number): Promise<PredictionsAlertsKPI> {
    const response = await apiClient.get<ApiResponse<PredictionsAlertsKPI>>(
      `/products/${productId}/kpis/predictions-alerts`
    );
    return response.data;
  },

  async getScoringClassification(productId: number): Promise<ScoringClassificationKPI> {
    const response = await apiClient.get<ApiResponse<ScoringClassificationKPI>>(
      `/products/${productId}/kpis/scoring-classification`
    );
    return response.data;
  },

  async getComparative(productId: number): Promise<ComparativeKPI> {
    const response = await apiClient.get<ApiResponse<ComparativeKPI>>(
      `/products/${productId}/kpis/comparative`
    );
    return response.data;
  },

  async getPriceEvolution(productId: number): Promise<PriceEvolutionKPI> {
    const response = await apiClient.get<ApiResponse<PriceEvolutionKPI>>(
      `/products/${productId}/kpis/price-evolution`
    );
    return response.data;
  },

  // Convenience method to fetch all KPIs at once
  async getAllKPIs(productId: number): Promise<{
    pricingMargin: PricingMarginKPI;
    stockAvailability: StockAvailabilityKPI;
    salesRotation: SalesRotationKPI;
    profitability: ProfitabilityKPI;
    restock: RestockKPI;
    predictionsAlerts: PredictionsAlertsKPI;
    scoringClassification: ScoringClassificationKPI;
    comparative: ComparativeKPI;
    priceEvolution: PriceEvolutionKPI;
  }> {
    const [
      pricingMargin,
      stockAvailability,
      salesRotation,
      profitability,
      restock,
      predictionsAlerts,
      scoringClassification,
      comparative,
      priceEvolution,
    ] = await Promise.all([
      this.getPricingMargin(productId),
      this.getStockAvailability(productId),
      this.getSalesRotation(productId),
      this.getProfitability(productId),
      this.getRestock(productId),
      this.getPredictionsAlerts(productId),
      this.getScoringClassification(productId),
      this.getComparative(productId),
      this.getPriceEvolution(productId),
    ]);

    return {
      pricingMargin,
      stockAvailability,
      salesRotation,
      profitability,
      restock,
      predictionsAlerts,
      scoringClassification,
      comparative,
      priceEvolution,
    };
  },
};
