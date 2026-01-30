import botAvatar from "@/assets/images/BOT.png";
import type { ChatThread, ChatMessage } from "@/ui/features/ai-assistant/types";

export const initialThreads: ChatThread[] = [
  {
    id: "t-init",
    title: "Nouvelle conversation",
    lastMessagePreview: "Posez votre question...",
    avatar: botAvatar,
  },
];

export const initialMessages: Record<string, ChatMessage[]> = {
  "t-init": [],
};

