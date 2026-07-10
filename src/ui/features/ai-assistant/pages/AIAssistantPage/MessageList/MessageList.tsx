import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
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

const isTableLine = (line: string) => line.trim().startsWith("|");

/** `| a | b |` → ["a", "b"] */
function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

/** La ligne `| --- | --- |` sépare l'en-tête du corps et ne s'affiche pas. */
const isSeparatorRow = (cells: string[]) =>
  cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell));

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines.map(splitRow).filter((cells) => !isSeparatorRow(cells));
  if (rows.length === 0) return null;

  const [header, ...body] = rows;
  return (
    <div className="my-2 overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-muted-foreground/10">
            {header.map((cell, i) => (
              <th key={i} className="px-2 py-1.5 text-left font-semibold">
                <FormattedInline content={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((cells, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border align-top">
              {cells.map((cell, i) => (
                <td key={i} className="px-2 py-1.5">
                  <FormattedInline content={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BotContent({ content }: { content: string }) {
  const lines = content.replace(/\\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const trimmed = line.trim();

    // Les lignes de tableau consécutives forment un seul bloc.
    if (isTableLine(trimmed)) {
      const start = index;
      while (index + 1 < lines.length && isTableLine(lines[index + 1])) index++;
      blocks.push(<MarkdownTable key={start} lines={lines.slice(start, index + 1)} />);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      blocks.push(
        <div key={index} className="flex pl-4">
          <span className="mr-2">•</span>
          <FormattedInline content={trimmed.slice(2)} />
        </div>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={index} className="mt-2 mb-1 text-base font-semibold">
          <FormattedInline content={trimmed.slice(4)} />
        </h3>
      );
      continue;
    }

    blocks.push(
      <div key={index} className="min-h-[1.2em]">
        <FormattedInline content={line} />
      </div>
    );
  }

  return <div className="whitespace-pre-wrap break-words">{blocks}</div>;
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
                  "rounded-lg px-3.5 py-2 text-sm leading-relaxed",
                  isUser
                    ? "max-w-[min(75%,42rem)] bg-primary text-primary-foreground rounded-br-md"
                    : "max-w-[min(92%,48rem)] bg-muted text-foreground rounded-bl-md"
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
