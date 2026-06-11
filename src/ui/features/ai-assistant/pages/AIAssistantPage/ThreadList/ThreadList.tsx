import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import botAvatar from "@/assets/images/BOT.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ChatThread } from "@/ui/features/ai-assistant/types";

type ThreadListProps = {
  threads: ChatThread[];
  activeThreadId: string;
  onSelect: (threadId: string) => void;
  onNew: () => void;
  onRename: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  className?: string;
};

export function ThreadList({
  threads,
  activeThreadId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  className,
}: ThreadListProps) {
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t("ai_assistant.conversations", "Conversations")}
        </h2>
        <Button size="sm" onClick={onNew}>
          <Plus />
          <span>{t("ai_assistant.new_chat", "Nouveau")}</span>
        </Button>
      </div>

      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          return (
            <li key={thread.id} className="group/thread relative">
              <button
                type="button"
                onClick={() => onSelect(thread.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/60",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Avatar size="default">
                  <AvatarImage src={thread.avatar ?? botAvatar} alt="Bot" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {thread.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {thread.lastMessagePreview}
                  </p>
                </div>
              </button>

              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("common.more", "Options")}
                      className="opacity-0 transition-opacity group-hover/thread:opacity-100 data-[state=open]:opacity-100 focus-visible:opacity-100"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onRename(thread.id)}>
                      <Pencil />
                      {t("ai_assistant.rename", "Renommer")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => onDelete(thread.id)}
                    >
                      <Trash2 />
                      {t("ai_assistant.delete", "Supprimer")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          );
        })}
        {threads.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            {t("ai_assistant.no_conversations", "Aucune conversation")}
          </li>
        )}
      </ul>
    </aside>
  );
}
