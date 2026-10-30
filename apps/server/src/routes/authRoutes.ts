import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';
import {
  verifyGoogleToken,
  verifyAppleToken,
  signSessionJwt,
} from '../services/authService.js';

const router = Router();

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ success: false, message: 'idToken is required' });
      return;
    }

    const { email, fullName, avatarUrl } = await verifyGoogleToken(idToken);

    // Find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        email,
        fullName,
        avatarUrl,
        preferences: {
          theme: 'dark',
          accentColor: '#6366F1',
          fontSize: 'medium',
          language: 'en',
          dailyReminders: true,
          hapticFeedback: true,
        },
      });
      isNewUser = true;
    }

    const token = signSessionJwt(user._id.toString());

    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ success: false, message: error.message || 'Authentication failed' });
  }
});

// POST /api/auth/apple
router.post('/apple', async (req: Request, res: Response): Promise<void> => {
  try {
    const { identityToken, user: userMetadata } = req.body;
    if (!identityToken) {
      res.status(400).json({ success: false, message: 'identityToken is required' });
      return;
    }

    const { email, fullName } = await verifyAppleToken(identityToken, userMetadata);

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        email,
        fullName,
        preferences: {
          theme: 'dark',
          accentColor: '#6366F1',
          fontSize: 'medium',
          language: 'en',
          dailyReminders: true,
          hapticFeedback: true,
        },
      });
      isNewUser = true;
    }

    const token = signSessionJwt(user._id.toString());

    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        preferences: user.preferences,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    console.error('Apple Auth Error:', error);
    res.status(401).json({ success: false, message: error.message || 'Authentication failed' });
  }
});

export default router;