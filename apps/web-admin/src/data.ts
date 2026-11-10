export type Plan = "Free" | "Plus" | "Premium";
export type Status = "Active" | "Suspended" | "Pending deletion";
export type Provider = "Google" | "Apple";
export type Perm = "view_users" | "suspend" | "delete" | "reveal" | "export" | "resolve" | "revenue" | "team";
export type RoleKey = "super" | "safety" | "support" | "analyst";

export interface User {
  id: string;
  name: string;
  email: string;
  provider: Provider;
  country: string;
  plan: Plan;
  status: Status;
  joinedDays: number;
  lastMin: number;
  sessions: number;
  messages: number;
  voiceMin: number;
  journals: number;
  streak: number;
  mood: number[];
  device: string;
  os: string;
  version: string;
  risk: "None" | "Watch" | "High";
  hue: number;
}

export interface Flag {
  id: string;
  userId: string;
  severity: "High" | "Medium" | "Low";
  reason: string;
  status: "Open" | "Reviewing" | "Resolved";
  min: number;
  assignee: string | null;
  source: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  detail: string;
  min: number;
}

export const ROLES: Record<RoleKey, { label: string; blurb: string; perms: Perm[] }> = {
  super: {
    label: "Super Admin",
    blurb: "Full access, including team and billing.",
    perms: ["view_users", "suspend", "delete", "reveal", "export", "resolve", "revenue", "team"],
  },
  safety: {
    label: "Trust & Safety",
    blurb: "Reviews crisis flags and sensitive content.",
    perms: ["view_users", "suspend", "reveal", "resolve"],
  },
  support: {
    label: "Support Agent",
    blurb: "Helps users with accounts and data requests.",
    perms: ["view_users", "export"],
  },
  analyst: {
    label: "Product Analyst",
    blurb: "Aggregate usage and revenue, read-only.",
    perms: ["view_users", "revenue"],
  },
};

export const PERM_LABELS: Record<Perm, string> = {
  view_users: "View user profiles & activity",
  suspend: "Suspend / restore accounts",
  delete: "Schedule account deletion",
  reveal: "Reveal conversation excerpts",
  export: "Export user data",
  resolve: "Resolve safety flags",
  revenue: "View revenue",
  team: "Manage admins & roles",
};

const FIRST = ["Maya", "Liam", "Sofia", "Noah", "Aiko", "Mateo", "Priya", "Elena", "Omar", "Chloe", "Kwame", "Isla", "Dev", "Hana", "Lucas", "Zara", "Tomas", "Nia", "Ravi", "Freya"];
const LAST = ["Chen", "Okafor", "Rossi", "Bergström", "Tanaka", "Silva", "Nair", "Novak", "Haddad", "Dubois", "Mensah", "Walsh", "Patel", "Kim", "Moreau", "Rahman", "Johnson", "Larsen", "Sharma", "Ortiz"];
const COUNTRIES = ["US", "UK", "IN", "DE", "BR", "JP", "CA", "FR"];
const DEVICES = [["Pixel 8", "Android 15"], ["Galaxy S24", "Android 14"], ["OnePlus 12", "Android 14"], ["Pixel 7a", "Android 14"]];

export const USERS: User[] = FIRST.map((f, i) => {
  const name = `${f} ${LAST[i % LAST.length]}`;
  const plan: Plan = i % 3 === 0 ? "Premium" : i % 2 === 0 ? "Plus" : "Free";
  const status: Status = i === 4 ? "Suspended" : i === 12 ? "Pending deletion" : "Active";
  const base = 2 + (i % 3);
  const mood = Array.from({ length: 14 }, (_, idx) => Math.max(1, Math.min(5, Math.round((base + Math.sin(idx + i) * 1.5) * 10) / 10)));
  const avg = mood.reduce((a, b) => a + b, 0) / mood.length;
  const dev = DEVICES[i % DEVICES.length];

  return {
    id: `usr_820${i}`,
    name,
    email: `${f.toLowerCase()}.${LAST[i % LAST.length].toLowerCase()}@gmail.com`,
    provider: i % 2 === 0 ? "Google" : "Apple",
    country: COUNTRIES[i % COUNTRIES.length],
    plan,
    status,
    joinedDays: 10 + i * 14,
    lastMin: 2 + i * 18,
    sessions: 24 + i * 12,
    messages: (24 + i * 12) * 10,
    voiceMin: 15 + i * 18,
    journals: 4 + i * 3,
    streak: (i * 3) % 25,
    mood,
    device: dev[0],
    os: dev[1],
    version: "2.8.1",
    risk: i === 2 || i === 8 ? "High" : avg < 2.5 ? "Watch" : "None",
    hue: (i * 45) % 360,
  };
});

