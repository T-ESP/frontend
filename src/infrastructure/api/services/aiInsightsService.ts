import { apiClient } from '../client';

// ====================== TYPES ======================

export interface AiInsightsParams {
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string;   // Format: YYYY-MM-DD
}

export interface PeriodInfo {
  start_date: string;
  end_date: string;
  days_count: number;
}

export interface GlobalPerformanceKpis {
  total_revenue: number;
  total_profit: number;
  avg_margin_rate: number | null;
  total_products_count: number;
  active_products_count: number;
  inactive_products_count: number;
  discontinued_products_count: number;
  total_orders_count: number;
  global_avg_basket_value: number | null;
  total_stock_value_cost: number;
  total_stock_value_potential: number;
}

export interface RankingProductInfo {
  product_id: number;
  product_name: string;
  category: string;
  value: number;
}

export interface TopFlopKpis {
  top_10_by_revenue: RankingProductInfo[];
  top_10_by_profit: RankingProductInfo[];
  top_10_by_volume: RankingProductInfo[];
  top_10_by_turnover: RankingProductInfo[];
  flop_10_by_sales: RankingProductInfo[];
  flop_10_by_profit: RankingProductInfo[];
  at_risk_products: RankingProductInfo[];
}

export interface StockResponse {
  id: number;
  name: string;
  category: string;
  reference: string;
  supplier_id: number;
  stock_quantity: number;
  buying_price: number;
  date_last_reassor: string;
  stock_status: string;
}

export interface StockAlert {
  product: StockResponse;
  alert_type: string;
  severity: string;
  message: string;
}

export interface StockSummary {
  total_products: number;
  out_of_stock_count: number;
  low_stock_count: number;
  overstock_count: number;
  total_stock_value: number;
  categories_affected: string[];
}

export interface TrendsKpis {
  revenue_growth_percent: number | null;
  profit_growth_percent: number | null;
  orders_growth_percent: number | null;
  basket_value_growth_percent: number | null;
  global_trend: string;
  seasonality_detected: boolean;
}

export interface CategoryStats {
  category: string;
  revenue: number;
  profit: number;
  avg_margin_rate: number | null;
  products_count: number;
  avg_turnover_rate: number | null;
  stock_distribution_percent: number | null;
}

export interface CategoryAnalysisKpis {
  by_category: CategoryStats[];
  top_5_by_revenue: CategoryStats[];
  top_5_by_profit: CategoryStats[];
  top_5_by_volume: CategoryStats[];
}

export interface ForecastKpis {
  forecasted_revenue_next_month: number | null;
  forecasted_revenue_next_3_months: number | null;
  cash_needed_for_restocks: number;
  predicted_stockouts_count: number;
  optimization_opportunities_count: number;
}

export interface CatalogHealthKpis {
  availability_rate: number | null;
  stockout_products_count: number;
  discontinued_products_count: number;
  catalog_renewal_rate: number | null;
  low_rotation_products_percent: number | null;
  obsolete_products_percent: number | null;
  overstocked_products_percent: number | null;
}

export interface AiInsightsData {
  global_performance: GlobalPerformanceKpis;
  top_flop: TopFlopKpis;
  stock_alerts: StockAlert[];
  stock_summary: StockSummary;
  trends: TrendsKpis;
  category_analysis: CategoryAnalysisKpis;
  forecast: ForecastKpis;
  catalog_health: CatalogHealthKpis;
  period: PeriodInfo;
}

export interface AiInsightsResponse {
  status: string;
  message: string;
  data: AiInsightsData;
}

// ====================== SERVICE ======================

