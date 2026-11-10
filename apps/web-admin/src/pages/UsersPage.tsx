import { useState, useMemo } from "react";
import { Search, Download, ArrowUp, ArrowDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import { ago, type User, type Plan, type Status } from "../data";

interface UsersPageProps {
  users: User[];
  onOpenUser: (userId: string) => void;
}

export function UsersPage({ users, onOpenUser }: UsersPageProps) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [signinFilter, setSigninFilter] = useState("All");

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchesPlan = planFilter === "All" || u.plan === planFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      const matchesSignin = signinFilter === "All" || u.provider === signinFilter;

      return matchesSearch && matchesPlan && matchesStatus && matchesSignin;
    });
  }, [users, search, planFilter, statusFilter, signinFilter]);

  const handleExportCSV = () => {
    const headers = "User ID,Name,Email,Plan,Sign-in,Status,Sessions,Joined,Last Active Min,Risk";
    const rows = filteredUsers.map((u) =>
      `"${u.id}","${u.name}","${u.email}","${u.plan}","${u.provider}","${u.status}",${u.sessions},"${u.joinedDays}d ago",${u.lastMin},"${u.risk}"`
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aura_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Outer Card Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] shadow-xl overflow-hidden">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/[0.06]">
          {/* Search Input */}
          <div className="relative min-w-[280px] max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or user ID"
              className="w-full rounded-xl border border-white/10 bg-[#080C1B] py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-400/60"
            />
          </div>

          {/* Filter Dropdowns and Export Button */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Plan Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Plan</span>
              <div className="relative">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-white/10 bg-[#080C1B] py-2 pl-3.5 pr-8 font-medium text-slate-200 outline-none hover:border-indigo-400/40 focus:border-indigo-400 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Free">Free</option>
                  <option value="Plus">Plus</option>
                  <option value="Premium">Premium</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Status</span>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-white/10 bg-[#080C1B] py-2 pl-3.5 pr-8 font-medium text-slate-200 outline-none hover:border-indigo-400/40 focus:border-indigo-400 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending deletion">Pending deletion</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Sign-in Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sign-in</span>
              <div className="relative">
                <select
                  value={signinFilter}
                  onChange={(e) => setSigninFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-white/10 bg-[#080C1B] py-2 pl-3.5 pr-8 font-medium text-slate-200 outline-none hover:border-indigo-400/40 focus:border-indigo-400 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Google">Google</option>
                  <option value="Apple">Apple</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#080C1B] px-3.5 py-2 font-medium text-slate-200 transition hover:bg-white/[0.05] hover:text-white cursor-pointer"
            >
              <Download className="size-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs">
            <thead className="border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 pl-6 pr-4">User</th>
                <th className="px-4 py-3">PLAN</th>
                <th className="px-4 py-3">SIGN-IN</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">MOOD 14D</th>
                <th className="px-4 py-3 text-right">Sessions</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    Last active <ArrowUp className="size-3" />
                  </span>
                </th>
                <th className="py-3 pl-4 pr-6">RISK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);

                return (
                  <tr
                    key={u.id}
                    onClick={() => onOpenUser(u.id)}
                    className="group cursor-pointer transition hover:bg-white/[0.035]"
                  >
                    {/* User Identity Column */}
                    <td className="py-3.5 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, hsl(${u.hue} 70% 50%), hsl(${(u.hue + 45) % 360} 70% 35%))`,
                          }}
                        >
                          {initials}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                            {u.name}
                          </p>
                          <p className="font-mono text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          u.plan === "Premium"
                            ? "bg-[#6B21A8]/30 text-[#D8B4FE] ring-1 ring-[#9333EA]/40"
                            : u.plan === "Plus"
                            ? "bg-[#1E1B4B]/60 text-[#A5B4FC] ring-1 ring-[#6366F1]/40"
                            : "bg-white/[0.04] text-slate-400 ring-1 ring-white/10"
                        }`}
                      >
                        {u.plan}
                      </span>
                    </td>

                    {/* Sign-in Method */}
                    <td className="px-4 py-3.5 font-medium text-slate-300">{u.provider}</td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          u.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                            : u.status === "Suspended"
                            ? "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                            : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* 14d Mood Sparkline Curve */}
                    <td className="px-4 py-3.5">
                      <div className="h-6 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={u.mood.map((v) => ({ v }))}>
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke="#818CF8"
                              strokeWidth={1.8}
                              dot={false}
                              isAnimationActive={false}
                            />
                            <YAxis hide domain={[1, 5]} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>

                    {/* Sessions */}
                    <td className="px-4 py-3.5 text-right font-mono text-slate-300">
                      {u.sessions}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3.5 font-mono text-slate-400">{u.joinedDays}d ago</td>

                    {/* Last Active */}
                    <td className="px-4 py-3.5 font-mono text-slate-400">{ago(u.lastMin)}</td>

                    {/* Risk Badge */}
                    <td className="py-3.5 pl-4 pr-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          u.risk === "High"
                            ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
                            : u.risk === "Watch"
                            ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                            : "bg-white/[0.04] text-slate-400 ring-1 ring-white/10"
                        }`}
                      >
                        {u.risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}