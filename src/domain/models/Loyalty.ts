export interface LoyaltyConfig {
  id?: number;
  euros_per_point: number;
  points_required: number;
  discount_percent: number;
}

export interface LoyaltyUserStats {
  user_id: number;
  points: number;
  fidelity_code: string;
}

export interface AdjustPointsDto {
  points: number;
  reason?: string;
}

export type UpdateLoyaltyConfigDto = Omit<LoyaltyConfig, 'id'>;
