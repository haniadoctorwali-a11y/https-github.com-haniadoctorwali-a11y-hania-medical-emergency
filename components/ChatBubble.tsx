import React from 'react';
import { ChatMessage, Sender, GroundingChunk } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User, Activity, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  const renderGrounding = (chunks?: GroundingChunk[]) => {
    if (!chunks || chunks.length === 0) return null;

    const mapsChunks = chunks.filter(c => c.maps);
    const webChunks = chunks.filter(c => c.web);

    if (mapsChunks.length === 0 && webChunks.length === 0) return null;

    return (
      <div className="mt-6 pt-4 border-t border-zinc-700/50">
        <p className="font-bold text-teal-400 mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px]">
          <ShieldCheck size={14} /> Verified Locations & Sources
        </p>
        
        {/* Maps Results - Grid Layout */}
        {mapsChunks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {mapsChunks.map((chunk, idx) => (
              <a 
                key={`map-${idx}`}
                href={chunk.maps?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-3 hover:border-teal-500/50 hover:bg-zinc-800 transition-all group relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-teal-500/10 rounded-bl-xl"></div>

                <div className="bg-black/50 p-2.5 rounded-lg border border-zinc-700 group-hover:border-teal-500/30 transition-colors">
                  <MapPin size={18} className="text-teal-500 group-hover:text-teal-400" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="font-bold text-zinc-100 text-sm truncate">{chunk.maps?.title || "Medical Center"}</p>
                  <p className="text-teal-500/80 text-[10px] uppercase font-bold mt-1 tracking-wide group-hover:text-teal-400">View on Map</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Web Results */}
        {webChunks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {webChunks.slice(0, 3).map((chunk, idx) => (
              <a 
                key={`web-${idx}`}
                href={chunk.web?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/40 border border-zinc-800 px-3 py-1.5 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <ExternalLink size={10} />
                <span className="truncate max-w-[150px]">{chunk.web?.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg
          ${isUser 
            ? 'bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600' 
            : 'bg-gradient-to-br from-red-600 to-red-900 border border-red-500/30 shadow-red-900/20'}
        `}>
          {isUser ? (
            <User size={18} className="text-zinc-300" />
          ) : (
            <Activity size={18} className="text-white animate-pulse" />
          )}
        </div>

        {/* Bubble */}
        <div 
          className={`relative px-6 py-5 rounded-2xl shadow-2xl backdrop-blur-md
            ${isUser 
              ? 'bg-zinc-800 text-white rounded-tr-sm border border-zinc-700' 
              : 'bg-zinc-900/80 text-zinc-100 rounded-tl-sm border border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            }`}
        >
          {message.isThinking ? (
             <div className="flex items-center gap-4 py-1">
               <div className="flex gap-1.5">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
               <span className="text-xs font-bold text-zinc-400 animate-pulse tracking-wide uppercase">Connecting to Database...</span>
             </div>
          ) : (
            <>
              <div className={isUser ? 'text-zinc-100' : 'text-zinc-200'}>
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.text}</p>
                ) : (
                  <MarkdownRenderer content={message.text} />
                )}
              </div>
              {!isUser && renderGrounding(message.groundingChunks)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};