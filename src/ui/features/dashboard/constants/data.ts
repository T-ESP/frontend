import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiUsers } from "react-icons/fi";
import type { Customer, KPI, RevenueData, TopProduct } from "../types/dashboard.types";

export const revenueData : RevenueData[] = [
  { month: "Jan", revenue: 42000, profit: 28000, orders: 340 },
  { month: "Feb", revenue: 51000, profit: 35000, orders: 420 },
  { month: "Mar", revenue: 48000, profit: 32000, orders: 385 },
  { month: "Apr", revenue: 67000, profit: 45000, orders: 580 },
  { month: "May", revenue: 73000, profit: 52000, orders: 640 },
  { month: "Jun", revenue: 89000, profit: 61000, orders: 720 },
  { month: "Jul", revenue: 95000, profit: 68000, orders: 810 },
  { month: "Aug", revenue: 87000, profit: 59000, orders: 690 },
  { month: "Sep", revenue: 102000, profit: 74000, orders: 890 },
  { month: "Oct", revenue: 118000, profit: 85000, orders: 980 },
  { month: "Nov", revenue: 124000, profit: 89000, orders: 1050 },
  { month: "Dec", revenue: 135000, profit: 98000, orders: 1180 },
];

export const customerData : Customer[] = [
  { name: "New Customers", value: 68.4, count: 34249, color: "#8b5cf6" },
  { name: "Returning", value: 31.6, count: 15824, color: "#06b6d4" },
];

export const topProducts : TopProduct[] = [
  {
    id: 1,
    name: "MacBook Pro 16\"",
    image: "https://i.imgur.com/mbNua4x.png",
    sales: 2847,
    revenue: "$428,050",
    trend: "up",
    change: "+12.5%",
    rating: 4.8
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    image: "https://i.imgur.com/7j9X5Kw.png",
    sales: 1923,
    revenue: "$192,300",
    trend: "up",
    change: "+8.3%",
    rating: 4.9
  },
  {
    id: 3,
    name: "AirPods Pro",
    image: "https://i.imgur.com/9wQm5Nx.png",
    sales: 1456,
    revenue: "$36,240",
    trend: "down",
    change: "-2.1%",
    rating: 4.7
  },
];

export const kpiData : KPI[] = [
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+12.5%",
    trend: "up",
    icon: FiDollarSign,
    color: "emerald",
    description: "vs last month"
  },
  {
    title: "Total Orders",
    value: "8,540",
    change: "+8.3%",
    trend: "up",
    icon: FiShoppingCart,
    color: "blue",
    description: "vs last month"
  },
  {
    title: "Active Customers",
    value: "2,847",
    change: "+15.2%",
    trend: "up",
    icon: FiUsers,
    color: "purple",
    description: "vs last month"
  },
  {
    title: "Conversion Rate",
    value: "3.6%",
    change: "-0.8%",
    trend: "down",
    icon: FiTrendingUp,
    color: "amber",
    description: "vs last month"
  },
];