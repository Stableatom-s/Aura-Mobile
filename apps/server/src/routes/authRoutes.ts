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

    const verified = await verifyGoogleToken(idToken);

    let user = await User.findOne({
      $or: [{ googleId: verified.oauthId }, { email: verified.email }],
    });

    if (!user) {
      user = await User.create({
        email: verified.email,
        googleId: verified.oauthId,
        fullName: verified.fullName || '',
        avatarUrl: verified.avatarUrl,
        onboardingCompleted: false,
      });
    } else if (!user.googleId) {
      user.googleId = verified.oauthId;
      if (verified.avatarUrl && !user.avatarUrl) {
        user.avatarUrl = verified.avatarUrl;
      }
      await user.save();
    }

    const token = signSessionJwt(String(user._id));

    res.json({
      success: true,
      token,
      user: {
        id: String(user._id),
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Google authentication failed',
    });
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

    const verified = await verifyAppleToken(identityToken, userMetadata);

    let user = await User.findOne({
      $or: [{ appleId: verified.oauthId }, { email: verified.email }],
    });

    if (!user) {
      user = await User.create({
        email: verified.email,
        appleId: verified.oauthId,
        fullName: verified.fullName || '',
        onboardingCompleted: false,
      });
    } else if (!user.appleId) {
      user.appleId = verified.oauthId;
      await user.save();
    }

    const token = signSessionJwt(String(user._id));

    res.json({
      success: true,
      token,
      user: {
        id: String(user._id),
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    console.error('Apple Auth Error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Apple authentication failed',
    });
  }
});

// PATCH /api/auth/profile/:id — Save sequential onboarding data (Name, DOB, Gender)
router.patch('/profile/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, gender, dateOfBirth } = req.body;

    const updates: Record<string, any> = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (gender !== undefined) {
      updates.gender = gender;
      updates.onboardingCompleted = true;
    }
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: String(updatedUser._id),
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    });
  } catch (error: any) {
    console.error('Profile Update Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user profile',
    });
  }
});

export default router;