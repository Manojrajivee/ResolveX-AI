import { useChatStore } from '@/store/chat-store';
import { ChatMessage } from '@/types/chat';

export function useChat() {
  const { messages, isTyping, activeSessionId, addMessage, setIsTyping, clearChat } = useChatStore();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setIsTyping(true);

    // Simulate AI Agent reasoning & MCP tool response
    setTimeout(() => {
      let aiResponse: ChatMessage;

      if (text.toLowerCase().includes('database') || text.toLowerCase().includes('postgres')) {
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: `🔍 **Planner Agent Analyzed Alert:** "Database Server Unresponsive"

Match Found in Runbook: **PostgreSQL High Availability Recovery** (Confidence: 98.4%)

Proposed Execution Sequence:
1. \`systemctl status postgresql\` (Check Daemon Status)
2. \`df -h /var/lib/postgresql\` (Verify Storage Space)
3. \`systemctl restart postgresql\` ⚠️ (Service Restart)

Executing Step 1 & Step 2...`,
          timestamp: new Date().toISOString(),
          requiresApproval: true,
          pendingCommand: {
            stepNumber: 3,
            command: 'systemctl restart postgresql',
            riskLevel: 'RISKY',
            explanation: 'Restarting PostgreSQL daemon will briefly terminate active client connections.',
          },
        };
      } else {
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: `🤖 I have received your request: "${text}". Searching ChromaDB vector store for relevant runbooks...`,
          timestamp: new Date().toISOString(),
          suggestedCommands: ['systemctl status daemon', 'df -h', 'kubectl get pods'],
        };
      }

      setIsTyping(false);
      addMessage(aiResponse);
    }, 1500);
  };

  const approveCommand = (command: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const confirmMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `✅ **Human Confirmation Received.** Executing command via MCP Safe Shell Sandbox:
\`\`\`bash
$ ${command}
\`\`\`
**Stdout:**
\`\`\`
[OK] postgresql.service - PostgreSQL RDBMS
   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)
   Active: active (running) since Wed 2026-07-29 14:04:12 UTC; 2s ago
   Process: 14209 ExecStart=/usr/lib/postgresql/16/bin/postgres (code=exited, status=0/SUCCESS)
\`\`\`
🎉 **Decision Agent:** PostgreSQL is now healthy. Incident closed in 2m 14s. Automated incident PDF report generated.`,
        timestamp: new Date().toISOString(),
      };
      setIsTyping(false);
      addMessage(confirmMsg);
    }, 1200);
  };

  return {
    messages,
    isTyping,
    activeSessionId,
    sendMessage,
    approveCommand,
    clearChat,
  };
}
