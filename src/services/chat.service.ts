import { ChatMessage } from '@/types/chat';

export const ChatService = {
  async sendPrompt(prompt: string): Promise<ChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `AI Agent processed: "${prompt}". Matching ChromaDB vector database embeddings...`,
      timestamp: new Date().toISOString(),
    };
  },
};
