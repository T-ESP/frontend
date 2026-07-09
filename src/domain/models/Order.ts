export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  status: string;
  amount: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}

export type OrderSortBy = 'date' | 'amount' | 'status' | 'user';
export type OrderSortOrder = 'asc' | 'desc';

/** Filtres appliqués côté serveur. Omettre un champ signifie « pas de filtre ». */
export interface OrderQueryParams {
  limit?: number;
  offset?: number;
  user_id?: number;
  status?: string;
  search?: string;
  min_amount?: number;
  max_amount?: number;
  /** Dates au format ISO 8601 (RFC 3339). */
  date_from?: string;
  date_until?: string;
  sort_by?: OrderSortBy;
  sort_order?: OrderSortOrder;
}

/** `total` est le nombre de lignes correspondant aux filtres, pas la taille de `items`. */
export interface PaginatedOrders {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
}

export interface LineItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  line_total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems {
  id: number;
  user_id: number;
  order_date: string;
  status: string;
  amount: number;
  line_items: LineItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateLineItemDto {
  product_id: number;
  quantity: number;
}

export interface CreateOrderDto {
  user_id: number;
  status: string;
  line_items: CreateLineItemDto[];
  discount_ids?: number[];
  payment_method?: string;
}

export interface UpdateOrderDto {
  status: string;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_amount: number;
  avg_order_value: number;
}
