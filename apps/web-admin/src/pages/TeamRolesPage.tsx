import { useState } from "react";
import { UserPlus, Check, X } from "lucide-react";

export interface AdminMember {
  id?: string;
  name: string;
  email: string;
  role: string;
  twoFactor: boolean;
  lastSignIn: string;
}

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

interface TeamRolesPageProps {
  admins?: AdminMember[];
  onInviteAdmin?: (payload: { name: string; email: string; role: string }) => Promise<void> | void;
}

export function TeamRolesPage({
  admins = [],
  onInviteAdmin,
}: TeamRolesPageProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Trust & Safety");
  const [submitting, setSubmitting] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onInviteAdmin?.({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteName("");
      setInviteEmail("");
      setInviteOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Administrators Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-white">Administrators</h3>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-[#545CEB] cursor-pointer"
          >
            <UserPlus className="size-3.5" />
            <span>Invite admin</span>
          </button>
        </div>

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
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    No administrators registered in database yet.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
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
                      {admin.lastSignIn || "Never"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Permission Matrix Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] shadow-xl overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-sm font-semibold tracking-wide text-white">Permission matrix</h3>
        </div>

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

      {/* Invite Admin Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleInviteSubmit}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1326] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Invite Administrator</h4>
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Enter administrator name"
                className="w-full rounded-xl border border-white/10 bg-[#080C1B] px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="w-full rounded-xl border border-white/10 bg-[#080C1B] px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080C1B] px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-indigo-400"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Trust & Safety">Trust & Safety</option>
                <option value="Support Agent">Support Agent</option>
                <option value="Product Analyst">Product Analyst</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.04] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#545CEB] cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}