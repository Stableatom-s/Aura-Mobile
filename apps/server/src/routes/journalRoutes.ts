import { Router, Response } from 'express';
import { JournalEntry } from '../models/JournalEntry.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/journal - Fetch user entries
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, count: entries.length, entries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/journal - Create new reflection
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { emotion, reflectionText, tags, sentimentScore } = req.body;

    if (!emotion || !reflectionText) {
      res.status(400).json({ success: false, message: 'emotion and reflectionText are required' });
      return;
    }

    const entry = await JournalEntry.create({
      userId: req.userId,
      emotion,
      reflectionText,
      tags: tags || [],
      sentimentScore: sentimentScore ?? 0,
    });

    res.status(201).json({ success: true, entry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/journal/:id - Delete an entry
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Entry not found' });
      return;
    }

    res.json({ success: true, message: 'Entry deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;