import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

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
import { productKpisService } from "@/infrastructure/api/services/productKpisService";

interface TopProductsProps {
  products: Product[];
}

/** Champ de tri du tableau des produits. */
type SortKey = "rating" | "stock" | "value";
type SortDir = "asc" | "desc";

/** Donnée produit enrichie d'une valeur numérique pour le tri sur « Total Value ». */
type SortableProduct = TopProduct & { value: number };

export function TopProducts({ products }: TopProductsProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || "fr-FR";

  const topProducts = useMemo<SortableProduct[]>(() => {
    const sorted = [...products].sort(
      (a, b) => b.stock_quantity - a.stock_quantity
    );

    return sorted.slice(0, 10).map((product) => {
      const totalValue = product.buying_price * product.stock_quantity;
      return {
        id: product.id,
        name: product.name,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random&size=80`,
        sales: product.stock_quantity,
        value: totalValue,
        revenue: new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(totalValue),
        trend: product.stock_quantity > 50 ? "up" : ("down" as "up" | "down"),
        change: `${product.stock_quantity} ${t("common.units")}`,
      };
    });
  }, [products, t]);

  // Real per-product score, identical to the one shown on the product KPI page
  // (same scoring-classification endpoint). Keyed by product id, /100.
  const [scores, setScores] = useState<Record<number, number | null>>({});

  useEffect(() => {
    let cancelled = false;
    const ids = topProducts.map((p) => p.id);
    if (ids.length === 0) {
      setScores({});
      return;
    }

    Promise.all(
      ids.map((id) =>
        productKpisService
          .getScoringClassification(id)
          .then((s) => [id, s.global_score] as const)
          .catch(() => [id, null] as const)
      )
    ).then((entries) => {
      if (!cancelled) setScores(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [topProducts]);

  // Tri du tableau : « Rating » par défaut, sinon stock ou valeur totale.
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedProducts = useMemo<SortableProduct[]>(() => {
    const accessor = (p: SortableProduct): number => {
      if (sortKey === "stock") return p.sales;
      if (sortKey === "value") return p.value;
      // rating : score réel /100 ; produits sans score relégués en fin de liste.
      return scores[p.id] ?? -Infinity;
    };
    const factor = sortDir === "desc" ? -1 : 1;
    return [...topProducts].sort((a, b) => (accessor(a) - accessor(b)) * factor);
  }, [topProducts, scores, sortKey, sortDir]);

  const sortIcon = (key: SortKey) => {
    if (key !== sortKey) return <FiChevronDown className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === "desc" ? (
      <FiChevronDown className="w-3.5 h-3.5" />
    ) : (
      <FiChevronUp className="w-3.5 h-3.5" />
    );
  };

  const handleClick = (_name: string, id: string | number) => {
    navigate(`/inventory/${id}/kpis`);
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
            <TableHead className="px-6">{t("dashboard.top_products.product")}</TableHead>
            <TableHead className="px-6">
              <button
                type="button"
                onClick={() => handleSort("stock")}
                aria-sort={sortKey === "stock" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}
                className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${sortKey === "stock" ? "text-foreground font-semibold" : ""}`}
              >
                {t("dashboard.top_products.units_sold")}
                {sortIcon("stock")}
              </button>
            </TableHead>
            <TableHead className="px-6">
              <button
                type="button"
                onClick={() => handleSort("rating")}
                aria-sort={sortKey === "rating" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}
                className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${sortKey === "rating" ? "text-foreground font-semibold" : ""}`}
              >
                {t("dashboard.top_products.rating")}
                {sortIcon("rating")}
              </button>
            </TableHead>
            <TableHead className="px-6">
              <button
                type="button"
                onClick={() => handleSort("value")}
                aria-sort={sortKey === "value" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}
                className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${sortKey === "value" ? "text-foreground font-semibold" : ""}`}
              >
                {t("dashboard.top_products.total_value")}
                {sortIcon("value")}
              </button>
            </TableHead>
            <TableHead className="px-6">{t("dashboard.top_products.status_col")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
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
                {scores[product.id] != null
                  ? `${scores[product.id]!.toLocaleString(currentLang, { maximumFractionDigits: 1 })}/100`
                  : "—"}
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
                  {product.trend === "up" ? t("dashboard.top_products.high_demand") : t("dashboard.top_products.low_stock_status")}
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
        {t("dashboard.top_products.rows", { count: topProducts.length })}
      </div>
    </div>
  );
}
