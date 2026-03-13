import { useTranslation } from "react-i18next";

export function InventoryTableHead() {
  const { t } = useTranslation();
  return (
    <thead>
      <tr className="border-b border-gray-100 bg-gray-50/50">
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          {t('inventory.table.product')}
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          {t('inventory.table.category')}
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          {t('inventory.table.price')}
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          {t('inventory.table.stock')}
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          {t('inventory.table.status')}
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          {t('common.actions')}
        </th>
      </tr>
    </thead>
  );
}

