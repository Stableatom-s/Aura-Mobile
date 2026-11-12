import { type ReactNode } from "react";
import { AdminSidebar, type ViewKey } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import type { RoleKey, Perm, User } from "../../data";

export type { ViewKey };

interface AdminLayoutProps {
  currentView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  activeRole: RoleKey;
  onRoleChange: (role: RoleKey) => void;
  openFlagsCount?: number;
  can: (perm: Perm) => boolean;
  users: User[];
  onOpenUser: (userId: string) => void;
  currentAdmin?: { name: string; email?: string };
  children: ReactNode;
}

const VIEW_TITLES: Record<ViewKey, [string, string]> = {
  overview: ["Overview", "Health of the Aura community at a glance"],
  users: ["Users", "Everyone who has signed in to the app"],
  live: ["Live activity", "Real-time stream of application interactions"],
  safety: ["Safety queue", "Wellbeing flags that need a human"],
  revenue: ["Revenue", "Platform subscriptions, ARR, and monetization"],
  team: ["Team & roles", "Administrator directory and RBAC permissions"],
  audit: ["Audit log", "A record of every admin action"],
};

export function AdminLayout({
  currentView,
  onNavigate,
  activeRole,
  onRoleChange,
  openFlagsCount = 0,
  can,
  users,
  onOpenUser,
  currentAdmin,
  children,
}: AdminLayoutProps) {
  const [title, subtitle] = VIEW_TITLES[currentView] ?? ["Console", "Aura Administration"];

  return (
    <div className="min-h-screen bg-[#070A17] text-slate-100 font-sans selection:bg-indigo-500/30">
      <AdminSidebar
        currentView={currentView}
        onNavigate={onNavigate}
        activeRole={activeRole}
        onRoleChange={onRoleChange}
        openFlagsCount={openFlagsCount}
        can={can}
      />

      <div className="pl-[230px] min-h-screen flex flex-col">
        <AdminTopBar
          title={title}
          subtitle={subtitle}
          activeRole={activeRole}
          users={users}
          onOpenUser={onOpenUser}
          currentAdmin={currentAdmin}
        />

        <main className="flex-1 px-6 py-6 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}