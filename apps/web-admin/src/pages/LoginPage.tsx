import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { RoleKey } from "../data";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

interface AdminLoginPageProps {
  onLoginSuccess: (session: {
    name: string;
    email: string;
    role: RoleKey;
  }) => void;
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = twoFactorCode.trim();

    if (!trimmedEmail || trimmedCode.length !== 6) {
      setError("Enter your work email and a valid 6-digit 2FA code.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          code: trimmedCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.message || "Invalid credentials or unauthorized admin email.");
        return;
      }

      onLoginSuccess({
        name: data.admin.name,
        email: data.admin.email,
        role: data.admin.roleKey,
      });
    } catch (err) {
      setError("Unable to reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A17] px-4 text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[440px] rounded-3xl border border-white/[0.08] bg-[#0D1123]/95 p-8 shadow-2xl space-y-6"
      >
        {/* Work Email */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            WORK EMAIL
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-[#080C1B] px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
          />
        </div>

        {/* 2FA Code */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            2FA CODE
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            className="w-full rounded-xl border border-white/10 bg-[#080C1B] px-4 py-3 font-mono text-sm tracking-widest text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign in to console"}
        </button>

        {/* Audit Notice */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
          <ShieldCheck className="size-4 text-slate-500" />
          <span>Every action you take is written to the audit log.</span>
        </div>
      </form>
    </div>
  );
}