export const FLAGS: Flag[] = [
  { id: "flg_0412", userId: USERS[2].id, severity: "High", reason: "Self-harm language detected in night chat", status: "Open", min: 14, assignee: null, source: "Chat" },
  { id: "flg_0411", userId: USERS[8].id, severity: "High", reason: "Acute panic spike during voice orb session", status: "Reviewing", min: 52, assignee: "Dana Whitfield", source: "Voice" },
  { id: "flg_0409", userId: USERS[5].id, severity: "Medium", reason: "Consistently low mood score for 7 consecutive days", status: "Open", min: 190, assignee: null, source: "Mood Trend" },
  { id: "flg_0405", userId: USERS[11].id, severity: "Medium", reason: "Repeated insomnia and stress expressions", status: "Open", min: 420, assignee: null, source: "Journal" },
  { id: "flg_0398", userId: USERS[0].id, severity: "Low", reason: "Inquired about antidepressant dosage", status: "Resolved", min: 1300, assignee: "Dana Whitfield", source: "Chat" },
];

export const ADMINS = [
  { name: "Priya Raman", email: "priya@aura.ai", role: "super" as RoleKey, last: "2 min ago", mfa: true },
  { name: "Dana Whitfield", email: "dana@aura.ai", role: "safety" as RoleKey, last: "18 min ago", mfa: true },
  { name: "Marcus Oyelaran", email: "marcus@aura.ai", role: "safety" as RoleKey, last: "3 h ago", mfa: true },
  { name: "Jun Takeda", email: "jun@aura.ai", role: "support" as RoleKey, last: "40 min ago", mfa: true },
  { name: "Elise Moreau", email: "elise@aura.ai", role: "analyst" as RoleKey, last: "Yesterday", mfa: false },
];

export const SEED_AUDIT: AuditEntry[] = [
  { id: "a1", actor: "Dana Whitfield", role: "Trust & Safety", action: "Claimed flag", target: "flg_0411", detail: "Assigned to self", min: 51 },
  { id: "a2", actor: "Jun Takeda", role: "Support Agent", action: "Exported user data", target: USERS[3].id, detail: "GDPR request #5521 · JSON package", min: 96 },
  { id: "a3", actor: "Priya Raman", role: "Super Admin", action: "Changed role", target: "Elise Moreau", detail: "Support Agent → Product Analyst", min: 310 },
  { id: "a4", actor: "Dana Whitfield", role: "Trust & Safety", action: "Suspended account", target: USERS[4].id, detail: "Violated community guidelines", min: 1200 },
];

export const DAILY = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 9, 22 - (29 - i));
  return {
    day: `${d.getMonth() + 1}/${d.getDate()}`,
    dau: Math.round(3800 + i * 55 + Math.sin(i) * 200),
    signups: Math.round(110 + (i % 6) * 15),
  };
});

export const MRR = [
  { m: "May", v: 21400 },
  { m: "Jun", v: 24100 },
  { m: "Jul", v: 27800 },
  { m: "Aug", v: 31200 },
  { m: "Sep", v: 35900 },
  { m: "Oct", v: 39600 },
];

export const FEATURES = [
  { name: "Chat Session", v: 78 },
  { name: "Mood Journaling", v: 54 },
  { name: "Voice Orb", v: 37 },
  { name: "Emotion Analytics", v: 46 },
  { name: "Meditation", v: 29 },
];

export const MOOD_LABELS = ["Rough", "Low", "Okay", "Good", "Great"];
export const MOOD_COLORS = ["#F472B6", "#FBBF24", "#67E8F9", "#818CF8", "#34D399"];

export const EXCERPTS = [
  { who: "user", text: "I've been feeling pretty overwhelmed with work lately and I can't switch off at night." },
  { who: "aura", text: "That sounds exhausting. Would it help to unwind with a short breathing exercise before bed?" },
  { who: "user", text: "Maybe. I just keep replaying everything in my head." },
];

export function makeTimeline(u: User) {
  const kinds = ["login", "chat", "voice", "journal", "mood", "meditate", "settings"];
  const label: Record<string, string> = {
    login: `Signed in with ${u.provider} · ${u.device}`,
    chat: "Chat session completed",
    voice: "Voice orb check-in",
    journal: "Daily journal entry saved",
    mood: "Mood check-in recorded",
    meditate: "Box-breathing meditation finished",
    settings: "Updated push notification preferences",
  };
  let t = u.lastMin;
  return Array.from({ length: 8 }, (_, i) => {
    const k = kinds[i % kinds.length];
    t += 35 + i * 40;
    return { id: i, kind: k, label: label[k], min: t };
  });
}

export function ago(min: number) {
  if (min < 1) return "just now";
  if (min < 60) return `${Math.round(min)}m ago`;
  if (min < 1440) return `${Math.round(min / 60)}h ago`;
  return `${Math.round(min / 1440)}d ago`;
}