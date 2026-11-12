import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export interface AuditEntry {
  id: string;
  when: string;
  adminName: string;
  adminRole: string;
  action: string;
  target: string;
  detail: string;
}

interface AuditLogsPageProps {
  logs?: AuditEntry[];
  isLoading?: boolean;
  onOpenUser?: (userId: string) => void;
}

export function AuditLogsPage({
  logs = [],
  isLoading = false,
  onOpenUser,
}: AuditLogsPageProps) {
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs;

    return logs.filter(
      (entry) =>
        (entry.adminName || "").toLowerCase().includes(q) ||
        (entry.action || "").toLowerCase().includes(q) ||
        (entry.target || "").toLowerCase().includes(q) ||
        (entry.detail || "").toLowerCase().includes(q)
    );
  }, [logs, search]);

  return (
    <div className="space-y-4 pb-12">
      {/* Outer Card Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E1326] shadow-xl overflow-hidden">
        {/* Top Search Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/[0.06]">
          <div className="relative min-w-[280px] max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by admin, action or target"
              className="w-full rounded-xl border border-white/10 bg-[#080C1B] py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-400/60"
            />
          </div>

          <div className="text-xs font-mono text-slate-400 pr-2">
            <span>{filteredLogs.length} entries · immutable</span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 pl-6 pr-4 w-[130px]">WHEN</th>
                <th className="px-4 py-3 w-[180px]">ADMIN</th>
                <th className="px-4 py-3 w-[200px]">ACTION</th>
                <th className="px-4 py-3 w-[180px]">TARGET</th>
                <th className="py-3 pl-4 pr-6">DETAIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Loading audit logs from database...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    {search.trim()
                      ? `No audit logs matching "${search}"`
                      : "No administrative audit entries recorded yet."}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isUserTarget =
                    log.target.startsWith("usr_") || /^[a-f0-9]{24}$/i.test(log.target);

                  return (
                    <tr key={log.id} className="transition hover:bg-white/[0.02]">
                      <td className="py-4 pl-6 pr-4 font-mono text-slate-400 whitespace-nowrap">
                        {log.when}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-100">{log.adminName}</p>
                        <p className="text-[11px] text-slate-500">{log.adminRole}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-100">
                        {log.action}
                      </td>
                      <td className="px-4 py-4">
                        {isUserTarget ? (
                          <button
                            type="button"
                            onClick={() => onOpenUser?.(log.target)}
                            className="font-mono text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                          >
                            {log.target}
                          </button>
                        ) : (
                          <span className="font-mono text-slate-200">{log.target}</span>
                        )}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-slate-400">{log.detail}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}