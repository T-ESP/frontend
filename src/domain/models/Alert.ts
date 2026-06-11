export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed';
export type AlertModelType = 'demand_forecast' | 'price_anomaly' | 'sales_anomaly' | 'clustering' | 'classification';

export interface Alert {
  id: number;
  product_id: number | null;
  product_name: string | null;
  model_type: AlertModelType;
  category: 'alert' | 'suggestion';
  notification_type: string;
  severity: AlertSeverity;
  message: string;
  action_recommended: string | null;
  related_result_id: number | null;
  status: AlertStatus;
  created_at: string;
  updated_at: string;
}

export interface AlertSummary {
  total: number;
  by_status: Record<string, number>;
  by_severity: Record<string, number>;
  by_model_type: Array<{ model_type: string; count: number }>;
}

export interface AlertFilters {
  status?: AlertStatus;
  severity?: AlertSeverity;
  model_type?: AlertModelType;
  product_id?: number;
  category?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export interface UpdateAlertStatusDto {
  status: AlertStatus;
}

export interface BulkUpdateAlertStatusDto {
  ids: number[];
  status: AlertStatus;
}
