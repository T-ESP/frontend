export type DiscountTrigger = 'product' | 'total_amount' | 'quantity';
export type DiscountAction  = 'fixed_eur' | 'percentage';
export type DiscountScope   = 'per_product' | 'global';

export interface Discount {
  id: number;
  name: string;
  trigger_type: DiscountTrigger;
  trigger_product_id: number | null;
  trigger_min_amount: number | null;
  trigger_min_qty: number | null;
  action_type: DiscountAction;
  action_value: number;
  scope: DiscountScope;
  scope_product_id: number | null;
  cumulative: boolean;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface DiscountOrderSummary {
  order_id: number;
  order_date: string;
  saving_amount: number;
  order_total: number;
}

export interface OrderDiscountSummary {
  discount_id: number;
  discount_name: string;
  action_type: DiscountAction;
  action_value: number;
  saving_amount: number;
}

export interface CreateDiscountDto {
  name: string;
  trigger_type: DiscountTrigger;
  trigger_product_id?: number | null;
  trigger_min_amount?: number | null;
  trigger_min_qty?: number | null;
  action_type: DiscountAction;
  action_value: number;
  scope: DiscountScope;
  scope_product_id?: number | null;
  cumulative?: boolean;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

export interface UpdateDiscountDto {
  name?: string;
  action_value?: number;
  cumulative?: boolean;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

export interface CheckLineItemDto {
  product_id: number;
  quantity: number;
  line_total: number;
}

export interface CheckDiscountDto {
  line_items: CheckLineItemDto[];
  total_amount: number;
}

export interface ApplicableDiscount {
  id: number;
  name: string;
  trigger_type: DiscountTrigger;
  action_type: DiscountAction;
  action_value: number;
  scope: DiscountScope;
  scope_product_id: number | null;
  saving_amount: number;
  cumulative: boolean;
}

export interface CheckDiscountResponse {
  applicable_discounts: ApplicableDiscount[];
  total_before: number;
  total_after: number;
  total_saving: number;
}
