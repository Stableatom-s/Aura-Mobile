import { useState } from "react";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  FLAGS,
  DAILY,
  FEATURES,
  MOOD_LABELS,
  MOOD_COLORS,
  ago,
  type User,
  type Flag,
} from "../data";

interface DashboardPageProps {
  users: User[];
  onNavigateToUsers?: () => void;
  onOpenUser?: (userId: string) => void;
}

export function DashboardPage({ users, onNavigateToUsers, onOpenUser }: DashboardPageProps) {
  const [range, setRange] = useState<7 | 30>(30);

  const openFlagsCount = FLAGS.filter((f: Flag) => f.status !== "Resolved").length;
  const moodDistribution = MOOD_LABELS.map((label: string, idx: number) => ({
    label,
    count: users.filter((u: User) => Math.round(u.mood[u.mood.length - 1]) - 1 === idx).length,
    color: MOOD_COLORS[idx],
  }));

  const recentLogins = [...users].sort((a: User, b: User) => a.lastMin - b.lastMin).slice(0, 7);
  const chartData = DAILY.slice(-range);

  return (
    <div className="space-y-6 pb-12">
      {/* 6 Top KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {/* Total Users */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">48,213</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 3.1%
            </span>
            <span className="text-slate-500 font-normal">vs last 30d</span>
          </div>
        </div>

        {/* Daily Active */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Daily Active</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">5,904</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 4.8%
            </span>
            <span className="text-slate-500 font-normal">vs last wk</span>
          </div>
        </div>

        {/* New Sign-ups */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">New Sign-ups</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">1,372</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 9.2%
            </span>
            <span className="text-slate-500 font-normal">this week</span>
          </div>
        </div>

        {/* Active Now */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Now</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">412</p>
          <div className="mt-2.5 flex items-center text-xs font-normal text-slate-500">
            <span>in app</span>
          </div>
        </div>

        {/* Open Safety Flags */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Open Safety Flags</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">{openFlagsCount}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
            <span className="flex items-center gap-0.5">
              <ArrowDown className="size-3.5 stroke-[2.5]" /> 2 new
            </span>
            <span className="text-slate-500 font-normal">today</span>
          </div>
        </div>

        {/* MRR */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">MRR</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">$39.6k</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 10.3%
            </span>
            <span className="text-slate-500 font-normal">vs Sep</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Area Chart + Feature Usage Distribution */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
        {/* Left: DAU Chart */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-sm font-semibold tracking-wide text-white">Daily active users & sign-ups</h3>
            <div className="flex rounded-xl bg-[#090D1C] p-1 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setRange(7)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  range === 7 ? "bg-[#545CEB] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                7d
              </button>
              <button
                type="button"
                onClick={() => setRange(30)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  range === 30 ? "bg-[#545CEB] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                30d
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                key={range}
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#46E3B7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#46E3B7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 1500, 3000, 4500, 6000]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1021",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="dau"
                  stroke="#34D399"
                  strokeWidth={2.5}
                  fill="url(#dauGradient)"
                  isAnimationActive={true}
                  animationDuration={350}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Feature Usage Progress */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">Feature usage · % of DAU</h3>
            <div className="mt-6 space-y-4">
              {FEATURES.map((item: { name: string; v: number }) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>{item.name}</span>
                    <span className="text-slate-400 font-mono">{item.v}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#18203E]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
                      style={{ width: `${item.v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 border-t border-white/[0.06] pt-4 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Google</p>
              <p className="mt-1 text-base font-bold text-white font-['Outfit']">58%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Apple</p>
              <p className="mt-1 text-base font-bold text-white font-['Outfit']">42%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Avg Session</p>
              <p className="mt-1 text-base font-bold text-white font-['Outfit']">11m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Mood Check-in Histogram + Recent Logins Table */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1.9fr]">
        {/* Mood Histogram */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white">Latest mood check-in · all users</h3>
          <div className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} dy={6} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} ticks={[0, 4, 8, 12, 16]} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{
                    backgroundColor: "#0B1021",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {moodDistribution.map((entry: { color: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Recent Logins Feed */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold tracking-wide text-white">Most recent logins</h3>
            <button
              onClick={onNavigateToUsers}
              className="flex items-center gap-1 text-xs font-medium text-[#7C87F7] hover:text-[#9AA3FF] transition"
            >
              All users <ExternalLink className="size-3" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {recentLogins.map((user: User) => {
              const initials = user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <div
                  key={user.id}
                  onClick={() => onOpenUser?.(user.id)}
                  className="flex items-center justify-between py-2.5 transition hover:bg-white/[0.04] cursor-pointer rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, hsl(${user.hue} 70% 50%), hsl(${(user.hue + 40) % 360} 70% 35%))`,
                      }}
                    >
                      {initials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {user.device} · {user.provider} · {user.country}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{ago(user.lastMin)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}