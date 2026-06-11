import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/domain/models/Product";
import type { TopProduct } from "../../../types/dashboard.types";

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const topProducts = useMemo<TopProduct[]>(() => {
    const sorted = [...products].sort(
      (a, b) => b.stock_quantity - a.stock_quantity
    );

    return sorted.slice(0, 10).map((product, index) => {
      const totalValue = product.buying_price * product.stock_quantity;
      return {
        id: product.id,
        name: product.name,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random&size=80`,
        sales: product.stock_quantity,
        revenue: new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(totalValue),
        trend: product.stock_quantity > 50 ? "up" : ("down" as "up" | "down"),
        change: `${product.stock_quantity} ${t("common.units")}`,
        rating: 4.5 + index * 0.1,
      };
    });
  }, [products, t]);

  const handleClick = (name: string, id: string | number) => {
    navigate(`/inventory?search=${encodeURIComponent(name)}&productId=${id}`);
  };

  return (
    <div className="mt-8 w-full overflow-hidden rounded-xl border bg-card text-card-foreground">
      <div className="border-b p-6">
        <h3 className="text-lg font-semibold">
          {t("dashboard.top_products.title")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.top_products.subtitle")}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6">Product</TableHead>
            <TableHead className="px-6">Units Sold</TableHead>
            <TableHead className="px-6">Rating</TableHead>
            <TableHead className="px-6">Total Value</TableHead>
            <TableHead className="px-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topProducts.map((product) => (
            <TableRow
              key={product.id}
              onClick={() => handleClick(product.name, product.id)}
              className="cursor-pointer"
            >
              <TableCell className="px-6 font-medium">{product.name}</TableCell>
              <TableCell className="px-6 text-muted-foreground tabular-nums">
                {product.sales.toLocaleString()}
              </TableCell>
              <TableCell className="px-6 font-medium tabular-nums">
                {product.rating.toFixed(1)} / 5
              </TableCell>
              <TableCell className="px-6 font-medium tabular-nums">
                {product.revenue}
              </TableCell>
              <TableCell className="px-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <span
                    className={`size-1.5 rounded-full ${
                      product.trend === "up" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {product.trend === "up" ? "High Demand" : "Low Stock"}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {topProducts.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="h-24 px-6 text-center text-muted-foreground"
              >
                {t("dashboard.top_products.no_products")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="border-t px-6 py-4 text-sm text-muted-foreground">
        {topProducts.length} row(s).
      </div>
    </div>
  );
}
