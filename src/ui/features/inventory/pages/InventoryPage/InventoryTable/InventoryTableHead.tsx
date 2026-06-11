import { useTranslation } from "react-i18next";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHead() {
  const { t } = useTranslation();
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="px-6">{t("inventory.table.product")}</TableHead>
        <TableHead className="px-6">{t("inventory.table.category")}</TableHead>
        <TableHead className="px-6">{t("inventory.table.price")}</TableHead>
        <TableHead className="px-6">{t("inventory.table.stock")}</TableHead>
        <TableHead className="px-6">{t("inventory.table.status")}</TableHead>
        <TableHead className="px-6 text-right">{t("common.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
