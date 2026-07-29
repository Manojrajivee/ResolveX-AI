export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  suggestedCommands?: string[];
  requiresApproval?: boolean;
  pendingCommand?: {
    stepNumber: number;
    command: string;
    riskLevel: 'SAFE' | 'RISKY' | 'CRITICAL';
    explanation: string;
  };
}

export interface IncidentSession {
  sessionId: string;
  incidentTitle: string;
  status: 'ACTIVE' | 'RESOLVED' | 'PENDING';
  messages: ChatMessage[];
  startedAt: string;
}
