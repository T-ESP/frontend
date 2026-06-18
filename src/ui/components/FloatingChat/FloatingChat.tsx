import { useMemo, useState, useRef } from "react";
import { MessageCircle, X, Maximize2, Minimize2 } from "lucide-react";
import { initialMessages, initialThreads } from "@/ui/features/ai-assistant/constants";
import type { ChatMessage } from "@/ui/features/ai-assistant/types";
import { ChatHeader } from "@/ui/features/ai-assistant/pages/AIAssistantPage/ChatHeader";
import { Composer } from "@/ui/features/ai-assistant/pages/AIAssistantPage/Composer";
import { MessageList } from "@/ui/features/ai-assistant/pages/AIAssistantPage/MessageList";
import { chatBackendService } from "@/infrastructure/api/services/chatBackendService";
import { useTranslation } from "react-i18next";

export function FloatingChat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const threadsData = useMemo(() => initialThreads, []);
  const messagesData = useMemo(() => initialMessages, []);

  const activeThreadId = threadsData[0]?.id ?? "";
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>(messagesData);
  const [composer, setComposer] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef(crypto.randomUUID());

  const activeMessages: ChatMessage[] = messagesByThread[activeThreadId] ?? [];

  const handleSend = async () => {
    const text = composer.trim();
    if (!text || !activeThreadId || isSending) return;

    setIsSending(true);

    const history = messagesByThread[activeThreadId] ?? [];

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), userMsg],
    }));
    setComposer("");

    const loadingId = `loading-${Date.now()}`;
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [
        ...(prev[activeThreadId] ?? []),
        {
          id: loadingId,
          role: "bot",
          content: t("ai_assistant.analyzing", "Analyse en cours..."),
          createdAt: Date.now() + 1,
        } satisfies ChatMessage,
      ],
    }));

    const updateLoading = (content: string) => {
      setMessagesByThread((prev) => ({
        ...prev,
        [activeThreadId]: (prev[activeThreadId] ?? []).map((m) =>
          m.id === loadingId ? { ...m, content } : m
        ),
      }));
    };

    try {
      await chatBackendService.streamTurn(
        text,
        history.map((m) => ({ role: m.role, content: m.content })),
        sessionIdRef.current,
        {
          onStatus: updateLoading,
          onDelta: updateLoading,
          onError: (msg) => updateLoading(msg),
        }
      );
    } catch {
      updateLoading(t("ai_assistant.error_msg", "Désolé, je rencontre des difficultés pour accéder aux services."));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed z-50 bottom-4 right-4 md:bottom-20 md:right-20">
      {/* Chat panel — toujours monté pour permettre une transition d'ouverture/fermeture fluide */}
      <div
        aria-hidden={!isOpen}
        className={`absolute bottom-16 right-0 bg-card rounded-lg shadow-2xl border border-border flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ease-out ${
          // Taille étendue ou normale, toujours plafonnée au viewport (jamais plein écran)
          isExpanded
            ? "w-[calc(100vw-2rem)] sm:w-[640px] h-[680px] max-h-[calc(100vh-6rem)]"
            : "w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-6rem)]"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
          <div className="flex justify-between items-center pr-2 border-b border-border">
            <div className="flex-1">
              <ChatHeader />
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                title={isExpanded ? t("ai_assistant.shrink", "Réduire") : t("ai_assistant.expand", "Agrandir")}
                aria-label={isExpanded ? t("ai_assistant.shrink", "Réduire") : t("ai_assistant.expand", "Agrandir")}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                title={t("ai_assistant.close", "Fermer")}
                aria-label={t("ai_assistant.close", "Fermer")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <MessageList messages={activeMessages} />
          <Composer value={composer} onChange={setComposer} onSend={handleSend} disabled={isSending} />
        </div>

      {/* Toggle button */}
      <button
        data-tour="assistant"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex justify-center items-center w-14 h-14 text-primary-foreground rounded-full shadow-lg transition-transform duration-200 ease-out bg-primary hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
