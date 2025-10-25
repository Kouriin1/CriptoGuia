
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const systemInstruction = `
Eres un asistente de IA para CriptoGuíaVE, especializado en criptomonedas en Venezuela. 
Tu objetivo es proporcionar consejos claros, útiles y seguros a los usuarios.
Responde preguntas sobre qué criptomoneda usar, cómo elegir una wallet, cómo evitar estafas y cómo gestionar criptoactivos, siempre considerando el contexto venezolano.
Mantén tus respuestas concisas, fáciles de entender y en español. No uses markdown.
`;

export async function sendMessageToAI(message: string): Promise<string> {
  if (!ai) {
    return "El servicio de IA no está disponible en este momento. Por favor, asegúrese de que la clave API esté configurada.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI");
  }
}
