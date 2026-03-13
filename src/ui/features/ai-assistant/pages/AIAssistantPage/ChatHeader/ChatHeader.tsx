import botAvatar from "@/assets/images/BOT.png";
import { useTranslation } from "react-i18next";

export function ChatHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between px-4 border-b border-gray-200 h-14">
      <div className="flex items-center gap-2">
        <img src={botAvatar} alt="Avatar" className="object-cover w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{t('ai_assistant.title', 'Assistant IA')}</p>
          {/* <p className="text-xs text-gray-500">En ligne</p> */}
        </div>
      </div>
    </div>
  );
}

