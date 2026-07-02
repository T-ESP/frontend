function getBackendUrl(): string {
  return import.meta.env.VITE_API_URL ?? "http://localhost:8090";
}

function resolveCommerceId(): string | null {
  const cached = localStorage.getItem("commerce_id");
  if (cached) return cached;
  // Fallback: parse directly from JWT
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const id = decoded.commerce_id;
    if (id) {
      const str = String(id);
      localStorage.setItem("commerce_id", str);
      return str;
    }
  } catch {
    // ignore malformed JWT
  }
  return null;
}

function getCommercePrefix(): string {
  const id = resolveCommerceId();
  if (!id) throw new Error("commerce_id manquant — veuillez vous reconnecter.");
  return `/api/${id}`;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export interface StreamCallbacks {
  onStatus?: (msg: string) => void;
  onDelta: (content: string) => void;
  onDone?: (suggestions: string[]) => void;
  onError?: (msg: string) => void;
}

export const chatBackendService = {
  async createSession(): Promise<string> {
    const prefix = getCommercePrefix();
    const url = `${getBackendUrl()}${prefix}/chat/sessions`;
    console.debug("[chat] createSession →", url);
    const resp = await fetch(url, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({}) });
    console.debug("[chat] createSession status:", resp.status);
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error("[chat] createSession error body:", body);
      throw new Error(`Failed to create session: HTTP ${resp.status} — ${body}`);
    }
    const json = await resp.json();
    console.debug("[chat] session_id:", json.data?.session_id);
    return json.data.session_id as string;
  },

  async streamTurn(
    userMessage: string,
    sessionId: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const response = await fetch(
      `${getBackendUrl()}${getCommercePrefix()}/chat/sessions/${sessionId}/messages/stream`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: userMessage }),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error(`Chat error: HTTP ${response.status}`);
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
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";
      for (const block of blocks) {
        if (block.trim()) processBlock(block);
      }
    }
    if (buffer.trim()) processBlock(buffer);
  },
};
