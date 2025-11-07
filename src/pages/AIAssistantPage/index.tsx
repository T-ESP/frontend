import { useMemo, useState } from "react";
import { ThreadList } from "./components/ThreadList";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { Composer } from "./components/Composer";
import type { ChatThread, ChatMessage } from "./components/types";
import botAvatar from "@/assets/images/BOT.png";

export default function AIAssistantPage() {
  const initialThreads: ChatThread[] = useMemo(
    () => [
      {
        id: "t1",
        title: "Générer résumé marché",
        lastMessagePreview: "Voici la tendance de clôture du jour…",
        avatar: botAvatar,
      },
      {
        id: "t2",
        title: "Analyser portefeuille",
        lastMessagePreview: "Peux-tu calculer le risque de drawdown ?",
        avatar: botAvatar,
      },
    ],
    []
  );

  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(initialThreads[0]?.id ?? "");
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({
    t1: [
      { id: "m1", role: "user", content: "Synthèse du marché d’aujourd’hui ?", createdAt: Date.now() - 1000 * 60 * 60 },
      { id: "m2", role: "bot", content: "Voici la tendance de clôture du jour…", createdAt: Date.now() - 1000 * 60 * 55 },
    ],
    t2: [
      { id: "m3", role: "user", content: "Peux-tu analyser mon portefeuille ?", createdAt: Date.now() - 1000 * 60 * 42 },
      { id: "m4", role: "bot", content: "Bien sûr, je vais estimer le risque et la perf.", createdAt: Date.now() - 1000 * 60 * 41 },
    ],
  });
  const [composer, setComposer] = useState("");
  const [openMenuThreadId, setOpenMenuThreadId] = useState<string | null>(null);

  const activeMessages: ChatMessage[] = messagesByThread[activeThreadId] ?? [];

  const handleNewThread = () => {
    const nid = `t-${Date.now()}`;
    const newThread: ChatThread = {
      id: nid,
      title: "Nouvelle conversation",
      lastMessagePreview: "Démarrez une question…",
      avatar: botAvatar,
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [nid]: [] }));
    setActiveThreadId(nid);
  };

  const handleSend = () => {
    const text = composer.trim();
    if (!text || !activeThreadId) return;
    const newMsg: ChatMessage = { id: `m-${Date.now()}`, role: "user", content: text, createdAt: Date.now() };
    const echoMsg: ChatMessage = {
      id: `m-${Date.now()}-bot`,
      role: "bot",
      content: "(Réponse simulée) Je traite votre demande…",
      createdAt: Date.now() + 500,
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), newMsg, echoMsg],
    }));
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, lastMessagePreview: text } : t))
    );
    setComposer("");
  };

  const handleRename = (threadId: string) => {
    const name = prompt("Renommer la conversation:")?.trim();
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
      {/* Colonne gauche: conversations */}
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

      {/* Colonne droite: chat */}
      <section className="flex flex-col flex-1">
        {/* En-tête discussion */}
        <ChatHeader />

        {/* Messages */}
        <MessageList messages={activeMessages} />

        {/* Composer */}
        <Composer value={composer} onChange={setComposer} onSend={handleSend} />
      </section>
    </div>
  );
}


