import { ChatMessage } from '@/types/chat';

export const ChatService = {
  async sendPrompt(prompt: string): Promise<ChatMessage> {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `AI Agent processed: "${prompt}". Matching ChromaDB vector database embeddings...`,
      timestamp: new Date().toISOString(),
    };
  },
};
