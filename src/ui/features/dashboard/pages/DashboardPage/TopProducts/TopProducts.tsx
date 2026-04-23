import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/domain/models/Product";
import { Progress } from "@/ui/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface TopProductsProps {
  products: Product[];
}

type SortOption = "stock" | "price" | "name";

export function TopProducts({ products }: TopProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>("stock");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "stock":
        sorted.sort((a, b) => b.stock_quantity - a.stock_quantity);
        break;
      case "price":
        sorted.sort(
          (a, b) => b.buying_price * b.stock_quantity - a.buying_price * a.stock_quantity
        );
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted.slice(0, 5);
  }, [products, sortBy]);

  const maxValue = useMemo(() => {
    if (topProducts.length === 0) return 1;
    return Math.max(...topProducts.map((p) =>
      sortBy === "price" ? p.buying_price * p.stock_quantity : p.stock_quantity
    ));
  }, [topProducts, sortBy]);

  const getValue = (p: Product) =>
    sortBy === "price" ? p.buying_price * p.stock_quantity : p.stock_quantity;

  const formatValue = (p: Product) =>
    sortBy === "price"
      ? new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(p.buying_price * p.stock_quantity)
      : `${p.stock_quantity} ${t("common.units")}`;

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "stock": return t("dashboard.top_products.stock");
      case "price": return t("dashboard.top_products.value");
      case "name": return t("dashboard.top_products.name");
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{t("dashboard.top_products.title")}</CardTitle>
          <CardDescription className="mt-1">{t("dashboard.top_products.subtitle")}</CardDescription>
        </div>
        <div className="relative shrink-0" ref={filterRef}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {getSortLabel(sortBy)}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilter ? "rotate-180" : ""}`} />
          </button>
          {showFilter && (
            <div className="absolute right-0 z-10 mt-1 w-36 py-1 bg-white rounded-lg border border-gray-200 shadow-lg">
              {(["stock", "price", "name"] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowFilter(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${
                    sortBy === opt ? "text-purple-600 font-semibold" : "text-gray-700"
                  }`}
                >
                  {getSortLabel(opt)}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {topProducts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            {t("dashboard.top_products.no_products")}
          </div>
        ) : (
          topProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() =>
                navigate(
                  `/inventory?search=${encodeURIComponent(product.name)}&productId=${product.id}`
                )
              }
              className="cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 shrink-0 ml-2">
                  {formatValue(product)}
                </span>
              </div>
              <Progress
                value={maxValue > 0 ? (getValue(product) / maxValue) * 100 : 0}
                className="ml-6"
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
