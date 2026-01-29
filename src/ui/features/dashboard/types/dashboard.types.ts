import type { IconType } from "react-icons";

export type KPI = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: IconType;
  color: string;
  description: string;
};

export type TopProduct = {
  id: number;
  name: string;
  image: string;
  sales: number;
  revenue: string;
  trend: "up" | "down";
  change: string;
  rating: number;
};

export type Customer = {
  name: string;
  value: number;
  count: number;
  color: string;
};

export type CustomerDistributionChartProps = {
  data: Customer[];
}

export type RevenueData = {
  month: string;
  revenue: number | null;
  profit: number | null;
  orders?: number;
};

export type RevenueChartProps = {
  data: RevenueData[];
}