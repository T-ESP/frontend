import { useMemo, useState } from "react";
import botAvatar from "@/assets/images/BOT.png";
import { initialMessages, initialThreads } from "@/ui/features/ai-assistant/constants";
import type { ChatThread, ChatMessage } from "@/ui/features/ai-assistant/types";
import { ChatHeader } from "./ChatHeader";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { ThreadList } from "./ThreadList";

export default function AIAssistantPage() {
  const threadsData = useMemo(() => initialThreads, []);
  const messagesData = useMemo(() => initialMessages, []);

  const [threads, setThreads] = useState<ChatThread[]>(threadsData);
  const [activeThreadId, setActiveThreadId] = useState<string>(threadsData[0]?.id ?? "");
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>(messagesData);
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

