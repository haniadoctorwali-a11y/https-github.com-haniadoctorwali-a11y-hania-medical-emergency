import React, { useState, useRef, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { sendMessageToGemini } from './services/gemini';
import { ChatMessage, Sender } from './types';
import { ChatBubble } from './components/ChatBubble';
import { QuickActions } from './components/QuickActions';
import { Send, Menu, MapPin, Activity, Stethoscope } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | undefined>(undefined);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: 'init-1',
      text: "Assalam-o-Alaikum! 🇵🇰 \n\nMain hoon **Hania**, aapki Medical Assistant.\n\nMain aapki zaban samajhti hoon. Aap mujh se **Urdu, English, Punjabi, Pashto, Sindhi, Saraiki** ya **Balochi** mein baat kar sakte hain.\n\n**Aap kis sheher se hain aur kis Doctor ko dhoond rahay hain?**\n\n*(I speak all Pakistani local languages. How can I help you today?)*",
      sender: Sender.BOT,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    
    // Request location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationStatus('success');
        },
        (error) => {
          console.warn("Location permission denied or failed:", error);
          setLocationStatus('error');
        }
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: Sender.USER,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Add temporary thinking message
    const thinkingMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: thinkingMsgId,
      text: '',
      sender: Sender.BOT,
      timestamp: new Date(),
      isThinking: true
    }]);

    try {
      // Prepare history
      const history = messages.map(m => ({
        role: m.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Call API
      const response = await sendMessageToGemini(history, textToSend, location);

      // Replace thinking message
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingMsgId);
        return [...filtered, {
          id: Date.now().toString(),
          text: response.text || "Maaf kijiye, network issue ki wajah se maloomat nahi mil saki. Dobara koshish karein.",
          sender: Sender.BOT,
          timestamp: new Date(),
          groundingChunks: response.groundingChunks
        }];
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingMsgId);
        return [...filtered, {
          id: Date.now().toString(),
          text: "Network Error: Internet check karein aur dobara try karein.",
          sender: Sender.BOT,
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden text-zinc-100 font-sans selection:bg-teal-500/30">
        
        {/* Sidebar */}
        <QuickActions 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          onActionSelect={(query) => handleSendMessage(query)} 
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full w-full relative">
          
          {/* VIP Header */}
          <header className="absolute top-0 left-0 right-0 glass h-20 flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full md:hidden transition-colors"
              >
                <Menu size={24} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 blur-lg opacity-20 animate-pulse"></div>
                  <Activity size={24} className="text-red-500 relative z-10 animate-heartbeat" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-white tracking-wide leading-none">
                    Hania
                  </h1>
                  <span className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em]">
                    Medical Emergency
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md ${locationStatus === 'success' ? "bg-teal-950/30 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.1)]" : "bg-zinc-900 border-zinc-700 text-zinc-500"}`}>
               <MapPin size={14} className={locationStatus === 'success' ? "text-teal-400" : "text-zinc-500"} />
               <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px]">
                 {locationStatus === 'success' ? "Location Active" : "Location Off"}
               </span>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto pt-24 pb-4 px-4 md:px-6 custom-scrollbar scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 mb-2">
            <div className="max-w-4xl mx-auto relative group">
              {/* Premium Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-purple-600 to-teal-600 rounded-full opacity-30 blur-md transition duration-500 group-hover:opacity-50"></div>
              
              <div className="relative flex items-center bg-[#09090b] border border-zinc-800 rounded-full shadow-2xl p-2 pl-6">
                <Stethoscope size={20} className="text-zinc-500 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Yahan likhein... (e.g. Dil ka doctor kahan hai?)"
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-base h-10"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="ml-2 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-full hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform active:scale-95 flex-shrink-0 border border-teal-400/20"
                >
                  <Send size={20} className={isLoading ? "opacity-0" : "opacity-100"} />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-3 gap-6 opacity-60">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
                  Urdu / Punjabi / Pashto / Sindhi
                </p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
                  Verified Doctors
                </p>
            </div>
          </div>

        </div>
      </div>
    </HashRouter>
  );
}

export default App;
