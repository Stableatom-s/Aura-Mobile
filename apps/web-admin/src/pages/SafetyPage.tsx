import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ago, type Flag, type User } from "../data";

interface SafetyPageProps {
  flags: Flag[];
  users: User[];
  onOpenUser: (userId: string) => void;
  onClaimFlag?: (flagId: string) => void;
  onResolveFlag?: (flagId: string) => void;
}

export function SafetyPage({
  flags,
  users,
  onOpenUser,
  onClaimFlag,
  onResolveFlag,
}: SafetyPageProps) {
  const [activeTab, setActiveTab] = useState<"Active" | "Resolved">("Active");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss the toast pill after 3.5 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleClaim = (flagId: string) => {
    onClaimFlag?.(flagId);
    setToastMessage("Claimed flag · logged to audit trail");
  };

  const handleResolve = (flagId: string) => {
    onResolveFlag?.(flagId);
  };

  // Filter flags according to tab
  const displayedFlags = flags.filter((f) =>
    activeTab === "Active" ? f.status !== "Resolved" : f.status === "Resolved"
  );

  return (
    <div className="relative space-y-6 pb-20">
      {/* Top Header Row with Active/Resolved Pills and Caption */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Toggle Pills */}
        <div className="flex rounded-full bg-[#0E1328] p-1 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setActiveTab("Active")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "Active"
                ? "bg-[#545CEB] text-white shadow-md shadow-indigo-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Resolved")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "Resolved"
                ? "bg-[#545CEB] text-white shadow-md shadow-indigo-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Info Caption */}
        <p className="text-xs text-slate-400">
          Flags are generated automatically from chat, voice, journal and mood signals.
        </p>
      </div>

      {/* Safety Incident Cards Feed */}
      <div className="space-y-3.5">
        {displayedFlags.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E1326] p-12 text-center text-slate-500 text-sm">
            No {activeTab.toLowerCase()} safety flags in queue.
          </div>
        ) : (
          displayedFlags.map((flag) => {
            const user = users.find((u) => u.id === flag.userId);
            const userName = user?.name || "Unknown User";
            const userHue = user?.hue || 280;
            const initials = userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={flag.id}
                className="group relative flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#0C1024]/90 p-4 px-5 shadow-lg shadow-black/20 transition hover:border-white/15 hover:bg-[#0E1328]"
              >
                {/* Left: Avatar + User Info (Clicking opens user drawer) */}
                <div
                  onClick={() => onOpenUser(flag.userId)}
                  className="flex items-center gap-4 cursor-pointer"
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-sm transition group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, hsl(${userHue} 75% 55%), hsl(${(userHue + 40) % 360} 75% 40%))`,
                    }}
                  >
                    {initials}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white transition group-hover:text-indigo-300">
                      {userName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{flag.reason}</p>
                  </div>
                </div>

                {/* Right: Badges, Metadata, & Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Severity Badge */}
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      flag.severity === "High"
                        ? "bg-rose-500/10 text-rose-400 ring-rose-500/25"
                        : "bg-amber-500/10 text-amber-400 ring-amber-500/25"
                    }`}
                  >
                    {flag.severity}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      flag.status === "Reviewing"
                        ? "bg-amber-400/10 text-amber-300 ring-amber-400/25"
                        : flag.status === "Resolved"
                        ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25"
                        : "bg-rose-500/10 text-rose-300 ring-rose-500/25"
                    }`}
                  >
                    {flag.status}
                  </span>

                  {/* Incident Metadata */}
                  <div className="text-right text-xs leading-relaxed text-slate-400 min-w-[150px]">
                    <p className="font-mono text-[11px] text-slate-300">
                      {flag.id} · {flag.source}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {ago(flag.min)} · {flag.assignee ? flag.assignee : "Unassigned"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {flag.status !== "Resolved" && (
                      <>
                        {!flag.assignee && (
                          <button
                            type="button"
                            onClick={() => handleClaim(flag.id)}
                            className="rounded-xl border border-white/10 bg-[#161D3B] px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-[#202952] hover:text-white cursor-pointer"
                          >
                            Claim
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResolve(flag.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-[#545CEB] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#6366F1] shadow-md shadow-indigo-500/20 cursor-pointer"
                        >
                          <Check className="size-3.5 stroke-[2.5]" />
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Floating Pill Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0E1328]/95 px-5 py-2.5 shadow-2xl backdrop-blur-md">
              <Check className="size-4 text-emerald-400 stroke-[2.5]" />
              <span className="text-xs font-medium text-slate-100">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}