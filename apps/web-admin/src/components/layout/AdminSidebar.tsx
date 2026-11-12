import {
  LayoutDashboard,
  Users,
  Radio,
  ShieldAlert,
  CircleDollarSign,
  KeyRound,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { ROLES, type RoleKey, type Perm } from "../../data";

export type ViewKey = "overview" | "users" | "live" | "safety" | "revenue" | "team" | "audit";

interface AdminSidebarProps {
  currentView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  activeRole: RoleKey;
  onRoleChange: (role: RoleKey) => void;
  openFlagsCount?: number;
  can: (perm: Perm) => boolean;
}

export function AdminSidebar({
  currentView,
  onNavigate,
  activeRole,
  onRoleChange,
  openFlagsCount = 0,
  can,
}: AdminSidebarProps) {
  const allNavItems: {
    key: ViewKey;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
    perm?: Perm;
  }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "live", label: "Live activity", icon: Radio },
    { key: "safety", label: "Safety queue", icon: ShieldAlert, badge: openFlagsCount },
    { key: "revenue", label: "Revenue", icon: CircleDollarSign, perm: "revenue" },
    { key: "team", label: "Team & roles", icon: KeyRound, perm: "team" },
    { key: "audit", label: "Audit log", icon: ScrollText },
  ];

  // Completely filter out items the active role cannot access
  const visibleNavItems = allNavItems.filter(
    (item) => !item.perm || can(item.perm)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[230px] flex-col border-r border-white/[0.06] bg-[#0A0E21] p-3.5">
      {/* Brand header */}
      <div className="mb-6 flex items-center gap-2.5 px-2 pt-1">
        <div className="grid size-8 place-items-center rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <Sparkles className="size-4 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight text-white font-['Outfit']">Aura</h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Console</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="space-y-1">
        {visibleNavItems.map((item) => {
          const active = currentView === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition cursor-pointer ${
                active
                  ? "bg-[#161D3B] text-white shadow-sm ring-1 ring-white/10"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`size-4 ${
                    active ? "text-[#818CF8]" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && item.badge > 0 ? (
                <span className="grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom Role selector */}
      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Viewing as</p>
        <div className="relative mt-1.5">
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as RoleKey)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-[#0C1126] px-3 py-2 text-xs font-medium text-slate-200 outline-none hover:border-indigo-400/40 focus:border-indigo-400 cursor-pointer"
          >
            {(Object.keys(ROLES) as RoleKey[]).map((r) => (
              <option key={r} value={r}>
                {ROLES[r].label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>
    </aside>
  );
}