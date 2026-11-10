import { useState, useEffect } from "react";
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
  country: string;
  device: string;
  iconType: "chat" | "voice" | "mood" | "sub" | "login" | "meditation" | "journal" | "account";
}

const INITIAL_EVENTS: LiveEvent[] = [
  {
    id: "evt_1",
    time: "15:17:19",
    userId: "usr_8204",
    userName: "Chloe Roth",
    action: "upgraded subscription",
    country: "DE",
    device: "Pixel 8",
    iconType: "sub",
  },
  {
    id: "evt_2",
    time: "15:17:18",
    userId: "usr_8212",
    userName: "Arjun Kim",
    action: "signed in with Google",
    country: "FR",
    device: "Xiaomi 14",
    iconType: "login",
  },
  {
    id: "evt_3",
    time: "15:17:11",
    userId: "usr_8200",
    userName: "Diego Aydin",
    action: "started a chat session",
    country: "BR",
    device: "Xiaomi 14",
    iconType: "chat",
  },
  {
    id: "evt_4",
    time: "15:16:44",
    userId: "usr_8208",
    userName: "Elena Patel",
    action: "logged a mood check-in",
    country: "AU",
    device: "Pixel 8",
    iconType: "mood",
  },
  {
    id: "evt_5",
    time: "15:16:42",
    userId: "usr_8210",
    userName: "Ben Walsh",
    action: "started a chat session",
    country: "NG",
    device: "Pixel 8",
    iconType: "chat",
  },
  {
    id: "evt_6",
    time: "15:16:40",
    userId: "usr_8205",
    userName: "Lucas Diallo",
    action: "finished a meditation",
    country: "US",
    device: "Galaxy A55",
    iconType: "meditation",
  },
  {
    id: "evt_7",
    time: "15:16:38",
    userId: "usr_8209",
    userName: "Yuki Weber",
    action: "logged a mood check-in",
    country: "IN",
    device: "Pixel 7a",
    iconType: "mood",
  },
  {
    id: "evt_8",
    time: "15:16:36",
    userId: "usr_8206",
    userName: "Mira Alvarez",
    action: "upgraded subscription",
    country: "SE",
    device: "OnePlus 12",
    iconType: "sub",
  },
  {
    id: "evt_9",
    time: "15:16:33",
    userId: "usr_8203",
    userName: "Tara Ferrari",
    action: "created an account via Google",
    country: "IN",
    device: "Galaxy S24",
    iconType: "account",
  },
  {
    id: "evt_10",
    time: "15:16:31",
    userId: "usr_8208",
    userName: "Nia Rossi",
    action: "logged a mood check-in",
    country: "DE",
    device: "Galaxy A55",
    iconType: "mood",
  },
  {
    id: "evt_11",
    time: "15:16:29",
    userId: "usr_8201",
    userName: "Omar Larsen",
    action: "signed in with Google",
    country: "BR",
    device: "Pixel 8",
    iconType: "login",
  },
  {
    id: "evt_12",
    time: "15:16:27",
    userId: "usr_8215",
    userName: "Liam Mensah",
    action: "saved a journal entry",
    country: "US",
    device: "Pixel 7a",
    iconType: "journal",
  },
];

const TOP_REGIONS = [
  { name: "United States", pct: 31 },
  { name: "India", pct: 18 },
  { name: "United Kingdom", pct: 12 },
  { name: "Germany", pct: 7 },
  { name: "Brazil", pct: 6 },
];

const POOL_NAMES = [
  { name: "Diego Aydin", id: "usr_8200", country: "ES", device: "Pixel 8" },
  { name: "Omar Larsen", id: "usr_8201", country: "BR", device: "Pixel 8" },
  { name: "Sofia Johnson", id: "usr_8202", country: "US", device: "Galaxy S24" },
  { name: "Mateo Singh", id: "usr_8205", country: "IN", device: "OnePlus 12" },
  { name: "Freya Kovács", id: "usr_8209", country: "DE", device: "Xiaomi 14" },
  { name: "Arjun Kim", id: "usr_8212", country: "FR", device: "Xiaomi 14" },
  { name: "Chloe Roth", id: "usr_8204", country: "DE", device: "Pixel 8" },
];

const POOL_ACTIONS: { action: string; iconType: LiveEvent["iconType"] }[] = [
  { action: "started a chat session", iconType: "chat" },
  { action: "began a voice session", iconType: "voice" },
  { action: "logged a mood check-in", iconType: "mood" },
  { action: "finished a meditation", iconType: "meditation" },
  { action: "signed in with Google", iconType: "login" },
  { action: "upgraded subscription", iconType: "sub" },
  { action: "saved a journal entry", iconType: "journal" },
  { action: "created an account via Google", iconType: "account" },
];

interface LiveActivityPageProps {
  onOpenUser?: (userId: string) => void;
}

export function LiveActivityPage({ onOpenUser }: LiveActivityPageProps) {
  const [events, setEvents] = useState<LiveEvent[]>(INITIAL_EVENTS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
      ].join(":");

      const randomUser = POOL_NAMES[Math.floor(Math.random() * POOL_NAMES.length)];
      const randomAction = POOL_ACTIONS[Math.floor(Math.random() * POOL_ACTIONS.length)];

      const newEvt: LiveEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        time: timeStr,
        userId: randomUser.id,
        userName: randomUser.name,
        action: randomAction.action,
        country: randomUser.country,
        device: randomUser.device,
        iconType: randomAction.iconType,
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 40)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

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
        {/* Sticky Header with Pause/Resume */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0A0E21] px-5 py-3.5">
          <h3 className="text-sm font-semibold tracking-wide text-white">Event stream</h3>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
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

        {/* Scrollable Confined Area with Native Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto px-4 divide-y divide-white/[0.03] [scrollbar-width:thin] [scrollbar-color:#1e293b_transparent]">
          <AnimatePresence initial={false}>
            {events.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between py-2.5 px-2 text-xs transition hover:bg-white/[0.02]"
              >
                {/* Left: Timestamp, Icon, User Name and Action */}
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
                      {evt.userName}
                    </button>
                    <span className="text-slate-400">{evt.action}</span>
                  </div>
                </div>

                {/* Right: Country & Device */}
                <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-slate-500">
                  <span>{evt.country}</span>
                  <span>·</span>
                  <span className="text-slate-400">{evt.device}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Metric Cards & Top Regions */}
      <div className="space-y-6">
        {/* Right now Tile Cards */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E21] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white pb-4">Right now</h3>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ONLINE</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">412</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IN CHAT</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">187</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IN VOICE</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">34</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0E1328] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">JOURNALING</p>
              <p className="mt-2 text-2xl font-bold text-white font-['Outfit']">96</p>
            </div>
          </div>
        </div>

        {/* Top Regions Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E21] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white pb-4">Top regions</h3>
          <div className="space-y-4">
            {TOP_REGIONS.map((region) => (
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
        </div>
      </div>
    </div>
  );
}