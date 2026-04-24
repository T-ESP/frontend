import { useState } from "react";
import type { Order } from "@/domain/models/Order";
import type { User } from "@/domain/models/User";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LatestPayments({ orders, users }: { orders: Order[], users: User[] }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const getBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("success") || s.includes("delivered") || s.includes("paid"))
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (s.includes("processing") || s.includes("pending"))
      return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-white bg-red-600 border-red-600";
  };

  const getMockStatus = (idx: number) => {
    // Just to force the mockup look if orders status strings are generic
    const statuses = ["Success", "Processing", "Success", "Failed", "Success"];
    return statuses[idx % statuses.length];
  }

  return (
    <div className="bg-white border h-full border-gray-200 rounded-xl text-gray-900 w-full overflow-hidden">
      <div className="flex flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Latest Payments</h3>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter payments..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-[14px] text-left border-collapse">
          <thead className="text-gray-500 border-b border-gray-200 bg-white">
            <tr>
              <th className="px-3 py-3 font-medium text-xs">Customer</th>
              <th className="px-3 py-3 font-medium text-xs hidden 2xl:table-cell">Email</th>
              <th className="px-3 py-3 font-medium text-xs">Amount</th>
              <th className="px-3 py-3 font-medium text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order, idx) => {
              const user = users.find(u => u.id === order.user_id);
              // Mocking empty fields if missing gracefully
              const defaultNames = ["Kenneth Thompson", "Abraham Lincoln", "Monserrat Rodriguez", "Silas Johnson", "Carmella DeVito"];
              const defaultEmails = ["ken99@yahoo.com", "abe45@gmail.com", "monserrat44@gmail.com", "silas22@gmail.com", "carmella@hotmail.com"];

              const name = user?.name || defaultNames[idx % defaultNames.length];
              const email = user?.email || defaultEmails[idx % defaultEmails.length];
              const status = getMockStatus(idx);

              return (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-900 text-[13px]">{name}</td>
                  <td className="px-3 py-3 text-gray-500 text-[13px] hidden 2xl:table-cell">{email}</td>
                  <td className="px-3 py-3 font-medium text-gray-900 text-[13px]">${Number(order.amount || 242.00).toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${getBadgeClass(status)}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              )
            })}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 px-6 border-t border-gray-200 text-[13px] text-gray-500">
        <div>0 of {recentOrders.length} row(s) selected.</div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
