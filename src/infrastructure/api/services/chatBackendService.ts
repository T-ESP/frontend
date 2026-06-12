function getAiServiceUrl(): string {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return import.meta.env.VITE_AI_SERVICE_URL ?? "http://localhost:8001";
  }
  return import.meta.env.VITE_AI_SERVICE_URL ?? "https://ai.stock-s.fr";
}

export interface StreamCallbacks {
  onStatus?: (msg: string) => void;
  onDelta: (content: string) => void;
  onDone?: (suggestions: string[]) => void;
  onError?: (msg: string) => void;
}

function parseHistory(
  messages: { role: string; content: string }[]
): { role: string; content: string }[] {
  return messages.map((m) => ({
    role: m.role === "bot" ? "assistant" : m.role,
    content: m.content,
  }));
}

export const chatBackendService = {
  async streamTurn(
    userMessage: string,
    history: { role: string; content: string }[],
    sessionId: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const jwt = localStorage.getItem("auth_token") ?? "";
    const userId = parseInt(localStorage.getItem("commerce_id") ?? "0", 10);

    const response = await fetch(`${getAiServiceUrl()}/chat/turn/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_message: userMessage,
        history: parseHistory(history),
        user_jwt: jwt,
        user_id: userId,
        session_id: sessionId,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`AI service error: HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const processBlock = (block: string) => {
      const lines = block.split("\n");
      let eventName = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          eventName = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            switch (eventName) {
              case "tool_call":
                callbacks.onStatus?.(`🔍 ${data.name ?? "Recherche"}…`);
                break;
              case "delta":
                if (data.content) callbacks.onDelta(data.content);
                break;
              case "done":
                callbacks.onDone?.(data.suggestions ?? []);
                break;
              case "error":
                callbacks.onError?.(data.message ?? "Erreur inconnue");
                break;
            }
          } catch {
            // malformed data line — ignore
          }
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by double newline
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        if (block.trim()) processBlock(block);
      }
    }

    // Process any remaining content
    if (buffer.trim()) processBlock(buffer);
  },
};
