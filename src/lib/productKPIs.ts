import type { Product } from "@/domain/models/Product";
import type { Order, LineItem } from "@/domain/models/Order";

export interface ProductKPI {
  productId: number;
  productName: string;
  // Pricing & Margin
  currentBuyingPrice: number;
  currentSellingPrice: number;
  grossMargin: number;
  marginRate: number;
  // Stock
  currentStock: number;
  // Sales & Rotation
  quantitySold: number;
  revenue: number;
  profit: number;
  stockTurnover: number;
  // Scoring
  abcClassification: 'A' | 'B' | 'C';
  performanceCategory: 'star' | 'rising' | 'declining' | 'dead';
  globalScore: number;
}

/**
 * Calculate KPIs for all products based on orders data
 */
export function calculateProductKPIs(
  products: Product[],
  orders: Order[],
  lineItems: Map<number, LineItem[]>
): ProductKPI[] {
  const productKPIs: ProductKPI[] = products.map(product => {
    // Calculate sales for this product
    let quantitySold = 0;
    let revenue = 0;

    orders.forEach(order => {
      const items = lineItems.get(order.id) || [];
      items.forEach(item => {
        if (item.product_id === product.id) {
          quantitySold += item.quantity;
          revenue += item.line_total;
        }
      });
    });

    // Calculate margin
    const estimatedSellingPrice = product.buying_price * 1.4; // Assume 40% markup
    const grossMargin = estimatedSellingPrice - product.buying_price;
    const marginRate = (grossMargin / product.buying_price) * 100;

    // Calculate profit
    const profit = quantitySold * grossMargin;

    // Calculate stock turnover
    const avgStock = product.stock_quantity;
    const stockTurnover = avgStock > 0 ? quantitySold / avgStock : 0;

    // Calculate global score (0-100)
    const popularityScore = Math.min((quantitySold / 100) * 100, 100);
    const profitabilityScore = Math.min((marginRate / 50) * 100, 100);
    const reliabilityScore = product.stock_quantity > 0 ? 90 : 30;
    const globalScore = (popularityScore + profitabilityScore + reliabilityScore) / 3;

    // ABC Classification
    let abcClassification: 'A' | 'B' | 'C' = 'C';
    if (globalScore >= 70) abcClassification = 'A';
    else if (globalScore >= 40) abcClassification = 'B';

    // Performance Category
    let performanceCategory: 'star' | 'rising' | 'declining' | 'dead' = 'dead';
    if (globalScore >= 80) performanceCategory = 'star';
    else if (globalScore >= 60) performanceCategory = 'rising';
    else if (globalScore >= 30) performanceCategory = 'declining';

    return {
      productId: product.id,
      productName: product.name,
      currentBuyingPrice: product.buying_price,
      currentSellingPrice: estimatedSellingPrice,
      grossMargin,
      marginRate,
      currentStock: product.stock_quantity,
      quantitySold,
      revenue,
      profit,
      stockTurnover,
      abcClassification,
      performanceCategory,
      globalScore,
    };
  });

  return productKPIs;
}

/**
 * Get top N products by revenue
 */
export function getTopProductsByRevenue(kpis: ProductKPI[], n: number = 10): ProductKPI[] {
  return [...kpis].sort((a, b) => b.revenue - a.revenue).slice(0, n);
}

/**
 * Get top N products by profit
 */
export function getTopProductsByProfit(kpis: ProductKPI[], n: number = 10): ProductKPI[] {
  return [...kpis].sort((a, b) => b.profit - a.profit).slice(0, n);
}

/**
 * Get flop products (least sold)
 */
export function getFlopProducts(kpis: ProductKPI[], n: number = 10): ProductKPI[] {
  return [...kpis]
    .filter(kpi => kpi.quantitySold > 0)
    .sort((a, b) => a.quantitySold - b.quantitySold)
    .slice(0, n);
}

/**
 * Get ABC distribution
 */
export function getABCDistribution(kpis: ProductKPI[]): {
  A: { count: number; revenue: number; percentage: number };
  B: { count: number; revenue: number; percentage: number };
  C: { count: number; revenue: number; percentage: number };
} {
  const totalRevenue = kpis.reduce((sum, kpi) => sum + kpi.revenue, 0);

  const aProducts = kpis.filter(k => k.abcClassification === 'A');
  const bProducts = kpis.filter(k => k.abcClassification === 'B');
  const cProducts = kpis.filter(k => k.abcClassification === 'C');

  const aRevenue = aProducts.reduce((sum, k) => sum + k.revenue, 0);
  const bRevenue = bProducts.reduce((sum, k) => sum + k.revenue, 0);
  const cRevenue = cProducts.reduce((sum, k) => sum + k.revenue, 0);

  return {
    A: {
      count: aProducts.length,
      revenue: aRevenue,
      percentage: totalRevenue > 0 ? (aRevenue / totalRevenue) * 100 : 0,
    },
    B: {
      count: bProducts.length,
      revenue: bRevenue,
      percentage: totalRevenue > 0 ? (bRevenue / totalRevenue) * 100 : 0,
    },
    C: {
      count: cProducts.length,
      revenue: cRevenue,
      percentage: totalRevenue > 0 ? (cRevenue / totalRevenue) * 100 : 0,
    },
  };
}

/**
 * Get products with alerts
 */
export function getProductAlerts(kpis: ProductKPI[]): {
  lowStock: ProductKPI[];
  noSales: ProductKPI[];
  lowRotation: ProductKPI[];
} {
  return {
    lowStock: kpis.filter(k => k.currentStock < 10 && k.quantitySold > 0),
    noSales: kpis.filter(k => k.quantitySold === 0),
    lowRotation: kpis.filter(k => k.stockTurnover < 1 && k.currentStock > 20),
  };
}
