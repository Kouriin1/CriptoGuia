import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SendIcon, BotIcon, UserIcon } from './icons';
import { sendMessageToAI } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente de CriptoGuíaVE. ¿En qué puedo ayudarte hoy?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAI(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al conectar con el servidor. Intenta de nuevo.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-[500px] flex flex-col overflow-hidden">
      {/* Header del Chat */}
      {/* Header del Chat */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
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

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
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
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl rounded-bl-none bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre criptomonedas..."
            className="flex-1 p-3.5 pl-5 rounded-full outline-none transition-all bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-[#f3ba2f] focus:shadow-md border border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`
                            p-3.5 rounded-full transition-all flex items-center justify-center shadow-md
                            ${isLoading || !inputText.trim()
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
