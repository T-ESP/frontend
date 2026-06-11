import { useState } from "react";
import { FiBarChart2, FiEdit2, FiMinus, FiPackage, FiPlus, FiTrash } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { InventoryItem } from "@/ui/features/inventory/types";

interface InventoryTableRowProps {
  item: InventoryItem;
  index: number;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number, name: string) => void;
  onStockUpdate: (id: number, change: number) => Promise<void>;
  onViewKPIs: (id: number, name: string) => void;
}

const STATUS_DOT: Record<InventoryItem["status"], { dot: string; label: string }> = {
  "In Stock": { dot: "bg-emerald-500", label: "in_stock" },
  "Low Stock": { dot: "bg-amber-500", label: "low_stock" },
  "Out of Stock": { dot: "bg-rose-500", label: "out_of_stock" },
};

export function InventoryTableRow({
  item,
  onEdit,
  onDelete,
  onStockUpdate,
  onViewKPIs,
}: InventoryTableRowProps) {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);

  const handleStockChange = async (change: number) => {
    setUpdating(true);
    try {
      await onStockUpdate(item.id, change);
    } finally {
      setUpdating(false);
    }
  };

  const status = STATUS_DOT[item.status];

  return (
    <TableRow>
      <TableCell className="px-6 py-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.name}</span>
          <span className="mt-0.5 text-xs text-muted-foreground">SKU: {item.sku}</span>
        </div>
      </TableCell>
      <TableCell className="px-6 py-3.5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <FiPackage className="h-3.5 w-3.5" />
          {item.category}
        </span>
      </TableCell>
      <TableCell className="px-6 py-3.5 text-sm font-medium tabular-nums">
        {item.price}
      </TableCell>
      <TableCell className="px-6 py-3.5">
        <div className="inline-flex items-center gap-1 rounded-md border bg-background p-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleStockChange(-1)}
            disabled={updating || item.piece <= 0}
            aria-label="Decrement"
          >
            <FiMinus />
          </Button>
          <span className="min-w-[3rem] text-center text-xs font-medium tabular-nums">
            {item.piece.toLocaleString()}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleStockChange(1)}
            disabled={updating}
            aria-label="Increment"
          >
            <FiPlus />
          </Button>
        </div>
      </TableCell>
      <TableCell className="px-6 py-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          <span className={`size-1.5 rounded-full ${status.dot}`} />
          {t(`inventory.status.${status.label}`)}
        </span>
      </TableCell>
      <TableCell className="px-6 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewKPIs(item.id, item.name)}
            title={t("common.view", "View")}
          >
            <FiBarChart2 />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(item)}
            title={t("common.edit", "Edit")}
          >
            <FiEdit2 />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(item.id, item.name)}
            title={t("common.delete", "Delete")}
            className="text-muted-foreground hover:text-destructive"
          >
            <FiTrash />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
