import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }
  return new GoogleGenAI({ apiKey });
}

const SYSTEM_INSTRUCTION = `
You are Aura, an empathetic, calm, and insightful emotional wellness companion.
- Guide users with active listening, non-judgmental validation, and gentle reflective questions.
- Maintain a warm, grounded, and concise tone (2-4 sentences per response unless the user asks for a deeper exercise).
- Never diagnose mental health conditions or prescribe medical treatments.
- If a user mentions self-harm or severe crisis, gently advise them to connect with trusted professionals or crisis resources immediately.
`;

// POST /api/chat/stream
router.post('/stream', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { message, moodContext, conversationHistory = [] } = req.body;

  if (!message) {
    res.status(400).json({ success: false, message: 'Message is required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let clientClosed = false;
  req.on('close', () => {
    clientClosed = true;
  });

  const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

  try {
    const ai = getGeminiClient();

    const formattedContents = [
      ...conversationHistory.map((item: { sender: string; text: string }) => ({
        role: item.sender === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: moodContext
              ? `[Current mood: ${moodContext}]\nUser: ${message}`
              : message,
          },
        ],
      },
    ];

    let streamSuccess = false;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        for await (const chunk of responseStream) {
          if (clientClosed) break;
          const chunkText = chunk.text;
          if (chunkText) {
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        }

        streamSuccess = true;
        break;
      } catch (err: any) {
        lastError = err;
        const status = err?.status;
        const msg = String(err?.message || '');
        const canFallback =
          status === 503 || status === 429 || status === 404 || msg.includes('503') || msg.includes('404');

        if (canFallback) {
          console.warn(`Model ${modelName} unavailable (${status || 'error'}), trying fallback...`);
          continue;
        }
        throw err;
      }
    }

    if (!streamSuccess) {
      throw lastError || new Error('All AI models are temporarily busy.');
    }

    if (!clientClosed) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error: any) {
    console.error('Gemini Stream Error:', error);
    const friendlyMessage =
      error?.status === 503 || String(error?.message).includes('503')
        ? 'Aura is experiencing high demand right now. Please try sending your message again in a few seconds.'
        : 'Unable to reach Aura right now. Please try again.';

    if (!clientClosed) {
      res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
      res.end();
    }
  }
});

export default router;