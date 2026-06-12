export interface LoyaltyConfig {
  id?: number;
  euros_per_point: number;
  points_required: number;
  discount_percent: number;
}

export interface LoyaltyTransaction {
  id: number;
  order_id: number | null;
  points: number;
  reason: string | null;
  created_at: string;
}

export interface LoyaltyUserStats {
  user_id: number;
  total_points: number;
  transactions: LoyaltyTransaction[];
}

export interface AdjustPointsDto {
  points: number;
  reason?: string;
}

export type UpdateLoyaltyConfigDto = Omit<LoyaltyConfig, 'id'>;
