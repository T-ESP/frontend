export type Sale = {
  id: number;
  product: string;
  location: string;
  date: string;
  time: string;
  quantity: number;
  amount: string;
  status: "Delivered" | "Pending" | "Cancelled";
  avatar: string;
};

export type SalesData = {
  name: string;
  sales: number;
};

