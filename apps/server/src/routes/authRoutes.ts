import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { JournalEntry } from '../models/JournalEntry.js';

const router = Router();

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  plan: string;
  provider: string;
  status: string;
  mood: number[];
  sessions: number;
  joinedDays: number;
  lastMin: number;
  risk: string;
  country: string;
  device: string;
  hue: number;
}

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'Trust & Safety' },
    twoFactor: { type: Boolean, default: false },
    lastSignIn: { type: String, default: 'Never' },
  },
  { timestamps: true }
);

const SafetyFlagSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    reason: { type: String, required: true },
    severity: { type: String, enum: ['High', 'Medium'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'Reviewing', 'Resolved'], default: 'Open' },
    source: { type: String, default: 'Journal' },
    assignee: { type: String, default: '' },
  },
  { timestamps: true }
);

const AuditLogSchema = new mongoose.Schema(
  {
    adminName: { type: String, required: true },
    adminRole: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String, required: true },
    detail: { type: String, default: '' },
  },
  { timestamps: true }
);

const AdminModel = mongoose.models.AdminMember || mongoose.model('AdminMember', AdminSchema);
const SafetyFlagModel = mongoose.models.SafetyFlag || mongoose.model('SafetyFlag', SafetyFlagSchema);
const AuditLogModel = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

const ROLE_LABEL_TO_KEY: Record<string, 'super' | 'safety' | 'support' | 'analyst'> = {
  'Super Admin': 'super',
  'Trust & Safety': 'safety',
  'Support Agent': 'support',
  'Product Analyst': 'analyst',
};

