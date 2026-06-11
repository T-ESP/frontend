export type ForecastUrgency = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ClassificationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface UrgentRestock {
  product_id: number;
  product_name: string;
  current_stock: number;
  recommended_stock: number;
  reorder_quantity: number;
  days_until_stockout: number;
  urgency: ForecastUrgency;
  avg_daily_demand: string;
  forecast_date: string;
}

export interface DemandForecast {
  id: number;
  product_id: number;
  product_name: string;
  forecast_date: string;
  forecast_days: number;
  total_predicted_demand: string;
  avg_daily_demand: string;
  current_stock: number;
  recommended_stock: number;
  reorder_quantity: number;
  days_until_stockout: number;
  urgency: ForecastUrgency;
  mape: string;
  rmse: string;
  created_at: string;
}

export interface PriceAnomaly {
  id: number;
  product_id: number;
  product_name: string;
  current_price: string;
  expected_price: string;
  anomaly_score: number;
  is_anomaly: boolean;
  created_at: string;
}

export interface SalesAnomaly {
  id: number;
  product_id: number;
  product_name: string;
  sales_volume: number;
  expected_sales: number;
  anomaly_score: number;
  is_anomaly: boolean;
  created_at: string;
}

export interface ProductClassification {
  id: number;
  product_id: number;
  product_name: string;
  abc_class: 'A' | 'B' | 'C';
  xyz_class: 'X' | 'Y' | 'Z';
  combined_class: string;
  total_revenue: string;
  revenue_contribution_pct: string;
  total_units_sold: number;
  coefficient_of_variation: string;
  strategy: string;
  priority: ClassificationPriority;
  created_at: string;
}

export interface PriceSuggestion {
  id: number;
  product_id: number;
  product_name: string;
  suggested_price: string;
  current_price: string;
  reason: string;
  confidence: number;
  created_at: string;
}

export interface SupplierScore {
  id: number;
  supplier_id: number;
  supplier_name: string;
  overall_score: string;
  delivery_score: string;
  quality_score: string;
  lead_time_score: string;
  fulfillment_score: string;
  rating: 'A' | 'B' | 'C';
  total_restocks: number;
  created_at: string;
}
