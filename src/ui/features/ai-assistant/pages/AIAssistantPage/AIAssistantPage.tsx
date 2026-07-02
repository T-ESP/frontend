import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import PageLayout from "@/ui/components/layouts/PageLayout";
import {
  initialMessages,
  initialThreads,
} from "@/ui/features/ai-assistant/constants";
import type {
  ChatMessage,
  ChatThread,
} from "@/ui/features/ai-assistant/types";
import { chatBackendService } from "@/infrastructure/api/services/chatBackendService";

import { ChatHeader } from "./ChatHeader";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import {
  DeleteThreadDialog,
  RenameThreadDialog,
  ThreadList,
} from "./ThreadList";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AIAssistantPage() {
  const { t } = useTranslation();

  const initialThreadsData = useMemo(() => initialThreads, []);
  const initialMessagesData = useMemo(() => initialMessages, []);

  const [threads, setThreads] = useState<ChatThread[]>(initialThreadsData);
  const [activeThreadId, setActiveThreadId] = useState<string>(
    initialThreadsData[0]?.id ?? ""
  );
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, ChatMessage[]>
  >(initialMessagesData);
  const [composer, setComposer] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const activeThread = threads.find((thread) => thread.id === activeThreadId);
  const activeMessages = messagesByThread[activeThreadId] ?? [];
  const renameTarget = threads.find((thread) => thread.id === renameTargetId);
  const deleteTarget = threads.find((thread) => thread.id === deleteTargetId);

  const handleNewThread = () => {
    const id = makeId("t");
    const newThread: ChatThread = {
      id,
      title: t("ai_assistant.new_conversation_title", "Nouvelle conversation"),
      lastMessagePreview: t(
        "ai_assistant.start_question",
        "Posez une question..."
      ),
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [id]: [] }));
    setActiveThreadId(id);
  };

  const handleRenameRequest = (threadId: string) => setRenameTargetId(threadId);
  const handleDeleteRequest = (threadId: string) => setDeleteTargetId(threadId);

  const handleRenameSubmit = (newTitle: string) => {
    if (!renameTargetId) return;
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === renameTargetId ? { ...thread, title: newTitle } : thread
      )
    );
    setRenameTargetId(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    setThreads((prev) => prev.filter((thread) => thread.id !== targetId));
    setMessagesByThread((prev) => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    setActiveThreadId((current) => {
      if (current !== targetId) return current;
      const remaining = threads.filter((thread) => thread.id !== targetId);
      return remaining[0]?.id ?? "";
    });
    setDeleteTargetId(null);
  };

  const handleSend = async () => {
    const text = composer.trim();
    if (!text || !activeThreadId || isSending) return;

    setIsSending(true);

    const userMsg: ChatMessage = {
      id: makeId("m"),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] ?? []), userMsg],
    }));
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? { ...thread, lastMessagePreview: text }
          : thread
      )
    );
    setComposer("");

    const loadingId = makeId("loading");
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
      if (!sessionIdRef.current) {
        sessionIdRef.current = await chatBackendService.createSession();
      }
      await chatBackendService.streamTurn(
        text,
        sessionIdRef.current,
        {
          onStatus: updateLoading,
          onDelta: (content) => {
            updateLoading(content);
            setThreads((prev) =>
              prev.map((thread) =>
                thread.id === activeThreadId
                  ? { ...thread, lastMessagePreview: content }
                  : thread
              )
            );
          },
          onError: (msg) => updateLoading(msg),
        }
      );
    } catch (error) {
      console.error("Erreur chat:", error);
      updateLoading(
        t(
          "ai_assistant.error_msg",
          "Désolé, je rencontre des difficultés pour accéder aux services."
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageLayout
      title={t("ai_assistant.title", "Assistant IA")}
      subtitle={t(
        "ai_assistant.subtitle",
        "Posez vos questions sur le stock, les ventes et les commandes."
      )}
    >
      <div className="grid h-[calc(100svh-15rem)] min-h-[480px] grid-cols-1 gap-4 md:grid-cols-[18rem_1fr]">
        <ThreadList
          threads={threads}
          activeThreadId={activeThreadId}
          onSelect={setActiveThreadId}
          onNew={handleNewThread}
          onRename={handleRenameRequest}
          onDelete={handleDeleteRequest}
          className="hidden md:flex"
        />

        <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
          <ChatHeader title={activeThread?.title} />
          <MessageList messages={activeMessages} />
          <Composer
            value={composer}
            onChange={setComposer}
            onSend={handleSend}
            disabled={isSending}
          />
        </section>
      </div>

      <RenameThreadDialog
        open={renameTargetId !== null}
        initialTitle={renameTarget?.title ?? ""}
        onOpenChange={(open) => {
          if (!open) setRenameTargetId(null);
        }}
        onSubmit={handleRenameSubmit}
      />

      <DeleteThreadDialog
        open={deleteTargetId !== null}
        threadTitle={deleteTarget?.title}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </PageLayout>
  );
}
