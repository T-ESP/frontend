import { useState, useEffect } from "react";
import type { Order } from "@/domain/models/Order";
import { orderService } from "@/infrastructure/api/services/orderService";
import { SalesTableBody } from "./SalesTableBody";
import { SalesTableFooter } from "./SalesTableFooter";
import { SalesTableHead } from "./SalesTableHead";
import { SalesTableHeader } from "./SalesTableHeader";

export default function SalesTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      // Sort by date descending and take only recent orders
      const sortedOrders = data.sort((a, b) => 
        new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      ).slice(0, 10);
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <SalesTableHeader />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <SalesTableHead />
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            </tbody>
          ) : (
            <SalesTableBody data={orders} />
          )}
        </table>
      </div>
      <SalesTableFooter />
    </div>
  );
}
