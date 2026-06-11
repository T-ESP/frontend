import { useRef } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function Composer({ value, onChange, onSend, disabled }: ComposerProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        if (canSend) onSend();
      }}
      className="shrink-0 border-t border-border bg-card px-4 py-3"
    >
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t(
            "ai_assistant.placeholder",
            "Posez une question sur votre stock ou vos ventes..."
          )}
          rows={1}
          className="max-h-40 min-h-10 resize-none bg-background"
          disabled={disabled}
        />
        <Button type="submit" size="lg" disabled={!canSend}>
          <Send />
          <span className="hidden sm:inline">
            {t("ai_assistant.send", "Envoyer")}
          </span>
        </Button>
      </div>
    </form>
  );
}
