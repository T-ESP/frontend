import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PageActionsProps {
  onAddProduct: () => void;
}

export function PageActions({ onAddProduct }: PageActionsProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onAddProduct}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Plus className="w-4 h-4" />
      {t('inventory.add_product')}
    </button>
  );
}
