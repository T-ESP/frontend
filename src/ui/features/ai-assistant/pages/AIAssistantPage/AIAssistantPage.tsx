import { useMemo, useState, useEffect } from "react";
import botAvatar from "@/assets/images/BOT.png";
import { initialMessages, initialThreads } from "@/ui/features/ai-assistant/constants";
import type { ChatThread, ChatMessage } from "@/ui/features/ai-assistant/types";
import { ChatHeader } from "./ChatHeader";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { ThreadList } from "./ThreadList";
import { aiInsightsService } from "@/infrastructure/api/services/aiInsightsService";
import { mistralService } from "@/infrastructure/api/services/mistralService";

export default function AIAssistantPage() {
  const threadsData = useMemo(() => initialThreads, []);
  const messagesData = useMemo(() => initialMessages, []);

  const [threads, setThreads] = useState<ChatThread[]>(threadsData);
  const [activeThreadId, setActiveThreadId] = useState<string>(threadsData[0]?.id ?? "");
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>(messagesData);
  const [composer, setComposer] = useState("");
  const [openMenuThreadId, setOpenMenuThreadId] = useState<string | null>(null);
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

  const handleNewThread = () => {
    const nid = `t-${Date.now()}`;
    const newThread: ChatThread = {
      id: nid,
      title: "New conversation",
      lastMessagePreview: "Start a question…",
      avatar: botAvatar,
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [nid]: [] }));
    setActiveThreadId(nid);
  };

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
      content: "Analyse en cours...",
      createdAt: Date.now() + 10,
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), loadingMsg],
    }));

    try {
      // Préparer l'historique pour Mistral
      // On exclut le message de loading qu'on vient d'ajouter
      const currentHistory = messagesByThread[activeThreadId] || [];
      const historyForMistral = currentHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })) as any[];

      // 3. Appel API Mistral
      const response = await mistralService.chat(text, insightsContext, historyForMistral);

      // 4. Remplacer le loading par la réponse
      const botMsg: ChatMessage = {
        id: `m-${Date.now()}-bot`,
        role: "bot",
        content: response,
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
        prev.map((t) => (t.id === activeThreadId ? { ...t, lastMessagePreview: response } : t))
      );

    } catch (error) {
      console.error("Erreur chat:", error);
      // En cas d'erreur, on remplace le loading par un message d'erreur
      setMessagesByThread((prev) => {
        const threadMsgs = prev[activeThreadId] ?? [];
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "bot",
          content: "Désolé, je rencontre des difficultés pour accéder aux services.",
          createdAt: Date.now(),
        };
        return {
          ...prev,
          [activeThreadId]: threadMsgs.map(m => m.id === loadingId ? errorMsg : m),
        };
      });
    }
  };

  const handleRename = (threadId: string) => {
    const name = prompt("Rename conversation:")?.trim();
    if (!name) return;
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, title: name } : t)));
    setOpenMenuThreadId(null);
  };

  const handleDelete = (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    setMessagesByThread((prev) => {
      const copy = { ...prev };
      delete copy[threadId];
      return copy;
    });
    if (activeThreadId === threadId) {
      const next = threads.find((t) => t.id !== threadId)?.id ?? "";
      setActiveThreadId(next);
    }
    setOpenMenuThreadId(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      <ThreadList
        threads={threads}
        activeThreadId={activeThreadId}
        onSelect={setActiveThreadId}
        onNew={handleNewThread}
        openMenuThreadId={openMenuThreadId}
        setOpenMenuThreadId={setOpenMenuThreadId}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <section className="flex flex-col flex-1">
        <ChatHeader />
        <MessageList messages={activeMessages} />
        <Composer value={composer} onChange={setComposer} onSend={handleSend} />
      </section>
    </div>
  );
}

