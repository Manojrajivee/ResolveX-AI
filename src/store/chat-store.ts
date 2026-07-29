import { create } from 'zustand';
import { ChatMessage } from '@/types/chat';

interface ChatStore {
  messages: ChatMessage[];
  isTyping: boolean;
  activeSessionId: string;
  addMessage: (msg: ChatMessage) => void;
  setIsTyping: (status: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Hello! I am your AI Runbook Following Agent. Upload a runbook or report an incident to begin automated resolution.',
      timestamp: new Date().toISOString(),
      suggestedPrompts: [
        'Database server PostgreSQL is unresponsive',
        'High CPU utilization alert on Node-04',
        'Redis cache memory limit reached 95%',
      ],
    },
  ],
  isTyping: false,
  activeSessionId: 'session-2026-9041',
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setIsTyping: (status) => set({ isTyping: status }),
  clearChat: () =>
    set({
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: 'Chat session reset. How can I assist you with your SRE operations?',
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
