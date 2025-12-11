export interface TotalRevenueResponse {
  total_revenue: number;
}

export interface EvolutionResponse {
  evolution_percentage: number;
}

export interface EvolutionDataPoint {
  date: string;
  revenue: number;
}

export interface EvolutionByGrainResponse {
  grain: string;
  data: EvolutionDataPoint[];
}

export interface ComparisonResponse {
  forecast: number;
  actual: number;
}

export interface AverageBasketResponse {
  average_basket: number;
  evolution_percentage?: number;
}

export interface AverageBasketByClientTypeResponse {
  new_clients: number;
  loyal_clients: number;
}

export interface PeriodQuery {
  start_date: string; // "YYYY-MM-DD"
  end_date: string;   // "YYYY-MM-DD"
  grain?: string;     // "day", "week", or "month"
}
