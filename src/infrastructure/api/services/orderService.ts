import { apiClient } from '../client';
import type { ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import type {
  Order,
  OrderWithItems,
  CreateOrderDto,
  UpdateOrderDto,
  LineItem,
  OrderStats,
  OrderQueryParams,
  PaginatedOrders
} from '@/domain/models/Order';

/** Doit rester <= au plafond MAX_LIMIT du backend (orders/services.rs). */
const MAX_PAGE_SIZE = 1000;

/** Garde-fou : 500 lots de 1000 = 500k commandes, bien au-delà du volume attendu. */
const MAX_PAGES = 500;

function buildQueryString(params: OrderQueryParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value));
    }
  }
  const queryString = search.toString();
  return queryString ? `?${queryString}` : '';
}

export const orderService = {
  /**
   * Récupère une page de commandes filtrée et triée par le serveur,
   * avec le nombre total de lignes correspondant aux filtres.
   */
  async getPage(params: OrderQueryParams = {}): Promise<PaginatedOrders> {
    const response = await apiClient.get<ApiResponse<PaginatedOrders>>(
      `${API_ENDPOINTS.orders.getAll}${buildQueryString(params)}`
    );
    return response.data;
  },

  /**
   * Récupère l'historique complet en parcourant les pages.
   * Réservé aux écrans qui agrègent des statistiques sur toutes les commandes ;
   * préférer `getPage` pour tout affichage de liste.
   */
  async getAll(params: OrderQueryParams = {}): Promise<Order[]> {
    const orders: Order[] = [];

    for (let page = 0; page < MAX_PAGES; page++) {
      const { items, total } = await this.getPage({
        ...params,
        limit: MAX_PAGE_SIZE,
        offset: page * MAX_PAGE_SIZE,
      });

      orders.push(...items);

      // Un lot incomplet signifie qu'on a atteint la fin.
      if (items.length < MAX_PAGE_SIZE || orders.length >= total) {
        break;
      }
    }

    return orders;
  },

  async getById(id: number): Promise<OrderWithItems> {
    const response = await apiClient.get<ApiResponse<OrderWithItems>>(API_ENDPOINTS.orders.getById(id));
    return response.data;
  },

  async getOrderItems(id: number): Promise<LineItem[]> {
    const response = await apiClient.get<ApiResponse<LineItem[]>>(API_ENDPOINTS.orders.getItems(id));
    return response.data;
  },

  async getByUser(userId: number): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.orders.getByUser(userId));
    return response.data;
  },

  async getStats(): Promise<OrderStats> {
    const response = await apiClient.get<ApiResponse<OrderStats>>(API_ENDPOINTS.orders.getStats);
    return response.data;
  },



  async create(data: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.orders.create, data);
    return response.data;
  },

  async update(id: number, data: UpdateOrderDto): Promise<Order> {
    const response = await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.orders.update(id), data);
    return response.data;
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
