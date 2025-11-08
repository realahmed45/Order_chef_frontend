import React, { useState, useEffect } from 'react';
import { 
  Globe,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Smartphone,
  Monitor,
  Settings,
  Languages,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Bell,
  Shield,
  Cloud,
  HardDrive,
  Database,
  Zap,
  Activity,
  Eye,
  EyeOff,
  Save,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  RotateCcw,
  Search,
  Filter,
  Info,
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  User,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  FileText,
  Camera,
  Image
} from 'lucide-react';

// PWA Features Component
const PWAFeatures = () => {
  const [pwaSettings, setPwaSettings] = useState({
    enabled: true,
    installPrompt: true,
    offlineSupport: true,
    pushNotifications: true,
    backgroundSync: true,
    webShare: true,
    fullscreenMode: false,
    orientation: 'any',
    themeColor: '#f97316',
    backgroundColor: '#ffffff',
    displayMode: 'standalone',
    startUrl: '/',
    shortcuts: [
      { name: 'Dashboard', url: '/dashboard', icon: '/icons/dashboard.png' },
      { name: 'Orders', url: '/orders', icon: '/icons/orders.png' },
      { name: 'Products', url: '/products', icon: '/icons/products.png' },
      { name: 'Analytics', url: '/analytics', icon: '/icons/analytics.png' }
    ]
  });

  const [installStats, setInstallStats] = useState({
    totalInstalls: 1247,
    androidInstalls: 789,
    iosInstalls: 458,
    desktopInstalls: 156,
    installRate: 12.3,
    retentionRate: 78.5
  });

  const [showShortcutForm, setShowShortcutForm] = useState(false);
  const [newShortcut, setNewShortcut] = useState({
    name: '',
    url: '',
    icon: ''
  });

  const displayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
  const orientations = ['any', 'natural', 'landscape', 'portrait'];

  const handleSettingChange = (setting, value) => {
    setPwaSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleAddShortcut = () => {
    if (newShortcut.name && newShortcut.url) {
      setPwaSettings(prev => ({
        ...prev,
        shortcuts: [...prev.shortcuts, { ...newShortcut }]
      }));
      setNewShortcut({ name: '', url: '', icon: '' });
      setShowShortcutForm(false);
    }
  };

  const handleRemoveShortcut = (index) => {
    setPwaSettings(prev => ({
      ...prev,
      shortcuts: prev.shortcuts.filter((_, i) => i !== index)
    }));
  };

  const generateManifest = () => {
    const manifest = {
      name: "Your App Name",
      short_name: "YourApp",
      description: "Your Progressive Web App",
      start_url: pwaSettings.startUrl,
      display: pwaSettings.displayMode,
      orientation: pwaSettings.orientation,
      theme_color: pwaSettings.themeColor,
      background_color: pwaSettings.backgroundColor,
      icons: [
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      shortcuts: pwaSettings.shortcuts
    };
    
    const dataStr = JSON.stringify(manifest, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'manifest.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">PWA Features</h3>
          <p className="text-sm text-gray-600">Configure Progressive Web App capabilities</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateManifest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Manifest
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      {/* PWA Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Installs</p>
              <p className="text-lg font-semibold text-gray-900">{installStats.totalInstalls.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Install Rate</p>
              <p className="text-lg font-semibold text-gray-900">{installStats.installRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Retention Rate</p>
              <p className="text-lg font-semibold text-gray-900">{installStats.retentionRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">PWA Status</p>
              <p className="text-lg font-semibold text-green-600">
                {pwaSettings.enabled ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic PWA Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Enable PWA</h5>
                <p className="text-sm text-gray-600">Turn on Progressive Web App features</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pwaSettings.enabled}
                  onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Install Prompt</h5>
                <p className="text-sm text-gray-600">Show install app banner</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pwaSettings.installPrompt}
                  onChange={(e) => handleSettingChange('installPrompt', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Push Notifications</h5>
                <p className="text-sm text-gray-600">Enable push notification support</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pwaSettings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Background Sync</h5>
                <p className="text-sm text-gray-600">Sync data when connection restored</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pwaSettings.backgroundSync}
                  onChange={(e) => handleSettingChange('backgroundSync', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Web Share API</h5>
                <p className="text-sm text-gray-600">Enable native sharing capabilities</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pwaSettings.webShare}
                  onChange={(e) => handleSettingChange('webShare', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
              <select
                value={pwaSettings.displayMode}
                onChange={(e) => handleSettingChange('displayMode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {displayModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <select
                value={pwaSettings.orientation}
                onChange={(e) => handleSettingChange('orientation', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {orientations.map(orientation => (
                  <option key={orientation} value={orientation}>{orientation}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pwaSettings.themeColor}
                  onChange={(e) => handleSettingChange('themeColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={pwaSettings.themeColor}
                  onChange={(e) => handleSettingChange('themeColor', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={pwaSettings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={pwaSettings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start URL</label>
              <input
                type="text"
                value={pwaSettings.startUrl}
                onChange={(e) => handleSettingChange('startUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="/"
              />
            </div>
          </div>
        </div>
      </div>

      {/* App Shortcuts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">App Shortcuts</h4>
          <button
            onClick={() => setShowShortcutForm(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Shortcut
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pwaSettings.shortcuts.map((shortcut, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {shortcut.icon ? (
                    <img src={shortcut.icon} alt="" className="w-6 h-6" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                  <h5 className="font-medium text-gray-900">{shortcut.name}</h5>
                </div>
                <button
                  onClick={() => handleRemoveShortcut(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{shortcut.url}</p>
            </div>
          ))}
        </div>

        {/* Add Shortcut Modal */}
        {showShortcutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add App Shortcut</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newShortcut.name}
                    onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                  <input
                    type="text"
                    value={newShortcut.url}
                    onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="/dashboard"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL</label>
                  <input
                    type="text"
                    value={newShortcut.icon}
                    onChange={(e) => setNewShortcut({ ...newShortcut, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="/icons/dashboard.png"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddShortcut}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Add Shortcut
                </button>
                <button
                  onClick={() => setShowShortcutForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Install Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Installation Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Platform Distribution</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Android:</span>
                <span className="font-medium">{installStats.androidInstalls}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">iOS:</span>
                <span className="font-medium">{installStats.iosInstalls}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Desktop:</span>
                <span className="font-medium">{installStats.desktopInstalls}</span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Performance Metrics</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Install Rate:</span>
                <span className="font-medium text-green-600">{installStats.installRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Retention Rate:</span>
                <span className="font-medium text-blue-600">{installStats.retentionRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Daily Active Users:</span>
                <span className="font-medium">892</span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">PWA Health</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Worker:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cache Status:</span>
                <span className="font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Manifest:</span>
                <span className="font-medium text-green-600">Valid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Offline Support Component
const OfflineSupport = () => {
  const [offlineSettings, setOfflineSettings] = useState({
    enabled: true,
    cacheStrategy: 'network-first',
    maxCacheSize: 50,
    cacheDuration: 7,
    offlinePages: ['/dashboard', '/profile', '/orders'],
    offlineAssets: ['images', 'styles', 'scripts'],
    syncOnReconnect: true,
    showOfflineIndicator: true,
    fallbackPage: '/offline.html'
  });

  const [cacheStats, setCacheStats] = useState({
    totalSize: 23.4,
    itemsCount: 1247,
    hitRate: 85.2,
    lastCleared: '2024-10-20T10:00:00Z'
  });

  const [syncQueue, setSyncQueue] = useState([
    {
      id: 'sync-001',
      action: 'POST /api/orders',
      data: { productId: 123, quantity: 2 },
      timestamp: '2024-10-29T14:30:00Z',
      status: 'pending',
      retries: 0
    },
    {
      id: 'sync-002', 
      action: 'PUT /api/profile',
      data: { name: 'John Doe', email: 'john@example.com' },
      timestamp: '2024-10-29T14:25:00Z',
      status: 'completed',
      retries: 1
    },
    {
      id: 'sync-003',
      action: 'DELETE /api/items/456',
      data: {},
      timestamp: '2024-10-29T14:20:00Z',
      status: 'failed',
      retries: 3
    }
  ]);

  const cacheStrategies = [
    'cache-first',
    'network-first', 
    'cache-only',
    'network-only',
    'stale-while-revalidate'
  ];

  const assetTypes = ['images', 'styles', 'scripts', 'fonts', 'documents'];

  const handleSettingChange = (setting, value) => {
    setOfflineSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleAddOfflinePage = (page) => {
    if (page && !offlineSettings.offlinePages.includes(page)) {
      setOfflineSettings(prev => ({
        ...prev,
        offlinePages: [...prev.offlinePages, page]
      }));
    }
  };

  const handleRemoveOfflinePage = (page) => {
    setOfflineSettings(prev => ({
      ...prev,
      offlinePages: prev.offlinePages.filter(p => p !== page)
    }));
  };

  const handleToggleAsset = (asset) => {
    setOfflineSettings(prev => ({
      ...prev,
      offlineAssets: prev.offlineAssets.includes(asset)
        ? prev.offlineAssets.filter(a => a !== asset)
        : [...prev.offlineAssets, asset]
    }));
  };

  const handleClearCache = () => {
    setCacheStats(prev => ({
      ...prev,
      totalSize: 0,
      itemsCount: 0,
      lastCleared: new Date().toISOString()
    }));
  };

  const handleRetrySync = (syncId) => {
    setSyncQueue(prev => prev.map(item => 
      item.id === syncId 
        ? { ...item, status: 'pending', retries: item.retries + 1 }
        : item
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Offline Support</h3>
          <p className="text-sm text-gray-600">Configure offline functionality and caching</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      {/* Offline Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <WifiOff className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Offline Mode</p>
              <p className="text-lg font-semibold text-gray-900">
                {offlineSettings.enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cache Size</p>
              <p className="text-lg font-semibold text-gray-900">{cacheStats.totalSize} MB</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cache Hit Rate</p>
              <p className="text-lg font-semibold text-gray-900">{cacheStats.hitRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Sync Queue</p>
              <p className="text-lg font-semibold text-gray-900">
                {syncQueue.filter(item => item.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Cache Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Enable Offline Support</h5>
                <p className="text-sm text-gray-600">Allow app to work without internet</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.enabled}
                  onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cache Strategy</label>
              <select
                value={offlineSettings.cacheStrategy}
                onChange={(e) => handleSettingChange('cacheStrategy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {cacheStrategies.map(strategy => (
                  <option key={strategy} value={strategy}>{strategy}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Cache Size (MB)</label>
              <input
                type="number"
                value={offlineSettings.maxCacheSize}
                onChange={(e) => handleSettingChange('maxCacheSize', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                min="10"
                max="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration (days)</label>
              <input
                type="number"
                value={offlineSettings.cacheDuration}
                onChange={(e) => handleSettingChange('cacheDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fallback Page</label>
              <input
                type="text"
                value={offlineSettings.fallbackPage}
                onChange={(e) => handleSettingChange('fallbackPage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="/offline.html"
              />
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Sync Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Sync on Reconnect</h5>
                <p className="text-sm text-gray-600">Auto-sync when internet restored</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.syncOnReconnect}
                  onChange={(e) => handleSettingChange('syncOnReconnect', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Offline Indicator</h5>
                <p className="text-sm text-gray-600">Show offline status to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.showOfflineIndicator}
                  onChange={(e) => handleSettingChange('showOfflineIndicator', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Asset Types to Cache</h5>
              <div className="space-y-2">
                {assetTypes.map(asset => (
                  <label key={asset} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={offlineSettings.offlineAssets.includes(asset)}
                      onChange={() => handleToggleAsset(asset)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{asset}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Pages */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Offline Pages</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offlineSettings.offlinePages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{page}</span>
              <button
                onClick={() => handleRemoveOfflinePage(page)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center p-3 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="text"
              placeholder="/new-page"
              className="flex-1 text-sm border-0 focus:ring-0 p-0"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddOfflinePage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <Plus className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Cache Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">Cache Management</h4>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{cacheStats.totalSize} MB</p>
            <p className="text-sm text-gray-600">Total Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{cacheStats.itemsCount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Cached Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{cacheStats.hitRate}%</p>
            <p className="text-sm text-gray-600">Hit Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{new Date(cacheStats.lastCleared).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Last Cleared</p>
          </div>
        </div>
      </div>

      {/* Background Sync Queue */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Background Sync Queue</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {syncQueue.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.action}</div>
                    <div className="text-xs text-gray-500">{JSON.stringify(item.data)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(item.timestamp).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.retries}</div>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'failed' && (
                      <button
                        onClick={() => handleRetrySync(item.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Language Settings Component
const LanguageSettings = () => {
  const [languageSettings, setLanguageSettings] = useState({
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
    autoDetect: true,
    fallbackLanguage: 'en',
    rtlSupport: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    numberFormat: 'en-US'
  });

  const [translations, setTranslations] = useState({
    en: { status: 'complete', progress: 100, lastUpdated: '2024-10-25T10:00:00Z' },
    es: { status: 'complete', progress: 95, lastUpdated: '2024-10-20T14:30:00Z' },
    fr: { status: 'in-progress', progress: 78, lastUpdated: '2024-10-15T09:15:00Z' },
    de: { status: 'in-progress', progress: 82, lastUpdated: '2024-10-18T16:45:00Z' },
    zh: { status: 'pending', progress: 45, lastUpdated: '2024-10-10T12:20:00Z' },
    ja: { status: 'pending', progress: 32, lastUpdated: '2024-10-08T11:10:00Z' }
  });

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' }
  ];

  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'];
  const timeFormats = ['12', '24'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'];

  const handleSettingChange = (setting, value) => {
    setLanguageSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleToggleLanguage = (langCode) => {
    setLanguageSettings(prev => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.includes(langCode)
        ? prev.supportedLanguages.filter(lang => lang !== langCode)
        : [...prev.supportedLanguages, langCode]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const exportTranslations = (langCode) => {
    const sampleTranslations = {
      "common.welcome": "Welcome",
      "common.goodbye": "Goodbye", 
      "nav.home": "Home",
      "nav.about": "About",
      "button.save": "Save",
      "button.cancel": "Cancel"
    };
    
    const dataStr = JSON.stringify(sampleTranslations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `translations_${langCode}.json`);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Language Settings</h3>
          <p className="text-sm text-gray-600">Configure internationalization and localization</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      {/* Language Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Languages className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Supported Languages</p>
              <p className="text-lg font-semibold text-gray-900">{languageSettings.supportedLanguages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Complete Translations</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.values(translations).filter(t => t.status === 'complete').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.values(translations).filter(t => t.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Default Language</p>
              <p className="text-lg font-semibold text-gray-900">{languageSettings.defaultLanguage.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">General Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
              <select
                value={languageSettings.defaultLanguage}
                onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fallback Language</label>
              <select
                value={languageSettings.fallbackLanguage}
                onChange={(e) => handleSettingChange('fallbackLanguage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Auto-detect Language</h5>
                <p className="text-sm text-gray-600">Detect user's preferred language</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={languageSettings.autoDetect}
                  onChange={(e) => handleSettingChange('autoDetect', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">RTL Support</h5>
                <p className="text-sm text-gray-600">Right-to-left text direction</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={languageSettings.rtlSupport}
                  onChange={(e) => handleSettingChange('rtlSupport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Format Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Format Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={languageSettings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {dateFormats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <select
                value={languageSettings.timeFormat}
                onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {timeFormats.map(format => (
                  <option key={format} value={format}>
                    {format === '12' ? '12-hour (AM/PM)' : '24-hour'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={languageSettings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
              <select
                value={languageSettings.numberFormat}
                onChange={(e) => handleSettingChange('numberFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="en-US">1,234.56 (US)</option>
                <option value="de-DE">1.234,56 (DE)</option>
                <option value="fr-FR">1 234,56 (FR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Supported Languages</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableLanguages.map(lang => (
            <div key={lang.code} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={languageSettings.supportedLanguages.includes(lang.code)}
                  onChange={() => handleToggleLanguage(lang.code)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{lang.name}</p>
                  <p className="text-sm text-gray-600">{lang.nativeName}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-500">{lang.code.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Translation Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Translation Status</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {languageSettings.supportedLanguages.map(langCode => {
                const lang = availableLanguages.find(l => l.code === langCode);
                const translation = translations[langCode];
                return (
                  <tr key={langCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lang?.name}</div>
                        <div className="text-xs text-gray-500">{lang?.nativeName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(translation?.status)}`}>
                        {translation?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(translation?.progress || 0)}`}
                            style={{ width: `${translation?.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{translation?.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {translation?.lastUpdated ? new Date(translation.lastUpdated).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportTranslations(langCode)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Export Translations"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit Translations"
                        >
                          <Edit className="w-4 h-4" />
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
    </div>
  );
};

// Voice Commands Component
const VoiceCommands = () => {
  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    wakeWord: 'Hey App',
    language: 'en-US',
    confidenceThreshold: 0.8,
    continuousListening: false,
    audioFeedback: true,
    visualFeedback: true
  });

  const [voiceCommands, setVoiceCommands] = useState([
    {
      id: 'cmd-001',
      phrase: 'show dashboard',
      action: 'navigate',
      target: '/dashboard',
      enabled: true,
      category: 'navigation'
    },
    {
      id: 'cmd-002',
      phrase: 'create new order',
      action: 'modal',
      target: 'new-order-modal',
      enabled: true,
      category: 'actions'
    },
    {
      id: 'cmd-003',
      phrase: 'search for products',
      action: 'focus',
      target: 'search-input',
      enabled: true,
      category: 'interface'
    },
    {
      id: 'cmd-004',
      phrase: 'read notifications',
      action: 'tts',
      target: 'notifications',
      enabled: true,
      category: 'accessibility'
    }
  ]);

  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [showCommandForm, setShowCommandForm] = useState(false);
  const [newCommand, setNewCommand] = useState({
    phrase: '',
    action: 'navigate',
    target: '',
    category: 'navigation'
  });

  const supportedLanguages = [
    'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN'
  ];

  const actionTypes = ['navigate', 'modal', 'focus', 'click', 'tts', 'function'];
  const categories = ['navigation', 'actions', 'interface', 'accessibility', 'search'];

  const handleSettingChange = (setting, value) => {
    setVoiceSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleToggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start listening simulation
      setTimeout(() => {
        setLastCommand({
          phrase: 'show dashboard',
          timestamp: new Date().toISOString(),
          confidence: 0.92,
          status: 'executed'
        });
        setIsListening(false);
      }, 3000);
    }
  };

  const handleAddCommand = () => {
    if (newCommand.phrase && newCommand.target) {
      const command = {
        ...newCommand,
        id: `cmd-${String(voiceCommands.length + 1).padStart(3, '0')}`,
        enabled: true
      };
      setVoiceCommands([...voiceCommands, command]);
      setNewCommand({
        phrase: '',
        action: 'navigate',
        target: '',
        category: 'navigation'
      });
      setShowCommandForm(false);
    }
  };

  const handleToggleCommand = (commandId) => {
    setVoiceCommands(voiceCommands.map(cmd => 
      cmd.id === commandId ? { ...cmd, enabled: !cmd.enabled } : cmd
    ));
  };

  const handleDeleteCommand = (commandId) => {
    setVoiceCommands(voiceCommands.filter(cmd => cmd.id !== commandId));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'navigation': return 'bg-blue-100 text-blue-800';
      case 'actions': return 'bg-green-100 text-green-800';
      case 'interface': return 'bg-purple-100 text-purple-800';
      case 'accessibility': return 'bg-orange-100 text-orange-800';
      case 'search': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'navigate': return <Globe className="w-4 h-4" />;
      case 'modal': return <Plus className="w-4 h-4" />;
      case 'focus': return <Search className="w-4 h-4" />;
      case 'click': return <Zap className="w-4 h-4" />;
      case 'tts': return <Volume2 className="w-4 h-4" />;
      case 'function': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Voice Commands</h3>
          <p className="text-sm text-gray-600">Configure voice recognition and commands</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleListening}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Voice Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Mic className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Voice Recognition</p>
              <p className="text-lg font-semibold text-gray-900">
                {voiceSettings.enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Volume2 className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Commands</p>
              <p className="text-lg font-semibold text-gray-900">
                {voiceCommands.filter(cmd => cmd.enabled).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {isListening ? 'Listening' : 'Ready'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Languages className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Language</p>
              <p className="text-lg font-semibold text-gray-900">{voiceSettings.language}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Mic className="w-12 h-12 text-blue-600" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping"></div>
            </div>
          </div>
          <h4 className="text-lg font-medium text-blue-900 mb-2">Listening for commands...</h4>
          <p className="text-sm text-blue-700">Say "{voiceSettings.wakeWord}" followed by your command</p>
        </div>
      )}

      {/* Last Command */}
      {lastCommand && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Last Command Executed</h4>
              <p className="text-sm text-green-700">
                "{lastCommand.phrase}" (Confidence: {(lastCommand.confidence * 100).toFixed(0)}%)
              </p>
              <p className="text-xs text-green-600">{new Date(lastCommand.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Voice Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Enable Voice Commands</h5>
                <p className="text-sm text-gray-600">Turn on voice recognition</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.enabled}
                  onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wake Word</label>
              <input
                type="text"
                value={voiceSettings.wakeWord}
                onChange={(e) => handleSettingChange('wakeWord', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Hey App"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={voiceSettings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Threshold ({voiceSettings.confidenceThreshold})
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={voiceSettings.confidenceThreshold}
                onChange={(e) => handleSettingChange('confidenceThreshold', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Continuous Listening</h5>
                <p className="text-sm text-gray-600">Always listen for wake word</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.continuousListening}
                  onChange={(e) => handleSettingChange('continuousListening', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Audio Feedback</h5>
                <p className="text-sm text-gray-600">Play confirmation sounds</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.audioFeedback}
                  onChange={(e) => handleSettingChange('audioFeedback', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Visual Feedback</h5>
                <p className="text-sm text-gray-600">Show visual indicators</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceSettings.visualFeedback}
                  onChange={(e) => handleSettingChange('visualFeedback', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Command Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Command Categories</h4>
          <div className="space-y-3">
            {categories.map(category => {
              const categoryCommands = voiceCommands.filter(cmd => cmd.category === category);
              const enabledCount = categoryCommands.filter(cmd => cmd.enabled).length;
              return (
                <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900 capitalize">{category}</h5>
                    <p className="text-sm text-gray-600">{enabledCount} of {categoryCommands.length} enabled</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                    {categoryCommands.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice Commands List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">Voice Commands</h4>
          <button
            onClick={() => setShowCommandForm(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Command
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Command
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {voiceCommands.map((command) => (
                <tr key={command.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">"{command.phrase}"</div>
                      <div className="text-xs text-gray-500">Target: {command.target}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(command.action)}
                      <span className="text-sm text-gray-900 capitalize">{command.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(command.category)}`}>
                      {command.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={command.enabled}
                        onChange={() => handleToggleCommand(command.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Command"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCommand(command.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Command"
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

      {/* Add Command Modal */}
      {showCommandForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Voice Command</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Command Phrase *</label>
                <input
                  type="text"
                  value={newCommand.phrase}
                  onChange={(e) => setNewCommand({ ...newCommand, phrase: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="show dashboard"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Type *</label>
                <select
                  value={newCommand.action}
                  onChange={(e) => setNewCommand({ ...newCommand, action: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                >
                  {actionTypes.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target *</label>
                <input
                  type="text"
                  value={newCommand.target}
                  onChange={(e) => setNewCommand({ ...newCommand, target: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="/dashboard or element-id"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newCommand.category}
                  onChange={(e) => setNewCommand({ ...newCommand, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddCommand}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Add Command
              </button>
              <button
                onClick={() => setShowCommandForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { PWAFeatures, OfflineSupport, LanguageSettings, VoiceCommands };
