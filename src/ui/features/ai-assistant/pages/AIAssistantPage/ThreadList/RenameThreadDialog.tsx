import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RenameThreadDialogProps = {
  open: boolean;
  initialTitle: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newTitle: string) => void;
};

export function RenameThreadDialog({
  open,
  initialTitle,
  onOpenChange,
  onSubmit,
}: RenameThreadDialogProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialTitle);

  useEffect(() => {
    if (open) setValue(initialTitle);
  }, [open, initialTitle]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = value.trim();
    if (!next) return;
    onSubmit(next);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {t("ai_assistant.rename", "Renommer")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "ai_assistant.rename_prompt",
                "Renommer la conversation :"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rename-thread-input">
              {t("ai_assistant.conversations", "Conversations")}
            </Label>
            <Input
              id="rename-thread-input"
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel", "Annuler")}
            </Button>
            <Button type="submit" disabled={value.trim().length === 0}>
              {t("common.save", "Enregistrer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
