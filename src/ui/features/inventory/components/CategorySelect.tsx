import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { productService } from "@/infrastructure/api/services/productService";
import { useTranslation } from "react-i18next";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CategorySelect({ value, onChange, required = false, disabled = false }: CategorySelectProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const products = await productService.getAll();
      const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
      setCategories(uniqueCategories.sort());
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
        {t('inventory.form.category', 'Category')} {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled || loading}
        className="w-full h-10 px-3 text-sm transition-colors bg-card border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">{loading ? t('common.loading', 'Loading...') : t('inventory.form.select_category', 'Select a category...')}</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
