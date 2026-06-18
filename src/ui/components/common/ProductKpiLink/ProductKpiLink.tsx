import { useNavigate } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export interface ProductKpiLinkProps {
  productId: number | string;
  name: string;
  /** Hide the small chart icon shown before the name. */
  hideIcon?: boolean;
  className?: string;
}

/**
 * Renders a product name as a clickable link that navigates to the product's
 * KPI page (`/inventory/:id/kpis`). Use anywhere a product is mentioned in a
 * table so users can jump straight to its KPIs.
 */
export function ProductKpiLink({ productId, name, hideIcon = false, className = "" }: ProductKpiLinkProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToKpis = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/inventory/${productId}/kpis`);
  };

  return (
    <button
      type="button"
      onClick={goToKpis}
      title={t("inventory.card.view_kpis", "Voir les KPIs")}
      className={`group inline-flex items-center gap-1.5 text-left font-medium text-foreground transition-colors hover:text-primary hover:underline underline-offset-2 focus:outline-none focus-visible:text-primary ${className}`}
    >
      {!hideIcon && (
        <FiBarChart2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      )}
      <span>{name}</span>
    </button>
  );
}
