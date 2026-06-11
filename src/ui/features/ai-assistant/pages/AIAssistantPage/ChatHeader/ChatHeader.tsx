import { useTranslation } from "react-i18next";

import botAvatar from "@/assets/images/BOT.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatHeaderProps = {
  title?: string;
};

export function ChatHeader({ title }: ChatHeaderProps) {
  const { t } = useTranslation();
  const heading = title ?? t("ai_assistant.title", "Assistant IA");

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      <Avatar size="sm">
        <AvatarImage src={botAvatar} alt="Bot avatar" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-semibold text-foreground">
          {heading}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {t("ai_assistant.online", "En ligne")}
        </span>
      </div>
    </div>
  );
}
