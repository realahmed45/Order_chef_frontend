import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Instagram,
  Phone,
  Send,
  Bot,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const SocialOrderingManager = ({ restaurant }) => {
  const [integrations, setIntegrations] = useState({
    whatsapp: { connected: false, phoneNumber: "", businessId: "" },
    instagram: { connected: false, username: "", businessId: "" },
  });

  const [socialOrders, setSocialOrders] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSocialData();
    fetchAnalytics();

    // Set up real-time updates
    const interval = setInterval(() => {
      if (integrations.whatsapp.connected || integrations.instagram.connected) {
        fetchConversations();
        fetchSocialOrders();
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSocialData = async () => {
    try {
      setLoading(true);

      const [integrationsRes, ordersRes, conversationsRes, templatesRes] =
        await Promise.all([
          fetch("/api/social/integrations", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/social/orders", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/social/conversations", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/social/templates", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      const [integrationsData, ordersData, conversationsData, templatesData] =
        await Promise.all([
          integrationsRes.json(),
          ordersRes.json(),
          conversationsRes.json(),
          templatesRes.json(),
        ]);

      if (integrationsData.success)
        setIntegrations(integrationsData.integrations);
      if (ordersData.success) setSocialOrders(ordersData.orders);
      if (conversationsData.success)
        setConversations(conversationsData.conversations);
      if (templatesData.success) setTemplates(templatesData.templates);
    } catch (error) {
      console.error("Error fetching social data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/social/analytics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching social analytics:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/social/conversations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchSocialOrders = async () => {
    try {
      const response = await fetch("/api/social/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        setSocialOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching social orders:", error);
    }
  };

  const connectWhatsApp = async (phoneNumber, businessId) => {
    try {
      const response = await fetch("/api/social/whatsapp/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ phoneNumber, businessId }),
      });

      const data = await response.json();
      if (data.success) {
        setIntegrations((prev) => ({
          ...prev,
          whatsapp: { connected: true, phoneNumber, businessId },
        }));
        alert("WhatsApp Business connected successfully!");
      } else {
        alert("Error connecting WhatsApp: " + data.message);
      }
    } catch (error) {
      console.error("Error connecting WhatsApp:", error);
      alert("Failed to connect WhatsApp");
    }
  };

  const connectInstagram = async (username, businessId) => {
    try {
      const response = await fetch("/api/social/instagram/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, businessId }),
      });

      const data = await response.json();
      if (data.success) {
        setIntegrations((prev) => ({
          ...prev,
          instagram: { connected: true, username, businessId },
        }));
        alert("Instagram Business connected successfully!");
      } else {
        alert("Error connecting Instagram: " + data.message);
      }
    } catch (error) {
      console.error("Error connecting Instagram:", error);
      alert("Failed to connect Instagram");
    }
  };

  const sendMessage = async (conversationId, message, type = "text") => {
    try {
      const response = await fetch("/api/social/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ conversationId, message, type }),
      });

      const data = await response.json();
      if (data.success) {
        fetchConversations();
        setNewMessage("");
      } else {
        alert("Error sending message: " + data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      sendMessage(selectedConversation.id, newMessage.trim());
    }
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPlatformIcon = (platform) => {
    return platform === "whatsapp" ? (
      <MessageSquare className="w-4 h-4 text-green-600" />
    ) : (
      <Instagram className="w-4 h-4 text-pink-600" />
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading social ordering..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Social Media Ordering
          </h2>
          <p className="text-gray-600">
            Manage WhatsApp and Instagram ordering channels
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                WhatsApp Orders
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.whatsappOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Instagram className="w-6 h-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Instagram Orders
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.instagramOrders || 0}
              </p>
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
                Active Conversations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {conversations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Social Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.socialRevenue || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WhatsAppIntegration
          integration={integrations.whatsapp}
          onConnect={connectWhatsApp}
        />
        <InstagramIntegration
          integration={integrations.instagram}
          onConnect={connectInstagram}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              {
                id: "conversations",
                label: "Conversations",
                icon: MessageSquare,
              },
              { id: "orders", label: "Social Orders", icon: Smartphone },
              { id: "templates", label: "Templates", icon: Bot },
              { id: "settings", label: "Settings", icon: Settings },
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
            <SocialDashboard
              analytics={analytics}
              socialOrders={socialOrders}
            />
          )}

          {activeTab === "conversations" && (
            <ConversationsTab
              conversations={conversations}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
              getPlatformIcon={getPlatformIcon}
            />
          )}

          {activeTab === "orders" && (
            <SocialOrdersTab
              orders={socialOrders}
              getOrderStatusColor={getOrderStatusColor}
              getPlatformIcon={getPlatformIcon}
            />
          )}

          {activeTab === "templates" && <TemplatesTab templates={templates} />}

          {activeTab === "settings" && <SocialSettingsTab />}
        </div>
      </div>
    </div>
  );
};

// WhatsApp Integration Component
const WhatsAppIntegration = ({ integration, onConnect }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [formData, setFormData] = useState({ phoneNumber: "", businessId: "" });

  const handleConnect = (e) => {
    e.preventDefault();
    if (formData.phoneNumber && formData.businessId) {
      onConnect(formData.phoneNumber, formData.businessId);
      setShowConnectModal(false);
      setFormData({ phoneNumber: "", businessId: "" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              WhatsApp Business
            </h3>
            <p className="text-sm text-gray-600">Enable WhatsApp ordering</p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            integration.connected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {integration.connected ? "Connected" : "Not Connected"}
        </div>
      </div>

      {integration.connected ? (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Phone Number:</span>
            <span className="text-sm font-medium">
              {integration.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Business ID:</span>
            <span className="text-sm font-medium">
              {integration.businessId}
            </span>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            Disconnect
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect your WhatsApp Business account to start receiving orders
          </p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Connect WhatsApp
          </button>
        </div>
      )}

      {/* Connect Modal */}
      <FormModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onSubmit={handleConnect}
        title="Connect WhatsApp Business"
        submitText="Connect"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Business Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="+1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business ID
            </label>
            <input
              type="text"
              value={formData.businessId}
              onChange={(e) =>
                setFormData({ ...formData, businessId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Your WhatsApp Business ID"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll need a WhatsApp Business API account
              to connect. Contact us for setup assistance.
            </p>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

// Instagram Integration Component
const InstagramIntegration = ({ integration, onConnect }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [formData, setFormData] = useState({ username: "", businessId: "" });

  const handleConnect = (e) => {
    e.preventDefault();
    if (formData.username && formData.businessId) {
      onConnect(formData.username, formData.businessId);
      setShowConnectModal(false);
      setFormData({ username: "", businessId: "" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <Instagram className="w-6 h-6 text-pink-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Instagram Business
            </h3>
            <p className="text-sm text-gray-600">
              Enable Instagram DM ordering
            </p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            integration.connected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {integration.connected ? "Connected" : "Not Connected"}
        </div>
      </div>

      {integration.connected ? (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Username:</span>
            <span className="text-sm font-medium">@{integration.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Business ID:</span>
            <span className="text-sm font-medium">
              {integration.businessId}
            </span>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            Disconnect
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect your Instagram Business account to receive orders via DM
          </p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Connect Instagram
          </button>
        </div>
      )}

      {/* Connect Modal */}
      <FormModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onSubmit={handleConnect}
        title="Connect Instagram Business"
        submitText="Connect"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="your_restaurant"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business ID
            </label>
            <input
              type="text"
              value={formData.businessId}
              onChange={(e) =>
                setFormData({ ...formData, businessId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Your Instagram Business ID"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll need Instagram Business API access
              to connect. Contact us for setup assistance.
            </p>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

// Social Dashboard Component
const SocialDashboard = ({ analytics, socialOrders }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Social Orders
          </h3>
          <div className="space-y-3">
            {socialOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {order.platform === "whatsapp" ? (
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  ) : (
                    <Instagram className="w-4 h-4 text-pink-600" />
                  )}
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.customerName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(order.total)}</p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span>WhatsApp</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {analytics.whatsappOrders || 0} orders
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(analytics.whatsappRevenue || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                <span>Instagram</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {analytics.instagramOrders || 0} orders
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(analytics.instagramRevenue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Conversations Tab Component
const ConversationsTab = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  newMessage,
  setNewMessage,
  onSendMessage,
  messagesEndRef,
  getPlatformIcon,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Conversations</h3>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id
                  ? "bg-orange-50 border-orange-200"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{conversation.customerName}</span>
                {getPlatformIcon(conversation.platform)}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateTime(conversation.updatedAt)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPlatformIcon(selectedConversation.platform)}
                <div>
                  <h3 className="font-semibold">
                    {selectedConversation.customerName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedConversation.customerPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {selectedConversation.messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.isFromCustomer ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromCustomer
                          ? "bg-gray-100 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isFromCustomer
                            ? "text-gray-500"
                            : "text-orange-100"
                        }`}
                      >
                        {formatDateTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={onSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No conversation selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Social Orders Tab Component
const SocialOrdersTab = ({ orders, getOrderStatusColor, getPlatformIcon }) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getPlatformIcon(order.platform)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {order.platform}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerPhone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No social orders yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Orders from WhatsApp and Instagram will appear here
          </p>
        </div>
      )}
    </div>
  );
};

// Templates Tab Component
const TemplatesTab = ({ templates }) => {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <Bot className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Message Templates
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Automated message templates coming soon
        </p>
      </div>
    </div>
  );
};

// Social Settings Tab Component
const SocialSettingsTab = () => {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Social Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Advanced social media settings coming soon
        </p>
      </div>
    </div>
  );
};

export default SocialOrderingManager;
