
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Info, Trash2 } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import { ChatMessage, Language } from '../types';
import { DICTIONARY } from '../constants';

const STORAGE_KEY = 'mygaav_chat_history';

interface AISahayakProps {
  lang: Language;
}

const AISahayak: React.FC<AISahayakProps> = ({ lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Pass language context to the AI
    const languageMap = { en: 'English', hi: 'Hindi', mr: 'Marathi' };
    const prompt = `[Please respond in ${languageMap[lang]}] ${userMessage}`;
    const response = await getChatResponse(prompt, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "Error" }]);
    setIsLoading(false);
  };

  const clearHistory = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 animate-slide-in">
      <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-800 text-sm font-medium">
          <Info size={16} />
          <span>{t('askAi')}</span>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Bot size={48} className="text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-slate-700">{t('welcome')}</p>
              <p className="text-sm">I am your Village Assistant. How can I help you today?</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-emerald-100 text-emerald-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                {msg.text.replace(/\[Please respond in .*\] /, '').split('\n').map((line, idx) => (
                   <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-emerald-500" />
                <span className="text-sm text-slate-400">{t('thinking')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:border-emerald-500 transition-all">
          <input
            type="text"
            placeholder={t('typeQ')}
            className="flex-1 bg-transparent border-none outline-none text-sm py-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-full transition-colors ${input.trim() && !isLoading ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISahayak;
