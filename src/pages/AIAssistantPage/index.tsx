import { useMemo, useRef, useState, useEffect } from "react";
import { Plus, MoreVertical, Pencil, Trash2, Send } from "lucide-react";
import botAvatar from "@/assets/images/BOT.png";

type ChatThread = {
  id: string;
  title: string;
  lastMessagePreview: string;
  avatar?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt: number;
};

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
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeThreadId, activeMessages.length]);

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
      <aside className="flex flex-col w-80 border-r border-gray-200">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Conversations</h2>
          <button
            type="button"
            onClick={handleNewThread}
            className="inline-flex gap-1 items-center px-2 py-1 text-sm text-white rounded-md bg-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-gray-100">
            {threads.map((t) => (
              <li key={t.id} className={`relative group ${activeThreadId === t.id ? "bg-primary-soft/40" : ""}`}>
                <button
                  type="button"
                  onClick={() => setActiveThreadId(t.id)}
                  className="flex gap-3 items-center px-4 py-3 w-full text-left hover:bg-primary-soft/50"
                >
                  <img src={t.avatar ?? botAvatar} alt="Avatar" className="object-cover w-9 h-9 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                    <p className="text-xs text-gray-500 truncate">{t.lastMessagePreview}</p>
                  </div>
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    type="button"
                    onClick={() => setOpenMenuThreadId((v) => (v === t.id ? null : t.id))}
                    className="hidden justify-center items-center w-8 h-8 text-gray-600 rounded group-hover:inline-flex hover:bg-gray-100"
                    aria-label="Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenuThreadId === t.id && (
                    <div className="absolute right-0 z-10 mt-2 w-40 bg-white rounded-md border border-gray-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleRename(t.id)}
                        className="flex gap-2 items-center px-3 py-2 w-full text-sm hover:bg-gray-50"
                      >
                        <Pencil className="w-4 h-4" /> Renommer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        className="flex gap-2 items-center px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Colonne droite: chat */}
      <section className="flex flex-col flex-1">
        {/* En-tête discussion */}
        <div className="flex justify-between items-center px-4 h-14 border-b border-gray-200">
          <div className="flex gap-2 items-center">
            <img src={botAvatar} alt="Avatar" className="object-cover w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Assistant IA</p>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatScrollRef} className="overflow-y-auto overflow-x-hidden flex-1 px-4 py-4 space-y-3 bg-white">
          {activeMessages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`${m.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-900"}
                  w-fit max-w-[min(45%,calc(100vw-16rem))] rounded-2xl px-3 py-2 text-sm overflow-hidden`}
                style={{
                  overflowWrap: "anywhere"
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="p-3 border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              placeholder="Écrire un message…"
              className="flex-1 px-3 h-11 text-sm rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex gap-2 items-center px-4 h-11 text-white rounded-md bg-primary hover:opacity-90"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}


