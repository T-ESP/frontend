import { apiClient } from '../client';
import type { ApiResponse } from '../client';

// KPI Types based on backend responses
export interface PricingMarginKPI {
  current_buying_price: number;
  current_selling_price: number | null;
  gross_margin: number | null;
  margin_rate: number | null;
  buying_price_min: number | null;
  buying_price_max: number | null;
  buying_price_avg: number | null;
  buying_price_variation: number | null;
  buying_price_volatility: number | null;
  buying_price_changes_count: number;
  selling_price_min: number | null;
  selling_price_max: number | null;
  selling_price_avg: number | null;
  selling_price_variation: number | null;
  selling_price_volatility: number | null;
  selling_price_changes_count: number;
  repercussion_rate: number | null;
  repercussion_delay_days: number | null;
}

export interface StockAvailabilityKPI {
  current_stock: number;
  product_status: string;
  stockout_rate: number | null;
  stockout_count: number;
  avg_stockout_duration_days: number | null;
  safety_stock_recommended: number | null;
  days_since_last_restock: number | null;
  last_restock_date: string | null;
}

export interface SalesRotationKPI {
  quantity_sold: number;
  revenue: number;
  order_count: number;
  avg_quantity_per_order: number | null;
  avg_basket_value: number | null;
  stock_turnover_rate: number | null;
  avg_storage_duration_days: number | null;
  sales_velocity_per_day: number | null;
  sales_trend: string;
  sales_variation_percent: number | null;
}

export interface ProfitabilityKPI {
  total_profit: number;
  avg_profit_per_sale: number | null;
  roi: number | null;
  contribution_to_total_revenue_percent: number | null;
  contribution_to_total_profit_percent: number | null;
}

export interface RestockKPI {
  restock_count: number;
  total_restocked_quantity: number;
  avg_quantity_per_restock: number | null;
  restock_frequency_days: number | null;
  total_restock_cost: number;
  avg_restock_cost: number | null;
  reception_rate: number | null;
  cancellation_rate: number | null;
  avg_delivery_delay_days: number | null;
}

export interface PredictionsAlertsKPI {
  estimated_stockout_date: string | null;
  optimal_reorder_quantity: number | null;
  optimal_reorder_point: number | null;
  days_of_coverage: number | null;
  alert_status: string;
}

export interface ScoringClassificationKPI {
  popularity_score: number;
  profitability_score: number;
  reliability_score: number;
  global_score: number;
  abc_classification: string;
  performance_category: string;
}

export interface ComparativeKPI {
  performance_vs_category_percent: number | null;
  performance_vs_supplier_percent: number | null;
  rank_in_category: number | null;
  share_in_category_percent: number | null;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface MarginPoint {
  date: string;
  margin_amount: number | null;
  margin_rate: number | null;
}

export interface PriceEvolutionKPI {
  buying_price_history: PricePoint[];
  selling_price_history: PricePoint[];
  margin_history: MarginPoint[];
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
