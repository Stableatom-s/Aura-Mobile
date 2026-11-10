import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { AdminLayout } from "./components/layout/AdminLayout";
import type { ViewKey } from "./components/layout/AdminSidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { SafetyPage } from "./pages/SafetyPage";
import { BillingPage } from "./pages/BillingPage";
import { TeamRolesPage } from "./pages/TeamRolesPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { LiveActivityPage } from "./pages/LiveActivityPage";
import { UserDrawer } from "./components/users/UserDrawer";
import { USERS, FLAGS, ROLES, type RoleKey, type Perm, type User, type Flag } from "./data";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewKey>("overview");
  const [role, setRole] = useState<RoleKey>("super");
  const [users, setUsers] = useState<User[]>(USERS);
  const [flags, setFlags] = useState<Flag[]>(FLAGS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const can = (perm: Perm) => ROLES[role]?.perms.includes(perm);

  const VIEW_PERMISSIONS: Partial<Record<ViewKey, Perm>> = {
    revenue: "revenue",
    team: "team",
  };

  // Immediate redirect if current page is unauthorized for the selected role
  useEffect(() => {
    const requiredPerm = VIEW_PERMISSIONS[currentView];
    if (requiredPerm && !can(requiredPerm)) {
      setCurrentView("overview");
    }
  }, [role, currentView]);

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

  const handlePatchUser = (id: string, patch: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const handleClaimFlag = (flagId: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId ? { ...f, status: "Reviewing", assignee: ROLES[role].label } : f
      )
    );
  };

  const handleResolveFlag = (flagId: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId ? { ...f, status: "Resolved", assignee: f.assignee || ROLES[role].label } : f
      )
    );
  };

  const openFlagsCount = flags.filter((f) => f.status !== "Resolved").length;

  return (
    <AdminLayout
      currentView={currentView}
      onNavigate={setCurrentView}
      activeRole={role}
      onRoleChange={setRole}
      openFlagsCount={openFlagsCount}
      can={can}
      users={users}
      onOpenUser={(id) => setSelectedUserId(id)}
    >
      {currentView === "overview" && (
        <DashboardPage
          users={users}
          onNavigateToUsers={() => setCurrentView("users")}
          onOpenUser={(id) => setSelectedUserId(id)}
        />
      )}

      {currentView === "users" && (
        <UsersPage
          users={users}
          onOpenUser={(id) => setSelectedUserId(id)}
        />
      )}

      {currentView === "safety" && (
        <SafetyPage
          flags={flags}
          users={users}
          onOpenUser={(id) => setSelectedUserId(id)}
          onClaimFlag={handleClaimFlag}
          onResolveFlag={handleResolveFlag}
        />
      )}

      {currentView === "revenue" && can("revenue") && (
        <BillingPage onOpenUser={(id) => setSelectedUserId(id)} />
      )}

      {currentView === "team" && can("team") && <TeamRolesPage />}

      {currentView === "audit" && (
        <AuditLogsPage onOpenUser={(id) => setSelectedUserId(id)} />
      )}

      {currentView === "live" && (
        <LiveActivityPage onOpenUser={(id) => setSelectedUserId(id)} />
      )}

      {/* Slide-over User Inspection Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <UserDrawer
            user={selectedUser}
            onClose={() => setSelectedUserId(null)}
            onPatchUser={handlePatchUser}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}