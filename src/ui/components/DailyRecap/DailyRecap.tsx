import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { X, TrendingUp, TrendingDown, ShoppingCart, Euro, Users, PackageX, ArrowRight } from "lucide-react";

import { useAuth } from "@/ui/features/auth/hooks/useAuth";
import { orderService } from "@/infrastructure/api/services/orderService";
import { userService } from "@/infrastructure/api/services/userService";
import { productService } from "@/infrastructure/api/services/productService";
import type { Order } from "@/domain/models/Order";
import { getRecapFrequency } from "./recapPreference";

// Empêche le double-affichage entre les remontages de layout (SPA) dans la même session.
let shownThisSession = false;

interface Recap {
  date: Date;
  revenue: number;
  revenueDelta: number | null;
  orders: number;
  ordersDelta: number | null;
  avgBasket: number;
  newClients: number;
  delivered: number;
  pending: number;
  stockouts: number;
  hasActivity: boolean;
}

const localDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const isCancelled = (o: Order) => o.status?.toLowerCase() === "cancelled";
const isDelivered = (o: Order) => o.status?.toLowerCase() === "delivered";
const isPending = (o: Order) => o.status?.toLowerCase() === "pending";

const pctDelta = (curr: number, prev: number): number | null => {
  if (prev <= 0) return curr > 0 ? 100 : null;
  return ((curr - prev) / prev) * 100;
};

