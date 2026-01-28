import botAvatar from "@/assets/images/BOT.png";
import type { ChatThread, ChatMessage } from "@/ui/features/ai-assistant/types";

export const initialThreads: ChatThread[] = [
  {
    id: "t1",
    title: "Generate market summary",
    lastMessagePreview: "Here's the closing trend for the day…",
    avatar: botAvatar,
  },
  {
    id: "t2",
    title: "Analyze portfolio",
    lastMessagePreview: "Can you calculate the drawdown risk?",
    avatar: botAvatar,
  },
];

export const initialMessages: Record<string, ChatMessage[]> = {
  t1: [
    { id: "m1", role: "user", content: "Today's market summary?", createdAt: Date.now() - 1000 * 60 * 60 },
    { id: "m2", role: "bot", content: "Here's the closing trend for the day…", createdAt: Date.now() - 1000 * 60 * 55 },
  ],
  t2: [
    { id: "m3", role: "user", content: "Can you analyze my portfolio?", createdAt: Date.now() - 1000 * 60 * 42 },
    { id: "m4", role: "bot", content: "Of course, I'll estimate the risk and performance.", createdAt: Date.now() - 1000 * 60 * 41 },
  ],
};

