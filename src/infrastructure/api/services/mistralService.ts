interface MistralMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class MistralService {
  private apiKey: string;
  private baseUrl: string = "https://api.mistral.ai/v1/chat/completions";

  constructor() {
    this.apiKey = import.meta.env.VITE_MISTRAL_API_KEY || "";
    if (!this.apiKey) {
      console.warn("⚠️ VITE_MISTRAL_API_KEY is missing in environment variables.");
    }
  }

  /**
   * Envoie un message à Mistral avec le contexte des insights
   */
  async chat(
    userMessage: string,
    insightsContext: string,
    history: MistralMessage[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      return "⚠️ Clé API Mistral manquante. Veuillez configurer .env avec VITE_MISTRAL_API_KEY.";
    }

    const systemPrompt = `Tu es un assistant intelligent d'un commerce. Tu as accès aux insights et données de performance de ce commerce pour les 30 derniers jours.
Voici les données du commerce :
${insightsContext}

Tes instructions :
1. Tu dois répondre aux questions de l'utilisateur en te basant UNIQUEMENT sur ces données ou sur des connaissances générales liées au commerce si pertinent pour expliquer les chiffres.
2. Si on te demande quelque chose que tu ne connais pas (qui n'est pas dans les données ou hors de ton rôle d'assistant commerce), dis clairement que tu ne sais pas.
3. Si la question est totalement hors sujet (pas rapport au commerce, aux chiffres, à l'analyse), demande à l'utilisateur de recommencer ou de poser une question pertinente.
4. Si tu as la réponse dans les données, réponds de manière précise et utile.
5. Sois poli, professionnel et concis.
`;

    const messages: MistralMessage[] = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage },
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-tiny", // ou mistral-small, mistral-medium selon dispo
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Mistral API Error:", errorData);
        throw new Error(`Erreur API Mistral: ${response.statusText}`);
      }

      const data: MistralResponse = await response.json();
      return data.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
    } catch (error) {
      console.error("Erreur lors de l'appel à Mistral:", error);
      return "Désolé, une erreur technique est survenue lors de la communication avec l'assistant.";
    }
  }
  /**
   * Envoie un message à Mistral avec support des outils (Agent mode)
   */
  async agentChat(
    messages: any[],
    tools: any[]
  ): Promise<any> {
    if (!this.apiKey) {
      throw new Error("Clé API Mistral manquante.");
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest", // As requested
          messages: messages,
          tools: tools,
          tool_choice: "any", // Force tool use as requested
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Mistral API Error:", errorData);
        throw new Error(`Erreur API Mistral: ${response.statusText}`);
      }

      const data: MistralResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur agent Mistral:", error);
      throw error;
    }
  }
}

export const mistralService = new MistralService();
