import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import botAvatar from "@/assets/images/BOT.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/ui/features/ai-assistant/types";

type MessageListProps = {
  messages: ChatMessage[];
};

function FormattedInline({ content }: { content: string }) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function BotContent({ content }: { content: string }) {
  const lines = content.replace(/\\n/g, "\n").split("\n");
  return (
    <div className="whitespace-pre-wrap break-words">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ")) {
          return (
            <div key={index} className="flex pl-4">
              <span className="mr-2">•</span>
              <FormattedInline content={trimmed.slice(2)} />
            </div>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="mt-2 mb-1 text-base font-semibold">
              <FormattedInline content={trimmed.slice(4)} />
            </h3>
          );
        }
        return (
          <div key={index} className="min-h-[1.2em]">
            <FormattedInline content={line} />
          </div>
        );
      })}
    </div>
  );
}

export function MessageList({ messages }: MessageListProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-10">
        <div className="max-w-md text-center">
          <Avatar size="lg" className="mx-auto mb-4">
            <AvatarImage src={botAvatar} alt="Bot" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h2 className="text-base font-semibold text-foreground">
            {t("ai_assistant.title", "Assistant IA")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "ai_assistant.placeholder",
              "Posez une question sur votre stock ou vos ventes..."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-background px-4 py-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              {!isUser && (
                <Avatar size="sm" className="mb-0.5">
                  <AvatarImage src={botAvatar} alt="Bot" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[min(75%,42rem)] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
                style={{ overflowWrap: "anywhere" }}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                ) : (
                  <BotContent content={message.content} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
