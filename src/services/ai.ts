import { apiService } from '@/services/apiService';

export const AiService = {
  async sendMessage(
    history: { role: 'user' | 'ai'; text: string }[],
    newMessage: string,
    userMood?: string
  ): Promise<string> {
    try {
      let fullReply = '';

      await apiService.streamChatMessage(
        {
          message: newMessage,
          moodContext: userMood || null,
          conversationHistory: history
            .filter((m) => m.text.trim().length > 0)
            .map((m) => ({
              sender: m.role,
              text: m.text,
            })),
        },
        (chunkText) => {
          fullReply += chunkText;
        }
      );

      return fullReply.trim() || "I'm here with you. Take your time.";
    } catch {
      return "I'm having a quiet moment connecting, but I'm still right here listening.";
    }
  },
};