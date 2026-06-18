import { useState, useEffect, useMemo } from "react";
import { Settings, Check, X } from "lucide-react";
import { KPICard } from "./KPICard";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import type { Supplier } from "@/domain/models/Supplier";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { salesService } from "@/infrastructure/api/services/salesService";
import { supplierService } from "@/infrastructure/api/services/supplierService";
import {
  KPI_CATALOG,
  KPI_CATALOG_MAP,
  KPI_CATEGORY_ORDER,
  DEFAULT_KPI_KEYS,
  type KpiContext,
} from "./kpiCatalog";

function grainForRange(days: number): "day" | "week" | "month" {
  if (days <= 30) return "day";
  if (days <= 90) return "week";
  return "month";
}

interface KPICardsProps {
  orders: Order[];
  products: Product[];
  users: User[];
  totalRevenue: number;
  evolution: number;
  totalOrderCount?: number;
  dateRange?: number;
  editMode?: boolean;
  onCloseEdit?: () => void;
}

const KPI_STORAGE_KEY = "dashboard_kpi_visible";

const isValidKey = (key: string) => key in KPI_CATALOG_MAP;

function readPreferences(): string[] {
  try {
    const saved = localStorage.getItem(KPI_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      const valid = Array.isArray(parsed) ? parsed.filter(isValidKey) : [];
      if (valid.length > 0) return valid;
    }
  } catch {
    // ignore
  }
  return [...DEFAULT_KPI_KEYS];
}

function writePreferences(keys: string[]) {
  try {
    localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore
  }
}

export function KPICards({
  orders,
  products,
  users,
  totalRevenue,
  evolution,
  totalOrderCount,
  dateRange = 30,
  editMode = false,
  onCloseEdit,
}: KPICardsProps) {
  const { t } = useTranslation();

  const [visibleKPIs, setVisibleKPIs] = useState<string[]>(() => readPreferences());
  const [pendingVisible, setPendingVisible] = useState<string[]>(visibleKPIs);
  const [revenueSparkline, setRevenueSparkline] = useState<{ value: number }[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSparkline = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
        const fmt = (d: Date) => d.toISOString().split("T")[0];
        const res = await salesService.getEvolutionByGrain({
          start_date: fmt(startDate),
          end_date: fmt(endDate),
          grain: grainForRange(dateRange),
        });
        setRevenueSparkline(res.data.map((p) => ({ value: Math.round(p.revenue) })));
      } catch {
        setRevenueSparkline([]);
      }
    };
    fetchSparkline();
  }, [dateRange]);

  // Suppliers power the supplier-related KPIs; fetched lazily, errors are non-fatal.
  useEffect(() => {
    supplierService
      .getAll()
      .then(setSuppliers)
      .catch(() => setSuppliers([]));
  }, []);

  // Sync pending each time the modal opens
  useEffect(() => {
    if (editMode) setPendingVisible(visibleKPIs);
  }, [editMode, visibleKPIs]);

  // Close on Escape
  useEffect(() => {
    if (!editMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseEdit?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editMode, onCloseEdit]);

  const applyChanges = () => {
    const next = pendingVisible.length > 0 ? pendingVisible : [...DEFAULT_KPI_KEYS];
    setVisibleKPIs(next);
    writePreferences(next);
    onCloseEdit?.();
  };

  const cancelChanges = () => {
    setPendingVisible(visibleKPIs);
    onCloseEdit?.();
  };

  const toggleKPI = (key: string) => {
    setPendingVisible((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${(value || 0).toFixed(1)}%`;
  };

  const dateRangeLabel = useMemo(() => {
    if (dateRange === 7) return t("common.date_range.last_7_days");
    if (dateRange === 90) return t("common.date_range.last_90_days");
    if (dateRange === 365) return t("common.date_range.last_year");
    return t("common.date_range.last_30_days");
  }, [dateRange, t]);

  const orderCount = totalOrderCount ?? orders.length;

  const ctx: KpiContext = useMemo(
    () => ({
      orders,
      products,
      users,
      suppliers,
      totalRevenue,
      evolution,
      orderCount,
      dateRange,
      t,
      fmtCurrency: formatCurrency,
      fmtPercent: formatPercentage,
      dateRangeLabel,
      revenueSparkline,
    }),
    [orders, products, users, suppliers, totalRevenue, evolution, orderCount, dateRange, t, dateRangeLabel, revenueSparkline],
  );

  const hasChanges =
    pendingVisible.length !== visibleKPIs.length ||
    pendingVisible.some((k) => !visibleKPIs.includes(k));

  // Render in catalog order so layout stays stable regardless of selection order.
  const visibleDefs = KPI_CATALOG.filter((def) => visibleKPIs.includes(def.key));

  return (
    <div className="mb-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {visibleDefs.map((def) => (
          <KPICard key={def.key} kpi={def.compute(ctx)} />
        ))}
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={cancelChanges}
        >
          <div
            className="flex flex-col w-full max-w-md max-h-[85vh] bg-card border shadow-xl rounded-xl border-border animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {t("dashboard.kpi_edit.title", "Personnaliser les KPIs")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.kpi_edit.subtitle", "Choisis les indicateurs à afficher")}
                  </p>
                </div>
              </div>
              <button
                onClick={cancelChanges}
                className="p-1.5 transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {KPI_CATEGORY_ORDER.map((category) => {
                const defs = KPI_CATALOG.filter((d) => d.category === category);
                if (defs.length === 0) return null;
                return (
                  <div key={category} className="space-y-2">
                    <p className="px-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      {t(`dashboard.kpi_edit.categories.${category}`)}
                    </p>
                    {defs.map((def) => {
                      const isSelected = pendingVisible.includes(def.key);
                      return (
                        <label
                          key={def.key}
                          className={`flex items-center justify-between px-4 py-3 transition-colors border rounded-lg cursor-pointer ${
                            isSelected
                              ? "bg-accent border-primary/40"
                              : "bg-secondary border-border hover:bg-muted"
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {def.label(t)}
                          </span>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleKPI(def.key)}
                          />
                        </label>
                      );
                    })}
                  </div>
                );
              })}
              {pendingVisible.length === 0 && (
                <p className="px-1 text-xs text-muted-foreground">
                  {t("dashboard.kpi_edit.empty_hint", "Au moins un KPI doit rester affiché.")}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
              <button
                onClick={cancelChanges}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium transition-colors bg-white border rounded-lg border-border text-foreground hover:bg-muted"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={applyChanges}
                disabled={pendingVisible.length === 0 || !hasChanges}
                className="inline-flex items-center justify-center h-10 gap-2 px-4 text-sm font-medium transition-colors rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {t("common.apply", "Appliquer")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
