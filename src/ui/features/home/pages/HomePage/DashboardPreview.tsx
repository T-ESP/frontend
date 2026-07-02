import { FiBarChart2 } from "react-icons/fi";
import { KPICard } from "@/ui/features/dashboard/pages/DashboardPage/KPICards/KPICard";
import { RevenueChart } from "@/ui/features/dashboard/pages/DashboardPage/ChartContainer/RevenueChart";
import type { KPI } from "@/ui/features/dashboard/types";

/* ============================================================
 * Aperçu du dashboard pour la landing — réutilise les VRAIS
 * composants présentationnels du DashboardPage (KPICard,
 * RevenueChart), nourris en DONNÉES MOCK.
 *
 * 🎯 But : un aperçu LISIBLE et engageant, pas le dashboard
 *    complet. On ne montre que les KPIs + le graphe revenus ;
 *    le bas est coupé par un fondu dans le mockup.
 *
 * ⚠️ On NE réutilise PAS le vrai <TopProducts> : il déclenche un
 *    fetch de scores au montage → 401 sur la landing publique →
 *    l'intercepteur API redirige vers /login.
 *
 * Forcé en thème sombre via la classe `.dark` du wrapper, pour
 * coller au hero (la landing publique est en thème clair).
 * ============================================================ */

/** Petite sparkline factice déterministe. */
const spark = (vals: number[]) => vals.map((value) => ({ value }));

const MOCK_KPIS: KPI[] = [
  {
    title: "Chiffre d'affaires",
    value: "84 200 €",
    change: "+12,4 %",
    trend: "up",
    icon: FiBarChart2,
    color: "",
    description: "30 derniers jours",
    chartType: "line",
    sparkline: spark([42, 48, 45, 58, 54, 66, 72, 84]),
  },
  {
    title: "Commandes",
    value: "1 284",
    change: "+8,1 %",
    trend: "up",
    icon: FiBarChart2,
    color: "",
    description: "30 derniers jours",
    chartType: "bar",
    sparkline: spark([120, 150, 138, 162, 155, 180, 174, 198]),
  },
  {
    title: "Valeur du stock",
    value: "128 400 €",
    change: "+4,2 %",
    trend: "up",
    icon: FiBarChart2,
    color: "",
    description: "Inventaire actuel",
    chartType: "line",
    sparkline: spark([98, 102, 110, 108, 118, 121, 125, 128]),
  },
  {
    title: "Stock faible",
    value: "7",
    change: "-3",
    trend: "down",
    icon: FiBarChart2,
    color: "",
    description: "Produits à réapprovisionner",
    chartType: "line",
    sparkline: spark([14, 13, 12, 11, 10, 9, 8, 7]),
  },
];

const MOCK_REVENUE = [
  { month: "Janv.", revenue: 52000, profit: 36400 },
  { month: "Févr.", revenue: 48500, profit: 33950 },
  { month: "Mars", revenue: 61200, profit: 42840 },
  { month: "Avr.", revenue: 58700, profit: 41090 },
  { month: "Mai", revenue: 67400, profit: 47180 },
  { month: "Juin", revenue: 72100, profit: 50470 },
  { month: "Juil.", revenue: 69800, profit: 48860 },
  { month: "Août", revenue: 78300, profit: 54810 },
  { month: "Sept.", revenue: 84200, profit: 58940 },
];

export function DashboardPreview() {
  return (
    // `.dark` force les tokens sombres (--card, --foreground…) sur ce sous-arbre.
    <div className="dark bg-background p-6 text-foreground">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_KPIS.map((kpi) => (
          <KPICard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Graphe revenus (dernière section : son bas est coupé par le fondu) */}
      <div className="mt-6">
        <RevenueChart data={MOCK_REVENUE} rangeLabel="30 derniers jours" />
      </div>
    </div>
  );
}
