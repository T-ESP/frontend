import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { Badge } from "@/ui/components/ui/badge";
import type { Order } from "@/domain/models/Order";

interface RecentOrdersProps {
  orders: Order[];
}

type BadgeVariant = "success" | "warning" | "destructive" | "secondary" | "default";

function getStatusVariant(status: string): BadgeVariant {
  switch (status.toLowerCase()) {
    case "delivered":
      return "success";
    case "shipped":
      return "secondary";
    case "confirmed":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    .slice(0, 8);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{t("dashboard.recent_orders.title", "Recent Orders")}</CardTitle>
        <CardDescription>
          {t("dashboard.recent_orders.subtitle", "{{count}} most recent orders", {
            count: recentOrders.length,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {recentOrders.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            {t("dashboard.recent_orders.empty", "No orders yet")}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {t("dashboard.recent_orders.col_order", "Order")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {t("dashboard.recent_orders.col_date", "Date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {t("dashboard.recent_orders.col_status", "Status")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {t("dashboard.recent_orders.col_amount", "Amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/orders?id=${order.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(order.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
