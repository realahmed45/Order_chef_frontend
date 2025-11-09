import React, { useState, useEffect } from "react";
import {
  Zap,
  Settings,
  Link,
  Globe,
  CreditCard,
  Truck,
  Mail,
  Share2,
  Database,
  CloudUpload,
  Smartphone,
  Wifi,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Code,
  Key,
  Lock,
  Unlock,
  Monitor,
  FileText,
  BarChart3,
  DollarSign,
  Users,
  ShoppingCart,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import { formatDateTime, formatDate } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const IntegrationCenter = ({ restaurant }) => {
  const [integrations, setIntegrations] = useState([]);
  const [connectedApps, setConnectedApps] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const [integrationForm, setIntegrationForm] = useState({
    type: "",
    name: "",
    apiKey: "",
    secretKey: "",
    environment: "sandbox",
    enabled: true,
    settings: {},
  });

  const [webhookForm, setWebhookForm] = useState({
    name: "",
    url: "",
    events: [],
    secret: "",
    enabled: true,
  });

  const integrationCategories = [
    {
      name: "Accounting",
      icon: Database,
      color: "blue",
      integrations: [
        {
          id: "quickbooks",
          name: "QuickBooks",
          description: "Sync sales, expenses, and financial data",
          logo: "/logos/quickbooks.png",
          features: [
            "Sales Sync",
            "Expense Tracking",
            "Tax Reports",
            "Inventory Sync",
          ],
          status: "available",
        },
        {
          id: "xero",
          name: "Xero",
          description: "Cloud accounting and bookkeeping",
          logo: "/logos/xero.png",
          features: ["Invoicing", "Bank Reconciliation", "Financial Reports"],
          status: "available",
        },
      ],
    },
    {
      name: "Point of Sale",
      icon: ShoppingCart,
      color: "green",
      integrations: [
        {
          id: "square",
          name: "Square POS",
          description: "Complete POS system integration",
          logo: "/logos/square.png",
          features: [
            "Payment Processing",
            "Inventory Sync",
            "Customer Data",
            "Analytics",
          ],
          status: "available",
        },
        {
          id: "clover",
          name: "Clover",
          description: "All-in-one POS and payment solutions",
          logo: "/logos/clover.png",
          features: [
            "Payments",
            "Inventory",
            "Reporting",
            "Customer Management",
          ],
          status: "available",
        },
      ],
    },
    {
      name: "Delivery Partners",
      icon: Truck,
      color: "orange",
      integrations: [
        {
          id: "ubereats",
          name: "Uber Eats",
          description: "Food delivery platform integration",
          logo: "/logos/ubereats.png",
          features: [
            "Order Management",
            "Menu Sync",
            "Analytics",
            "Customer Reviews",
          ],
          status: "available",
        },
        {
          id: "doordash",
          name: "DoorDash",
          description: "On-demand delivery service",
          logo: "/logos/doordash.png",
          features: [
            "Order Processing",
            "Menu Management",
            "Promotions",
            "Insights",
          ],
          status: "available",
        },
        {
          id: "grubhub",
          name: "Grubhub",
          description: "Online food ordering and delivery",
          logo: "/logos/grubhub.png",
          features: [
            "Order Integration",
            "Menu Updates",
            "Performance Metrics",
          ],
          status: "available",
        },
      ],
    },
    {
      name: "Payment Gateways",
      icon: CreditCard,
      color: "purple",
      integrations: [
        {
          id: "stripe",
          name: "Stripe",
          description: "Online payment processing",
          logo: "/logos/stripe.png",
          features: [
            "Card Payments",
            "Digital Wallets",
            "Subscriptions",
            "Fraud Protection",
          ],
          status: "available",
        },
        {
          id: "paypal",
          name: "PayPal",
          description: "Global payment solutions",
          logo: "/logos/paypal.png",
          features: ["PayPal Checkout", "Credit Cards", "Buy Now Pay Later"],
          status: "available",
        },
      ],
    },
    {
      name: "Email Marketing",
      icon: Mail,
      color: "indigo",
      integrations: [
        {
          id: "mailchimp",
          name: "Mailchimp",
          description: "Email marketing and automation",
          logo: "/logos/mailchimp.png",
          features: [
            "Email Campaigns",
            "Customer Segmentation",
            "Analytics",
            "Automation",
          ],
          status: "available",
        },
        {
          id: "constant-contact",
          name: "Constant Contact",
          description: "Email and social media marketing",
          logo: "/logos/constantcontact.png",
          features: ["Email Marketing", "Event Management", "Social Media"],
          status: "available",
        },
      ],
    },
    {
      name: "Social Media",
      icon: Share2,
      color: "pink",
      integrations: [
        {
          id: "facebook",
          name: "Facebook",
          description: "Social media marketing and ads",
          logo: "/logos/facebook.png",
          features: [
            "Page Management",
            "Advertising",
            "Analytics",
            "Messenger",
          ],
          status: "available",
        },
        {
          id: "instagram",
          name: "Instagram",
          description: "Photo and video sharing platform",
          logo: "/logos/instagram.png",
          features: ["Post Scheduling", "Stories", "Shopping", "Analytics"],
          status: "available",
        },
        {
          id: "google-my-business",
          name: "Google My Business",
          description: "Local business presence on Google",
          logo: "/logos/googlemybusiness.png",
          features: ["Business Listing", "Reviews", "Posts", "Insights"],
          status: "available",
        },
      ],
    },
  ];

  const webhookEvents = [
    "order.created",
    "order.updated",
    "order.completed",
    "payment.successful",
    "payment.failed",
    "customer.created",
    "customer.updated",
    "inventory.low_stock",
    "review.submitted",
  ];

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    try {
      setLoading(true);

      const [integrationsRes, connectedRes, apiKeysRes, webhooksRes, logsRes] =
        await Promise.all([
          fetch("/api/integrations", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/integrations/connected", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/integrations/api-keys", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/integrations/webhooks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/integrations/sync-logs", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      const [
        integrationsData,
        connectedData,
        apiKeysData,
        webhooksData,
        logsData,
      ] = await Promise.all([
        integrationsRes.json(),
        connectedRes.json(),
        apiKeysRes.json(),
        webhooksRes.json(),
        logsRes.json(),
      ]);

      if (integrationsData.success)
        setIntegrations(integrationsData.integrations);
      if (connectedData.success) setConnectedApps(connectedData.connected);
      if (apiKeysData.success) setApiKeys(apiKeysData.keys);
      if (webhooksData.success) setWebhooks(webhooksData.webhooks);
      if (logsData.success) setSyncLogs(logsData.logs);
    } catch (error) {
      console.error("Error fetching integration data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectIntegration = async (integration) => {
    try {
      const response = await fetch(
        `/api/integrations/${integration.id}/connect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(integrationForm),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchIntegrationData();
        setShowIntegrationModal(false);
        setIntegrationForm({
          type: "",
          name: "",
          apiKey: "",
          secretKey: "",
          environment: "sandbox",
          enabled: true,
          settings: {},
        });
        alert("Integration connected successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error connecting integration:", error);
      alert("Failed to connect integration");
    }
  };

  const handleDisconnectIntegration = async (integrationId) => {
    if (
      !window.confirm("Are you sure you want to disconnect this integration?")
    )
      return;

    try {
      const response = await fetch(
        `/api/integrations/${integrationId}/disconnect`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchIntegrationData();
        alert("Integration disconnected successfully");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error disconnecting integration:", error);
      alert("Failed to disconnect integration");
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/integrations/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(webhookForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchIntegrationData();
        setShowWebhookModal(false);
        setWebhookForm({
          name: "",
          url: "",
          events: [],
          secret: "",
          enabled: true,
        });
        alert("Webhook created successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating webhook:", error);
      alert("Failed to create webhook");
    }
  };

  const testWebhook = async (webhookId) => {
    try {
      const response = await fetch(
        `/api/integrations/webhooks/${webhookId}/test`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Test webhook sent successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error testing webhook:", error);
      alert("Failed to test webhook");
    }
  };

  const syncIntegration = async (integrationId) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();
      if (data.success) {
        await fetchIntegrationData();
        alert("Sync initiated successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error syncing integration:", error);
      alert("Failed to sync integration");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      connected: "bg-green-100 text-green-800",
      disconnected: "bg-red-100 text-red-800",
      syncing: "bg-blue-100 text-blue-800",
      error: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      connected: CheckCircle,
      disconnected: XCircle,
      syncing: RefreshCw,
      error: AlertCircle,
      pending: Clock,
    };
    return icons[status] || AlertCircle;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading integrations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Integration Center
          </h2>
          <p className="text-gray-600">
            Connect your restaurant with external services and platforms
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowWebhookModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </button>
          <button
            onClick={() => window.open("/api/docs", "_blank")}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Code className="w-4 h-4 mr-2" />
            API Docs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Connected Apps
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {connectedApps.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                API Calls Today
              </p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Link className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Webhooks</p>
              <p className="text-2xl font-bold text-gray-900">
                {webhooks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Sync</p>
              <p className="text-2xl font-bold text-gray-900">2m ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "available", label: "Available Integrations", icon: Globe },
              { id: "connected", label: "Connected Apps", icon: Link },
              { id: "webhooks", label: "Webhooks", icon: Zap },
              { id: "api-keys", label: "API Keys", icon: Key },
              { id: "logs", label: "Sync Logs", icon: FileText },
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
            <IntegrationDashboard
              connectedApps={connectedApps}
              syncLogs={syncLogs}
              webhooks={webhooks}
              integrationCategories={integrationCategories}
            />
          )}

          {activeTab === "available" && (
            <AvailableIntegrations
              integrationCategories={integrationCategories}
              connectedApps={connectedApps}
              onConnect={(integration) => {
                setSelectedIntegration(integration);
                setIntegrationForm({
                  ...integrationForm,
                  type: integration.id,
                  name: integration.name,
                });
                setShowIntegrationModal(true);
              }}
            />
          )}

          {activeTab === "connected" && (
            <ConnectedApps
              connectedApps={connectedApps}
              onDisconnect={handleDisconnectIntegration}
              onSync={syncIntegration}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}

          {activeTab === "webhooks" && (
            <WebhooksManager
              webhooks={webhooks}
              onTest={testWebhook}
              getStatusColor={getStatusColor}
            />
          )}

          {activeTab === "api-keys" && <ApiKeysManager apiKeys={apiKeys} />}

          {activeTab === "logs" && (
            <SyncLogsViewer
              syncLogs={syncLogs}
              getStatusColor={getStatusColor}
            />
          )}
        </div>
      </div>

      {/* Integration Setup Modal */}
      <FormModal
        isOpen={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        onSubmit={(e) => {
          e.preventDefault();
          handleConnectIntegration(selectedIntegration);
        }}
        title={`Connect ${selectedIntegration?.name}`}
        submitText="Connect Integration"
        size="lg"
      >
        <IntegrationSetupForm
          integrationForm={integrationForm}
          setIntegrationForm={setIntegrationForm}
          selectedIntegration={selectedIntegration}
        />
      </FormModal>

      {/* Webhook Modal */}
      <FormModal
        isOpen={showWebhookModal}
        onClose={() => setShowWebhookModal(false)}
        onSubmit={handleCreateWebhook}
        title="Create Webhook"
        submitText="Create Webhook"
        size="lg"
      >
        <WebhookForm
          webhookForm={webhookForm}
          setWebhookForm={setWebhookForm}
          webhookEvents={webhookEvents}
        />
      </FormModal>
    </div>
  );
};

// Integration Dashboard Component
const IntegrationDashboard = ({
  connectedApps,
  syncLogs,
  webhooks,
  integrationCategories,
}) => {
  const recentSyncs = syncLogs.slice(0, 5);
  const activeWebhooks = webhooks.filter((w) => w.enabled);

  const integrationStats = integrationCategories.map((category) => ({
    ...category,
    connectedCount: connectedApps.filter((app) =>
      category.integrations.some((int) => int.id === app.type)
    ).length,
    totalCount: category.integrations.length,
  }));

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Integration Health</p>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-green-100">all systems operational</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Data Synced</p>
              <p className="text-3xl font-bold">12.4K</p>
              <p className="text-blue-100">records today</p>
            </div>
            <Database className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">API Response</p>
              <p className="text-3xl font-bold">145ms</p>
              <p className="text-purple-100">average latency</p>
            </div>
            <Zap className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationStats.map((category) => (
            <div
              key={category.name}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
              >
                <category.icon
                  className={`w-6 h-6 text-${category.color}-600`}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">
                  {category.connectedCount} of {category.totalCount} connected
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`w-3 h-3 rounded-full ${
                    category.connectedCount > 0 ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Sync Activity
          </h3>
          <div className="space-y-4">
            {recentSyncs.map((sync) => (
              <div key={sync.id} className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    sync.status === "success"
                      ? "bg-green-100"
                      : sync.status === "error"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      sync.status === "success"
                        ? "text-green-600"
                        : sync.status === "error"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {sync.integration}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sync.recordsProcessed} records •{" "}
                    {formatDateTime(sync.timestamp)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sync.status === "success"
                      ? "bg-green-100 text-green-800"
                      : sync.status === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {sync.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Webhook Status
          </h3>
          <div className="space-y-4">
            {activeWebhooks.slice(0, 5).map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {webhook.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {webhook.events.length} events
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-xs text-green-600">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Available Integrations Component
const AvailableIntegrations = ({
  integrationCategories,
  connectedApps,
  onConnect,
}) => {
  return (
    <div className="space-y-8">
      {integrationCategories.map((category) => (
        <div key={category.name} className="space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
            >
              <category.icon className={`w-5 h-5 text-${category.color}-600`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.integrations.map((integration) => {
              const isConnected = connectedApps.some(
                (app) => app.type === integration.id
              );

              return (
                <div
                  key={integration.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img
                          src={integration.logo}
                          alt={integration.name}
                          className="w-8 h-8"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="w-8 h-8 bg-gray-300 rounded hidden items-center justify-center">
                          <Globe className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {integration.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isConnected
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isConnected ? "Connected" : "Available"}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => onConnect(integration)}
                      disabled={isConnected}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        isConnected
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-orange-600 text-white hover:bg-orange-700"
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Connected
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Connected Apps Component
const ConnectedApps = ({
  connectedApps,
  onDisconnect,
  onSync,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Connected Applications
        </h3>
        <span className="text-sm text-gray-600">
          {connectedApps.length} apps connected
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {connectedApps.map((app) => {
          const StatusIcon = getStatusIcon(app.status);

          return (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.name}</h4>
                    <p className="text-sm text-gray-600">{app.type}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    app.status
                  )}`}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {app.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-medium">{app.environment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium">
                    {formatDateTime(app.lastSync)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Records Synced:</span>
                  <span className="font-medium">
                    {app.recordsSynced?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSync(app.id)}
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </button>
                  <button className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </button>
                </div>
                <button
                  onClick={() => onDisconnect(app.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Disconnect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {connectedApps.length === 0 && (
        <div className="text-center py-12">
          <Link className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No connected apps
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect your first integration to get started
          </p>
        </div>
      )}
    </div>
  );
};

// Integration Setup Form Component
const IntegrationSetupForm = ({
  integrationForm,
  setIntegrationForm,
  selectedIntegration,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <Globe className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {selectedIntegration?.name}
          </h3>
          <p className="text-sm text-gray-600">
            {selectedIntegration?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Integration Name *
          </label>
          <input
            type="text"
            value={integrationForm.name}
            onChange={(e) =>
              setIntegrationForm({ ...integrationForm, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="My Integration"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment
          </label>
          <select
            value={integrationForm.environment}
            onChange={(e) =>
              setIntegrationForm({
                ...integrationForm,
                environment: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="sandbox">Sandbox</option>
            <option value="production">Production</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key *
        </label>
        <input
          type="password"
          value={integrationForm.apiKey}
          onChange={(e) =>
            setIntegrationForm({ ...integrationForm, apiKey: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your API key"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secret Key
        </label>
        <input
          type="password"
          value={integrationForm.secretKey}
          onChange={(e) =>
            setIntegrationForm({
              ...integrationForm,
              secretKey: e.target.value,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your secret key (if required)"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={integrationForm.enabled}
            onChange={(e) =>
              setIntegrationForm({
                ...integrationForm,
                enabled: e.target.checked,
              })
            }
            className="w-4 h-4 text-orange-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Enable this integration immediately
          </span>
        </label>
      </div>
    </div>
  );
};

// Webhook Form Component
const WebhookForm = ({ webhookForm, setWebhookForm, webhookEvents }) => {
  const toggleEvent = (event) => {
    const updatedEvents = webhookForm.events.includes(event)
      ? webhookForm.events.filter((e) => e !== event)
      : [...webhookForm.events, event];

    setWebhookForm({ ...webhookForm, events: updatedEvents });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook Name *
        </label>
        <input
          type="text"
          value={webhookForm.name}
          onChange={(e) =>
            setWebhookForm({ ...webhookForm, name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Order Notifications"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL *
        </label>
        <input
          type="url"
          value={webhookForm.url}
          onChange={(e) =>
            setWebhookForm({ ...webhookForm, url: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="https://your-app.com/webhooks"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secret (Optional)
        </label>
        <input
          type="password"
          value={webhookForm.secret}
          onChange={(e) =>
            setWebhookForm({ ...webhookForm, secret: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Webhook secret for signature verification"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Events to Subscribe *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {webhookEvents.map((event) => (
            <label key={event} className="flex items-center">
              <input
                type="checkbox"
                checked={webhookForm.events.includes(event)}
                onChange={() => toggleEvent(event)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{event}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={webhookForm.enabled}
            onChange={(e) =>
              setWebhookForm({ ...webhookForm, enabled: e.target.checked })
            }
            className="w-4 h-4 text-orange-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Enable this webhook
          </span>
        </label>
      </div>
    </div>
  );
};

// Additional tab components (WebhooksManager, ApiKeysManager, SyncLogsViewer) would continue here...

// WebhooksManager Component
const WebhooksManager = ({ webhooks, onTest, getStatusColor }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Webhooks Manager</h3>
    <p className="text-gray-600">
      Webhook management functionality coming soon...
    </p>
    <div className="text-sm text-gray-500">
      {webhooks?.length || 0} webhooks configured
    </div>
  </div>
);

// ApiKeysManager Component
const ApiKeysManager = ({ apiKeys }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">API Keys Manager</h3>
    <p className="text-gray-600">
      API keys management functionality coming soon...
    </p>
    <div className="text-sm text-gray-500">
      {apiKeys?.length || 0} API keys configured
    </div>
  </div>
);

// SyncLogsViewer Component
const SyncLogsViewer = ({ syncLogs, getStatusColor }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Sync Logs Viewer</h3>
    <p className="text-gray-600">
      Sync logs viewing functionality coming soon...
    </p>
    <div className="text-sm text-gray-500">
      {syncLogs?.length || 0} sync logs available
    </div>
  </div>
);

export default IntegrationCenter;
