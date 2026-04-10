import { useState } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order } from '@/domain/models/Order';

export function useExportInvoice() {
  const [isExporting, setIsExporting] = useState<number | null>(null);

  const exportInvoice = async (order: Order, locale: string) => {
    setIsExporting(order.id);

    try {
      const lineItems = await orderService.getOrderItems(order.id);

      const formatCurrency = (amount: number) =>
        new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);

      const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

      const statusColors: Record<string, string> = {
        pending: '#fef3c7;color:#92400e',
        confirmed: '#dbeafe;color:#1e40af',
        shipped: '#ede9fe;color:#6d28d9',
        delivered: '#d1fae5;color:#065f46',
        cancelled: '#fee2e2;color:#991b1b',
      };
      const statusStyle = statusColors[order.status.toLowerCase()] ?? '#f3f4f6;color:#374151';

      const lineItemsRows = lineItems
        .map(
          (item) => `
          <tr>
            <td>Produit #${item.product_id}</td>
            <td style="text-align:center">${item.quantity}</td>
            <td style="text-align:right;font-weight:500">${formatCurrency(item.line_total)}</td>
          </tr>`
        )
        .join('');

      const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>Facture #${String(order.id).padStart(6, '0')} — StockS</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111827;background:#fff;padding:48px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px}
    .brand{font-size:30px;font-weight:800;color:#7c3aed;letter-spacing:-1px}
    .brand span{font-size:13px;font-weight:400;color:#9ca3af;display:block;margin-top:2px;letter-spacing:0}
    .inv-title h1{font-size:34px;font-weight:700;color:#111;text-align:right}
    .inv-title p{color:#6b7280;font-size:13px;text-align:right;margin-top:4px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:40px}
    .meta-group label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;display:block;margin-bottom:5px}
    .meta-group span{font-size:14px;font-weight:600;color:#111}
    .badge{display:inline-block;padding:3px 10px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;background:${statusStyle.split(';')[0]};${statusStyle.split(';')[1]}}
    table{width:100%;border-collapse:collapse;margin-bottom:32px;font-size:14px}
    thead tr{background:#7c3aed}
    thead th{padding:12px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#fff}
    thead th:last-child{text-align:right}
    thead th:nth-child(2){text-align:center}
    tbody tr{border-bottom:1px solid #f3f4f6}
    tbody tr:nth-child(even){background:#f9fafb}
    tbody td{padding:11px 16px;color:#374151}
    tfoot td{padding:14px 16px;background:#f3f4f6;font-weight:700;font-size:15px}
    tfoot td:last-child{text-align:right;color:#7c3aed;font-size:17px}
    .footer{margin-top:56px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;color:#9ca3af;font-size:11px;line-height:1.7}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">StockS<span>Système de gestion des stocks</span></div>
    <div class="inv-title">
      <h1>FACTURE</h1>
      <p>#${String(order.id).padStart(6, '0')}</p>
    </div>
  </div>

  <div class="meta">
    <div class="meta-group">
      <label>Client</label>
      <span>Client #${order.user_id}</span>
    </div>
    <div class="meta-group">
      <label>Date de commande</label>
      <span>${formatDate(order.order_date)}</span>
    </div>
    <div class="meta-group">
      <label>Statut</label>
      <span class="badge">${order.status}</span>
    </div>
    <div class="meta-group">
      <label>Date d'émission</label>
      <span>${formatDate(new Date().toISOString())}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produit</th>
        <th>Qté</th>
        <th>Total ligne</th>
      </tr>
    </thead>
    <tbody>${lineItemsRows}</tbody>
    <tfoot>
      <tr>
        <td colspan="2">Total TTC</td>
        <td>${formatCurrency(order.amount)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>StockS — Plateforme de gestion des stocks</p>
    <p>Facture générée automatiquement le ${formatDate(new Date().toISOString())}</p>
  </div>
</body>
</html>`;

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }
    } finally {
      setIsExporting(null);
    }
  };

  return { exportInvoice, isExporting };
}
