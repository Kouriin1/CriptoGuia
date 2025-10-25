
import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { SendIcon, BotIcon, UserIcon } from './icons';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: '¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte a navegar el mundo cripto en Venezuela hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(input);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: Message = { sender: 'ai', text: 'Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold text-center mb-4">Asistente IA</h2>
      <div className="h-96 bg-gray-900/50 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 max-w-lg ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'ai' ? 'bg-[#f3ba2f]' : 'bg-blue-500'}`}>
              {msg.sender === 'ai' ? <BotIcon className="h-5 w-5 text-gray-900"/> : <UserIcon className="h-5 w-5 text-white"/>}
            </div>
            <div className={`p-3 rounded-lg text-white ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="self-start flex items-start gap-3">
             <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#f3ba2f]">
              <BotIcon className="h-5 w-5 text-gray-900"/>
            </div>
            <div className="p-3 rounded-lg bg-gray-700">
              <div className="flex items-center justify-center space-x-1">
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center bg-gray-700 rounded-lg p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Pregúntame sobre wallets, estafas, P2P..."
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-[#f3ba2f] rounded-md p-2 disabled:bg-yellow-700 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
        >
          <SendIcon className="h-5 w-5 text-gray-900" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
