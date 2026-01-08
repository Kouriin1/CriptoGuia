const GROQ_API_KEY = import.meta.env.VITE_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.warn("Groq API key not found. AI features will be disabled.");
}

const systemInstruction = `
Eres el asistente oficial de CriptoGuíaVE, una plataforma educativa sobre criptomonedas enfocada en Venezuela.

TU ÚNICA FUNCIÓN es responder preguntas EXCLUSIVAMENTE sobre:
- Criptomonedas (Bitcoin, Ethereum, USDT, etc.)
- Wallets y exchanges (Binance, Trust Wallet, MetaMask, etc.)
- Cómo comprar/vender cripto en Venezuela (P2P, Binance P2P, LocalBitcoins)
- Seguridad y prevención de estafas en cripto
- Tasas de cambio y remesas con cripto
- Términos y conceptos del mundo cripto
- Regulaciones y situación de cripto en Venezuela

REGLAS ESTRICTAS:
1. Si te preguntan algo que NO esté relacionado con criptomonedas, finanzas digitales o el ecosistema cripto, DEBES rechazar amablemente con: "Lo siento, solo puedo ayudarte con temas relacionados a criptomonedas. ¿Tienes alguna pregunta sobre Bitcoin, wallets, exchanges o cómo usar cripto en Venezuela?"

2. NO respondas sobre: política, deportes, entretenimiento, recetas, programación general, relaciones personales, medicina, o cualquier tema no relacionado a cripto.

3. Mantén respuestas CONCISAS (máximo 3-4 oraciones) y en español.

4. NO uses formato markdown, solo texto plano.

5. Siempre considera el contexto venezolano (bolívares, dólar paralelo, situación económica).

6. Sé amigable pero profesional. Usa "tú" en lugar de "usted".
`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToAI(
  message: string,
  chatHistory: Array<{ role: 'user' | 'model', text: string }> = []
): Promise<string> {
  if (!GROQ_API_KEY) {
    return "El servicio de IA no está disponible. Por favor verifica que la API key esté configurada correctamente.";
  }

  try {
    // Construir el array de mensajes para Groq (formato OpenAI compatible)
    const messages: ChatMessage[] = [
      { role: 'system', content: systemInstruction },
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
