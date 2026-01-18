const GROQ_API_KEY = import.meta.env.VITE_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.warn("Groq API key not found. AI features will be disabled.");
}

const systemInstruction = `
Eres el asistente oficial de CriptoGuíaVE, una plataforma educativa sobre criptomonedas enfocada en Venezuela.

TU ÚNICA FUNCIÓN es responder preguntas sobre:
- Criptomonedas (Bitcoin, Ethereum, USDT, etc.)
- Wallets y exchanges (Binance, Trust Wallet, MetaMask, etc.)
- Cómo comprar/vender cripto en Venezuela (P2P, Binance P2P, LocalBitcoins)
- Tasas de cambio (Dólar Paralelo, BCV, Euro) y su relación con USDT
- Seguridad y prevención de estafas en cripto
- Regulaciones y situación de cripto en Venezuela

INFORMACIÓN EN TIEMPO REAL:
{{CONTEXT_DATA}}

REGLAS ESTRICTAS:
1. Si te preguntan algo fuera de estos temas (deportes, recetas, etc.), rechaza amablemente.
2. Si te preguntan por el precio del dólar, USA LA INFORMACIÓN PROPORCIONADA ARRIBA.
3. Mantén respuestas CONCISAS (máximo 3-4 oraciones) y en español.
4. NO uses formato markdown (negritas, cursivas), solo texto plano.
5. Sé amigable pero profesional.
`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToAI(
  message: string,
  chatHistory: Array<{ role: 'user' | 'model', text: string }> = [],
  appContext?: {
      binanceRate?: number;
      bcvRate?: number;
      euroRate?: number;
  }
): Promise<string> {
  if (!GROQ_API_KEY) {
    return "El servicio de IA no está disponible. Por favor verifica que la API key esté configurada correctamente.";
  }

  try {
    // Preparar datos de contexto
    let contextString = "No hay datos de tasas disponibles en este momento.";
    if (appContext) {
        const binanceText = appContext.binanceRate ? `Tasa Dólar Paralelo (USDT): ${appContext.binanceRate.toFixed(2)} Bs` : "";
        const bcvText = appContext.bcvRate ? `Tasa BCV: ${appContext.bcvRate.toFixed(2)} Bs` : "";
        const euroText = appContext.euroRate ? `Tasa Euro Oficial: ${appContext.euroRate.toFixed(2)} Bs` : "";
        contextString = [binanceText, bcvText, euroText].filter(Boolean).join("\n");
    }

    // Inyectar contexto en el prompt
    const finalSystemPrompt = systemInstruction.replace('{{CONTEXT_DATA}}', contextString);

    // Construir el array de mensajes para Groq
    const messages: ChatMessage[] = [
      { role: 'system', content: finalSystemPrompt },
      ...chatHistory.map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(errorData.error?.message || 'Error calling Groq API');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No pude generar una respuesta. Intenta de nuevo.";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return "Hubo un error al procesar tu mensaje. Por favor intenta de nuevo.";
  }
}
