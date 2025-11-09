import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Key,
  Users,
  Activity,
  Database,
  CloudUpload,
  HardDrive,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Download,
  Upload,
  Clock,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  UserCheck,
  UserX,
  Archive,
  RotateCcw,
  Trash2,
  Copy,
  Save,
  Calendar,
  MapPin,
  Wifi,
  WifiOff,
  Plus,
  Edit3,
} from "lucide-react";
import { formatDateTime, formatDate, formatFileSize } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const SecurityCenter = ({ restaurant, currentUser }) => {
  const [userRoles, setUserRoles] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [backups, setBackups] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [gdprRequests, setGdprRequests] = useState([]);
  const [loginSessions, setLoginSessions] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [],
    level: "user",
  });

  const [backupForm, setBackupForm] = useState({
    name: "",
    type: "full",
    schedule: "manual",
    frequency: "daily",
    time: "02:00",
    retention: 30,
    encryption: true,
    compression: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("7d");
  const [actionFilter, setActionFilter] = useState("all");

  const permissionCategories = [
    {
      name: "Dashboard",
      permissions: [
        { id: "dashboard.view", name: "View Dashboard" },
        { id: "dashboard.analytics", name: "View Analytics" },
      ],
    },
    {
      name: "Orders",
      permissions: [
        { id: "orders.view", name: "View Orders" },
        { id: "orders.create", name: "Create Orders" },
        { id: "orders.edit", name: "Edit Orders" },
        { id: "orders.delete", name: "Delete Orders" },
        { id: "orders.refund", name: "Process Refunds" },
      ],
    },
    {
      name: "Menu",
      permissions: [
        { id: "menu.view", name: "View Menu" },
        { id: "menu.edit", name: "Edit Menu" },
        { id: "menu.pricing", name: "Manage Pricing" },
      ],
    },
    {
      name: "Inventory",
      permissions: [
        { id: "inventory.view", name: "View Inventory" },
        { id: "inventory.edit", name: "Edit Inventory" },
        { id: "inventory.purchase", name: "Purchase Orders" },
      ],
    },
    {
      name: "Staff",
      permissions: [
        { id: "staff.view", name: "View Staff" },
        { id: "staff.edit", name: "Manage Staff" },
        { id: "staff.schedule", name: "Manage Schedules" },
        { id: "staff.payroll", name: "Manage Payroll" },
      ],
    },
    {
      name: "Customers",
      permissions: [
        { id: "customers.view", name: "View Customers" },
        { id: "customers.edit", name: "Edit Customers" },
        { id: "customers.export", name: "Export Customer Data" },
      ],
    },
    {
      name: "Reports",
      permissions: [
        { id: "reports.view", name: "View Reports" },
        { id: "reports.generate", name: "Generate Reports" },
        { id: "reports.export", name: "Export Reports" },
      ],
    },
    {
      name: "Settings",
      permissions: [
        { id: "settings.view", name: "View Settings" },
        { id: "settings.edit", name: "Edit Settings" },
        { id: "settings.security", name: "Security Settings" },
        { id: "settings.backup", name: "Backup Settings" },
      ],
    },
  ];

  const userLevels = [
    { value: "user", label: "User", color: "bg-gray-100 text-gray-800" },
    { value: "staff", label: "Staff", color: "bg-blue-100 text-blue-800" },
    {
      value: "manager",
      label: "Manager",
      color: "bg-green-100 text-green-800",
    },
    { value: "admin", label: "Admin", color: "bg-purple-100 text-purple-800" },
    { value: "owner", label: "Owner", color: "bg-orange-100 text-orange-800" },
  ];

  const actionTypes = [
    "login",
    "logout",
    "create",
    "update",
    "delete",
    "view",
    "export",
    "backup",
    "restore",
  ];

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);

      const [
        rolesRes,
        logsRes,
        backupsRes,
        settingsRes,
        auditRes,
        gdprRes,
        sessionsRes,
      ] = await Promise.all([
        fetch("/api/security/roles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/security/activity-logs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/security/backups", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/security/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/security/audit-logs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/security/gdpr-requests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/security/login-sessions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const [
        rolesData,
        logsData,
        backupsData,
        settingsData,
        auditData,
        gdprData,
        sessionsData,
      ] = await Promise.all([
        rolesRes.json(),
        logsRes.json(),
        backupsRes.json(),
        settingsRes.json(),
        auditRes.json(),
        gdprRes.json(),
        sessionsRes.json(),
      ]);

      if (rolesData.success) setUserRoles(rolesData.roles);
      if (logsData.success) setActivityLogs(logsData.logs);
      if (backupsData.success) setBackups(backupsData.backups);
      if (settingsData.success) setSecuritySettings(settingsData.settings);
      if (auditData.success) setAuditLogs(auditData.logs);
      if (gdprData.success) setGdprRequests(gdprData.requests);
      if (sessionsData.success) setLoginSessions(sessionsData.sessions);
    } catch (error) {
      console.error("Error fetching security data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();

    try {
      const url = editingRole
        ? `/api/security/roles/${editingRole.id}`
        : "/api/security/roles";
      const method = editingRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(roleForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSecurityData();
        resetRoleForm();
        alert(`Role ${editingRole ? "updated" : "created"} successfully!`);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to save role");
    }
  };

  const handleCreateBackup = async (e) => {
    e.preventDefault();

    try {
      setBackupLoading(true);

      const response = await fetch("/api/security/backups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(backupForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSecurityData();
        resetBackupForm();
        alert("Backup created successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      alert("Failed to create backup");
    } finally {
      setBackupLoading(false);
    }
  };

  const updateSecuritySettings = async (newSettings) => {
    try {
      const response = await fetch("/api/security/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newSettings),
      });

      const data = await response.json();
      if (data.success) {
        setSecuritySettings(newSettings);
        alert("Security settings updated successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      const response = await fetch(
        `/api/security/sessions/${sessionId}/terminate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchSecurityData();
        alert("Session terminated successfully");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error terminating session:", error);
      alert("Failed to terminate session");
    }
  };

  const restoreBackup = async (backupId) => {
    if (
      !window.confirm(
        "Are you sure you want to restore from this backup? This will overwrite current data."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/security/backups/${backupId}/restore`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Backup restoration initiated. Please wait...");
        // Optionally redirect or refresh
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      alert("Failed to restore backup");
    }
  };

  const resetRoleForm = () => {
    setRoleForm({
      name: "",
      description: "",
      permissions: [],
      level: "user",
    });
    setEditingRole(null);
    setShowRoleModal(false);
  };

  const resetBackupForm = () => {
    setBackupForm({
      name: "",
      type: "full",
      schedule: "manual",
      frequency: "daily",
      time: "02:00",
      retention: 30,
      encryption: true,
      compression: true,
    });
    setShowBackupModal(false);
  };

  const editRole = (role) => {
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      level: role.level,
    });
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const getActionIcon = (action) => {
    const icons = {
      login: UserCheck,
      logout: UserX,
      create: Plus,
      update: Edit3,
      delete: Trash2,
      view: Eye,
      export: Download,
      backup: Database,
      restore: RotateCcw,
    };
    return icons[action] || Activity;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredActivityLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    const logDate = new Date(log.timestamp);
    const now = new Date();
    let matchesDate = true;

    if (dateFilter === "24h") {
      matchesDate = now - logDate <= 24 * 60 * 60 * 1000;
    } else if (dateFilter === "7d") {
      matchesDate = now - logDate <= 7 * 24 * 60 * 60 * 1000;
    } else if (dateFilter === "30d") {
      matchesDate = now - logDate <= 30 * 24 * 60 * 60 * 1000;
    }

    return matchesSearch && matchesAction && matchesDate;
  });

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading security center..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Security & Backup Center
          </h2>
          <p className="text-gray-600">
            Manage user permissions, monitor activities, and secure your data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Key className="w-4 h-4 mr-2" />
            New Role
          </button>
          <button
            onClick={() => setShowBackupModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Database className="w-4 h-4 mr-2" />
            Create Backup
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Security Score
              </p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loginSessions.filter((s) => s.active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Backups</p>
              <p className="text-2xl font-bold text-gray-900">
                {backups.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Today's Activities
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  activityLogs.filter(
                    (log) =>
                      new Date(log.timestamp).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: Shield },
              { id: "roles", label: "User Roles", icon: Key },
              { id: "activity", label: "Activity Logs", icon: Activity },
              { id: "backups", label: "Backups", icon: Database },
              { id: "sessions", label: "Login Sessions", icon: Monitor },
              { id: "settings", label: "Security Settings", icon: Settings },
              { id: "gdpr", label: "GDPR Compliance", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <SecurityDashboard
              securitySettings={securitySettings}
              activityLogs={activityLogs}
              auditLogs={auditLogs}
              loginSessions={loginSessions}
              backups={backups}
            />
          )}

          {activeTab === "roles" && (
            <UserRolesManager
              userRoles={userRoles}
              userLevels={userLevels}
              onEdit={editRole}
              permissionCategories={permissionCategories}
            />
          )}

          {activeTab === "activity" && (
            <ActivityLogsViewer
              activityLogs={filteredActivityLogs}
              getActionIcon={getActionIcon}
              getStatusColor={getStatusColor}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              actionFilter={actionFilter}
              setActionFilter={setActionFilter}
              actionTypes={actionTypes}
            />
          )}

          {activeTab === "backups" && (
            <BackupManager
              backups={backups}
              onRestore={restoreBackup}
              backupLoading={backupLoading}
            />
          )}

          {activeTab === "sessions" && (
            <LoginSessionsManager
              loginSessions={loginSessions}
              onTerminate={terminateSession}
              currentUser={currentUser}
            />
          )}

          {activeTab === "settings" && (
            <SecuritySettings
              securitySettings={securitySettings}
              onUpdate={updateSecuritySettings}
            />
          )}

          {activeTab === "gdpr" && (
            <GDPRCompliance
              gdprRequests={gdprRequests}
              securitySettings={securitySettings}
            />
          )}
        </div>
      </div>

      {/* Role Modal */}
      <FormModal
        isOpen={showRoleModal}
        onClose={resetRoleForm}
        onSubmit={handleCreateRole}
        title={editingRole ? "Edit Role" : "Create New Role"}
        submitText={editingRole ? "Update Role" : "Create Role"}
        size="xl"
      >
        <RoleForm
          roleForm={roleForm}
          setRoleForm={setRoleForm}
          permissionCategories={permissionCategories}
          userLevels={userLevels}
        />
      </FormModal>

      {/* Backup Modal */}
      <FormModal
        isOpen={showBackupModal}
        onClose={resetBackupForm}
        onSubmit={handleCreateBackup}
        title="Create Backup"
        submitText={backupLoading ? "Creating..." : "Create Backup"}
        loading={backupLoading}
        size="lg"
      >
        <BackupForm backupForm={backupForm} setBackupForm={setBackupForm} />
      </FormModal>
    </div>
  );
};

// Security Dashboard Component
const SecurityDashboard = ({
  securitySettings,
  activityLogs,
  auditLogs,
  loginSessions,
  backups,
}) => {
  const recentActivities = activityLogs.slice(0, 5);
  const activeSessions = loginSessions.filter((session) => session.active);
  const recentBackups = backups.slice(0, 3);

  const securityScore = () => {
    let score = 0;
    if (securitySettings.twoFactorEnabled) score += 20;
    if (securitySettings.encryptionEnabled) score += 20;
    if (securitySettings.passwordPolicy?.strongPasswords) score += 15;
    if (securitySettings.sessionTimeout > 0) score += 10;
    if (securitySettings.auditLogging) score += 15;
    if (backups.length > 0) score += 20;
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Security Score</p>
              <p className="text-3xl font-bold">{securityScore()}%</p>
              <p className="text-green-100">
                {securityScore() >= 80
                  ? "Excellent"
                  : securityScore() >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </p>
            </div>
            <Shield className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Threats</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-blue-100">no threats detected</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Last Backup</p>
              <p className="text-3xl font-bold">
                {recentBackups.length > 0
                  ? formatDate(recentBackups[0]?.createdAt)
                  : "None"}
              </p>
              <p className="text-purple-100">automated</p>
            </div>
            <Database className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
          <h3 className="text-lg font-semibold text-yellow-900">
            Security Recommendations
          </h3>
        </div>
        <div className="space-y-2">
          {!securitySettings.twoFactorEnabled && (
            <div className="flex items-center text-yellow-800">
              <XCircle className="w-4 h-4 mr-2" />
              Enable two-factor authentication for all admin accounts
            </div>
          )}
          {!securitySettings.encryptionEnabled && (
            <div className="flex items-center text-yellow-800">
              <XCircle className="w-4 h-4 mr-2" />
              Enable data encryption for sensitive information
            </div>
          )}
          {backups.length === 0 && (
            <div className="flex items-center text-yellow-800">
              <XCircle className="w-4 h-4 mr-2" />
              Set up automated backups to protect your data
            </div>
          )}
          {securitySettings.passwordPolicy?.strongPasswords &&
            securitySettings.twoFactorEnabled &&
            securitySettings.encryptionEnabled &&
            backups.length > 0 && (
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                All security recommendations implemented!
              </div>
            )}
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.user?.name} {activity.action} {activity.resource}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
                <div className="flex items-center">
                  {activity.ipAddress && (
                    <span className="text-xs text-gray-500">
                      {activity.ipAddress}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Sessions
          </h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.device} • {session.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatDateTime(session.lastActivity)}
                  </p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// User Roles Manager Component
const UserRolesManager = ({
  userRoles,
  userLevels,
  onEdit,
  permissionCategories,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          User Roles & Permissions
        </h3>
        <span className="text-sm text-gray-600">
          {userRoles.length} roles configured
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userRoles.map((role) => {
          const levelInfo = userLevels.find(
            (level) => level.value === role.level
          );

          return (
            <div
              key={role.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(role)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo?.color}`}
                  >
                    {levelInfo?.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Permissions:</span>
                  <span className="text-sm font-medium">
                    {role.permissions?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Users:</span>
                  <span className="text-sm font-medium">
                    {role.userCount || 0}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(role.createdAt)}</span>
                  <span>Modified: {formatDate(role.updatedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Activity Logs Viewer Component
const ActivityLogsViewer = ({
  activityLogs,
  getActionIcon,
  getStatusColor,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  actionFilter,
  setActionFilter,
  actionTypes,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All actions</option>
          {actionTypes.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Log Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activityLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action);

              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ActionIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {log.user?.name || "System"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Additional components continue...
// BackupManager, LoginSessionsManager, SecuritySettings, GDPRCompliance, RoleForm, BackupForm

// BackupManager Component
const BackupManager = ({ backups, onRestore, backupLoading }) => {
  const [sortBy, setSortBy] = useState("date");

  const sortedBackups = [...backups].sort((a, b) => {
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "size") return (b.size || 0) - (a.size || 0);
    return a.name.localeCompare(b.name);
  });

  const downloadBackup = async (backupId) => {
    try {
      const response = await fetch(
        `/api/security/backups/${backupId}/download`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${backupId}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Backup Management
        </h3>
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          <span className="text-sm text-gray-600">
            {backups.length} backups
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedBackups.map((backup) => (
          <div
            key={backup.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{backup.name}</h4>
                  <p className="text-sm text-gray-600">{backup.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Type: {backup.type}</span>
                    <span>Size: {formatFileSize(backup.size || 0)}</span>
                    <span>Created: {formatDateTime(backup.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    backup.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : backup.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {backup.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                {backup.encrypted && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Lock className="w-3 h-3 mr-1" />
                    Encrypted
                  </span>
                )}
                {backup.compressed && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Archive className="w-3 h-3 mr-1" />
                    Compressed
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => downloadBackup(backup.id)}
                  className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </button>
                {backup.status === "completed" && (
                  <button
                    onClick={() => onRestore(backup.id)}
                    className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Restore
                  </button>
                )}
                <button className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {backups.length === 0 && (
        <div className="text-center py-12">
          <Database className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No backups available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first backup to secure your data
          </p>
        </div>
      )}
    </div>
  );
};

// LoginSessionsManager Component
const LoginSessionsManager = ({ loginSessions, onTerminate, currentUser }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Active Login Sessions
        </h3>
        <span className="text-sm text-gray-600">
          {loginSessions.filter((s) => s.active).length} active sessions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loginSessions.map((session) => (
          <div
            key={session.id}
            className={`border rounded-lg p-6 ${
              session.id === currentUser?.sessionId
                ? "border-orange-300 bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    session.device?.includes("Mobile")
                      ? "bg-green-100"
                      : "bg-blue-100"
                  }`}
                >
                  {session.device?.includes("Mobile") ? (
                    <Smartphone className="w-6 h-6 text-green-600" />
                  ) : (
                    <Monitor className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {session.user?.name}
                    {session.id === currentUser?.sessionId && (
                      <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                        Current Session
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">{session.user?.email}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {session.location || "Unknown Location"}
                    </span>
                    <span>IP: {session.ipAddress}</span>
                    <span>Device: {session.device || "Unknown"}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    session.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {session.active ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                      Active
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                      Inactive
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <div>Started: {formatDateTime(session.startTime)}</div>
                <div>Last Activity: {formatDateTime(session.lastActivity)}</div>
                {session.expiresAt && (
                  <div>Expires: {formatDateTime(session.expiresAt)}</div>
                )}
              </div>

              {session.active && session.id !== currentUser?.sessionId && (
                <button
                  onClick={() => onTerminate(session.id)}
                  className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <UserX className="w-3 h-3 mr-1" />
                  Terminate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// SecuritySettings Component
const SecuritySettings = ({ securitySettings, onUpdate }) => {
  const [settings, setSettings] = useState(securitySettings);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdate(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Security Configuration
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Authentication</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Two-Factor Authentication
                </span>
                <p className="text-sm text-gray-500">
                  Require 2FA for all admin accounts
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled || false}
                onChange={(e) =>
                  updateSetting("twoFactorEnabled", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Force Strong Passwords
                </span>
                <p className="text-sm text-gray-500">
                  Require complex password requirements
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.passwordPolicy?.strongPasswords || false}
                onChange={(e) =>
                  updateSetting("passwordPolicy", {
                    ...settings.passwordPolicy,
                    strongPasswords: e.target.checked,
                  })
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout || 30}
                onChange={(e) =>
                  updateSetting("sessionTimeout", parseInt(e.target.value))
                }
                min="5"
                max="1440"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Data Protection</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Data Encryption
                </span>
                <p className="text-sm text-gray-500">
                  Encrypt sensitive data at rest
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.encryptionEnabled || false}
                onChange={(e) =>
                  updateSetting("encryptionEnabled", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">Audit Logging</span>
                <p className="text-sm text-gray-500">Log all user activities</p>
              </div>
              <input
                type="checkbox"
                checked={settings.auditLogging || false}
                onChange={(e) =>
                  updateSetting("auditLogging", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Automatic Backups
                </span>
                <p className="text-sm text-gray-500">Daily automated backups</p>
              </div>
              <input
                type="checkbox"
                checked={settings.automaticBackups || false}
                onChange={(e) =>
                  updateSetting("automaticBackups", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Access Control</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts || 5}
                onChange={(e) =>
                  updateSetting("maxLoginAttempts", parseInt(e.target.value))
                }
                min="3"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.lockoutDuration || 15}
                onChange={(e) =>
                  updateSetting("lockoutDuration", parseInt(e.target.value))
                }
                min="5"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">IP Whitelist</span>
                <p className="text-sm text-gray-500">
                  Restrict access to specific IPs
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.ipWhitelistEnabled || false}
                onChange={(e) =>
                  updateSetting("ipWhitelistEnabled", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Monitoring */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Monitoring & Alerts
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">Email Alerts</span>
                <p className="text-sm text-gray-500">
                  Security event notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts || false}
                onChange={(e) => updateSetting("emailAlerts", e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Failed Login Alerts
                </span>
                <p className="text-sm text-gray-500">
                  Alert on suspicious login attempts
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.failedLoginAlerts || false}
                onChange={(e) =>
                  updateSetting("failedLoginAlerts", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Retention (days)
              </label>
              <input
                type="number"
                value={settings.logRetentionDays || 90}
                onChange={(e) =>
                  updateSetting("logRetentionDays", parseInt(e.target.value))
                }
                min="30"
                max="365"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// GDPRCompliance Component
const GDPRCompliance = ({ gdprRequests, securitySettings }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("access");

  const requestTypes = [
    {
      value: "access",
      label: "Data Access Request",
      description: "Request a copy of personal data",
    },
    {
      value: "portability",
      label: "Data Portability",
      description: "Export data in machine-readable format",
    },
    {
      value: "rectification",
      label: "Data Rectification",
      description: "Correct inaccurate personal data",
    },
    {
      value: "erasure",
      label: "Data Erasure",
      description: "Delete personal data (Right to be Forgotten)",
    },
    {
      value: "restriction",
      label: "Restrict Processing",
      description: "Limit how personal data is processed",
    },
  ];

  const processRequest = async (requestId, action) => {
    try {
      const response = await fetch(
        `/api/security/gdpr-requests/${requestId}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        alert(`Request ${action}ed successfully`);
      }
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            GDPR Compliance
          </h3>
          <p className="text-sm text-gray-600">
            Manage data privacy requests and compliance
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Compliance Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              GDPR Compliant
            </h3>
            <p className="text-green-800">
              All required data protection measures are in place
            </p>
          </div>
        </div>
      </div>

      {/* GDPR Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Data Protection Features
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Data Encryption</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  securitySettings.encryptionEnabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {securitySettings.encryptionEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Audit Logging</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  securitySettings.auditLogging
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {securitySettings.auditLogging ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Data Anonymization</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Consent Management</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Implemented
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Request Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {gdprRequests.length}
              </div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {gdprRequests.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {gdprRequests.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (gdprRequests.filter((r) => r.status === "completed").length /
                    Math.max(gdprRequests.length, 1)) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR Requests */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Recent Requests</h4>
        <div className="space-y-3">
          {gdprRequests.slice(0, 10).map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {requestTypes.find((t) => t.value === request.type)?.label ||
                    request.type}
                </div>
                <div className="text-sm text-gray-600">
                  {request.customerEmail} • {formatDateTime(request.createdAt)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {request.status}
                </span>
                {request.status === "pending" && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => processRequest(request.id, "approve")}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => processRequest(request.id, "reject")}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create GDPR Request
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {requestTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Create Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// RoleForm Component
const RoleForm = ({
  roleForm,
  setRoleForm,
  permissionCategories,
  userLevels,
}) => {
  const togglePermission = (permissionId) => {
    const newPermissions = roleForm.permissions.includes(permissionId)
      ? roleForm.permissions.filter((p) => p !== permissionId)
      : [...roleForm.permissions, permissionId];

    setRoleForm({ ...roleForm, permissions: newPermissions });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Name *
          </label>
          <input
            type="text"
            value={roleForm.name}
            onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Manager"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Level
          </label>
          <select
            value={roleForm.level}
            onChange={(e) =>
              setRoleForm({ ...roleForm, level: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {userLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={roleForm.description}
          onChange={(e) =>
            setRoleForm({ ...roleForm, description: e.target.value })
          }
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Describe the role responsibilities..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Permissions ({roleForm.permissions.length} selected)
        </label>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {permissionCategories.map((category) => (
            <div
              key={category.name}
              className="border border-gray-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-gray-900 mb-3">
                {category.name}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {category.permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={roleForm.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="w-4 h-4 text-orange-600 rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// BackupForm Component
const BackupForm = ({ backupForm, setBackupForm }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Backup Name *
        </label>
        <input
          type="text"
          value={backupForm.name}
          onChange={(e) =>
            setBackupForm({ ...backupForm, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Daily Backup - MM/DD/YYYY"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Type
          </label>
          <select
            value={backupForm.type}
            onChange={(e) =>
              setBackupForm({ ...backupForm, type: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="full">Full Backup</option>
            <option value="incremental">Incremental</option>
            <option value="differential">Differential</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule
          </label>
          <select
            value={backupForm.schedule}
            onChange={(e) =>
              setBackupForm({ ...backupForm, schedule: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="manual">Manual (One-time)</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {backupForm.schedule === "scheduled" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={backupForm.frequency}
              onChange={(e) =>
                setBackupForm({ ...backupForm, frequency: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={backupForm.time}
              onChange={(e) =>
                setBackupForm({ ...backupForm, time: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention (days)
            </label>
            <input
              type="number"
              value={backupForm.retention}
              onChange={(e) =>
                setBackupForm({
                  ...backupForm,
                  retention: parseInt(e.target.value),
                })
              }
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Backup Options
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={backupForm.encryption}
              onChange={(e) =>
                setBackupForm({ ...backupForm, encryption: e.target.checked })
              }
              className="w-4 h-4 text-orange-600 rounded mr-3"
            />
            <span className="text-sm text-gray-700">Encrypt backup data</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={backupForm.compression}
              onChange={(e) =>
                setBackupForm({ ...backupForm, compression: e.target.checked })
              }
              className="w-4 h-4 text-orange-600 rounded mr-3"
            />
            <span className="text-sm text-gray-700">Compress backup file</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
