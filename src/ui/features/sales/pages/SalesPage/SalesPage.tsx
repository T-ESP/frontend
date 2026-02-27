import { useState, useEffect } from "react";
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiArrowRight, FiPieChart, FiAward } from "react-icons/fi"; // Lucide is better if you have it, but sticking to your imports
import { KpiCard } from "@/ui/components/common/KpiCard";
import SalesChart from "@/ui/features/sales/pages/SalesPage/SalesChart";
import { salesService } from "@/infrastructure/api/services/salesService";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useTranslation } from "react-i18next";

// --- Types pour nos nouvelles analyses ---
interface TopProduct {
  id: number;
  name: string;
  revenue: number;
  quantity: number;
}

interface CategoryData {
  name: string;
  value: number; // Revenue
  color: string;
  [key: string]: string | number; // Signature d'index pour Recharts
}

const COLORS = ['#9333ea', '#c084fc', '#6b21a8', '#d8b4fe', '#94a3b8'];

export default function SalesPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'fr-FR';
  // ... (Garder l'état existant)
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);
  const [averageBasket, setAverageBasket] = useState<number>(0);
  const [averageBasketEvolution, setAverageBasketEvolution] = useState<number>(0);
  const [chartData, setChartData] = useState<Array<{ date: string; revenue: number; orders: number }>>([]);

  // Nouvel état pour les analyses
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const period = { start_date: formatDate(startDate), end_date: formatDate(endDate), grain: 'day' };

      const [revenueData, basketData, ordersData, dailyRevenueData, productsData] = await Promise.allSettled([
        salesService.getTotalRevenue(period),
        salesService.getAverageBasket(period),
        orderService.getAll(),
        salesService.getEvolutionByGrain(period),
        productService.getAll(),
      ]);

      // ... (Garder vos vérifications de sécurité existantes pour les revenus/paniers) ...
      if (revenueData.status === 'fulfilled' && revenueData.value) setTotalRevenue(revenueData.value.total_revenue || 0);
      if (basketData.status === 'fulfilled' && basketData.value) {
        setAverageBasket(basketData.value.average_basket || 0);
        setAverageBasketEvolution(basketData.value.evolution_percentage || 0);
      }

      // --- NOUVEAU: Traiter les commandes pour des analyses approfondies ---
      if (ordersData.status === 'fulfilled' && ordersData.value &&
        productsData.status === 'fulfilled' && productsData.value) {
        setOrders(ordersData.value);
        await processInsights(ordersData.value, productsData.value);
      }

      // Traiter les données de revenus quotidiens pour le graphique
      if (dailyRevenueData.status === 'fulfilled' && dailyRevenueData.value) {
        const dailyData = dailyRevenueData.value.data || [];

        // Calculer la croissance des revenus à partir des données quotidiennes
        if (dailyData.length > 0) {
          const halfPoint = Math.floor(dailyData.length / 2);
          const firstHalf = dailyData.slice(0, halfPoint);
          const secondHalf = dailyData.slice(halfPoint);

          const firstHalfRevenue = firstHalf.reduce((sum, d) => sum + d.revenue, 0);
          const secondHalfRevenue = secondHalf.reduce((sum, d) => sum + d.revenue, 0);

          if (firstHalfRevenue > 0) {
            const growth = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
            setRevenueGrowth(growth);
          }
        }

        // Créer une map pour compter les commandes par jour
        const ordersByDate = new Map<string, number>();
        if (ordersData.status === 'fulfilled' && ordersData.value) {
          ordersData.value.forEach(order => {
            if (order.status !== 'Cancelled') {
              const dateStr = new Date(order.order_date).toISOString().split('T')[0];
              ordersByDate.set(dateStr, (ordersByDate.get(dateStr) || 0) + 1);
            }
          });
        }

        // Combiner les données de revenus avec le nombre de commandes
        const processedData = dailyData.map(item => ({
          date: item.date,
          revenue: item.revenue,
          orders: ordersByDate.get(item.date) || 0,
        }));

        setChartData(processedData);
      }

    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE POUR EXTRAIRE LES ANALYSES DES COMMANDES ---
  const processInsights = async (orders: Order[], products: Product[]) => {
    try {
      const productMap = new Map<number, TopProduct>();
      const categoryMap = new Map<string, number>();
      const productsById = new Map(products.map(p => [p.id, p]));

      // Filtrer les commandes valides
      const validOrders = orders.filter(order =>
        order.status !== 'Cancelled' &&
        order.amount > 0
      );

      console.log(`Traitement de ${validOrders.length} commandes valides...`);

      // Traiter chaque commande pour obtenir les articles et regrouper par produit et catégorie
      const orderPromises = validOrders
        .map(order =>
          orderService.getOrderItems(order.id)
            .catch(err => {
              console.warn(`Échec de la récupération des articles pour la commande ${order.id}:`, err);
              return [];
            })
        );

      const allLineItems = await Promise.all(orderPromises);

      let totalItemsProcessed = 0;
      let itemsWithInvalidData = 0;

      // Agréger les données par produit et par catégorie
      allLineItems.forEach((lineItems, orderIndex) => {
        if (!lineItems || lineItems.length === 0) return;

        lineItems.forEach(item => {
          totalItemsProcessed++;

          const product = productsById.get(item.product_id);
          if (!product) {
            console.warn(`Produit introuvable pour l'article:`, item);
            return;
          }

          // Obtenir le total de la ligne, avec calcul de secours
          let lineTotal = item.line_total;

          // Valider et gérer NaN/undefined
          if (typeof lineTotal !== 'number' || isNaN(lineTotal) || lineTotal === null || lineTotal === undefined) {
            // Solutions de repli: calculer à partir du montant de la commande divisé par le nombre d'articles
            const order = validOrders[orderIndex];
            lineTotal = order.amount / lineItems.length;
            itemsWithInvalidData++;
            console.warn(`line_total invalide pour le produit ${product.name}, utilisation de la valeur de secours:`, lineTotal);
          }

          // Agréger par produit
          const existing = productMap.get(item.product_id);
          if (existing) {
            existing.revenue += lineTotal;
            existing.quantity += item.quantity || 1;
          } else {
            productMap.set(item.product_id, {
              id: item.product_id,
              name: product.name,
              revenue: lineTotal,
              quantity: item.quantity || 1,
            });
          }

          // Agréger par catégorie
          const category = product.category || t('sales.uncategorized', 'Non catégorisé');
          const currentCategoryTotal = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCategoryTotal + lineTotal);
        });
      });

      console.log(`Traitement de ${totalItemsProcessed} articles, ${itemsWithInvalidData} avaient des données invalides`);
      console.log('Totaux par catégorie:', Array.from(categoryMap.entries()));

      // Trier et définir les meilleurs produits
      const sortedProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      setTopProducts(sortedProducts);

      // Traiter les catégories avec des couleurs
      const sortedCategories = Array.from(categoryMap.entries())
        .filter(([_, value]) => value > 0) // Filtrer les valeurs nulles
        .map(([name, value]) => ({ name, value: Number(value) || 0 })) // S'assurer que c'est un nombre
        .sort((a, b) => b.value - a.value);

      const TOP_N = 4;
      const finalCategories = sortedCategories.slice(0, TOP_N);
      const otherCategories = sortedCategories.slice(TOP_N);

      if (otherCategories.length > 0) {
        const otherValue = otherCategories.reduce((sum, cat) => sum + cat.value, 0);
        finalCategories.push({ name: t('common.others', 'Autres'), value: otherValue });
      }

      const processedCategories: CategoryData[] = finalCategories.map((cat, index) => ({
        ...cat,
        color: COLORS[index % COLORS.length]
      }));

      console.log('Catégories finales traitées:', processedCategories);
      setCategoryData(processedCategories);

    } catch (error) {
      console.error('Erreur lors du traitement des analyses:', error);
      // Définir des données vides en cas d'erreur
      setTopProducts([]);
      setCategoryData([]);
    }
  };

  // ... (Garder les helpers formatCurrency et formatPercentage) ...
  const formatCurrency = (val: number) => new Intl.NumberFormat(currentLang, { style: 'currency', currency: 'EUR' }).format(val);

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const stats = [
    {
      title: t('sales.stats.total_revenue'),
      value: formatCurrency(totalRevenue),
      change: formatPercentage(revenueGrowth),
      trend: revenueGrowth >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: t('sales.stats.last_30_days')
    },
    {
      title: t('sales.stats.total_orders'),
      value: orders.filter(o => o.status !== 'Cancelled').length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: t('sales.stats.last_30_days')
    },
    {
      title: t('sales.stats.avg_basket'),
      value: formatCurrency(averageBasket),
      change: formatPercentage(averageBasketEvolution),
      trend: averageBasketEvolution >= 0 ? "up" : "down",
      icon: FiTrendingUp,
      color: "purple",
      description: t('sales.stats.last_30_days')
    },
    {
      title: t('sales.stats.revenue_growth'),
      value: formatPercentage(revenueGrowth),
      change: formatPercentage(revenueGrowth),
      trend: revenueGrowth >= 0 ? "up" : "down",
      icon: FiArrowRight,
      color: "indigo",
      description: t('sales.stats.trend')
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
            {t('sales.title')}
          </h1>
          <p className="mt-2 text-slate-500">
            {t('sales.subtitle')}
          </p>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="mb-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white border shadow-sm rounded-xl animate-pulse border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <KpiCard
                key={stat.title}
                label={stat.title}
                value={stat.value}
                color="primary"
              />
            ))}
          </div>
        )}
      </div>

      {/* Graphique de revenus principal */}
      <div className="mb-6">
        <SalesChart data={chartData} />
      </div>

      {/* --- NOUVELLE SECTION : ANALYSE DES PERFORMANCES (Remplace le tableau ennuyeux) --- */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">

        {/* Panneau gauche : Produits les plus vendus (2/3 de largeur) */}
        <div className="flex flex-col bg-white border shadow-sm lg:col-span-2 rounded-xl border-slate-100">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FiAward className="text-amber-500" />
              <h3 className="font-bold text-slate-900">{t('sales.top_products')}</h3>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-500">{t('sales.table.product')}</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right uppercase text-slate-500">{t('sales.table.units')}</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right uppercase text-slate-500">{t('sales.table.revenue')}</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right uppercase text-slate-500">{t('sales.table.performance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((product, idx) => (
                  <tr key={product.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg shrink-0 bg-slate-100 text-slate-600">
                          #{idx + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right whitespace-nowrap text-slate-600">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-slate-900">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="w-24 ml-auto bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panneau droit : Ventes par catégorie (1/3 de largeur) */}
        <div className="flex flex-col bg-white border shadow-sm rounded-xl border-slate-100">
          <div className="flex items-center gap-2 p-6 border-b border-slate-100">
            <FiPieChart className="text-purple-500" />
            <h3 className="font-bold text-slate-900">{t('sales.by_category')}</h3>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Liste des catégories */}
            <div className="w-full mt-4 space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}