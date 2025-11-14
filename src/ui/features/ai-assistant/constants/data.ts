import botAvatar from "@/assets/images/BOT.png";
import type { ChatThread, ChatMessage } from "@/ui/features/ai-assistant/types";

export const initialThreads: ChatThread[] = [
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
];

export const initialMessages: Record<string, ChatMessage[]> = {
  t1: [
    { id: "m1", role: "user", content: "Synthèse du marché d'aujourd'hui ?", createdAt: Date.now() - 1000 * 60 * 60 },
    { id: "m2", role: "bot", content: "Voici la tendance de clôture du jour…", createdAt: Date.now() - 1000 * 60 * 55 },
  ],
  t2: [
    { id: "m3", role: "user", content: "Peux-tu analyser mon portefeuille ?", createdAt: Date.now() - 1000 * 60 * 42 },
    { id: "m4", role: "bot", content: "Bien sûr, je vais estimer le risque et la perf.", createdAt: Date.now() - 1000 * 60 * 41 },
  ],
};

