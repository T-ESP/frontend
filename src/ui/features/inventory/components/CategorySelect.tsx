import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { productService } from "@/infrastructure/api/services/productService";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CategorySelect({ value, onChange, required = false, disabled = false }: CategorySelectProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const products = await productService.getAll();
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
      setCategories(uniqueCategories.sort());
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  if (loading) {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
          <Tag className="w-4 h-4 text-slate-400" />
          Category {required && "*"}
        </label>
        <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-400">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
        <Tag className="w-4 h-4 text-slate-400" />
        Category {required && "*"}
      </label>
      
      <select
        value={value}
        onChange={handleSelectChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-white"
      >
        <option value="">Select a category...</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
