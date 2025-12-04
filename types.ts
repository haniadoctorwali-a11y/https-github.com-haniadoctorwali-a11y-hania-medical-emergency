import React from 'react';

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

// Properties are optional to match the @google/genai SDK response types
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: unknown;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isThinking?: boolean;
  groundingChunks?: GroundingChunk[];
}

export interface QuickAction {
  label: string;
  query: string;
  icon: React.ReactNode;
}