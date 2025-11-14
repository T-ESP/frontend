export type ChatThread = {
  id: string;
  title: string;
  lastMessagePreview: string;
  avatar?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt: number;
};

