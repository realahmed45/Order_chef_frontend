import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Rocket, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Download,
  Copy,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  CloudUpload,
  Server,
  Shield,
  BarChart3,
  RefreshCw,
  Eye,
  Code,
  Palette
} from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { FormModal, ConfirmModal } from './common/Modal';

const WebsiteDeploymentManager = ({ restaurant, menuItems }) => {
  const [deploymentStatus, setDeploymentStatus] = useState('not_deployed');
  const [deploymentHistory, setDeploymentHistory] = useState([]);
  const [websiteConfig, setWebsiteConfig] = useState({});
  const [customDomain, setCustomDomain] = useState('');
  const [sslStatus, setSSLStatus] = useState('pending');
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState('deployment');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  // Hosting providers
  const hostingProviders = [
    {
      id: 'vercel',
      name: 'Vercel',
      icon: '▲',
      description: 'Fastest deployment with global CDN',
      features: ['Instant deployments', 'Global CDN', 'Automatic HTTPS', 'Custom domains'],
      status: 'available',
      recommended: true
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: '🌐',
      description: 'Reliable hosting with form handling',
      features: ['Continuous deployment', 'Form handling', 'Edge functions', 'Analytics'],
      status: 'available',
      recommended: false
    },
    {
      id: 'github_pages',
      name: 'GitHub Pages',
      icon: '🐙',
      description: 'Free hosting for static sites',
      features: ['Free hosting', 'GitHub integration', 'Custom domains', 'Jekyll support'],
      status: 'available',
      recommended: false
    },
    {
      id: 'firebase',
      name: 'Firebase Hosting',
      icon: '🔥',
      description: 'Google Cloud hosting solution',
      features: ['Global CDN', 'Real-time updates', 'Google Analytics', 'A/B testing'],
      status: 'available',
      recommended: false
    }
  ];

  useEffect(() => {
    fetchDeploymentData();
    fetchAnalytics();
  }, []);

  const fetchDeploymentData = async () => {
    try {
      setLoading(true);
      
      const [statusRes, historyRes, configRes, domainRes] = await Promise.all([
        fetch('/api/deployment/status', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/deployment/history', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/deployment/config', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/deployment/domain', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const [statusData, historyData, configData, domainData] = await Promise.all([
        statusRes.json(),
        historyRes.json(),
        configRes.json(),
        domainRes.json()
      ]);

      if (statusData.success) setDeploymentStatus(statusData.status);
      if (historyData.success) setDeploymentHistory(historyData.history);
      if (configData.success) setWebsiteConfig(configData.config);
      if (domainData.success) {
        setCustomDomain(domainData.domain);
        setSSLStatus(domainData.sslStatus);
      }

    } catch (error) {
      console.error('Error fetching deployment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/deployment/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching deployment analytics:', error);
    }
  };

  const deployWebsite = async (provider = 'vercel', config = {}) => {
    try {
      setDeploying(true);
      setDeploymentStatus('deploying');

      const response = await fetch('/api/deployment/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          provider,
          restaurantId: restaurant._id,
          menuItems,
          config: {
            ...websiteConfig,
            ...config
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setDeploymentStatus('deployed');
        await fetchDeploymentData();
        alert('🎉 Website deployed successfully!');
      } else {
        setDeploymentStatus('failed');
        throw new Error(data.message || 'Deployment failed');
      }

    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('failed');
      alert('❌ Deployment failed: ' + error.message);
    } finally {
      setDeploying(false);
    }
  };

  const redeployWebsite = async () => {
    if (window.confirm('Are you sure you want to redeploy your website? This will update your live site.')) {
      await deployWebsite();
    }
  };

  const setupCustomDomain = async (domain) => {
    try {
      const response = await fetch('/api/deployment/custom-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ domain })
      });

      const data = await response.json();
      if (data.success) {
        setCustomDomain(domain);
        setSSLStatus('pending');
        await fetchDeploymentData();
        alert('Custom domain setup initiated!');
      } else {
        alert('Error setting up custom domain: ' + data.message);
      }
    } catch (error) {
      console.error('Error setting up custom domain:', error);
      alert('Failed to setup custom domain');
    }
  };

  const downloadWebsiteFiles = async () => {
    try {
      const response = await fetch('/api/deployment/download', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${restaurant.name}-website.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download website files');
      }
    } catch (error) {
      console.error('Error downloading website:', error);
      alert('Failed to download website files');
    }
  };

  const copyWebsiteUrl = () => {
    const url = getWebsiteUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Website URL copied to clipboard!');
    }
  };

  const getWebsiteUrl = () => {
    if (customDomain) {
      return `https://${customDomain}`;
    }
    if (restaurant?.website?.websiteUrl) {
      return restaurant.website.websiteUrl;
    }
    return null;
  };

  const getDeploymentStatusColor = (status) => {
    const colors = {
      not_deployed: 'bg-gray-100 text-gray-800',
      deploying: 'bg-yellow-100 text-yellow-800',
      deployed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      updating: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeploymentStatusIcon = (status) => {
    const icons = {
      not_deployed: <AlertCircle className="w-4 h-4" />,
      deploying: <RefreshCw className="w-4 h-4 animate-spin" />,
      deployed: <CheckCircle className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />,
      updating: <RefreshCw className="w-4 h-4 animate-spin" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading deployment status..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Deployment</h2>
          <p className="text-gray-600">Deploy and manage your restaurant website</p>
        </div>
        <div className="flex items-center space-x-3">
          {deploymentStatus === 'deployed' && (
            <>
              <button
                onClick={copyWebsiteUrl}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </button>
              <button
                onClick={() => window.open(getWebsiteUrl(), '_blank')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </button>
            </>
          )}
        </div>
      </div>

      {/* Deployment Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Deployment Status</h3>
              <p className="text-sm text-gray-600">Current status of your website</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDeploymentStatusColor(deploymentStatus)}`}>
              {getDeploymentStatusIcon(deploymentStatus)}
              <span className="ml-1 capitalize">{deploymentStatus.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        {deploymentStatus === 'deployed' && getWebsiteUrl() && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-900">Your website is live! 🎉</p>
                <p className="text-sm text-green-700 break-all">{getWebsiteUrl()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyWebsiteUrl}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.open(getWebsiteUrl(), '_blank')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {deploymentStatus === 'not_deployed' && (
          <div className="text-center py-8">
            <Globe className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Deploy</h3>
            <p className="text-gray-600 mb-6">Your website is ready to go live. Choose a hosting provider below.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {hostingProviders.filter(p => p.recommended).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => deployWebsite(provider.id)}
                  disabled={deploying}
                  className="p-4 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
                >
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl mr-2">{provider.icon}</span>
                    <span className="font-semibold">{provider.name}</span>
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAdvancedModal(true)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              View all hosting options →
            </button>
          </div>
        )}

        {deploymentStatus === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700">
                Deployment failed. Please try again or contact support if the issue persists.
              </p>
              <button
                onClick={() => deployWebsite()}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry Deployment
              </button>
            </div>
          </div>
        )}

        {deploymentStatus === 'deployed' && (
          <div className="flex space-x-3">
            <button
              onClick={redeployWebsite}
              disabled={deploying}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {deploying ? 'Redeploying...' : 'Redeploy Website'}
            </button>
            
            <button
              onClick={() => setShowDomainModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Globe className="w-4 h-4 mr-2" />
              Custom Domain
            </button>
            
            <button
              onClick={downloadWebsiteFiles}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Files
            </button>
          </div>
        )}
      </div>

      {/* Analytics Cards */}
      {deploymentStatus === 'deployed' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.pageViews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Load Time</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.loadTime || 0}s</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SSL Status</p>
                <p className={`text-lg font-bold ${sslStatus === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {sslStatus.charAt(0).toUpperCase() + sslStatus.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.uptime || 99.9}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'deployment', label: 'Deployment', icon: Rocket },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'deployment' && (
            <DeploymentHistoryTab history={deploymentHistory} />
          )}

          {activeTab === 'preview' && (
            <WebsitePreviewTab 
              restaurant={restaurant}
              menuItems={menuItems}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
            />
          )}

          {activeTab === 'analytics' && (
            <DeploymentAnalyticsTab analytics={analytics} />
          )}

          {activeTab === 'settings' && (
            <DeploymentSettingsTab 
              config={websiteConfig}
              customDomain={customDomain}
              sslStatus={sslStatus}
            />
          )}
        </div>
      </div>

      {/* Custom Domain Modal */}
      <FormModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          setupCustomDomain(formData.get('domain'));
          setShowDomainModal(false);
        }}
        title="Setup Custom Domain"
        submitText="Setup Domain"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Name
            </label>
            <input
              name="domain"
              type="text"
              placeholder="yourdomain.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll need to update your domain's DNS settings to point to our servers. 
              Instructions will be provided after setup.
            </p>
          </div>
        </div>
      </FormModal>

      {/* Advanced Hosting Options Modal */}
      <FormModal
        isOpen={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        onSubmit={() => setShowAdvancedModal(false)}
        title="Choose Hosting Provider"
        submitText="Cancel"
      >
        <div className="space-y-4">
          {hostingProviders.map((provider) => (
            <div
              key={provider.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      {provider.name}
                      {provider.recommended && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    deployWebsite(provider.id);
                    setShowAdvancedModal(false);
                  }}
                  disabled={deploying || provider.status !== 'available'}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  Deploy
                </button>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormModal>
    </div>
  );
};

// Deployment History Tab Component
const DeploymentHistoryTab = ({ history }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Deployment History</h3>
      
      <div className="space-y-3">
        {history.map((deployment, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                deployment.status === 'success' ? 'bg-green-500' : 
                deployment.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <div>
                <p className="font-medium text-gray-900">
                  Deployed to {deployment.provider}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDateTime(deployment.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                deployment.status === 'success' ? 'bg-green-100 text-green-800' :
                deployment.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {deployment.status}
              </span>
              
              {deployment.url && (
                <button
                  onClick={() => window.open(deployment.url, '_blank')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="text-center py-8">
          <Rocket className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No deployments yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Deploy your website to see deployment history here
          </p>
        </div>
      )}
    </div>
  );
};

// Website Preview Tab Component
const WebsitePreviewTab = ({ restaurant, menuItems, previewMode, setPreviewMode }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Website Preview</h3>
        
        <div className="flex items-center space-x-2">
          {[
            { mode: 'desktop', icon: Monitor, label: 'Desktop' },
            { mode: 'tablet', icon: Tablet, label: 'Tablet' },
            { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`p-2 rounded-lg ${
                previewMode === mode
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 p-4">
        <div className={`bg-white mx-auto transition-all duration-300 ${
          previewMode === 'mobile' ? 'max-w-sm' :
          previewMode === 'tablet' ? 'max-w-2xl' : 'w-full'
        }`} style={{ minHeight: '600px' }}>
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-orange-600 mb-2">
                {restaurant?.name || 'Your Restaurant'}
              </h1>
              <p className="text-gray-600">
                {restaurant?.description || 'Delicious food delivered to your door'}
              </p>
            </div>

            <div className="grid gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
              {menuItems?.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">${item.price}</p>
                    <button className="mt-1 px-3 py-1 bg-orange-600 text-white rounded text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Deployment Analytics Tab Component
const DeploymentAnalyticsTab = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Website Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Load Time</span>
              <span className="font-medium">{analytics.loadTime || 0}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Performance Score</span>
              <span className="font-medium">{analytics.performanceScore || 0}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile Friendly</span>
              <span className="font-medium text-green-600">✓ Yes</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Traffic Overview</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Visitors</span>
              <span className="font-medium">{analytics.visitors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Page Views</span>
              <span className="font-medium">{analytics.pageViews || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-medium">{analytics.bounceRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Deployment Settings Tab Component
const DeploymentSettingsTab = ({ config, customDomain, sslStatus }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Deployment Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Domain Configuration</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Custom Domain</label>
              <p className="font-medium">{customDomain || 'None configured'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">SSL Status</label>
              <p className={`font-medium ${sslStatus === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                {sslStatus.charAt(0).toUpperCase() + sslStatus.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Build Configuration</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Build Command</label>
              <p className="font-medium font-mono text-sm">npm run build</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Output Directory</label>
              <p className="font-medium font-mono text-sm">dist/</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDeploymentManager;
