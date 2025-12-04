import type { Order } from "@/domain/models/Order";
import { SalesTableRow } from "./SalesTableRow";

interface SalesTableBodyProps {
  data: Order[];
}

export function SalesTableBody({ data }: SalesTableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-100">
      {data.length === 0 ? (
        <tr>
          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
            No orders found
          </td>
        </tr>
      ) : (
        data.map((order, index) => (
          <SalesTableRow key={order.id} order={order} index={index} />
        ))
      )}
    </tbody>
  );
}

