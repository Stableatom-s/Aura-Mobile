import { ArrowUp, ArrowDown } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { MRR, USERS, type User } from "../data";

interface BillingPageProps {
  onOpenUser?: (userId: string) => void;
}

const RECENT_SUBSCRIPTIONS = [
  {
    userId: "usr_8204",
    name: "Aiko Sato",
    plan: "Premium",
    price: "$14.99 / mo",
    type: "New · Google Play",
    time: "40 min ago",
    hue: 280,
  },
  {
    userId: "usr_8205",
    name: "Mateo Singh",
    plan: "Premium",
    price: "$14.99 / mo",
    type: "New · Google Play",
    time: "5 h ago",
    hue: 230,
  },
  {
    userId: "usr_8201",
    name: "Omar Larsen",
    plan: "Plus",
    price: "$7.99 / mo",
    type: "Renewed · Google Play",
    time: "8 h ago",
    hue: 300,
  },
  {
    userId: "usr_8210",
    name: "Kwame Brooks",
    plan: "Premium",
    price: "$14.99 / mo",
    type: "New · Google Play",
    time: "12 h ago",
    hue: 190,
  },
  {
    userId: "usr_8211",
    name: "Isla Chen",
    plan: "Plus",
    price: "$7.99 / mo",
    type: "New · Google Play",
    time: "16 h ago",
    hue: 145,
  },
];

export function BillingPage({ onOpenUser }: BillingPageProps) {
  // Format Y-axis labels like $0k, $10k, $20k, $30k, $40k
  const formatYAxis = (val: number) => `$${Math.round(val / 1000)}k`;

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* MRR */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">MRR</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">$39,600</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 10.3%
            </span>
            <span className="text-slate-500 font-normal">vs Sep</span>
          </div>
        </div>

        {/* Paying Users */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Paying Users</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">9,884</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 6.1%
            </span>
            <span className="text-slate-500 font-normal">20.5% of base</span>
          </div>
        </div>

        {/* ARPU */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">ARPU</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">$4.01</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex items-center gap-0.5">
              <ArrowUp className="size-3.5 stroke-[2.5]" /> 1.2%
            </span>
            <span className="text-slate-500 font-normal">paying</span>
          </div>
        </div>

        {/* Churn */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-5 shadow-lg shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Churn</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white font-['Outfit']">2.4%</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
            <span className="flex items-center gap-0.5">
              <ArrowDown className="size-3.5 stroke-[2.5]" /> 0.3pt
            </span>
            <span className="text-slate-500 font-normal">monthly</span>
          </div>
        </div>
      </div>

      {/* Middle Row: MRR Bar Chart + Cohort Plan Mix */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.85fr_1.15fr]">
        {/* Left: Monthly Recurring Revenue */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <h3 className="text-sm font-semibold tracking-wide text-white pb-2">Monthly recurring revenue</h3>
          <div className="h-[280px] w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MRR} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                  ticks={[0, 10000, 20000, 30000, 40000]}
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
        </div>

        {/* Right: Plan mix · sample cohort */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">Plan mix · sample cohort</h3>

            {/* Segmented Progress Bar */}
            <div className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full bg-[#1A2035] p-0.5">
              <div className="h-full rounded-l-full bg-[#475569]" style={{ width: "60%" }} />
              <div className="h-full bg-[#6366F1]" style={{ width: "23%" }} />
              <div className="h-full rounded-r-full bg-[#D946EF]" style={{ width: "17%" }} />
            </div>

            {/* Breakdown Legend Items */}
            <div className="mt-7 space-y-4 text-xs font-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#64748B]" />
                  <span className="text-slate-300">Free</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-mono text-slate-300">24</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="font-mono">60%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#6366F1]" />
                  <span className="text-slate-300">Plus</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-mono text-slate-300">9</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="font-mono">23%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-[#D946EF]" />
                  <span className="text-slate-300">Premium</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-mono text-slate-300">7</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="font-mono">18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent subscriptions */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] p-6 shadow-xl">
        <h3 className="text-sm font-semibold tracking-wide text-white pb-3">Recent subscriptions</h3>
        <div className="divide-y divide-white/[0.04]">
          {RECENT_SUBSCRIPTIONS.map((item, idx) => {
            const initials = item.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={idx}
                onClick={() => onOpenUser?.(item.userId)}
                className="group flex flex-wrap items-center justify-between gap-4 py-3.5 px-2 -mx-2 transition hover:bg-white/[0.025] cursor-pointer rounded-xl"
              >
                {/* Left: Avatar & Name */}
                <div className="flex items-center gap-3.5 min-w-[200px]">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, hsl(${item.hue} 70% 55%), hsl(${(item.hue + 45) % 360} 70% 35%))`,
                    }}
                  >
                    {initials}
                  </span>
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                    {item.name}
                  </span>
                </div>

                {/* Plan Badge */}
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

                {/* Price */}
                <div className="w-28 text-xs font-mono text-slate-300">
                  {item.price}
                </div>

                {/* Attribution Channel */}
                <div className="flex-1 text-xs text-slate-400">
                  {item.type}
                </div>

                {/* Timestamp */}
                <div className="text-right text-xs font-mono text-slate-400">
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}