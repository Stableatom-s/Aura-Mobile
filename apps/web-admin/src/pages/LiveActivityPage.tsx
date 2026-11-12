import { useState, useMemo } from "react";
import {
  Pause,
  Play,
  MessageSquare,
  Mic,
  Smile,
  Sparkles,
  LogIn,
  Wind,
  BookOpen,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LiveEvent {
  id: string;
  time: string;
  userId?: string;
  userName: string;
  action: string;
  country?: string;
  device?: string;
  iconType: "chat" | "voice" | "mood" | "sub" | "login" | "meditation" | "journal" | "account";
}

export interface LiveMetrics {
  online?: number;
  inChat?: number;
  inVoice?: number;
  journaling?: number;
  topRegions?: Array<{ name: string; pct: number }>;
}

interface LiveActivityPageProps {
  events?: LiveEvent[];
  metrics?: LiveMetrics;
  onOpenUser?: (userId: string) => void;
}

export function LiveActivityPage({
  events = [],
  metrics,
  onOpenUser,
}: LiveActivityPageProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [frozenEvents, setFrozenEvents] = useState<LiveEvent[]>([]);

  const handleTogglePause = () => {
    setIsPaused((prev) => {
      if (!prev) {
        setFrozenEvents(events);
      }
      return !prev;
    });
  };

  const displayedEvents = isPaused ? frozenEvents : events;

  // Compute top regions dynamically from live events if explicit metrics aren't provided
  const computedRegions = useMemo(() => {
    if (metrics?.topRegions && metrics.topRegions.length > 0) {
      return metrics.topRegions;
    }
    const counts: Record<string, number> = {};
    let total = 0;
    for (const evt of displayedEvents) {
      if (evt.country) {
        counts[evt.country] = (counts[evt.country] || 0) + 1;
        total += 1;
      }
    }
    if (total === 0) return [];
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);
  }, [metrics?.topRegions, displayedEvents]);

  const renderIcon = (type: LiveEvent["iconType"]) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="size-3.5 text-slate-300" />;
      case "voice":
        return <Mic className="size-3.5 text-blue-400" />;
      case "mood":
        return <Smile className="size-3.5 text-emerald-400" />;
      case "meditation":
        return <Wind className="size-3.5 text-teal-300" />;
      case "sub":
        return <Sparkles className="size-3.5 text-amber-400" />;
      case "login":
        return <LogIn className="size-3.5 text-teal-400" />;
      case "journal":
        return <BookOpen className="size-3.5 text-slate-300" />;
      case "account":
        return <UserPlus className="size-3.5 text-teal-400" />;
      default:
        return <MessageSquare className="size-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 pb-12 xl:grid-cols-[1.95fr_1.05fr]">
      {/* LEFT: Confined Event Stream Box */}
      <div className="flex h-[600px] flex-col rounded-2xl border border-white/[0.08] bg-[#0A0E21] shadow-xl overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0A0E21] px-5 py-3.5">
          <h3 className="text-sm font-semibold tracking-wide text-white">Event stream</h3>

          <button
            type="button"
            onClick={handleTogglePause}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0E1328] px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play className="size-3 text-emerald-400 fill-emerald-400" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="size-3 text-slate-400" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 divide-y divide-white/[0.03] [scrollbar-width:thin] [scrollbar-color:#1e293b_transparent]">
          {displayedEvents.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              Waiting for live user events from database...
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {displayedEvents.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between py-2.5 px-2 text-xs transition hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className="font-mono text-[11px] text-slate-500 shrink-0">
                      {evt.time}
                    </span>
                    <span className="shrink-0">{renderIcon(evt.iconType)}</span>
                    <div className="truncate text-slate-300">
                      <button
                        type="button"
                        onClick={() => evt.userId && onOpenUser?.(evt.userId)}
                        className="font-bold text-white hover:text-indigo-300 hover:underline cursor-pointer mr-1.5 transition"
                      >
                        {evt.userName || "User"}
                      </button>
                      <span className="text-slate-400">{evt.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-slate-500">
                    {evt.country && <span>{evt.country}</span>}
                    {evt.country && evt.device && <span>·</span>}
                    {evt.device && <span className="text-slate-400">{evt.device}</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* RIGHT: Metric Cards & Top Regions */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E21] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white pb-4">Right now</h3>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ONLINE</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">
                {metrics?.online ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IN CHAT</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">
                {metrics?.inChat ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IN VOICE</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">
                {metrics?.inVoice ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">JOURNALING</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">
                {metrics?.journaling ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E21] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white pb-4">Top regions</h3>
          {computedRegions.length === 0 ? (
            <p className="text-xs text-slate-500">No regional activity data yet.</p>
          ) : (
            <div className="space-y-4">
              {computedRegions.map((region) => (
                <div key={region.name}>
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>{region.name}</span>
                    <span className="font-mono text-slate-400">{region.pct}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#18203E]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
                      style={{ width: `${region.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}