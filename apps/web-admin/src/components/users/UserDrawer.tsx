import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Lock,
  Eye,
  Ban,
  Download,
  Trash2,
  BookOpen,
  Smartphone,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { User } from "../../data";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

interface UserDrawerProps {
  user: User;
  onClose: () => void;
  onPatchUser?: (userId: string, patch: Partial<User>) => void;
}

type DrawerTab = "overview" | "activity" | "content" | "actions";

interface UserJournalRecord {
  id: string;
  emotion: string;
  reflectionText: string;
  createdAt: string;
}

export function UserDrawer({ user, onClose, onPatchUser }: UserDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");
  const [reason, setReason] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [userJournals, setUserJournals] = useState<UserJournalRecord[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Reset reveal state and fetch live user activity/journals when inspected user changes
  useEffect(() => {
    setRevealed(false);
    setReason("");
    setUserJournals([]);

    let isMounted = true;
    async function fetchUserDetails() {
      try {
        setLoadingDetails(true);
        const res = await fetch(`${API_BASE}/admin/users/${user.id}/details`);
        const data = await res.json();
        if (isMounted && data?.success) {
          setUserJournals(data.journals || []);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    }

    fetchUserDetails();
    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const displayName = user.name || user.email || "Unknown User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const moodSeries = Array.isArray(user.mood) ? user.mood : [];

  const moodChartData = useMemo(() => {
    return moodSeries.map((val, idx) => ({
      d: `D${idx + 1}`,
      score: val,
    }));
  }, [moodSeries]);

  const avgMood =
    moodSeries.length > 0
      ? (moodSeries.reduce((acc, curr) => acc + curr, 0) / moodSeries.length).toFixed(1)
      : "—";

  const handleRevealExcerpts = async () => {
    if (!reason) return;
    setRevealed(true);
    try {
      await fetch(`${API_BASE}/admin/users/${user.id}/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
    } catch (err) {
      console.error("Failed to record excerpt reveal audit log:", err);
    }
  };

  const handleExportGDPR = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        provider: user.provider,
        status: user.status,
        country: user.country,
        device: user.device,
      },
      journals: userJournals,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aura_gdpr_${user.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Dimmed Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Slide-over Drawer Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col border-l border-white/[0.08] bg-[#0A0E21] shadow-2xl"
      >
        {/* Header Profile Section */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            <span
              className="grid size-12 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
              }}
            >
              {initials}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">{displayName}</h2>
              <p className="font-mono text-xs text-slate-400">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                  {user.status || "Active"}
                </span>
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                  {user.plan || "Free"}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/[0.08] px-6">
          {(["overview", "activity", "content", "actions"] as DrawerTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 pt-2 text-sm font-semibold capitalize transition cursor-pointer ${
                activeTab === tab ? "text-white" : "text-slate-400 hover:text-slate-200"
              } mr-6`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable View Body */}
        <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:thin]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sessions</p>
                  <p className="mt-2 text-xl font-bold text-white font-['Outfit']">{user.sessions ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Messages</p>
                  <p className="mt-2 text-xl font-bold text-white font-['Outfit']">
                    {(user.messages ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Voice Min</p>
                  <p className="mt-2 text-xl font-bold text-white font-['Outfit']">{user.voiceMin ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Journals</p>
                  <p className="mt-2 text-xl font-bold text-white font-['Outfit']">
                    {userJournals.length || user.journals || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Streak</p>
                  <p className="mt-2 text-xl font-bold text-white font-['Outfit']">{user.streak ?? 0}d</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Avg Mood</p>
                  <p className="mt-2 text-xl font-bold text-white font-['Outfit']">{avgMood}</p>
                </div>
              </div>

              {/* Mood Sparkline Curve */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Mood · Recorded Check-ins
                </p>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
                  {moodChartData.length < 2 ? (
                    <div className="flex h-28 items-center justify-center text-xs text-slate-500">
                      Not enough mood check-ins recorded yet.
                    </div>
                  ) : (
                    <div className="h-28 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={moodChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="drawerMoodGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#A855F7" stopOpacity={0.45} />
                              <stop offset="100%" stopColor="#A855F7" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="d"
                            stroke="#64748B"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            domain={[1, 5]}
                            stroke="#64748B"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            ticks={[1, 3, 5]}
                          />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#A855F7"
                            strokeWidth={2}
                            fill="url(#drawerMoodGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* User Metadata Card Table */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0E1328]/60 p-4 divide-y divide-white/[0.05] text-xs">
                <div className="flex items-center justify-between pb-3 text-slate-400">
                  <span>User ID</span>
                  <span className="font-mono text-slate-200">{user.id}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-slate-400">
                  <span>Sign-in method</span>
                  <span className="text-slate-200">{user.provider || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-slate-400">
                  <span>Country</span>
                  <span className="text-slate-200">{user.country || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-slate-400">
                  <span>Joined</span>
                  <span className="text-slate-200">
                    {typeof user.joinedDays === "number" ? `${user.joinedDays} days ago` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 text-slate-400">
                  <span>Last active</span>
                  <span className="text-slate-200">
                    {typeof user.lastMin === "number" ? `${user.lastMin} min ago` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 text-slate-400">
                  <span>Device</span>
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Smartphone className="size-3.5 text-slate-400" />
                    {[user.device, user.os].filter(Boolean).join(" · ") || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 text-slate-400">
                  <span>App version</span>
                  <span className="font-mono text-slate-200">{user.version || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY */}
          {activeTab === "activity" && (
            <div>
              {loadingDetails ? (
                <p className="py-10 text-center text-xs text-slate-500">
                  Loading user activity from database...
                </p>
              ) : userJournals.length === 0 ? (
                <p className="py-10 text-center text-xs text-slate-500">
                  No recorded journal or session activity for this user yet.
                </p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:bottom-3 before:left-2.5 before:top-3 before:w-[1px] before:bg-white/[0.08]">
                  {userJournals.map((entry) => (
                    <div key={entry.id} className="relative flex items-start gap-4">
                      <div className="absolute -left-[30px] grid size-7 place-items-center rounded-full border border-white/10 bg-[#0A0E21] text-indigo-400">
                        <BookOpen className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white leading-tight">
                          Journal check-in · {entry.emotion}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {new Date(entry.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4.5 text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                  <Lock className="size-3.5 text-slate-400" />
                  <span>Private by default</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Aura conversations and journal entries are end-user private. Only usage
                  metadata is shown elsewhere. Revealing excerpts requires a reason and is
                  recorded in the audit log.
                </p>
              </div>

              {!revealed ? (
                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[#0E1328] px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-400 cursor-pointer"
                    >
                      <option value="">Select a reason...</option>
                      <option value="Safety flag review">Safety flag review</option>
                      <option value="Abuse report">Abuse report</option>
                      <option value="User-requested support">User-requested support</option>
                      <option value="Legal request">Legal request</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!reason}
                    onClick={handleRevealExcerpts}
                    className="flex w-fit items-center gap-2 rounded-xl bg-[#525FE1] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6366F1] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 cursor-pointer"
                  >
                    <Eye className="size-3.5" />
                    Reveal recent excerpts
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-200">
                    Excerpts revealed under audit reason: <strong>{reason}</strong>
                  </div>
                  {userJournals.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-500">
                      No journal entries stored for this user.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {userJournals.slice(0, 10).map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-2xl bg-[#0E1328] border border-white/[0.06] p-3.5 text-xs leading-relaxed text-slate-200"
                        >
                          <div className="mb-1 flex items-center justify-between text-[10px] font-mono text-indigo-300">
                            <span>{entry.emotion.toUpperCase()}</span>
                            <span className="text-slate-500">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p>{entry.reflectionText}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACTIONS */}
          {activeTab === "actions" && (
            <div className="space-y-3.5">
              {/* Suspend account */}
              <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
                <div className="flex items-start gap-3.5">
                  <Ban className="mt-0.5 size-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Suspend account</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Signs the user out of all devices and blocks sign-in.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = user.status === "Suspended" ? "Active" : "Suspended";
                    onPatchUser?.(user.id, { status: next });
                  }}
                  className="rounded-xl bg-[#18203E] px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-[#202B52] transition border border-white/5 cursor-pointer"
                >
                  {user.status === "Suspended" ? "Restore" : "Run"}
                </button>
              </div>

              {/* Export user data */}
              <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
                <div className="flex items-start gap-3.5">
                  <Download className="mt-0.5 size-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Export user data</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Generates a GDPR/CCPA data package (JSON).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportGDPR}
                  className="rounded-xl bg-[#18203E] px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-[#202B52] transition border border-white/5 cursor-pointer"
                >
                  Run
                </button>
              </div>

              {/* Schedule deletion */}
              <div className="flex items-center justify-between rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-4">
                <div className="flex items-start gap-3.5">
                  <Trash2 className="mt-0.5 size-4 text-rose-400" />
                  <div>
                    <p className="text-xs font-semibold text-rose-300">Schedule deletion</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Removes all data after a 30-day grace period.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Schedule ${displayName} for deletion?`)) {
                      onPatchUser?.(user.id, { status: "Pending deletion" });
                    }
                  }}
                  className="rounded-xl border border-rose-500/30 bg-[#2D1525] px-3.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-[#3D1A32] transition cursor-pointer"
                >
                  Delete...
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}