import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/ui/features/ai-assistant/types";

type MessageListProps = {
  messages: ChatMessage[];
};

const FormattedMessage = ({ content }: { content: string }) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export function MessageList({ messages }: MessageListProps) {
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div ref={chatScrollRef} className="overflow-y-auto overflow-x-hidden flex-1 px-4 py-4 space-y-3 bg-white">
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`${m.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-900"}
              w-fit max-w-[min(45%,calc(100vw-16rem))] rounded-2xl px-3 py-2 text-sm overflow-hidden`}
            style={{ overflowWrap: "anywhere" }}
          >
            {m.role === "user" ? (
              <div className="whitespace-pre-wrap">{m.content}</div>
            ) : (
              <div className="whitespace-pre-wrap">
                {m.content.replace(/\\n/g, '\n').split('\n').map((line, i) => {
                  // Gestion basique des listes et titres
                  if (line.trim().startsWith("- ")) {
                    return <div key={i} className="pl-4 flex"><span className="mr-2">•</span><FormattedMessage content={line.substring(2)} /></div>;
                  }
                  if (line.trim().startsWith("### ")) {
                    return <h3 key={i} className="text-base font-bold mt-2 mb-1"><FormattedMessage content={line.substring(4)} /></h3>;
                  }
                  return <div key={i} className="min-h-[1.2em]"><FormattedMessage content={line} /></div>;
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

