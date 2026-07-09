import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Order,
  OrderWithItems,
  CreateOrderDto,
  UpdateOrderDto,
  LineItem,
  OrderStats
} from '@/domain/models/Order';

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// L'API sérialise les Decimal Postgres en chaînes. Sans conversion ici, toute
// addition de `amount` concatène au lieu d'additionner.
const normalizeOrder = (order: Order): Order => ({
  ...order,
  amount: toNumber(order.amount),
  discount_amount: toNumber(order.discount_amount),
});

const normalizeLineItem = (item: LineItem): LineItem => ({
  ...item,
  line_total: toNumber(item.line_total),
});

const normalizeOrderWithItems = (order: OrderWithItems): OrderWithItems => ({
  ...order,
  amount: toNumber(order.amount),
  line_items: (order.line_items ?? []).map(normalizeLineItem),
});

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.orders.getAll);
    return response.data.map(normalizeOrder);
  },

  async getById(id: number): Promise<OrderWithItems> {
    const response = await apiClient.get<ApiResponse<OrderWithItems>>(API_ENDPOINTS.orders.getById(id));
    return normalizeOrderWithItems(response.data);
  },

  async getOrderItems(id: number): Promise<LineItem[]> {
    const response = await apiClient.get<ApiResponse<LineItem[]>>(API_ENDPOINTS.orders.getItems(id));
    return response.data.map(normalizeLineItem);
  },

  async getByUser(userId: number): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.orders.getByUser(userId));
    return response.data.map(normalizeOrder);
  },

  async getStats(): Promise<OrderStats> {
    const response = await apiClient.get<ApiResponse<OrderStats>>(API_ENDPOINTS.orders.getStats);
    return response.data;
  },



  async create(data: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.orders.create, data);
    return normalizeOrder(response.data);
  },

  async update(id: number, data: UpdateOrderDto): Promise<Order> {
    const response = await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.orders.update(id), data);
    return normalizeOrder(response.data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.orders.delete(id));
  },

  async sendReceipt(id: number, email: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<string>>(
      API_ENDPOINTS.orders.receipt(id),
      { email }
    );
    return response.data;
  },
};
