import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SendIcon, BotIcon } from './icons';
import { sendMessageToAI } from '../services/IAService';
import { getBinanceRate } from '../services/binanceService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const STORAGE_KEY = 'criptoguia_chat_history';
const MESSAGE_COUNT_KEY = 'criptoguia_message_count';
const MESSAGE_DATE_KEY = 'criptoguia_message_date';
const MAX_MESSAGES_PER_SESSION = 10;

const getWelcomeMessage = (): Message => ({
  id: '1',
  text: '¡Hola! Soy tu asistente de CriptoGuíaVE. Puedo ayudarte con preguntas sobre criptomonedas, wallets, exchanges y cómo usar cripto en Venezuela. ¿En qué puedo ayudarte?',
  sender: 'ai',
  timestamp: new Date().toISOString()
});

const getTodayDate = () => new Date().toDateString();

const AIChat: React.FC = () => {
  const { isDark } = useTheme();

  // Estado para mensajes
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading chat history:', e);
    }
    return [getWelcomeMessage()];
  });

  // Estado para contador de mensajes (se resetea cada día)
  const [messageCount, setMessageCount] = useState<number>(() => {
    try {
      const savedDate = localStorage.getItem(MESSAGE_DATE_KEY);
      const today = getTodayDate();

      // Si es un día nuevo, resetear contador
      if (savedDate !== today) {
        localStorage.setItem(MESSAGE_DATE_KEY, today);
        localStorage.setItem(MESSAGE_COUNT_KEY, '0');
        return 0;
      }

      const count = localStorage.getItem(MESSAGE_COUNT_KEY);
      return count ? parseInt(count, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const remainingMessages = MAX_MESSAGES_PER_SESSION - messageCount;
  const hasReachedLimit = remainingMessages <= 0;

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Error saving chat history:', e);
    }
  }, [messages]);

  // Guardar contador de mensajes
  useEffect(() => {
    try {
      localStorage.setItem(MESSAGE_COUNT_KEY, messageCount.toString());
    } catch (e) {
      console.warn('Error saving message count:', e);
    }
  }, [messageCount]);

  // Auto-scroll al último mensaje (solo dentro del contenedor del chat)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Obtener tasas para contexto de IA
  const [rates, setRates] = useState<{ binanceRate?: number; bcvRate?: number; euroRate?: number }>({});

  useEffect(() => {
      const fetchRates = async () => {
          try {
              const binanceData = await getBinanceRate();
              let bcvVal;
              try {
                  const resUsd = await fetch('/.netlify/functions/dolar-rate');
                  const dataUsd = await resUsd.json();
                  if (dataUsd.success && dataUsd.valor) {
                      bcvVal = parseFloat(dataUsd.valor);
                  }
              } catch (e) {
                  // Fallo silencioso en BCV
              }

              let euroVal;
              try {
                  const resEuro = await fetch('/.netlify/functions/euro-rate');
                  const dataEuro = await resEuro.json();
                  if (dataEuro.success && dataEuro.valor) {
                      euroVal = parseFloat(dataEuro.valor);
                  }
              } catch (e) {
                  // Fallo silencioso en Euro
              }
              
              setRates({
                  binanceRate: binanceData.rate,
                  bcvRate: bcvVal,
                  euroRate: euroVal
              });
          } catch (e) {
              console.warn("Could not fetch rates for AI context");
          }
      };
      fetchRates();
  }, []);

  const handleClearChat = () => {
    setMessages([getWelcomeMessage()]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || hasReachedLimit) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Preparar historial para el contexto de la IA (últimos 10 mensajes)
      const chatHistory = updatedMessages
        .slice(-10)
        .filter(m => m.id !== '1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'model' as const,
          text: m.text
        }));

      const responseText = await sendMessageToAI(inputText, chatHistory, rates);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Incrementar contador solo si la respuesta fue exitosa
      setMessageCount(prev => prev + 1);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al conectar con el servidor. Intenta de nuevo.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-[500px] flex flex-col overflow-hidden">
      {/* Header del Chat */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f3ba2f] to-orange-400 flex items-center justify-center text-white shadow-lg">
            <BotIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Asistente IA</h2>
            <p className="text-xs text-green-500 font-medium flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              En línea
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Contador de mensajes restantes */}
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasReachedLimit
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : remainingMessages <= 3
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
            {remainingMessages} restantes
          </span>
          {/* Botón para limpiar chat */}
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Limpiar conversación"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Área de Mensajes */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
              ${msg.sender === 'user'
                ? 'bg-[#f3ba2f] text-gray-900 rounded-br-none font-medium'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'
              }
            `}>
              {msg.text}
              <p className={`text-[10px] mt-1 text-right opacity-60 ${msg.sender === 'user' ? 'text-gray-800' : 'text-gray-400'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Mensaje de límite alcanzado */}
        {hasReachedLimit && (
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-4 py-2 rounded-full">
              Has alcanzado el límite de mensajes de hoy. ¡Vuelve mañana! 🔄
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl rounded-bl-none bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={hasReachedLimit ? "Límite alcanzado, vuelve mañana" : "Pregunta sobre criptomonedas..."}
            disabled={isLoading || hasReachedLimit}
            className={`flex-1 p-3.5 pl-5 rounded-full outline-none transition-all bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-[#f3ba2f] focus:shadow-md border border-transparent ${hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim() || hasReachedLimit}
            className={`
              p-3.5 rounded-full transition-all flex items-center justify-center shadow-md
              ${isLoading || !inputText.trim() || hasReachedLimit
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                : 'bg-[#f3ba2f] hover:bg-[#d9a526] hover:scale-105 active:scale-95 text-gray-900'
              }
            `}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
