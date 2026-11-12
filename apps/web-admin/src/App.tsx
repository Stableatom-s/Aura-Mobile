import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { AdminLayout } from "./components/layout/AdminLayout";
import type { ViewKey } from "./components/layout/AdminSidebar";
import { DashboardPage, type DashboardStats } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { SafetyPage } from "./pages/SafetyPage";
import { BillingPage, type BillingMetrics } from "./pages/BillingPage";
import { TeamRolesPage, type AdminMember } from "./pages/TeamRolesPage";
import { AuditLogsPage, type AuditEntry } from "./pages/AuditLogsPage";
import { LiveActivityPage, type LiveEvent, type LiveMetrics } from "./pages/LiveActivityPage";
import { AdminLoginPage } from "./pages/LoginPage";
import { UserDrawer } from "./components/users/UserDrawer";
import { ROLES, type RoleKey, type Perm, type User, type Flag } from "./data";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";
const SESSION_KEY = "aura_admin_session";

interface AdminSession {
  name: string;
  email: string;
  role: RoleKey;
}

export default function App() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? (JSON.parse(saved) as AdminSession) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<ViewKey>("overview");
  const [role, setRole] = useState<RoleKey>(() => adminSession?.role || "super");

  // Live MongoDB Atlas state
  const [users, setUsers] = useState<User[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | undefined>(undefined);
  const [billing, setBilling] = useState<BillingMetrics | undefined>(undefined);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleLoginSuccess = (session: AdminSession) => {
    setAdminSession(session);
    setRole(session.role);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore storage errors
    }
  };

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

  const fetchAdminData = useCallback(async () => {
    if (!adminSession) return;
    try {
      const res = await fetch(`${API_BASE}/admin/bootstrap`);
      const data = await res.json();
      if (data?.success) {
        setUsers(data.users || []);
        setFlags(data.flags || []);
        setAdmins(data.admins || []);
        setAuditLogs(data.logs || []);
        setLiveEvents(data.liveEvents || []);
        setStats(data.stats);
        setBilling(data.billing);
        setLiveMetrics(data.liveMetrics);
      }
    } catch (err) {
      console.error("Failed to fetch admin console data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [adminSession]);

  useEffect(() => {
    if (!adminSession) return;
    fetchAdminData();
    const pollInterval = setInterval(fetchAdminData, 15000);
    return () => clearInterval(pollInterval);
  }, [adminSession, fetchAdminData]);

  // Show LoginPage until authenticated
  if (!adminSession) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

  const handlePatchUser = async (id: string, patch: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    try {
      await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patch,
          adminName: adminSession.name,
          adminRole: ROLES[role]?.label,
        }),
      });
      fetchAdminData();
    } catch (err) {
      console.error("Failed to persist user patch:", err);
    }
  };

  const handleClaimFlag = async (flagId: string) => {
    const assigneeLabel = adminSession.name || ROLES[role].label;
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId ? { ...f, status: "Reviewing", assignee: assigneeLabel } : f
      )
    );
    try {
      await fetch(`${API_BASE}/admin/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Reviewing",
          assignee: assigneeLabel,
          adminRole: ROLES[role]?.label,
        }),
      });
      fetchAdminData();
    } catch (err) {
      console.error("Failed to claim flag:", err);
    }
  };

  const handleResolveFlag = async (flagId: string) => {
    const assigneeLabel = adminSession.name || ROLES[role].label;
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? { ...f, status: "Resolved", assignee: f.assignee || assigneeLabel }
          : f
      )
    );
    try {
      await fetch(`${API_BASE}/admin/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Resolved",
          assignee: assigneeLabel,
          adminRole: ROLES[role]?.label,
        }),
      });
      fetchAdminData();
    } catch (err) {
      console.error("Failed to resolve flag:", err);
    }
  };

  const handleInviteAdmin = async (payload: { name: string; email: string; role: string }) => {
    const res = await fetch(`${API_BASE}/admin/team/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.success && data.admin) {
      setAdmins((prev) => [data.admin, ...prev]);
      fetchAdminData();
    }
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
      currentAdmin={{ name: adminSession.name, email: adminSession.email }}
    >
      {currentView === "overview" && (
        <DashboardPage
          users={users}
          flags={flags}
          stats={stats}
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
        <BillingPage
          users={users}
          billing={billing}
          onOpenUser={(id) => setSelectedUserId(id)}
        />
      )}

      {currentView === "team" && can("team") && (
        <TeamRolesPage
          admins={admins}
          onInviteAdmin={handleInviteAdmin}
        />
      )}

      {currentView === "audit" && (
        <AuditLogsPage
          logs={auditLogs}
          isLoading={isLoading}
          onOpenUser={(id) => setSelectedUserId(id)}
        />
      )}

      {currentView === "live" && (
        <LiveActivityPage
          events={liveEvents}
          metrics={liveMetrics}
          onOpenUser={(id) => setSelectedUserId(id)}
        />
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