async function buildRecap(): Promise<Recap | null> {
  const [ordersRes, usersRes, productsRes] = await Promise.allSettled([
    orderService.getAll(),
    userService.getAll(),
    productService.getAll(),
  ]);
  if (ordersRes.status !== "fulfilled") return null;

  const orders = ordersRes.value;
  const users = usersRes.status === "fulfilled" ? usersRes.value : [];
  const products = productsRes.status === "fulfilled" ? productsRes.value : [];

  // Bornes locales : hier 00:00 → 23:59, et l'avant-veille pour la comparaison.
  const startY = new Date();
  startY.setDate(startY.getDate() - 1);
  startY.setHours(0, 0, 0, 0);
  const endY = new Date(startY);
  endY.setHours(23, 59, 59, 999);
  const startD2 = new Date(startY);
  startD2.setDate(startY.getDate() - 1);
  const endD2 = new Date(startD2);
  endD2.setHours(23, 59, 59, 999);

  const inRange = (dateStr: string, start: Date, end: Date) => {
    const ts = new Date(dateStr).getTime();
    return ts >= start.getTime() && ts <= end.getTime();
  };

  const yOrders = orders.filter((o) => inRange(o.order_date, startY, endY));
  const d2Orders = orders.filter((o) => inRange(o.order_date, startD2, endD2));

  const revenueOf = (list: Order[]) => list.filter((o) => !isCancelled(o)).reduce((s, o) => s + o.amount, 0);
  const revenue = revenueOf(yOrders);
  const prevRevenue = revenueOf(d2Orders);
  const orderCount = yOrders.filter((o) => !isCancelled(o)).length;
  const prevOrderCount = d2Orders.filter((o) => !isCancelled(o)).length;

  const newClients = users.filter((u) => u.created_at && inRange(u.created_at, startY, endY)).length;
  const stockouts = products.filter((p) => (p.stock_quantity ?? 0) <= 0).length;

  return {
    date: startY,
    revenue,
    revenueDelta: pctDelta(revenue, prevRevenue),
    orders: orderCount,
    ordersDelta: pctDelta(orderCount, prevOrderCount),
    avgBasket: orderCount > 0 ? revenue / orderCount : 0,
    newClients,
    delivered: yOrders.filter(isDelivered).length,
    pending: yOrders.filter(isPending).length,
    stockouts,
    hasActivity: orderCount > 0 || newClients > 0,
  };
}

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
        up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
      }`}
    >
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

export function DailyRecap() {
  const { t, i18n } = useTranslation();
  const { email, firstname } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [recap, setRecap] = useState<Recap | null>(null);

  useEffect(() => {
    if (!email || shownThisSession) return;

    const frequency = getRecapFrequency(email);
    const storageKey = `stocks:daily-recap:${email}`;
    const todayKey = localDateKey(new Date());

    // En mode « une fois par jour », on saute si déjà affiché aujourd'hui.
    // En mode « à chaque ouverture », seul le garde de session s'applique
    // (affiché une fois par chargement de l'app, pas à chaque navigation).
    if (frequency === "once_per_day") {
      let already: string | null = null;
      try {
        already = localStorage.getItem(storageKey);
      } catch {
        /* ignore */
      }
      if (already === todayKey) {
        shownThisSession = true;
        return;
      }
    }

    let cancelled = false;
    buildRecap().then((data) => {
      // Le flag n'est posé qu'au succès, sur l'instance encore montée :
      // évite le blocage avec le double-montage de React.StrictMode (dev).
      if (cancelled || !data) return;
      shownThisSession = true;
      setRecap(data);
      setOpen(true);
      if (frequency === "once_per_day") {
        try {
          localStorage.setItem(storageKey, todayKey);
        } catch {
          /* ignore */
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !recap) return null;

  const lang = i18n.language || "fr-FR";
  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
  const fmtDate = recap.date.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });

  const tiles = [
    {
      icon: Euro,
      label: t("daily_recap.revenue", "Chiffre d'affaires"),
      value: fmtCurrency(recap.revenue),
      delta: recap.revenueDelta,
      accent: "text-emerald-500",
    },
    {
      icon: ShoppingCart,
      label: t("daily_recap.orders", "Commandes"),
      value: recap.orders.toString(),
      delta: recap.ordersDelta,
      accent: "text-primary",
    },
    {
      icon: Euro,
      label: t("daily_recap.avg_basket", "Panier moyen"),
      value: fmtCurrency(recap.avgBasket),
      delta: null,
      accent: "text-blue-500",
    },
    {
      icon: Users,
      label: t("daily_recap.new_clients", "Nouveaux clients"),
      value: recap.newClients.toString(),
      delta: null,
      accent: "text-violet-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg overflow-hidden bg-card border border-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 border-b border-border">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">
              {firstname
                ? t("daily_recap.greeting", "Bonjour {{name}}", { name: firstname })
                : t("daily_recap.greeting_generic", "Bonjour")}
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-foreground">{t("daily_recap.title", "Votre journée d'hier")}</h2>
            <p className="mt-0.5 text-sm capitalize text-muted-foreground">{fmtDate}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-3 p-6">
          {tiles.map((tile) => (
            <div key={tile.label} className="p-4 border border-border rounded-xl bg-muted/30">
              <div className="flex items-center justify-between">
                <tile.icon className={`w-4 h-4 ${tile.accent}`} />
                <DeltaBadge value={tile.delta} />
              </div>
              <p className="mt-3 text-lg font-bold tabular-nums text-foreground">{tile.value}</p>
              <p className="text-[12px] text-muted-foreground">{tile.label}</p>
            </div>
          ))}
        </div>

        {/* Info line */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 pb-4 text-[12px] text-muted-foreground">
          <span>{t("daily_recap.delivered", "{{count}} livrées", { count: recap.delivered })}</span>
          <span>·</span>
          <span>{t("daily_recap.pending", "{{count}} en attente", { count: recap.pending })}</span>
          {recap.stockouts > 0 && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <PackageX className="w-3.5 h-3.5" />
                {t("daily_recap.stockouts", "{{count}} en rupture", { count: recap.stockouts })}
              </span>
            </>
          )}
        </div>

        {!recap.hasActivity && (
          <p className="px-6 pb-4 text-[13px] text-muted-foreground/80">
            {t("daily_recap.no_activity", "Aucune activité enregistrée hier.")}
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-border bg-muted/20">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors"
          >
            {t("daily_recap.close", "Fermer")}
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard");
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("daily_recap.go_dashboard", "Voir le tableau de bord")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
