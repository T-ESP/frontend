import { mistralService } from "./mistralService";
import { productService } from "./productService";

// --- Constantes ---

const SYSTEM_PROMPT = {
  role: "system",
  content: `Tu es l'assistant IA expert du SaaS de gestion de stock.

RÈGLES ABSOLUES (A SUIVRE SOUS PEINE D'ERREUR) :
1. NE RÉPONDS JAMAIS par du texte brut. Tu dois TOUJOURS utiliser un outil.
2. Pour parler à l'utilisateur (réponse finale, question de clarification, salutations), utilise UNIQUEMENT l'outil "reply_to_user".
3. Ton but est de répondre aux questions sur le stock, les ventes, et les réapprovisionnements.
4. UTILISE LE MARKDOWN pour structurer tes réponses :
   - Mets en **gras** les produits et les chiffres clés.
   - Utilise des listes à puces pour énumérer des articles.
   - Utilise des titres (###) pour séparer les sections si la réponse est longue.

PROCÉDURE DE RECHERCHE (Le workflow) :
1. Si l'utilisateur demande un produit sans donner d'ID précis, utilise D'ABORD "search_product_names".
2. Si "search_product_names" renvoie une liste vide ([]) :
   - NE DIS PAS tout de suite que tu n'as rien trouvé.
   - Tente une nouvelle recherche avec un synonyme, une orthographe différente ou une catégorie plus large.
   - Tu peux réessayer jusqu'à ce que tu trouves ou que le système t'arrête.
3. Si "search_product_names" renvoie plusieurs produits :
   - Ne devine pas. Utilise "reply_to_user" pour demander à l'utilisateur de préciser lequel il veut (en citant les noms trouvés).
4. Une fois l'ID du produit confirmé, utilise les outils de détails ("get_product_stock_details", "get_sales_history"...) pour avoir les chiffres exacts avant de répondre.

GESTION DES ERREURS ET HORS-SUJET :
- Si l'utilisateur parle d'un sujet qui n'a rien à voir avec le stock (ex: météo, code, blague), utilise "reply_to_user" pour dire : "Je suis spécialisé uniquement dans la gestion de votre stock. Comment puis-je vous aider à ce sujet ?"
- Si après plusieurs tentatives de recherche le résultat est toujours vide, utilise "reply_to_user" pour demander la référence exacte ou une autre orthographe.`
};

const AVAILABLE_TOOLS = [
  {
    type: "function",
    function: {
      name: "reply_to_user",
      description: "L'UNIQUE moyen de parler à l'utilisateur (réponse finale ou question).",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string" },
          type: { type: "string", enum: ["answer", "question", "error"] }
        },
        required: ["message", "type"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_product_names",
      description: "Recherche l'ID d'un produit par nom. Renvoie une liste légère.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_product_stock_details",
      description: "Récupère le stock complet via un ID précis.",
      parameters: {
        type: "object",
        properties: { id: { type: "integer" } },
        required: ["id"]
      }
    }
  }
];

// --- Types ---

export interface AgentResponse {
  message: string;
  type: "answer" | "question" | "error";
}

// --- Service ---

export const agentService = {
  async handleUserMessage(userText: string, history: any[] = [], insightsContext: string = "", language: string = "fr"): Promise<AgentResponse> {
    
    // Construction du System Prompt Dynamique
    const dynamicSystemPrompt = {
      role: "system",
      content: `${SYSTEM_PROMPT.content}
      
INSTRUCTION DE LANGUE :
Tu dois impérativement répondre en ${language === 'fr' ? 'FRANÇAIS' : 'ANGLAIS'}. 

CONTEXTE GLOBAL (INSIGHTS & DATA) :
Voici les chiffres clés et tendances actuelles du commerce (Top ventes, Flops, CA...).
Utilise ces données pour répondre aux questions d'ordre général comme "Quels sont les articles qui marchent le mieux ?" sans avoir besoin d'utiliser un outil de recherche.

${insightsContext}`
    };

    // 1. Initialiser l'historique avec le System Prompt si vide ou incomplet
    let messages = [...history];
    if (messages.length === 0 || messages[0].role !== "system") {
      messages = [dynamicSystemPrompt, ...messages];
    } else {
      // Si le system prompt existe déjà, on le met à jour avec le contexte frais
      messages[0] = dynamicSystemPrompt;
    }

    // Ajouter le message utilisateur
    messages.push({ role: "user", content: userText });

    let loopActive = true;
    let retryCounter = 3;
    let finalResponse: AgentResponse = { message: "Erreur inattendue", type: "error" };

    try {
      while (loopActive) {
        // ... (rest of the loop)
        console.log("🤖 Appel Mistral avec historique:", messages);
        const response = await mistralService.agentChat(messages, AVAILABLE_TOOLS);
        const aiMessage = response.choices[0].message;

        // 3. Ajouter la réponse de l'IA à l'historique
        messages.push(aiMessage);

        // 4. Vérifier les outils
        if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
          const toolCall = aiMessage.tool_calls[0];
          const functionName = toolCall.function.name;
          let args: any = {};
          
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch (e) {
            console.error("Erreur parsing arguments:", e);
          }

          console.log(`🛠️ Appel outil detected: ${functionName}`, args);

          // CAS A : L'IA veut parler
          if (functionName === "reply_to_user") {
            finalResponse = { message: args.message, type: args.type };
            loopActive = false;
          }
          // CAS B : L'IA veut chercher des données
          else {
            let result: any = "Erreur: Outil inconnu";

            try {
              if (functionName === "search_product_names") {
                result = await productService.searchLight(args.query);
                
                // --- Logique de Retry (Kill Switch) ---
                if (Array.isArray(result) && result.length === 0) {
                   retryCounter--;
                   if (retryCounter <= 0) {
                     messages.push({
                       role: "system",
                       content: "Arrête de chercher. Dis à l'utilisateur que tu ne trouves pas ce produit."
                     });
                     continue; 
                   }
                }
              } else if (functionName === "get_product_stock_details") {
                result = await productService.getAllKpis(args.id);
              }
            } catch (err: any) {
              result = `Erreur exécution outil: ${err.message}`;
            }

            // 5. Ajouter le résultat à l'historique
            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: functionName,
              content: JSON.stringify(result) 
            });
            
            // La boucle continue...
          }
        } else {
          // Sécurité
          console.error("Erreur : L'IA a répondu sans outil.", aiMessage);
          finalResponse = { message: aiMessage.content || "Je navigue à vue... (pas d'outil utilisé)", type: "error" };
          loopActive = false;
        }
      }
    } catch (error: any) {
      console.error("Erreur critique Agent:", error);
      return { message: "Une erreur critique est survenue.", type: "error" };
    }

    return finalResponse;
  }
};
