import { useMemo, useState, useEffect } from "react";
import { MessageCircle, X, Maximize2, Minimize2 } from "lucide-react";
import { initialMessages, initialThreads } from "@/ui/features/ai-assistant/constants";
import type { ChatMessage } from "@/ui/features/ai-assistant/types";
import { ChatHeader } from "@/ui/features/ai-assistant/pages/AIAssistantPage/ChatHeader";
import { Composer } from "@/ui/features/ai-assistant/pages/AIAssistantPage/Composer";
import { MessageList } from "@/ui/features/ai-assistant/pages/AIAssistantPage/MessageList";
import { aiInsightsService } from "@/infrastructure/api/services/aiInsightsService";
import { agentService } from "@/infrastructure/api/services/agentService";
import { useTranslation } from "react-i18next";

export function FloatingChat() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const threadsData = useMemo(() => initialThreads, []);
  const messagesData = useMemo(() => initialMessages, []);

  const activeThreadId = threadsData[0]?.id ?? "";
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>(messagesData);
  const [composer, setComposer] = useState("");
  const [insightsContext, setInsightsContext] = useState("");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await aiInsightsService.getLast30Days();
        const formatted = aiInsightsService.formatForAI(data);
        setInsightsContext(formatted);
      } catch {
        // silently fail
      }
    };
    loadInsights();
  }, []);

  const activeMessages: ChatMessage[] = messagesByThread[activeThreadId] ?? [];

  const handleSend = async () => {
    const text = composer.trim();
    if (!text || !activeThreadId) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), newMsg],
    }));
    setComposer("");

    const loadingId = `loading-${Date.now()}`;
    const loadingMsg: ChatMessage = {
      id: loadingId,
      role: "bot",
      content: t("ai_assistant.analyzing", "Analyse en cours..."),
      createdAt: Date.now() + 10,
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), loadingMsg],
    }));

    try {
      const currentHistory = messagesByThread[activeThreadId] || [];
      const historyForAgent = currentHistory.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const agentResponse = await agentService.handleUserMessage(
        text,
        historyForAgent,
        insightsContext,
        i18n.language.split("-")[0]
      );

      const botMsg: ChatMessage = {
        id: `m-${Date.now()}-bot`,
        role: "bot",
        content: agentResponse.message,
        createdAt: Date.now(),
      };

      setMessagesByThread((prev) => {
        const threadMsgs = prev[activeThreadId] ?? [];
        return {
          ...prev,
          [activeThreadId]: threadMsgs.map((m) => (m.id === loadingId ? botMsg : m)),
        };
      });
    } catch {
      setMessagesByThread((prev) => {
        const threadMsgs = prev[activeThreadId] ?? [];
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "bot",
          content: t("ai_assistant.error_msg", "Désolé, je rencontre des difficultés pour accéder aux services."),
          createdAt: Date.now(),
        };
        return {
          ...prev,
          [activeThreadId]: threadMsgs.map((m) => (m.id === loadingId ? errorMsg : m)),
        };
      });
    }
  };

  return (
    <div className="fixed z-50 bottom-4 right-4 md:bottom-20 md:right-20">
      {/* Chat panel — toujours monté pour permettre une transition d'ouverture/fermeture fluide */}
      <div
        aria-hidden={!isOpen}
        className={`absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ease-out ${
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
          <div className="flex justify-between items-center pr-2 border-b border-gray-200">
            <div className="flex-1">
              <ChatHeader />
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title={isExpanded ? t("ai_assistant.shrink", "Réduire") : t("ai_assistant.expand", "Agrandir")}
                aria-label={isExpanded ? t("ai_assistant.shrink", "Réduire") : t("ai_assistant.expand", "Agrandir")}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title={t("ai_assistant.close", "Fermer")}
                aria-label={t("ai_assistant.close", "Fermer")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <MessageList messages={activeMessages} bubbleMaxWidth="75%" />
          <Composer value={composer} onChange={setComposer} onSend={handleSend} />
        </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex justify-center items-center w-14 h-14 text-white rounded-full shadow-lg transition-transform duration-200 ease-out bg-primary hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