class AiInsightsService {
  /**
   * Récupère toutes les données agrégées pour l'analyse IA
   * @param params Paramètres optionnels (dates de début et fin)
   * @returns Données complètes pour l'IA
   */
  async getInsights(params?: AiInsightsParams): Promise<AiInsightsData> {
    // Construire l'URL avec les paramètres
    let url = '/ai/insights';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.start_date) searchParams.append('start_date', params.start_date);
      if (params.end_date) searchParams.append('end_date', params.end_date);
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }

    const response = await apiClient.get<AiInsightsResponse>(url);
    return response.data;
  }

  /**
   * Récupère les insights pour les 30 derniers jours
   */
  async getLast30Days(): Promise<AiInsightsData> {
    return this.getInsights();
  }

  /**
   * Récupère les insights pour une période personnalisée
   * @param startDate Date de début (format: YYYY-MM-DD)
   * @param endDate Date de fin (format: YYYY-MM-DD)
   */
  async getCustomPeriod(startDate: string, endDate: string): Promise<AiInsightsData> {
    return this.getInsights({ start_date: startDate, end_date: endDate });
  }

  /**
   * Formate les données pour un prompt IA simple
   * @param data Données d'insights
   * @returns Texte formaté pour l'IA
   */
  formatForAI(data: AiInsightsData): string {
    return `
ANALYSE DU STOCK - PÉRIODE DU ${data.period.start_date} AU ${data.period.end_date}

📊 PERFORMANCE GLOBALE:
- Chiffre d'affaires: ${data.global_performance.total_revenue.toFixed(2)}€
- Profit: ${data.global_performance.total_profit.toFixed(2)}€
- Marge moyenne: ${data.global_performance.avg_margin_rate?.toFixed(1) || 'N/A'}%
- Nombre de commandes: ${data.global_performance.total_orders_count}
- Panier moyen: ${data.global_performance.global_avg_basket_value?.toFixed(2) || 'N/A'}€
- Produits actifs: ${data.global_performance.active_products_count}/${data.global_performance.total_products_count}

📈 TENDANCES:
- Tendance globale: ${data.trends.global_trend}
- Croissance CA: ${data.trends.revenue_growth_percent?.toFixed(1) || 'N/A'}%
- Croissance profit: ${data.trends.profit_growth_percent?.toFixed(1) || 'N/A'}%
- Croissance commandes: ${data.trends.orders_growth_percent?.toFixed(1) || 'N/A'}%

⭐ TOP 5 PRODUITS (par CA):
${data.top_flop.top_10_by_revenue.slice(0, 5).map((p, i) => 
  `${i + 1}. ${p.product_name} (${p.category}) - ${p.value.toFixed(2)}€`
).join('\n')}

⚠️ ALERTES STOCKS:
- Total alertes: ${data.stock_alerts.length}
- Ruptures de stock: ${data.stock_summary.out_of_stock_count}
- Stock bas: ${data.stock_summary.low_stock_count}
- Surstock: ${data.stock_summary.overstock_count}

🔮 PRÉVISIONS:
- CA prévu mois prochain: ${data.forecast.forecasted_revenue_next_month?.toFixed(2) || 'N/A'}€
- CA prévu 3 mois: ${data.forecast.forecasted_revenue_next_3_months?.toFixed(2) || 'N/A'}€
- Ruptures prévues: ${data.forecast.predicted_stockouts_count}
- Opportunités d'optimisation: ${data.forecast.optimization_opportunities_count}

📦 SANTÉ DU CATALOGUE:
- Taux de disponibilité: ${data.catalog_health.availability_rate?.toFixed(1) || 'N/A'}%
- Produits à faible rotation: ${data.catalog_health.low_rotation_products_percent?.toFixed(1) || 'N/A'}%
- Produits obsolètes: ${data.catalog_health.obsolete_products_percent?.toFixed(1) || 'N/A'}%
`;
  }

  /**
   * Formate les données pour un prompt IA détaillé (JSON)
   * @param data Données d'insights
   * @returns Objet structuré pour l'IA
   */
  formatForAIStructured(data: AiInsightsData): object {
    return {
      periode: {
        debut: data.period.start_date,
        fin: data.period.end_date,
        jours: data.period.days_count
      },
      performance: {
        ca: data.global_performance.total_revenue,
        profit: data.global_performance.total_profit,
        marge: data.global_performance.avg_margin_rate,
        commandes: data.global_performance.total_orders_count,
        panier_moyen: data.global_performance.global_avg_basket_value
      },
      tendances: {
        direction: data.trends.global_trend,
        croissance_ca: data.trends.revenue_growth_percent,
        croissance_profit: data.trends.profit_growth_percent
      },
      top_produits: data.top_flop.top_10_by_revenue.slice(0, 5).map(p => ({
        nom: p.product_name,
        categorie: p.category,
        ca: p.value
      })),
      alertes: {
        total: data.stock_alerts.length,
        ruptures: data.stock_summary.out_of_stock_count,
        stock_bas: data.stock_summary.low_stock_count,
        surstock: data.stock_summary.overstock_count,
        details: data.stock_alerts.slice(0, 10).map(a => ({
          produit: a.product.name,
          type: a.alert_type,
          severite: a.severity,
          message: a.message
        }))
      },
      previsions: {
        ca_mois_prochain: data.forecast.forecasted_revenue_next_month,
        ruptures_prevues: data.forecast.predicted_stockouts_count,
        opportunites: data.forecast.optimization_opportunities_count
      }
    };
  }

  /**
   * Identifie les points d'attention critiques
   * @param data Données d'insights
   * @returns Liste des alertes critiques
   */
  getCriticalPoints(data: AiInsightsData): string[] {
    const points: string[] = [];

    // Vérifier les ruptures de stock
    if (data.stock_summary.out_of_stock_count > 0) {
      points.push(`⚠️ ${data.stock_summary.out_of_stock_count} produits en rupture de stock`);
    }

    // Vérifier les alertes critiques
    const criticalAlerts = data.stock_alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
    if (criticalAlerts.length > 0) {
      points.push(`🚨 ${criticalAlerts.length} alertes critiques nécessitent une attention immédiate`);
    }

    // Vérifier la tendance négative
    if (data.trends.global_trend === 'decreasing') {
      points.push(`📉 Tendance à la baisse: CA en décroissance de ${data.trends.revenue_growth_percent?.toFixed(1)}%`);
    }

    // Vérifier le taux de disponibilité
    if (data.catalog_health.availability_rate && data.catalog_health.availability_rate < 85) {
      points.push(`📦 Taux de disponibilité faible: ${data.catalog_health.availability_rate.toFixed(1)}%`);
    }

    // Vérifier les produits obsolètes
    if (data.catalog_health.obsolete_products_percent && data.catalog_health.obsolete_products_percent > 10) {
      points.push(`⏰ Trop de produits obsolètes: ${data.catalog_health.obsolete_products_percent.toFixed(1)}%`);
    }

    // Vérifier les ruptures prévues
    if (data.forecast.predicted_stockouts_count > 5) {
      points.push(`🔮 ${data.forecast.predicted_stockouts_count} ruptures de stock prévues`);
    }

    return points;
  }

  /**
   * Génère un résumé exécutif
   * @param data Données d'insights
   * @returns Résumé pour la direction
   */
  getExecutiveSummary(data: AiInsightsData): string {
    const trend = data.trends.global_trend === 'increasing' ? '📈 en hausse' : 
                  data.trends.global_trend === 'decreasing' ? '📉 en baisse' : '➡️ stable';
    
    return `
📊 RÉSUMÉ EXÉCUTIF - ${data.period.start_date} au ${data.period.end_date}

🎯 Performance: ${data.global_performance.total_revenue.toFixed(0)}€ de CA (${trend})
💰 Profitabilité: ${data.global_performance.total_profit.toFixed(0)}€ de profit
📦 État des stocks: ${data.stock_summary.out_of_stock_count} ruptures, ${data.stock_summary.low_stock_count} stocks bas
⭐ Meilleur produit: ${data.top_flop.top_10_by_revenue[0]?.product_name || 'N/A'}
🔮 Prévision: ${data.forecast.forecasted_revenue_next_month?.toFixed(0) || 'N/A'}€ attendus le mois prochain

${this.getCriticalPoints(data).length > 0 ? 
  `⚠️ Points d'attention:\n${this.getCriticalPoints(data).join('\n')}` : 
  '✅ Aucun point critique détecté'
}
`;
  }
}

export const aiInsightsService = new AiInsightsService();
export default aiInsightsService;
