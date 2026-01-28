export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
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
