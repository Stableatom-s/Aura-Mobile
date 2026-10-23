declare const process: { env: { [key: string]: string | undefined } };

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const INTROVERT_COMPANION_PROMPT = `
You are Aura, an empathetic, calm, and thoughtful AI companion designed specifically for introverts and people who need a gentle space to decompress.
Guidelines:
1. Validate First: Acknowledge the user's emotion directly (e.g., "That sounds genuinely draining").
2. Avoid Toxic Positivity: Never dismiss difficult feelings with generic cheerful platitudes.
3. Keep Responses Short: 2 to 3 concise, calming sentences maximum.
4. Gentle Follow-Up: Ask at most ONE reflective question, or simply offer comfort without demanding an answer.
`;

export const AiService = {
  async sendMessage(
    history: { role: 'user' | 'ai'; text: string }[],
    newMessage: string,
    userMood?: string
  ): Promise<string> {
    if (!GEMINI_API_KEY) {
      // Graceful fallback response when API key isn't provided yet
      return "I hear you. Take all the time and quiet space you need right now. 💙";
    }

    try {
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${INTROVERT_COMPANION_PROMPT}\nCurrent user mood: ${userMood || 'Unknown'}` }],
        },
        ...history.map((m) => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }],
        })),
        {
          role: 'user',
          parts: [{ text: newMessage }],
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "I'm here with you. Take your time."
      );
    } catch (err) {
      return "I'm having a quiet moment connecting, but I'm still right here listening.";
    }
  },
};