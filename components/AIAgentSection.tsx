
import React, { useState, useRef, useEffect } from 'react';
import { Job, UserProfile, ChatMessage } from '../types';
import { chatWithCareerAgent } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface AIAgentSectionProps {
  jobs: Job[];
  profile: UserProfile;
}

export const AIAgentSection: React.FC<AIAgentSectionProps> = ({ jobs, profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${profile.name.split(' ')[0] || 'there'}! I'm your AI Career Agent. 
      
I've analyzed your profile and your ${jobs.length} tracked applications. I can help you:
• Prepare for your interview at ${jobs.find(j => j.status === 'Interview')?.company || 'your target company'}
• Identify skill gaps for the ${jobs[0]?.title || 'next role'}
• Draft follow-up emails

What's on your mind?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Pass the CURRENT history (excluding the new message we just added visually, 
      // but the service function handles appending the new message)
      // We pass `messages` which is the history *before* this new turn.
      const responseText = await chatWithCareerAgent(messages, userMsg.content, { jobs, profile });
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-3 shadow-sm shadow-indigo-200">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">AI Career Agent</h3>
          <p className="text-xs text-slate-500">Context-Aware • Powered by Gemini 2.5</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600 ml-2' : 'bg-indigo-100 text-indigo-600 mr-2'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none ml-10 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your applications or skills..."
            className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
