import { useTranslation } from "react-i18next";

export function InventoryTableHead() {
  const { t } = useTranslation();
  return (
    <thead className="bg-gray-100/70">
      <tr>
        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
          {t('inventory.table.product')}
        </th>
        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
          {t('inventory.table.category')}
        </th>
        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
          {t('inventory.table.price')}
        </th>
        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
          {t('inventory.table.stock')}
        </th>
        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
          {t('inventory.table.status')}
        </th>
        <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">
          {t('common.actions')}
        </th>
      </tr>
    </thead>
  );
}

