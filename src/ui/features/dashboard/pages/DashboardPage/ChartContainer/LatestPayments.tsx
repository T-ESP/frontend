import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/domain/models/Order";
import type { User } from "@/domain/models/User";

const STATUS_DOT: Record<string, string> = {
  success: "bg-emerald-500",
  delivered: "bg-emerald-500",
  paid: "bg-emerald-500",
  processing: "bg-blue-500",
  pending: "bg-amber-500",
  failed: "bg-rose-500",
};

function statusDot(status: string) {
  const key = Object.keys(STATUS_DOT).find((k) => status.toLowerCase().includes(k));
  return STATUS_DOT[key ?? ""] ?? "bg-muted-foreground";
}

export function LatestPayments({ orders, users }: { orders: Order[]; users: User[] }) {
  const { t } = useTranslation();
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const getMockStatus = (idx: number) => {
    const statuses = ["Success", "Processing", "Success", "Failed", "Success"];
    return statuses[idx % statuses.length];
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="border-b p-6">
        <h3 className="text-lg font-semibold">{t("dashboard.charts.latest_payments")}</h3>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <TableHead className="px-3">{t("dashboard.charts.email")}</TableHead>
            <TableHead className="px-3">{t("dashboard.charts.amount")}</TableHead>
            <TableHead className="px-3">{t("dashboard.charts.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order, idx) => {
            const user = users.find((u) => u.id === order.user_id);
            const defaultEmails = [
              "ken99@yahoo.com",
              "abe45@gmail.com",
              "monserrat44@gmail.com",
              "silas22@gmail.com",
              "carmella@hotmail.com",
            ];

            const email = user?.email || defaultEmails[idx % defaultEmails.length];
            const status = getMockStatus(idx);

            return (
              <TableRow key={order.id}>
                <TableCell className="px-3 text-muted-foreground">{email}</TableCell>
                <TableCell className="px-3 font-medium tabular-nums">
                  {Number(order.amount || 242.0).toFixed(2)}€
                </TableCell>
                <TableCell className="px-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    <span className={`size-1.5 rounded-full ${statusDot(status)}`} />
                    {status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
          {recentOrders.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="h-24 px-3 text-center text-muted-foreground"
              >
                {t("dashboard.charts.no_payments")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
