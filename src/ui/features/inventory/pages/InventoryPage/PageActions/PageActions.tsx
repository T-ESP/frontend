import { useTranslation } from "react-i18next";

interface PageActionsProps {
  onAddProduct: () => void;
}

export function PageActions({ onAddProduct }: PageActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      {/* <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
        {t('common.export')}
      </button> */}
      <button
        onClick={onAddProduct}
        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700"
      >
        {t('inventory.add_product')}
      </button>
    </div>
  );
}

