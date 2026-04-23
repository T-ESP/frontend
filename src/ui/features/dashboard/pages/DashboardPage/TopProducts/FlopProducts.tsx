import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TopFlopProduct } from "@/infrastructure/api/services/globalKpisService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { Badge } from "@/ui/components/ui/badge";
import { useTranslation } from "react-i18next";

type FlopMode = "sales" | "profit";

interface FlopProductsProps {
  flopBySales: TopFlopProduct[];
  flopByProfit: TopFlopProduct[];
  loading?: boolean;
}

export function FlopProducts({ flopBySales, flopByProfit, loading }: FlopProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<FlopMode>("sales");

  const items = mode === "sales" ? flopBySales : flopByProfit;

  const formatValue = (value: number) =>
    mode === "profit"
      ? new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(value)
      : `${value} ${t("common.units")}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{t("dashboard.flop_products.title")}</CardTitle>
          <CardDescription className="mt-1">{t("dashboard.flop_products.subtitle")}</CardDescription>
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg shrink-0">
          <button
            onClick={() => setMode("sales")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === "sales"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("dashboard.flop_products.by_sales")}
          </button>
          <button
            onClick={() => setMode("profit")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === "profit"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("dashboard.flop_products.by_profit")}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              {t("dashboard.top_products.no_products")}
            </div>
          ) : (
            items.slice(0, 5).map((product) => (
              <div
                key={product.product_id}
                onClick={() =>
                  navigate(
                    `/inventory?search=${encodeURIComponent(product.product_name)}&productId=${product.product_id}`
                  )
                }
                className="flex items-center justify-between px-6 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 shrink-0">
                    <TrendingDown size={13} className="text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                      {product.product_name}
                    </p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </div>
                </div>
                <Badge variant="destructive" className="shrink-0 ml-4">
                  {formatValue(product.value)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
