import { UserPlus, Check } from "lucide-react";

interface AdminMember {
  name: string;
  email: string;
  role: string;
  twoFactor: boolean;
  lastSignIn: string;
}

const ADMINS: AdminMember[] = [
  {
    name: "Priya Raman",
    email: "priya@aura.ai",
    role: "Super Admin",
    twoFactor: true,
    lastSignIn: "2 min ago",
  },
  {
    name: "Dana Whitfield",
    email: "dana@aura.ai",
    role: "Trust & Safety",
    twoFactor: true,
    lastSignIn: "18 min ago",
  },
  {
    name: "Marcus Oyelaran",
    email: "marcus@aura.ai",
    role: "Trust & Safety",
    twoFactor: true,
    lastSignIn: "3 h ago",
  },
  {
    name: "Jun Takeda",
    email: "jun@aura.ai",
    role: "Support Agent",
    twoFactor: true,
    lastSignIn: "40 min ago",
  },
  {
    name: "Elise Moreau",
    email: "elise@aura.ai",
    role: "Product Analyst",
    twoFactor: false,
    lastSignIn: "Yesterday",
  },
];

interface MatrixRow {
  permission: string;
  superAdmin: boolean;
  trustSafety: boolean;
  supportAgent: boolean;
  productAnalyst: boolean;
}

const MATRIX_DATA: MatrixRow[] = [
  {
    permission: "View user profiles & activity",
    superAdmin: true,
    trustSafety: true,
    supportAgent: true,
    productAnalyst: true,
  },
  {
    permission: "Suspend / restore accounts",
    superAdmin: true,
    trustSafety: true,
    supportAgent: false,
    productAnalyst: false,
  },
  {
    permission: "Schedule account deletion",
    superAdmin: true,
    trustSafety: false,
    supportAgent: false,
    productAnalyst: false,
  },
  {
    permission: "Reveal conversation excerpts",
    superAdmin: true,
    trustSafety: true,
    supportAgent: false,
    productAnalyst: false,
  },
  {
    permission: "Export user data",
    superAdmin: true,
    trustSafety: false,
    supportAgent: true,
    productAnalyst: false,
  },
  {
    permission: "Resolve safety flags",
    superAdmin: true,
    trustSafety: true,
    supportAgent: false,
    productAnalyst: false,
  },
  {
    permission: "View revenue",
    superAdmin: true,
    trustSafety: false,
    supportAgent: false,
    productAnalyst: true,
  },
  {
    permission: "Manage admins & roles",
    superAdmin: true,
    trustSafety: false,
    supportAgent: false,
    productAnalyst: false,
  },
];

export function TeamRolesPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Administrators Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-white">Administrators</h3>
          <button
            type="button"
            onClick={() => alert("Invite admin modal")}
            className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-[#545CEB] cursor-pointer"
          >
            <UserPlus className="size-3.5" />
            <span>Invite admin</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 pl-6 pr-4">Admin</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">2FA</th>
                <th className="py-3 pl-4 pr-6">Last Sign-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {ADMINS.map((admin) => (
                <tr key={admin.email} className="transition hover:bg-white/[0.02]">
                  <td className="py-4 pl-6 pr-4">
                    <p className="font-semibold text-slate-100">{admin.name}</p>
                    <p className="font-mono text-[11px] text-slate-500">{admin.email}</p>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-200">{admin.role}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-medium ${
                        admin.twoFactor ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {admin.twoFactor ? "Enabled" : "Not set up"}
                    </span>
                  </td>
                  <td className="py-4 pl-4 pr-6 font-mono text-slate-400">
                    {admin.lastSignIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Permission Matrix Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-white">Permission matrix</h3>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 pl-6 pr-4 w-[280px]">Permission</th>
                <th className="px-4 py-3 text-center">Super Admin</th>
                <th className="px-4 py-3 text-center">Trust & Safety</th>
                <th className="px-4 py-3 text-center">Support Agent</th>
                <th className="py-3 pl-4 pr-6 text-center">Product Analyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {MATRIX_DATA.map((row) => (
                <tr key={row.permission} className="transition hover:bg-white/[0.02]">
                  <td className="py-3.5 pl-6 pr-4 font-medium text-slate-200">
                    {row.permission}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {row.superAdmin ? (
                      <Check className="inline-block size-4 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <span className="text-slate-600 font-bold">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {row.trustSafety ? (
                      <Check className="inline-block size-4 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <span className="text-slate-600 font-bold">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {row.supportAgent ? (
                      <Check className="inline-block size-4 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <span className="text-slate-600 font-bold">—</span>
                    )}
                  </td>
                  <td className="py-3.5 pl-4 pr-6 text-center">
                    {row.productAnalyst ? (
                      <Check className="inline-block size-4 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <span className="text-slate-600 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}