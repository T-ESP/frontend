import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function Composer({ value, onChange, onSend }: ComposerProps) {
  const { t } = useTranslation();
  return (
    <div className="p-3 border-t border-gray-200">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex gap-2 items-center"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('ai_assistant.placeholder', 'Posez une question sur votre stock ou vos ventes...')}
          className="flex-1 px-3 h-11 text-sm rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button
          type="submit"
          className="inline-flex gap-2 items-center px-4 h-11 text-white rounded-md bg-primary hover:opacity-90"
        >
          <Send className="w-4 h-4" />
          {t('ai_assistant.send', 'Envoyer')}
        </button>
      </form>
    </div>
  );
}

