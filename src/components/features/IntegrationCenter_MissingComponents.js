import React, { useState, useEffect } from 'react';
import { 
  Webhook,
  Key,
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Settings,
  Code,
  Globe,
  Zap,
  Database,
  Cloud,
  Server,
  Monitor,
  Bell,
  Shield,
  Lock,
  Calendar,
  BarChart3,
  TrendingUp,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Info,
  Users,
  Mail
} from 'lucide-react';

// Webhooks Manager Component
const WebhooksManager = () => {
  const [webhooks, setWebhooks] = useState([
    {
      id: 'WH-001',
      name: 'User Registration Webhook',
      url: 'https://api.example.com/webhooks/user-registration',
      events: ['user.created', 'user.updated'],
      status: 'active',
      lastTriggered: '2024-10-29T14:30:00Z',
      successRate: 98.5,
      totalCalls: 1247,
      failedCalls: 18,
      secret: 'wh_secret_abc123',
      headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
      retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
      createdAt: '2024-09-15T10:00:00Z'
    },
    {
      id: 'WH-002',
      name: 'Order Processing Webhook',
      url: 'https://warehouse.company.com/api/orders',
      events: ['order.created', 'order.updated', 'order.cancelled'],
      status: 'active',
      lastTriggered: '2024-10-29T16:45:00Z',
      successRate: 95.2,
      totalCalls: 892,
      failedCalls: 43,
      secret: 'wh_secret_xyz789',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token123' },
      retryPolicy: { maxRetries: 5, backoffMultiplier: 1.5 },
      createdAt: '2024-08-20T15:30:00Z'
    },
    {
      id: 'WH-003',
      name: 'Payment Notification Webhook',
      url: 'https://billing.company.com/webhooks/payments',
      events: ['payment.completed', 'payment.failed'],
      status: 'paused',
      lastTriggered: '2024-10-28T09:20:00Z',
      successRate: 99.1,
      totalCalls: 2156,
      failedCalls: 19,
      secret: 'wh_secret_def456',
      headers: { 'Content-Type': 'application/json' },
      retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
      createdAt: '2024-07-10T12:15:00Z'
    }
  ]);

  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSecret, setShowSecret] = useState({});

  const availableEvents = [
    'user.created', 'user.updated', 'user.deleted',
    'order.created', 'order.updated', 'order.cancelled',
    'payment.completed', 'payment.failed', 'payment.refunded',
    'product.created', 'product.updated', 'product.deleted',
    'inventory.low', 'inventory.updated'
  ];

  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [],
    status: 'active',
    secret: '',
    headers: {},
    retryPolicy: { maxRetries: 3, backoffMultiplier: 2 }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredWebhooks = webhooks.filter(webhook => {
    const matchesSearch = webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webhook.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || webhook.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateWebhook = () => {
    const webhook = {
      ...webhookForm,
      id: `WH-${String(webhooks.length + 1).padStart(3, '0')}`,
      lastTriggered: null,
      successRate: 100,
      totalCalls: 0,
      failedCalls: 0,
      createdAt: new Date().toISOString()
    };
    setWebhooks([...webhooks, webhook]);
    resetForm();
  };

  const handleUpdateWebhook = () => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === selectedWebhook.id 
        ? { ...webhook, ...webhookForm }
        : webhook
    ));
    resetForm();
  };

  const resetForm = () => {
    setWebhookForm({
      name: '',
      url: '',
      events: [],
      status: 'active',
      secret: '',
      headers: {},
      retryPolicy: { maxRetries: 3, backoffMultiplier: 2 }
    });
    setShowWebhookForm(false);
    setIsEditing(false);
    setSelectedWebhook(null);
  };

  const handleEditWebhook = (webhook) => {
    setWebhookForm(webhook);
    setSelectedWebhook(webhook);
    setIsEditing(true);
    setShowWebhookForm(true);
  };

  const handleDeleteWebhook = (id) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
  };

  const handleToggleStatus = (id) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id 
        ? { ...webhook, status: webhook.status === 'active' ? 'paused' : 'active' }
        : webhook
    ));
  };

  const toggleEventSelection = (event) => {
    const updatedEvents = webhookForm.events.includes(event)
      ? webhookForm.events.filter(e => e !== event)
      : [...webhookForm.events, event];
    setWebhookForm({ ...webhookForm, events: updatedEvents });
  };

  const toggleSecretVisibility = (webhookId) => {
    setShowSecret(prev => ({ ...prev, [webhookId]: !prev[webhookId] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Webhooks Manager</h3>
          <p className="text-sm text-gray-600">Manage webhook endpoints and event subscriptions</p>
        </div>
        <button
          onClick={() => setShowWebhookForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {/* Webhooks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Webhook className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Webhooks</p>
              <p className="text-lg font-semibold text-gray-900">{webhooks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-lg font-semibold text-gray-900">
                {webhooks.filter(w => w.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Calls</p>
              <p className="text-lg font-semibold text-gray-900">
                {webhooks.reduce((sum, w) => sum + w.totalCalls, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Success Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search webhooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Webhooks Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Webhook
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Triggered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWebhooks.map((webhook) => (
                <tr key={webhook.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{webhook.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{webhook.url}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 2).map((event, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {event}
                        </span>
                      ))}
                      {webhook.events.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{webhook.events.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}>
                      {getStatusIcon(webhook.status)}
                      {webhook.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{webhook.successRate}%</div>
                    <div className="text-xs text-gray-500">
                      {webhook.totalCalls} calls, {webhook.failedCalls} failed
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleDateString() : 'Never'}
                    </div>
                    {webhook.lastTriggered && (
                      <div className="text-xs text-gray-500">
                        {new Date(webhook.lastTriggered).toLocaleTimeString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedWebhook(webhook)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditWebhook(webhook)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(webhook.id)}
                        className={`${webhook.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={webhook.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {webhook.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Form Modal */}
      {showWebhookForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit Webhook' : 'Add New Webhook'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Name *</label>
                <input
                  type="text"
                  value={webhookForm.name}
                  onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL *</label>
                <input
                  type="url"
                  value={webhookForm.url}
                  onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="https://your-app.com/webhooks"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Events to Subscribe *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {availableEvents.map((event) => (
                    <label key={event} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={webhookForm.events.includes(event)}
                        onChange={() => toggleEventSelection(event)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secret (Optional)</label>
                <input
                  type="password"
                  value={webhookForm.secret}
                  onChange={(e) => setWebhookForm({ ...webhookForm, secret: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Webhook secret for signature verification"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={webhookForm.status}
                  onChange={(e) => setWebhookForm({ ...webhookForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={isEditing ? handleUpdateWebhook : handleCreateWebhook}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                {isEditing ? 'Update Webhook' : 'Create Webhook'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Detail Modal */}
      {selectedWebhook && !showWebhookForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedWebhook.name}</h3>
                <p className="text-sm text-gray-600">Webhook Details</p>
              </div>
              <button
                onClick={() => setSelectedWebhook(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">URL:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all flex-1">
                          {selectedWebhook.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedWebhook.url)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Secret:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs flex-1">
                          {showSecret[selectedWebhook.id] ? selectedWebhook.secret : '••••••••'}
                        </code>
                        <button
                          onClick={() => toggleSecretVisibility(selectedWebhook.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showSecret[selectedWebhook.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(selectedWebhook.secret)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWebhook.status)}`}>
                        {selectedWebhook.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Subscribed Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWebhook.events.map((event, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-gray-900">{selectedWebhook.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Calls:</span>
                      <span className="font-medium text-gray-900">{selectedWebhook.totalCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed Calls:</span>
                      <span className="font-medium text-red-600">{selectedWebhook.failedCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Triggered:</span>
                      <span className="font-medium text-gray-900">
                        {selectedWebhook.lastTriggered ? new Date(selectedWebhook.lastTriggered).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Retry Policy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Retries:</span>
                      <span className="text-gray-900">{selectedWebhook.retryPolicy.maxRetries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Backoff Multiplier:</span>
                      <span className="text-gray-900">{selectedWebhook.retryPolicy.backoffMultiplier}x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  handleEditWebhook(selectedWebhook);
                  setSelectedWebhook(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Webhook
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Test Webhook
              </button>
              <button
                onClick={() => setSelectedWebhook(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// API Keys Manager Component
const ApiKeysManager = () => {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'AK-001',
      name: 'Production API Key',
      key: 'ak_live_1234567890abcdef',
      permissions: ['read', 'write'],
      status: 'active',
      lastUsed: '2024-10-29T14:30:00Z',
      requestCount: 15420,
      rateLimit: 1000,
      environment: 'production',
      createdAt: '2024-08-15T10:00:00Z',
      expiresAt: '2025-08-15T10:00:00Z',
      ipWhitelist: ['192.168.1.100', '10.0.0.50']
    },
    {
      id: 'AK-002',
      name: 'Development API Key',
      key: 'ak_test_abcdef1234567890',
      permissions: ['read'],
      status: 'active',
      lastUsed: '2024-10-28T16:45:00Z',
      requestCount: 8934,
      rateLimit: 500,
      environment: 'development',
      createdAt: '2024-09-01T14:30:00Z',
      expiresAt: '2025-09-01T14:30:00Z',
      ipWhitelist: []
    },
    {
      id: 'AK-003',
      name: 'Mobile App API Key',
      key: 'ak_live_fedcba0987654321',
      permissions: ['read', 'write', 'delete'],
      status: 'revoked',
      lastUsed: '2024-10-20T12:15:00Z',
      requestCount: 23156,
      rateLimit: 2000,
      environment: 'production',
      createdAt: '2024-07-10T09:00:00Z',
      expiresAt: '2025-07-10T09:00:00Z',
      ipWhitelist: []
    }
  ]);

  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showKey, setShowKey] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [environmentFilter, setEnvironmentFilter] = useState('all');

  const permissions = ['read', 'write', 'delete', 'admin'];
  const environments = ['development', 'staging', 'production'];
  const rateLimits = [100, 500, 1000, 2000, 5000];

  const [apiKeyForm, setApiKeyForm] = useState({
    name: '',
    permissions: [],
    environment: 'development',
    rateLimit: 1000,
    expiresAt: '',
    ipWhitelist: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (environment) => {
    switch (environment) {
      case 'production': return 'bg-red-100 text-red-800';
      case 'staging': return 'bg-yellow-100 text-yellow-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApiKeys = apiKeys.filter(apiKey => {
    const matchesSearch = apiKey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apiKey.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apiKey.status === statusFilter;
    const matchesEnvironment = environmentFilter === 'all' || apiKey.environment === environmentFilter;
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  const generateApiKey = () => {
    const prefix = apiKeyForm.environment === 'production' ? 'ak_live_' : 'ak_test_';
    const randomString = Math.random().toString(36).substring(2, 18);
    return prefix + randomString;
  };

  const handleCreateApiKey = () => {
    const apiKey = {
      ...apiKeyForm,
      id: `AK-${String(apiKeys.length + 1).padStart(3, '0')}`,
      key: generateApiKey(),
      status: 'active',
      lastUsed: null,
      requestCount: 0,
      createdAt: new Date().toISOString(),
      ipWhitelist: apiKeyForm.ipWhitelist ? apiKeyForm.ipWhitelist.split(',').map(ip => ip.trim()) : []
    };
    setApiKeys([...apiKeys, apiKey]);
    resetForm();
  };

  const handleUpdateApiKey = () => {
    setApiKeys(apiKeys.map(apiKey => 
      apiKey.id === selectedApiKey.id 
        ? { 
            ...apiKey, 
            ...apiKeyForm,
            ipWhitelist: apiKeyForm.ipWhitelist ? apiKeyForm.ipWhitelist.split(',').map(ip => ip.trim()) : []
          }
        : apiKey
    ));
    resetForm();
  };

  const resetForm = () => {
    setApiKeyForm({
      name: '',
      permissions: [],
      environment: 'development',
      rateLimit: 1000,
      expiresAt: '',
      ipWhitelist: ''
    });
    setShowApiKeyForm(false);
    setIsEditing(false);
    setSelectedApiKey(null);
  };

  const handleEditApiKey = (apiKey) => {
    setApiKeyForm({
      ...apiKey,
      ipWhitelist: apiKey.ipWhitelist.join(', ')
    });
    setSelectedApiKey(apiKey);
    setIsEditing(true);
    setShowApiKeyForm(true);
  };

  const handleRevokeApiKey = (id) => {
    setApiKeys(apiKeys.map(apiKey => 
      apiKey.id === id ? { ...apiKey, status: 'revoked' } : apiKey
    ));
  };

  const handleDeleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(apiKey => apiKey.id !== id));
  };

  const toggleKeyVisibility = (apiKeyId) => {
    setShowKey(prev => ({ ...prev, [apiKeyId]: !prev[apiKeyId] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const togglePermission = (permission) => {
    const updatedPermissions = apiKeyForm.permissions.includes(permission)
      ? apiKeyForm.permissions.filter(p => p !== permission)
      : [...apiKeyForm.permissions, permission];
    setApiKeyForm({ ...apiKeyForm, permissions: updatedPermissions });
  };

  const getDaysUntilExpiry = (expiresAt) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">API Keys Manager</h3>
          <p className="text-sm text-gray-600">Manage API keys and access permissions</p>
        </div>
        <button
          onClick={() => setShowApiKeyForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate API Key
        </button>
      </div>

      {/* API Keys Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Key className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Keys</p>
              <p className="text-lg font-semibold text-gray-900">{apiKeys.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Keys</p>
              <p className="text-lg font-semibold text-gray-900">
                {apiKeys.filter(k => k.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-lg font-semibold text-gray-900">
                {apiKeys.reduce((sum, k) => sum + k.requestCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Production Keys</p>
              <p className="text-lg font-semibold text-gray-900">
                {apiKeys.filter(k => k.environment === 'production').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search API keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={environmentFilter}
            onChange={(e) => setEnvironmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Environments</option>
            {environments.map(env => (
              <option key={env} value={env}>{env.charAt(0).toUpperCase() + env.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApiKeys.map((apiKey) => {
                const daysUntilExpiry = getDaysUntilExpiry(apiKey.expiresAt);
                return (
                  <tr key={apiKey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {showKey[apiKey.id] ? apiKey.key : `${apiKey.key.substring(0, 12)}...`}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showKey[apiKey.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnvironmentColor(apiKey.environment)}`}>
                        {apiKey.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                        {apiKey.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{apiKey.requestCount.toLocaleString()} requests</div>
                      <div className="text-xs text-gray-500">
                        Limit: {apiKey.rateLimit}/min
                      </div>
                      {apiKey.lastUsed && (
                        <div className="text-xs text-gray-500">
                          Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${daysUntilExpiry < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(apiKey.expiresAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApiKey(apiKey)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditApiKey(apiKey)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {apiKey.status === 'active' && (
                          <button
                            onClick={() => handleRevokeApiKey(apiKey.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Revoke"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Key Form Modal */}
      {showApiKeyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit API Key' : 'Generate New API Key'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key Name *</label>
                <input
                  type="text"
                  value={apiKeyForm.name}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment *</label>
                  <select
                    value={apiKeyForm.environment}
                    onChange={(e) => setApiKeyForm({ ...apiKeyForm, environment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    {environments.map(env => (
                      <option key={env} value={env}>{env.charAt(0).toUpperCase() + env.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (requests/min)</label>
                  <select
                    value={apiKeyForm.rateLimit}
                    onChange={(e) => setApiKeyForm({ ...apiKeyForm, rateLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {rateLimits.map(limit => (
                      <option key={limit} value={limit}>{limit}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions *</label>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={apiKeyForm.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expires At</label>
                <input
                  type="date"
                  value={apiKeyForm.expiresAt ? apiKeyForm.expiresAt.split('T')[0] : ''}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist (comma-separated)</label>
                <input
                  type="text"
                  value={apiKeyForm.ipWhitelist}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, ipWhitelist: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="192.168.1.100, 10.0.0.50"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={isEditing ? handleUpdateApiKey : handleCreateApiKey}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                {isEditing ? 'Update API Key' : 'Generate API Key'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Detail Modal */}
      {selectedApiKey && !showApiKeyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedApiKey.name}</h3>
                <p className="text-sm text-gray-600">API Key Details</p>
              </div>
              <button
                onClick={() => setSelectedApiKey(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Key Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">API Key:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all flex-1">
                          {showKey[selectedApiKey.id] ? selectedApiKey.key : `${selectedApiKey.key.substring(0, 12)}...`}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(selectedApiKey.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showKey[selectedApiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(selectedApiKey.key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(selectedApiKey.environment)}`}>
                        {selectedApiKey.environment}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApiKey.status)}`}>
                        {selectedApiKey.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate Limit:</span>
                      <span className="text-gray-900">{selectedApiKey.rateLimit} requests/min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApiKey.permissions.map((permission, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedApiKey.ipWhitelist.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">IP Whitelist</h4>
                    <div className="space-y-1">
                      {selectedApiKey.ipWhitelist.map((ip, index) => (
                        <code key={index} className="block bg-gray-100 px-2 py-1 rounded text-xs">
                          {ip}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Usage Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Requests:</span>
                      <span className="font-medium text-gray-900">{selectedApiKey.requestCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Used:</span>
                      <span className="font-medium text-gray-900">
                        {selectedApiKey.lastUsed ? new Date(selectedApiKey.lastUsed).toLocaleString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">{new Date(selectedApiKey.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className={`font-medium ${getDaysUntilExpiry(selectedApiKey.expiresAt) < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(selectedApiKey.expiresAt).toLocaleDateString()}
                        ({getDaysUntilExpiry(selectedApiKey.expiresAt)} days)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today:</span>
                      <span className="text-gray-900">247 requests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Week:</span>
                      <span className="text-gray-900">1,832 requests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month:</span>
                      <span className="text-gray-900">7,294 requests</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  handleEditApiKey(selectedApiKey);
                  setSelectedApiKey(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit API Key
              </button>
              {selectedApiKey.status === 'active' && (
                <button
                  onClick={() => {
                    handleRevokeApiKey(selectedApiKey.id);
                    setSelectedApiKey(null);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Revoke Key
                </button>
              )}
              <button
                onClick={() => setSelectedApiKey(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sync Logs Viewer Component
const SyncLogsViewer = () => {
  const [syncLogs, setSyncLogs] = useState([
    {
      id: 'SYNC-001',
      service: 'Salesforce CRM',
      operation: 'customer_sync',
      status: 'success',
      startTime: '2024-10-29T14:30:00Z',
      endTime: '2024-10-29T14:32:15Z',
      duration: '2m 15s',
      recordsProcessed: 1247,
      recordsSuccess: 1245,
      recordsError: 2,
      errors: [
        { record: 'Customer ID: 12345', error: 'Invalid email format' },
        { record: 'Customer ID: 67890', error: 'Duplicate customer ID' }
      ]
    },
    {
      id: 'SYNC-002',
      service: 'Mailchimp',
      operation: 'email_list_sync',
      status: 'running',
      startTime: '2024-10-29T15:00:00Z',
      endTime: null,
      duration: 'In progress',
      recordsProcessed: 892,
      recordsSuccess: 885,
      recordsError: 7,
      errors: []
    },
    {
      id: 'SYNC-003',
      service: 'Stripe Payments',
      operation: 'payment_sync',
      status: 'failed',
      startTime: '2024-10-29T13:45:00Z',
      endTime: '2024-10-29T13:47:30Z',
      duration: '2m 30s',
      recordsProcessed: 0,
      recordsSuccess: 0,
      recordsError: 0,
      errors: [
        { record: 'Connection', error: 'API authentication failed - invalid token' }
      ]
    },
    {
      id: 'SYNC-004',
      service: 'HubSpot CRM',
      operation: 'contact_sync',
      status: 'success',
      startTime: '2024-10-29T12:00:00Z',
      endTime: '2024-10-29T12:05:45Z',
      duration: '5m 45s',
      recordsProcessed: 2156,
      recordsSuccess: 2149,
      recordsError: 7,
      errors: [
        { record: 'Contact ID: 98765', error: 'Missing required field: company' },
        { record: 'Contact ID: 54321', error: 'Invalid phone number format' }
      ]
    }
  ]);

  const [selectedLog, setSelectedLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  const statuses = ['success', 'running', 'failed', 'warning'];
  const services = ['Salesforce CRM', 'Mailchimp', 'Stripe Payments', 'HubSpot CRM', 'Shopify'];
  const dateFilters = ['today', 'yesterday', 'last_7_days', 'last_30_days'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case 'Salesforce CRM': return <Users className="w-5 h-5 text-blue-600" />;
      case 'Mailchimp': return <Mail className="w-5 h-5 text-yellow-600" />;
      case 'Stripe Payments': return <Globe className="w-5 h-5 text-purple-600" />;
      case 'HubSpot CRM': return <Users className="w-5 h-5 text-orange-600" />;
      case 'Shopify': return <Globe className="w-5 h-5 text-green-600" />;
      default: return <Server className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredLogs = syncLogs.filter(log => {
    const matchesSearch = log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    
    // Date filtering logic would go here
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleRetrySync = (logId) => {
    setSyncLogs(syncLogs.map(log => 
      log.id === logId 
        ? { 
            ...log, 
            status: 'running', 
            startTime: new Date().toISOString(), 
            endTime: null,
            duration: 'In progress'
          }
        : log
    ));
  };

  const getSuccessRate = (log) => {
    if (log.recordsProcessed === 0) return 0;
    return ((log.recordsSuccess / log.recordsProcessed) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sync Logs Viewer</h3>
          <p className="text-sm text-gray-600">Monitor integration synchronization logs</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Logs
        </button>
      </div>

      {/* Sync Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Successful Syncs</p>
              <p className="text-lg font-semibold text-gray-900">
                {syncLogs.filter(log => log.status === 'success').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Running Syncs</p>
              <p className="text-lg font-semibold text-gray-900">
                {syncLogs.filter(log => log.status === 'running').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Failed Syncs</p>
              <p className="text-lg font-semibold text-gray-900">
                {syncLogs.filter(log => log.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Records Processed</p>
              <p className="text-lg font-semibold text-gray-900">
                {syncLogs.reduce((sum, log) => sum + log.recordsProcessed, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sync logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Services</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Sync Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service & Operation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getServiceIcon(log.service)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.service}</div>
                        <div className="text-xs text-gray-500">{log.operation.replace('_', ' ')}</div>
                        <div className="text-xs text-gray-400">{log.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.duration}</div>
                    {log.endTime && (
                      <div className="text-xs text-gray-500">
                        Ended: {new Date(log.endTime).toLocaleTimeString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.recordsProcessed.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      Success: {log.recordsSuccess.toLocaleString()}
                    </div>
                    {log.recordsError > 0 && (
                      <div className="text-xs text-red-600">
                        Errors: {log.recordsError.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${getSuccessRate(log) === '100.0' ? 'text-green-600' : getSuccessRate(log) > '90' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {getSuccessRate(log)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(log.startTime).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(log.startTime).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {log.status === 'failed' && (
                        <button
                          onClick={() => handleRetrySync(log.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Retry Sync"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Download Log"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedLog.service} - {selectedLog.operation}</h3>
                <p className="text-sm text-gray-600">{selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Sync Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="text-gray-900">{selectedLog.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operation:</span>
                      <span className="text-gray-900">{selectedLog.operation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                        {selectedLog.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">{selectedLog.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Started:</span>
                      <span className="text-gray-900">{new Date(selectedLog.startTime).toLocaleString()}</span>
                    </div>
                    {selectedLog.endTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ended:</span>
                        <span className="text-gray-900">{new Date(selectedLog.endTime).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Processing Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Records Processed:</span>
                      <span className="text-gray-900">{selectedLog.recordsProcessed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Successful:</span>
                      <span className="text-green-600">{selectedLog.recordsSuccess.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Errors:</span>
                      <span className="text-red-600">{selectedLog.recordsError.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className={`font-medium ${getSuccessRate(selectedLog) === '100.0' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {getSuccessRate(selectedLog)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedLog.errors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Errors ({selectedLog.errors.length})</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedLog.errors.map((error, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-red-200">
                          <div className="text-sm font-medium text-gray-900">{error.record}</div>
                          <div className="text-xs text-red-600 mt-1">{error.error}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Log Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Download Full Log
                    </button>
                    {selectedLog.status === 'failed' && (
                      <button
                        onClick={() => {
                          handleRetrySync(selectedLog.id);
                          setSelectedLog(null);
                        }}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Retry Sync
                      </button>
                    )}
                    <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                      View Service Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { WebhooksManager, ApiKeysManager, SyncLogsViewer };
