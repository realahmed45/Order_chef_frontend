import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Settings,
  Send,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Check,
  X,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Volume2,
  VolumeX,
  Filter,
  Search,
  Download,
  Upload,
} from "lucide-react";
import { formatDateTime, formatDate } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const NotificationCenter = ({ restaurant, currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    template: null,
  });

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [templateForm, setTemplateForm] = useState({
    name: "",
    type: "email",
    subject: "",
    content: "",
    channels: ["email"],
    variables: [],
    trigger: "manual",
    conditions: {},
  });

  const [sendForm, setSendForm] = useState({
    templateId: "",
    recipients: [],
    scheduledTime: "",
    variables: {},
    channels: ["email"],
  });

  const notificationTypes = [
    { value: "order", label: "Order Updates", icon: Bell },
    { value: "payment", label: "Payment", icon: CheckCircle },
    { value: "inventory", label: "Inventory", icon: AlertTriangle },
    { value: "staff", label: "Staff", icon: Users },
    { value: "marketing", label: "Marketing", icon: Mail },
    { value: "system", label: "System", icon: Settings },
  ];

  const channels = [
    { id: "email", label: "Email", icon: Mail, color: "blue" },
    { id: "sms", label: "SMS", icon: MessageSquare, color: "green" },
    { id: "push", label: "Push", icon: Bell, color: "purple" },
    { id: "whatsapp", label: "WhatsApp", icon: Smartphone, color: "emerald" },
  ];

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const fetchNotificationData = async () => {
    try {
      setLoading(true);

      const [notificationsRes, templatesRes, preferencesRes] =
        await Promise.all([
          fetch("/api/notifications", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/notifications/templates", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/notifications/preferences", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      const [notificationsData, templatesData, preferencesData] =
        await Promise.all([
          notificationsRes.json(),
          templatesRes.json(),
          preferencesRes.json(),
        ]);

      if (notificationsData.success)
        setNotifications(notificationsData.notifications);
      if (templatesData.success) setTemplates(templatesData.templates);
      if (preferencesData.success) setPreferences(preferencesData.preferences);
    } catch (error) {
      console.error("Error fetching notification data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();

    try {
      const url = editingTemplate
        ? `/api/notifications/templates/${editingTemplate.id}`
        : "/api/notifications/templates";
      const method = editingTemplate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(templateForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchNotificationData();
        resetTemplateForm();
        alert(
          `Template ${editingTemplate ? "updated" : "created"} successfully!`
        );
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(sendForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchNotificationData();
        setSendForm({
          templateId: "",
          recipients: [],
          scheduledTime: "",
          variables: {},
          channels: ["email"],
        });
        setShowSendModal(false);
        alert("Notification sent successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      const response = await fetch(
        `/api/notifications/templates/${deleteModal.template.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchNotificationData();
        setDeleteModal({ show: false, template: null });
        alert("Template deleted successfully");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPreferences),
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(newPreferences);
        alert("Preferences updated successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: "",
      type: "email",
      subject: "",
      content: "",
      channels: ["email"],
      variables: [],
      trigger: "manual",
      conditions: {},
    });
    setEditingTemplate(null);
    setShowTemplateModal(false);
  };

  const editTemplate = (template) => {
    setTemplateForm({
      name: template.name,
      type: template.type,
      subject: template.subject,
      content: template.content,
      channels: template.channels,
      variables: template.variables,
      trigger: template.trigger,
      conditions: template.conditions,
    });
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      order: Bell,
      payment: CheckCircle,
      inventory: AlertTriangle,
      staff: Users,
      marketing: Mail,
      system: Settings,
    };
    return iconMap[type] || Bell;
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      scheduled: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesStatus =
      filterStatus === "all" || notification.status === filterStatus;
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Notification Center
          </h2>
          <p className="text-gray-600">
            Manage all your restaurant communications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "delivered").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "delivered").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Templates</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length}
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
              { id: "dashboard", label: "Dashboard", icon: Bell },
              {
                id: "notifications",
                label: "Notifications",
                icon: MessageSquare,
              },
              { id: "templates", label: "Templates", icon: Mail },
              { id: "preferences", label: "Preferences", icon: Settings },
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
            <NotificationDashboard
              notifications={notifications}
              templates={templates}
              channels={channels}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              getNotificationIcon={getNotificationIcon}
              getStatusColor={getStatusColor}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterType={filterType}
              setFilterType={setFilterType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              notificationTypes={notificationTypes}
            />
          )}

          {activeTab === "templates" && (
            <TemplatesManager
              templates={templates}
              onEdit={editTemplate}
              onDelete={(template) => setDeleteModal({ show: true, template })}
              channels={channels}
            />
          )}

          {activeTab === "preferences" && (
            <NotificationPreferences
              preferences={preferences}
              onUpdate={updatePreferences}
              channels={channels}
              notificationTypes={notificationTypes}
            />
          )}
        </div>
      </div>

      {/* Template Modal */}
      <FormModal
        isOpen={showTemplateModal}
        onClose={resetTemplateForm}
        onSubmit={handleCreateTemplate}
        title={editingTemplate ? "Edit Template" : "Create New Template"}
        submitText={editingTemplate ? "Update Template" : "Create Template"}
        size="xl"
      >
        <TemplateForm
          templateForm={templateForm}
          setTemplateForm={setTemplateForm}
          channels={channels}
          notificationTypes={notificationTypes}
        />
      </FormModal>

      {/* Send Notification Modal */}
      <FormModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSubmit={handleSendNotification}
        title="Send Notification"
        submitText="Send Now"
        size="lg"
      >
        <SendNotificationForm
          sendForm={sendForm}
          setSendForm={setSendForm}
          templates={templates}
          channels={channels}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, template: null })}
        onConfirm={handleDeleteTemplate}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteModal.template?.name}"? This action cannot be undone.`}
        confirmText="Delete Template"
        variant="danger"
      />
    </div>
  );
};

// Notification Dashboard Component
const NotificationDashboard = ({ notifications, templates, channels }) => {
  const recentNotifications = notifications.slice(0, 5);
  const channelStats = channels.map((channel) => ({
    ...channel,
    count: notifications.filter((n) => n.channels.includes(channel.id)).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Notifications
          </h3>
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.read ? "bg-gray-100" : "bg-orange-100"
                  }`}
                >
                  <Bell
                    className={`w-4 h-4 ${
                      notification.read ? "text-gray-600" : "text-orange-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : notification.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {notification.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Channel Performance
          </h3>
          <div className="space-y-4">
            {channelStats.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 bg-${channel.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <channel.icon
                      className={`w-4 h-4 text-${channel.color}-600`}
                    />
                  </div>
                  <span className="font-medium text-gray-900">
                    {channel.label}
                  </span>
                </div>
                <span className="font-semibold">{channel.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50">
            <Plus className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-700">Create Template</span>
          </button>

          <button className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50">
            <Send className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-700">Send Notification</span>
          </button>

          <button className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50">
            <Settings className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-700">Manage Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Notifications List Component
const NotificationsList = ({
  notifications,
  onMarkAsRead,
  getNotificationIcon,
  getStatusColor,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery,
  notificationTypes,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Types</option>
          {notificationTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const IconComponent = getNotificationIcon(notification.type);

          return (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${
                notification.read
                  ? "bg-white"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.read ? "bg-gray-100" : "bg-orange-100"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      notification.read ? "text-gray-600" : "text-orange-600"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          notification.status
                        )}`}
                      >
                        {notification.status}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {notification.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Sent via:</span>
                      {notification.channels.map((channel) => (
                        <span
                          key={channel}
                          className="px-2 py-1 bg-gray-100 rounded-full"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                    <span>{formatDateTime(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No notifications found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No notifications match your current filters
          </p>
        </div>
      )}
    </div>
  );
};

// Templates Manager Component
const TemplatesManager = ({ templates, onEdit, onDelete, channels }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.type}</p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(template)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(template)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Subject:</span>
                <p className="font-medium truncate">{template.subject}</p>
              </div>
              <div>
                <span className="text-gray-600">Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.channels.map((channelId) => {
                    const channel = channels.find((c) => c.id === channelId);
                    return (
                      <span
                        key={channelId}
                        className="px-2 py-1 bg-white rounded-full text-xs"
                      >
                        {channel?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
              <span>Trigger: {template.trigger}</span>
              <span>{formatDate(template.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No templates created
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first notification template to get started
          </p>
        </div>
      )}
    </div>
  );
};

// Template Form Component
const TemplateForm = ({
  templateForm,
  setTemplateForm,
  channels,
  notificationTypes,
}) => {
  const addVariable = () => {
    setTemplateForm({
      ...templateForm,
      variables: [...templateForm.variables, { name: "", description: "" }],
    });
  };

  const removeVariable = (index) => {
    setTemplateForm({
      ...templateForm,
      variables: templateForm.variables.filter((_, i) => i !== index),
    });
  };

  const updateVariable = (index, field, value) => {
    const updatedVariables = templateForm.variables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable
    );
    setTemplateForm({ ...templateForm, variables: updatedVariables });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name *
          </label>
          <input
            type="text"
            value={templateForm.name}
            onChange={(e) =>
              setTemplateForm({ ...templateForm, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Order Confirmation"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={templateForm.type}
            onChange={(e) =>
              setTemplateForm({ ...templateForm, type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {notificationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          value={templateForm.subject}
          onChange={(e) =>
            setTemplateForm({ ...templateForm, subject: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Your order #{order_number} is ready!"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          value={templateForm.content}
          onChange={(e) =>
            setTemplateForm({ ...templateForm, content: e.target.value })
          }
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Hi {customer_name}, your order is ready for pickup..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channels
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {channels.map((channel) => (
            <label key={channel.id} className="flex items-center">
              <input
                type="checkbox"
                checked={templateForm.channels.includes(channel.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTemplateForm({
                      ...templateForm,
                      channels: [...templateForm.channels, channel.id],
                    });
                  } else {
                    setTemplateForm({
                      ...templateForm,
                      channels: templateForm.channels.filter(
                        (c) => c !== channel.id
                      ),
                    });
                  }
                }}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {channel.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trigger
        </label>
        <select
          value={templateForm.trigger}
          onChange={(e) =>
            setTemplateForm({ ...templateForm, trigger: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="manual">Manual</option>
          <option value="order_placed">Order Placed</option>
          <option value="order_ready">Order Ready</option>
          <option value="payment_received">Payment Received</option>
          <option value="inventory_low">Low Inventory</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Variables
          </label>
          <button
            type="button"
            onClick={addVariable}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Variable
          </button>
        </div>

        {templateForm.variables.map((variable, index) => (
          <div key={index} className="flex items-center space-x-3 mb-3">
            <input
              type="text"
              value={variable.name}
              onChange={(e) => updateVariable(index, "name", e.target.value)}
              placeholder="Variable name (e.g., customer_name)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              value={variable.description}
              onChange={(e) =>
                updateVariable(index, "description", e.target.value)
              }
              placeholder="Description"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => removeVariable(index)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Send Notification Form Component
const SendNotificationForm = ({
  sendForm,
  setSendForm,
  templates,
  channels,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Template *
        </label>
        <select
          value={sendForm.templateId}
          onChange={(e) =>
            setSendForm({ ...sendForm, templateId: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select a template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipients *
        </label>
        <textarea
          value={sendForm.recipients.join("\n")}
          onChange={(e) =>
            setSendForm({
              ...sendForm,
              recipients: e.target.value.split("\n").filter((r) => r.trim()),
            })
          }
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Enter email addresses or phone numbers (one per line)"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channels
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {channels.map((channel) => (
            <label key={channel.id} className="flex items-center">
              <input
                type="checkbox"
                checked={sendForm.channels.includes(channel.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSendForm({
                      ...sendForm,
                      channels: [...sendForm.channels, channel.id],
                    });
                  } else {
                    setSendForm({
                      ...sendForm,
                      channels: sendForm.channels.filter(
                        (c) => c !== channel.id
                      ),
                    });
                  }
                }}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {channel.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Schedule (Optional)
        </label>
        <input
          type="datetime-local"
          value={sendForm.scheduledTime}
          onChange={(e) =>
            setSendForm({ ...sendForm, scheduledTime: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to send immediately
        </p>
      </div>
    </div>
  );
};

// Notification Preferences Component
const NotificationPreferences = ({
  preferences,
  onUpdate,
  channels,
  notificationTypes,
}) => {
  const updateChannelPreference = (channelId, typeValue, enabled) => {
    const newPreferences = {
      ...preferences,
      channels: {
        ...preferences.channels,
        [channelId]: {
          ...preferences.channels?.[channelId],
          [typeValue]: enabled,
        },
      },
    };
    onUpdate(newPreferences);
  };

  const updateGlobalSettings = (setting, value) => {
    const newPreferences = {
      ...preferences,
      global: {
        ...preferences.global,
        [setting]: value,
      },
    };
    onUpdate(newPreferences);
  };

  return (
    <div className="space-y-8">
      {/* Global Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Global Settings
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Enable all notifications</span>
            <input
              type="checkbox"
              checked={preferences.global?.enabled !== false}
              onChange={(e) =>
                updateGlobalSettings("enabled", e.target.checked)
              }
              className="w-4 h-4 text-orange-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-700">Play sound for notifications</span>
            <input
              type="checkbox"
              checked={preferences.global?.sound !== false}
              onChange={(e) => updateGlobalSettings("sound", e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded"
            />
          </label>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Quiet hours</span>
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={preferences.global?.quietStart || "22:00"}
                onChange={(e) =>
                  updateGlobalSettings("quietStart", e.target.value)
                }
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={preferences.global?.quietEnd || "08:00"}
                onChange={(e) =>
                  updateGlobalSettings("quietEnd", e.target.value)
                }
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Channel Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Channel Preferences
          </h3>
          <p className="text-sm text-gray-600">
            Choose which notifications you want to receive through each channel
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Notification Type
                </th>
                {channels.map((channel) => (
                  <th
                    key={channel.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <channel.icon className="w-4 h-4" />
                      <span>{channel.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationTypes.map((type) => (
                <tr key={type.value}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <type.icon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  </td>
                  {channels.map((channel) => (
                    <td
                      key={channel.id}
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      <input
                        type="checkbox"
                        checked={
                          preferences.channels?.[channel.id]?.[type.value] !==
                          false
                        }
                        onChange={(e) =>
                          updateChannelPreference(
                            channel.id,
                            type.value,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