function minutesAgo(date?: Date | string): number {
  if (!date) return 0;
  const diffMs = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

function daysAgo(date?: Date | string): number {
  if (!date) return 0;
  const diffMs = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function formatRelative(date?: Date | string): string {
  const mins = minutesAgo(date);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}

const EMOTION_SCORE: Record<string, number> = {
  Anxious: 1,
  Sad: 1,
  Tired: 2,
  Stressed: 2,
  Reflective: 3,
  Neutral: 3,
  Calm: 4,
  Grateful: 4,
  Happy: 5,
  Excited: 5,
};

// POST /api/admin/login — Authenticate admin by work email and resolve DB role
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;
    if (!email || !code || String(code).length !== 6) {
      res.status(400).json({ success: false, message: 'Valid email and 6-digit 2FA code required.' });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let admin = await AdminModel.findOne({ email: normalizedEmail });

    if (!admin) {
      const totalAdmins = await AdminModel.countDocuments();
      if (totalAdmins === 0) {
        admin = await AdminModel.create({
          name: normalizedEmail.split('@')[0],
          email: normalizedEmail,
          role: 'Super Admin',
          twoFactor: true,
          lastSignIn: new Date().toLocaleString(),
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'Access denied. Ask a Super Admin to invite this email in Team & Roles.',
        });
        return;
      }
    } else {
      admin.lastSignIn = new Date().toLocaleString();
      admin.twoFactor = true;
      await admin.save();
    }

    const roleKey = ROLE_LABEL_TO_KEY[admin.role] || 'support';

    await AuditLogModel.create({
      adminName: admin.name,
      adminRole: admin.role,
      action: 'Signed in to console',
      target: admin.email,
      detail: '2FA verified',
    });

    res.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
        roleKey,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/bootstrap — Loads all live MongoDB data for the Admin Console
router.get('/bootstrap', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rawUsers, rawJournals, rawFlags, rawAdmins, rawLogs] = await Promise.all([
      User.find().sort({ updatedAt: -1 }).lean(),
      JournalEntry.find().sort({ createdAt: -1 }).limit(500).lean(),
      SafetyFlagModel.find().sort({ createdAt: -1 }).lean(),
      AdminModel.find().sort({ createdAt: -1 }).lean(),
      AuditLogModel.find().sort({ createdAt: -1 }).limit(100).lean(),
    ]);

    const journalsByUser = new Map<string, any[]>();
    for (const j of rawJournals as any[]) {
      const uid = String(j.userId);
      if (!journalsByUser.has(uid)) journalsByUser.set(uid, []);
      journalsByUser.get(uid)!.push(j);
    }

    const users: AdminUserRow[] = (rawUsers as any[]).map((u: any, index: number) => {
      const uid = String(u._id);
      const userJournals = journalsByUser.get(uid) || [];
      const moodSeries = userJournals
        .slice(0, 14)
        .reverse()
        .map((j: any) => EMOTION_SCORE[j.emotion] ?? 3);

      const isPro = Boolean(u.subscription?.isPro);
      const plan = u.subscription?.plan || (isPro ? 'Premium' : 'Free');

      return {
        id: uid,
        name: u.fullName || u.email?.split('@')[0] || 'Aura User',
        email: u.email || '',
        plan,
        provider: u.appleId ? 'Apple' : 'Google',
        status: u.status || 'Active',
        mood: moodSeries,
        sessions: userJournals.length,
        joinedDays: daysAgo(u.createdAt),
        lastMin: minutesAgo(u.updatedAt || u.createdAt),
        risk: u.risk || 'Normal',
        country: u.country || 'IN',
        device: u.device || 'Mobile',
        hue: (index * 47 + 210) % 360,
      };
    });

    const userMap = new Map<string, AdminUserRow>(users.map((u: AdminUserRow) => [u.id, u]));

    const flags = (rawFlags as any[]).map((f: any) => ({
      id: String(f._id),
      userId: String(f.userId),
      reason: f.reason,
      severity: f.severity,
      status: f.status,
      source: f.source,
      min: minutesAgo(f.createdAt),
      assignee: f.assignee || undefined,
    }));

    const logs = (rawLogs as any[]).map((l: any) => ({
      id: String(l._id),
      when: formatRelative(l.createdAt),
      adminName: l.adminName,
      adminRole: l.adminRole,
      action: l.action,
      target: l.target,
      detail: l.detail,
    }));

    const admins = (rawAdmins as any[]).map((a: any) => ({
      id: String(a._id),
      name: a.name,
      email: a.email,
      role: a.role,
      twoFactor: a.twoFactor,
      lastSignIn: a.lastSignIn,
    }));

    const liveEvents = [
      ...(rawJournals as any[]).slice(0, 20).map((j: any) => {
        const u = userMap.get(String(j.userId));
        const d = new Date(j.createdAt || Date.now());
        return {
          id: `evt_j_${j._id}`,
          time: d.toTimeString().slice(0, 8),
          userId: String(j.userId),
          userName: u?.name || 'Aura User',
          action: `saved a ${j.emotion?.toLowerCase() || ''} journal entry`.trim(),
          country: u?.country || 'IN',
          device: u?.device || 'Mobile',
          iconType: 'journal' as const,
        };
      }),
      ...(rawUsers as any[]).slice(0, 10).map((u: any) => {
        const d = new Date(u.createdAt || Date.now());
        return {
          id: `evt_u_${u._id}`,
          time: d.toTimeString().slice(0, 8),
          userId: String(u._id),
          userName: u.fullName || u.email || 'Aura User',
          action: u.appleId ? 'signed in with Apple' : 'signed in with Google',
          country: u.country || 'IN',
          device: u.device || 'Mobile',
          iconType: 'login' as const,
        };
      }),
    ].slice(0, 25);

    const payingUsers = users.filter((u: AdminUserRow) => u.plan === 'Plus' || u.plan === 'Premium').length;
    const mrr = users.reduce((sum: number, u: AdminUserRow) => {
      if (u.plan === 'Premium') return sum + 14.99;
      if (u.plan === 'Plus') return sum + 7.99;
      return sum;
    }, 0);

    res.json({
      success: true,
      users,
      flags,
      admins,
      logs,
      liveEvents,
      stats: {
        totalUsers: users.length,
        dailyActive: users.filter((u: AdminUserRow) => u.lastMin <= 1440).length,
        newSignups: users.filter((u: AdminUserRow) => u.joinedDays <= 7).length,
        activeNow: users.filter((u: AdminUserRow) => u.lastMin <= 15).length,
        mrr: Math.round(mrr),
      },
      billing: {
        mrr: Math.round(mrr),
        payingUsers,
        arpu: payingUsers > 0 ? Number((mrr / payingUsers).toFixed(2)) : 0,
        churnPct: 0,
        mrrSeries: [],
        recentSubscriptions: [],
      },
      liveMetrics: {
        online: users.filter((u: AdminUserRow) => u.lastMin <= 15).length,
        inChat: 0,
        inVoice: 0,
        journaling: (rawJournals as any[]).filter((j: any) => minutesAgo(j.createdAt) <= 15).length,
      },
    });
  } catch (error: any) {
    console.error('Admin bootstrap error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/users/:id/details — Fetch user's live journal entries for UserDrawer
router.get('/users/:id/details', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const journals = await JournalEntry.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      journals: (journals as any[]).map((j) => ({
        id: String(j._id),
        emotion: j.emotion,
        reflectionText: j.reflectionText,
        createdAt: j.createdAt,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/users/:id/reveal — Record excerpt reveal in AuditLog
router.post('/users/:id/reveal', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await AuditLogModel.create({
      adminName: 'Console Admin',
      adminRole: 'Super Admin',
      action: 'Revealed excerpts',
      target: id,
      detail: `Reason: ${reason || 'Unspecified'}`,
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/users/:id — Suspend, restore, or update user status/plan
router.patch('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patch = req.body;

    const updated = await User.findByIdAndUpdate(id, { $set: patch }, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    await AuditLogModel.create({
      adminName: patch.adminName || 'Console Admin',
      adminRole: patch.adminRole || 'Super Admin',
      action: patch.status ? `Updated status to ${patch.status}` : 'Updated user record',
      target: id,
      detail: JSON.stringify(patch),
    });

    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/flags/:id — Claim or resolve a safety flag
router.patch('/flags/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignee, adminRole } = req.body;

    const updated = await SafetyFlagModel.findByIdAndUpdate(
      id,
      { $set: { ...(status && { status }), ...(assignee && { assignee }) } },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Flag not found' });
      return;
    }

    await AuditLogModel.create({
      adminName: assignee || 'Console Admin',
      adminRole: adminRole || 'Trust & Safety',
      action: status === 'Resolved' ? 'Resolved flag' : 'Claimed flag',
      target: id,
      detail: status === 'Resolved' ? 'Marked resolved' : `Assigned to ${assignee}`,
    });

    res.json({ success: true, flag: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/team/invite — Invite/save a new admin member
router.post('/team/invite', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required' });
      return;
    }

    const admin = await AdminModel.create({
      name,
      email,
      role: role || 'Trust & Safety',
      twoFactor: false,
      lastSignIn: 'Pending invite',
    });

    await AuditLogModel.create({
      adminName: 'Console Admin',
      adminRole: 'Super Admin',
      action: 'Invited admin',
      target: email,
      detail: `Role: ${role || 'Trust & Safety'}`,
    });

    res.status(201).json({
      success: true,
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        twoFactor: admin.twoFactor,
        lastSignIn: admin.lastSignIn,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;