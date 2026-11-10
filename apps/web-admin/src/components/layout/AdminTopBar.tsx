import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import type { User, RoleKey } from "../../data";
import { ROLES } from "../../data";

interface AdminTopBarProps {
  title: string;
  subtitle: string;
  activeRole: RoleKey;
  users: User[];
  onOpenUser: (userId: string) => void;
}

export function AdminTopBar({
  title,
  subtitle,
  activeRole,
  users,
  onOpenUser,
}: AdminTopBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = query.trim()
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (userId: string) => {
    onOpenUser(userId);
    setQuery("");
    setIsOpen(false);
  };

  const adminName = activeRole === "super" ? "Priya Raman" : ROLES[activeRole]?.label || "Staff Admin";
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070A17]/80 px-6 backdrop-blur-md">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white font-['Outfit']">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Right Area: Jump to user search + Admin Badge */}
      <div className="flex items-center gap-5">
        {/* Search Bar Container */}
        <div ref={containerRef} className="relative w-72">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Jump to a user..."
              className="w-full rounded-xl border border-white/10 bg-[#0E1328] py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-[#0B1021]"
            />
          </div>

          {/* Search Results Dropdown */}
          {isOpen && query.trim() && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#0B1021] p-2 shadow-2xl backdrop-blur-xl z-50 overflow-hidden divide-y divide-white/[0.04]">
              {results.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  No users found matching "{query}"
                </div>
              ) : (
                results.map((u) => {
                  const userInitials = u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelect(u.id)}
                      className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-xs transition hover:bg-white/[0.04] cursor-pointer group"
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white shadow"
                        style={{
                          background: `linear-gradient(135deg, hsl(${u.hue} 70% 50%), hsl(${(u.hue + 40) % 360} 70% 35%))`,
                        }}
                      >
                        {userInitials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-100 group-hover:text-indigo-300 transition truncate">
                            {u.name}
                          </p>
                          <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-2">
                            {u.id}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-400 truncate">{u.email}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Current Admin Identity */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-xs font-bold text-white shadow-md">
            {initials}
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-white leading-tight">{adminName}</p>
            <p className="text-[10px] text-slate-400">{ROLES[activeRole]?.label}</p>
          </div>
        </div>
      </div>
    </header>
  );
}