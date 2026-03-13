import { useMemo, useState, useEffect } from "react";
import { initialMessages, initialThreads } from "@/ui/features/ai-assistant/constants";
import type { ChatThread, ChatMessage } from "@/ui/features/ai-assistant/types";
import { ChatHeader } from "./ChatHeader";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { aiInsightsService } from "@/infrastructure/api/services/aiInsightsService";
import { agentService } from "@/infrastructure/api/services/agentService";
import { useTranslation } from "react-i18next";

export default function AIAssistantPage() {
  const { t, i18n } = useTranslation();
  const threadsData = useMemo(() => initialThreads, []);
  const messagesData = useMemo(() => initialMessages, []);

  const [_threads, setThreads] = useState<ChatThread[]>(threadsData);
  const [activeThreadId, _setActiveThreadId] = useState<string>(threadsData[0]?.id ?? "");
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>(messagesData);
  const [composer, setComposer] = useState("");
  const [insightsContext, setInsightsContext] = useState("");

  // Charger les insights pour voir la structure des données
  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await aiInsightsService.getLast30Days();
        console.log('📊 AI INSIGHTS DATA:', data);
        const formatted = aiInsightsService.formatForAI(data);
        console.log('📊 Formatted for AI:', formatted);
        setInsightsContext(formatted);
        console.log('📊 Structured:', aiInsightsService.formatForAIStructured(data));
        console.log('📊 Critical Points:', aiInsightsService.getCriticalPoints(data));
        console.log('📊 Executive Summary:', aiInsightsService.getExecutiveSummary(data));
      } catch (error) {
        console.error('❌ Erreur lors du chargement des insights:', error);
      }
    };

    loadInsights();
  }, []);

  const activeMessages: ChatMessage[] = messagesByThread[activeThreadId] ?? [];


  const handleSend = async () => {
    const text = composer.trim();
    if (!text || !activeThreadId) return;

    // 1. Message de l'utilisateur
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now()
    };

    // Mise à jour optimiste
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), newMsg],
    }));
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, lastMessagePreview: text } : t))
    );
    setComposer("");

    // 2. Indicateur de chargement
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
      // Préparer l'historique pour l'Agent
      const currentHistory = messagesByThread[activeThreadId] || [];
      // On convertit l'historique UI en format compatible Mistral (juste le texte pour l'instant)
      const historyForAgent = currentHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      // 3. Appel Agent Service (boucle incluse)
      const agentResponse = await agentService.handleUserMessage(
        text,
        historyForAgent,
        insightsContext,
        i18n.language.split('-')[0] // 'fr' ou 'en'
      );

      // 4. Remplacer le loading par la réponse
      const botMsg: ChatMessage = {
        id: `m-${Date.now()}-bot`,
        role: "bot",
        content: agentResponse.message, // On prend le message final
        createdAt: Date.now(),
      };

      setMessagesByThread((prev) => {
        const threadMsgs = prev[activeThreadId] ?? [];
        return {
          ...prev,
          [activeThreadId]: threadMsgs.map(m => m.id === loadingId ? botMsg : m),
        };
      });

      // Mettre à jour l'aperçu avec la réponse du bot
      setThreads((prev) =>
        prev.map((t) => (t.id === activeThreadId ? { ...t, lastMessagePreview: agentResponse.message } : t))
      );

    } catch (error) {
      console.error("Erreur chat:", error);
      // En cas d'erreur, on remplace le loading par un message d'erreur
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
          [activeThreadId]: threadMsgs.map(m => m.id === loadingId ? errorMsg : m),
        };
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* <ThreadList
        threads={_threads}
        activeThreadId={activeThreadId}
        onSelect={_setActiveThreadId}
        onNew={handleNewThread}
        openMenuThreadId={openMenuThreadId}
        setOpenMenuThreadId={setOpenMenuThreadId}
        onRename={handleRename}
        onDelete={handleDelete}
      /> */}

      <section className="flex flex-col flex-1">
        <ChatHeader />
        <MessageList messages={activeMessages} />
        <Composer value={composer} onChange={setComposer} onSend={handleSend} />
      </section>
    </div>
  );
}

