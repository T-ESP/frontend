import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteThreadDialogProps = {
  open: boolean;
  threadTitle?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteThreadDialog({
  open,
  threadTitle,
  onOpenChange,
  onConfirm,
}: DeleteThreadDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("ai_assistant.delete_title", "Supprimer la conversation ?")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {threadTitle
              ? t(
                  "ai_assistant.delete_description",
                  '« {{title}} » sera supprimée définitivement. Cette action est irréversible.',
                  { title: threadTitle }
                )
              : t(
                  "ai_assistant.delete_description_generic",
                  "Cette action est irréversible."
                )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("common.cancel", "Annuler")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {t("ai_assistant.delete", "Supprimer")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
