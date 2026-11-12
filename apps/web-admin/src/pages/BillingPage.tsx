import { ArrowUp, ArrowDown } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { User } from "../data";

export interface SubscriptionTransaction {
  id: string;
  userId: string;
  name: string;
  plan: "Plus" | "Premium" | string;
  price: string;
  type: string;
  time: string;
  hue?: number;
}

export interface BillingMetrics {
  mrr: number;
  mrrDeltaPct?: number;
  payingUsers: number;
  payingUsersDeltaPct?: number;
  arpu: number;
  arpuDeltaPct?: number;
  churnPct: number;
  churnDeltaPt?: number;
  mrrSeries: Array<{ m: string; v: number }>;
  recentSubscriptions: SubscriptionTransaction[];
}

interface BillingPageProps {
  users?: User[];
  billing?: BillingMetrics;
  onOpenUser?: (userId: string) => void;
}

export function BillingPage({
  users = [],
  billing,
  onOpenUser,
}: BillingPageProps) {
  const formatYAxis = (val: number) => `$${Math.round(val / 1000)}k`;

  // Compute plan distribution dynamically from live users array
  const totalUsers = users.length;
  const freeCount = users.filter((u) => !u.plan || u.plan.toLowerCase() === "free").length;
  const plusCount = users.filter((u) => u.plan?.toLowerCase() === "plus").length;
  const premiumCount = users.filter((u) => u.plan?.toLowerCase() === "premium" || u.plan?.toLowerCase() === "pro").length;

  const pct = (count: number) => (totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0);
  const freePct = pct(freeCount);
  const plusPct = pct(plusCount);
  const premiumPct = pct(premiumCount);

  const mrr = billing?.mrr ?? 0;
  const payingUsers = billing?.payingUsers ?? plusCount + premiumCount;
  const payingBasePct = totalUsers > 0 ? ((payingUsers / totalUsers) * 100).toFixed(1) : "0.0";
  const arpu = billing?.arpu ?? (payingUsers > 0 ? mrr / payingUsers : 0);
  const churnPct = billing?.churnPct ?? 0;
  const mrrSeries = billing?.mrrSeries ?? [];
  const recentSubs = billing?.recentSubscriptions ?? [];

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* MRR */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">MRR</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">
            ${mrr.toLocaleString()}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            {billing?.mrrDeltaPct !== undefined ? (
              <>
                <span className="flex items-center gap-0.5">
                  <ArrowUp className="size-3.5 stroke-[2.5]" /> {billing.mrrDeltaPct}%
                </span>
                <span className="text-slate-500 font-normal">vs prev month</span>
              </>
            ) : (
              <span className="text-slate-500 font-normal">Live recurring total</span>
            )}
          </div>
        </div>

        {/* Paying Users */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Paying Users</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">
            {payingUsers.toLocaleString()}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            {billing?.payingUsersDeltaPct !== undefined && (
              <span className="flex items-center gap-0.5">
                <ArrowUp className="size-3.5 stroke-[2.5]" /> {billing.payingUsersDeltaPct}%
              </span>
            )}
            <span className="text-slate-500 font-normal">{payingBasePct}% of base</span>
          </div>
        </div>

        {/* ARPU */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">ARPU</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">
            ${arpu.toFixed(2)}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            {billing?.arpuDeltaPct !== undefined && (
              <span className="flex items-center gap-0.5">
                <ArrowUp className="size-3.5 stroke-[2.5]" /> {billing.arpuDeltaPct}%
              </span>
            )}
            <span className="text-slate-500 font-normal">paying</span>
          </div>
        </div>

        {/* Churn */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Churn</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">
            {churnPct.toFixed(1)}%
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
            {billing?.churnDeltaPt !== undefined && (
              <span className="flex items-center gap-0.5">
                <ArrowDown className="size-3.5 stroke-[2.5]" /> {billing.churnDeltaPt}pt
              </span>
            )}
            <span className="text-slate-500 font-normal">monthly</span>
          </div>
        </div>
      </div>

      {/* Middle Row: MRR Bar Chart + Cohort Plan Mix */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.85fr_1.15fr]">
        {/* Left: Monthly Recurring Revenue */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white pb-2">
            Monthly recurring revenue
          </h3>
          {mrrSeries.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-xs text-slate-500">
              No historical MRR data recorded yet.
            </div>
          ) : (
            <div className="h-[280px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mrrSeries} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis
                    dataKey="m"
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={6}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, "MRR"]}
                    contentStyle={{
                      backgroundColor: "#0B1021",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="v" fill="#7C87F7" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right: Plan mix · live user base */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Plan mix · active users ({totalUsers})
            </h3>

            {/* Segmented Progress Bar */}
            <div className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full bg-[#1A2035] p-0.5">
              <div className="h-full rounded-l-full bg-[#475569]" style={{ width: `${freePct}%` }} />
              <div className="h-full bg-[#6366F1]" style={{ width: `${plusPct}%` }} />
              <div className="h-full rounded-r-full bg-[#D946EF]" style={{ width: `${premiumPct}%` }} />
            </div>

            {/* Breakdown Legend Items */}
            <div className="mt-7 space-y-4 text-xs font-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#64748B]" />
                  <span className="text-slate-300">Free</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-mono text-slate-300">{freeCount}</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="font-mono">{freePct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#6366F1]" />
                  <span className="text-slate-300">Plus</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-mono text-slate-300">{plusCount}</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="font-mono">{plusPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#D946EF]" />
                  <span className="text-slate-300">Premium</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-mono text-slate-300">{premiumCount}</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="font-mono">{premiumPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent subscriptions */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
        <h3 className="text-sm font-semibold tracking-wide text-white pb-3">Recent subscriptions</h3>
        {recentSubs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No subscription events recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentSubs.map((item, idx) => {
              const displayName = item.name || "Unknown User";
              const initials =
                displayName
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U";
              const hue = typeof item.hue === "number" ? item.hue : 240;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => onOpenUser?.(item.userId)}
                  className="group flex flex-wrap items-center justify-between gap-4 py-3.5 px-2 -mx-2 transition hover:bg-white/[0.025] cursor-pointer rounded-xl"
                >
                  <div className="flex items-center gap-3.5 min-w-[200px]">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 45) % 360} 70% 35%))`,
                      }}
                    >
                      {initials}
                    </span>
                    <span className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                      {displayName}
                    </span>
                  </div>

                  <div className="w-24">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        item.plan === "Premium"
                          ? "bg-[#6B21A8]/30 text-[#D8B4FE] ring-1 ring-[#9333EA]/40"
                          : "bg-[#1E1B4B]/60 text-[#A5B4FC] ring-1 ring-[#6366F1]/40"
                      }`}
                    >
                      {item.plan}
                    </span>
                  </div>

                  <div className="w-28 text-xs font-mono text-slate-300">{item.price}</div>
                  <div className="flex-1 text-xs text-slate-400">{item.type}</div>
                  <div className="text-right text-xs font-mono text-slate-400">{item.time}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}