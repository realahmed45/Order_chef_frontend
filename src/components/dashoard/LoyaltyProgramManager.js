import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Star, 
  Gift, 
  Target, 
  TrendingUp,
  Users,
  DollarSign,
  Send,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Settings,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Filter,
  Search,
  Zap,
  Crown,
  Trophy
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatDate } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { FormModal, ConfirmModal } from './common/Modal';
import Modal from './common/Modal';

const LoyaltyProgramManager = ({ restaurant }) => {
  const [loyaltySettings, setLoyaltySettings] = useState({});
  const [rewards, setRewards] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filters, setFilters] = useState({
    tier: 'all',
    status: 'all',
    dateRange: '30d'
  });

  const [rewardFormData, setRewardFormData] = useState({
    name: '',
    description: '',
    pointsCost: '',
    type: 'discount',
    value: '',
    category: '',
    expiryDays: '',
    isActive: true,
    maxRedemptions: '',
    minOrderValue: ''
  });

  const [campaignFormData, setCampaignFormData] = useState({
    name: '',
    description: '',
    type: 'points_multiplier',
    value: '',
    startDate: '',
    endDate: '',
    minOrderValue: '',
    isActive: true,
    targetTiers: [],
    maxParticipants: ''
  });

  const customerTiers = [
    { name: 'Bronze', minPoints: 0, color: 'bg-orange-100 text-orange-800', icon: '🥉' },
    { name: 'Silver', minPoints: 100, color: 'bg-gray-100 text-gray-800', icon: '🥈' },
    { name: 'Gold', minPoints: 500, color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
    { name: 'Platinum', minPoints: 1000, color: 'bg-purple-100 text-purple-800', icon: '💎' },
    { name: 'VIP', minPoints: 2000, color: 'bg-blue-100 text-blue-800', icon: '👑' }
  ];

  useEffect(() => {
    fetchLoyaltyData();
    fetchAnalytics();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      
      const [settingsRes, rewardsRes, campaignsRes, customersRes] = await Promise.all([
        fetch('/api/loyalty/settings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/loyalty/rewards', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/loyalty/campaigns', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/loyalty/customers', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const [settingsData, rewardsData, campaignsData, customersData] = await Promise.all([
        settingsRes.json(),
        rewardsRes.json(),
        campaignsRes.json(),
        customersRes.json()
      ]);

      if (settingsData.success) setLoyaltySettings(settingsData.settings);
      if (rewardsData.success) setRewards(rewardsData.rewards);
      if (campaignsData.success) setCampaigns(campaignsData.campaigns);
      if (customersData.success) setCustomers(customersData.customers);

    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/loyalty/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching loyalty analytics:', error);
    }
  };

  const handleRewardSubmit = async (e) => {
    e.preventDefault();
    
    if (!rewardFormData.name || !rewardFormData.pointsCost) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const url = editingReward ? `/api/loyalty/rewards/${editingReward._id}` : '/api/loyalty/rewards';
      const method = editingReward ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(rewardFormData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchLoyaltyData();
        resetRewardForm();
        alert(`Reward ${editingReward ? 'updated' : 'created'} successfully!`);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Failed to save reward');
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    
    if (!campaignFormData.name || !campaignFormData.type) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const url = editingCampaign ? `/api/loyalty/campaigns/${editingCampaign._id}` : '/api/loyalty/campaigns';
      const method = editingCampaign ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(campaignFormData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchLoyaltyData();
        resetCampaignForm();
        alert(`Campaign ${editingCampaign ? 'updated' : 'created'} successfully!`);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign');
    }
  };

  const sendLoyaltyMessage = async (customerIds, message, subject) => {
    try {
      const response = await fetch('/api/loyalty/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ customerIds, message, subject })
      });

      const data = await response.json();
      if (data.success) {
        alert('Message sent successfully!');
        setSelectedCustomers([]);
      } else {
        alert('Error sending message: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const getCustomerTier = (points) => {
    for (let i = customerTiers.length - 1; i >= 0; i--) {
      if (points >= customerTiers[i].minPoints) {
        return customerTiers[i];
      }
    }
    return customerTiers[0];
  };

  const resetRewardForm = () => {
    setRewardFormData({
      name: '',
      description: '',
      pointsCost: '',
      type: 'discount',
      value: '',
      category: '',
      expiryDays: '',
      isActive: true,
      maxRedemptions: '',
      minOrderValue: ''
    });
    setEditingReward(null);
    setShowRewardModal(false);
  };

  const resetCampaignForm = () => {
    setCampaignFormData({
      name: '',
      description: '',
      type: 'points_multiplier',
      value: '',
      startDate: '',
      endDate: '',
      minOrderValue: '',
      isActive: true,
      targetTiers: [],
      maxParticipants: ''
    });
    setEditingCampaign(null);
    setShowCampaignModal(false);
  };

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setRewardFormData({
      name: reward.name,
      description: reward.description || '',
      pointsCost: reward.pointsCost.toString(),
      type: reward.type,
      value: reward.value.toString(),
      category: reward.category || '',
      expiryDays: reward.expiryDays?.toString() || '',
      isActive: reward.isActive !== false,
      maxRedemptions: reward.maxRedemptions?.toString() || '',
      minOrderValue: reward.minOrderValue?.toString() || ''
    });
    setShowRewardModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCampaignFormData({
      name: campaign.name,
      description: campaign.description || '',
      type: campaign.type,
      value: campaign.value.toString(),
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      minOrderValue: campaign.minOrderValue?.toString() || '',
      isActive: campaign.isActive !== false,
      targetTiers: campaign.targetTiers || [],
      maxParticipants: campaign.maxParticipants?.toString() || ''
    });
    setShowCampaignModal(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading loyalty program..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loyalty Program</h2>
          <p className="text-gray-600">Reward your customers and build lasting relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalPointsEarned?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rewards Redeemed</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.rewardsRedeemed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Program ROI</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.programROI || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'rewards', label: 'Rewards', icon: Gift },
              { id: 'campaigns', label: 'Campaigns', icon: Target },
              { id: 'customers', label: 'Members', icon: Users },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
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
          {activeTab === 'dashboard' && (
            <LoyaltyDashboard 
              analytics={analytics} 
              customers={customers}
              customerTiers={customerTiers}
              getCustomerTier={getCustomerTier}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsTab
              rewards={rewards}
              onAdd={() => setShowRewardModal(true)}
              onEdit={handleEditReward}
              onDelete={(reward) => console.log('Delete reward:', reward)}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsTab
              campaigns={campaigns}
              onAdd={() => setShowCampaignModal(true)}
              onEdit={handleEditCampaign}
              onDelete={(campaign) => console.log('Delete campaign:', campaign)}
            />
          )}

          {activeTab === 'customers' && (
            <LoyaltyCustomersTab
              customers={customers}
              customerTiers={customerTiers}
              getCustomerTier={getCustomerTier}
              selectedCustomers={selectedCustomers}
              setSelectedCustomers={setSelectedCustomers}
              filters={filters}
              setFilters={setFilters}
            />
          )}

          {activeTab === 'communication' && (
            <CommunicationTab
              customers={customers}
              selectedCustomers={selectedCustomers}
              onSendMessage={sendLoyaltyMessage}
            />
          )}

          {activeTab === 'settings' && (
            <LoyaltySettingsTab
              settings={loyaltySettings}
              customerTiers={customerTiers}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Reward Modal */}
      <FormModal
        isOpen={showRewardModal}
        onClose={resetRewardForm}
        onSubmit={handleRewardSubmit}
        title={editingReward ? 'Edit Reward' : 'Create Reward'}
        submitText={editingReward ? 'Update Reward' : 'Create Reward'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reward Name *
            </label>
            <input
              type="text"
              value={rewardFormData.name}
              onChange={(e) => setRewardFormData({ ...rewardFormData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Free Appetizer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Cost *
            </label>
            <input
              type="number"
              value={rewardFormData.pointsCost}
              onChange={(e) => setRewardFormData({ ...rewardFormData, pointsCost: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reward Type
            </label>
            <select
              value={rewardFormData.type}
              onChange={(e) => setRewardFormData({ ...rewardFormData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="discount">Percentage Discount</option>
              <option value="fixed_amount">Fixed Amount Off</option>
              <option value="free_item">Free Item</option>
              <option value="free_delivery">Free Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="number"
              step="0.01"
              value={rewardFormData.value}
              onChange={(e) => setRewardFormData({ ...rewardFormData, value: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={rewardFormData.category}
              onChange={(e) => setRewardFormData({ ...rewardFormData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Food, Drinks, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry (Days)
            </label>
            <input
              type="number"
              value={rewardFormData.expiryDays}
              onChange={(e) => setRewardFormData({ ...rewardFormData, expiryDays: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Redemptions
            </label>
            <input
              type="number"
              value={rewardFormData.maxRedemptions}
              onChange={(e) => setRewardFormData({ ...rewardFormData, maxRedemptions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Order Value
            </label>
            <input
              type="number"
              step="0.01"
              value={rewardFormData.minOrderValue}
              onChange={(e) => setRewardFormData({ ...rewardFormData, minOrderValue: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="25.00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={rewardFormData.description}
              onChange={(e) => setRewardFormData({ ...rewardFormData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Describe this reward..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rewardFormData.isActive}
                onChange={(e) => setRewardFormData({ ...rewardFormData, isActive: e.target.checked })}
                className="w-5 h-5 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Reward is active</span>
            </label>
          </div>
        </div>
      </FormModal>

      {/* Add/Edit Campaign Modal */}
      <FormModal
        isOpen={showCampaignModal}
        onClose={resetCampaignForm}
        onSubmit={handleCampaignSubmit}
        title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
        submitText={editingCampaign ? 'Update Campaign' : 'Create Campaign'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              value={campaignFormData.name}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Double Points Weekend"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type
            </label>
            <select
              value={campaignFormData.type}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="points_multiplier">Points Multiplier</option>
              <option value="bonus_points">Bonus Points</option>
              <option value="special_reward">Special Reward</option>
              <option value="referral_bonus">Referral Bonus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={campaignFormData.startDate}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={campaignFormData.endDate}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="number"
              step="0.01"
              value={campaignFormData.value}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, value: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="2 (for 2x multiplier)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Order Value
            </label>
            <input
              type="number"
              step="0.01"
              value={campaignFormData.minOrderValue}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, minOrderValue: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="25.00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={campaignFormData.description}
              onChange={(e) => setCampaignFormData({ ...campaignFormData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Describe this campaign..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={campaignFormData.isActive}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, isActive: e.target.checked })}
                className="w-5 h-5 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Campaign is active</span>
            </label>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

// Loyalty Dashboard Component
const LoyaltyDashboard = ({ analytics, customers, customerTiers, getCustomerTier }) => {
  const tierDistribution = customerTiers.map(tier => ({
    ...tier,
    count: customers.filter(customer => {
      const customerTier = getCustomerTier(customer.loyaltyPoints || 0);
      return customerTier.name === tier.name;
    }).length
  }));

  return (
    <div className="space-y-6">
      {/* Tier Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Tier Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tierDistribution.map((tier) => (
            <div key={tier.name} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">{tier.icon}</div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${tier.color} mb-2`}>
                {tier.name}
              </div>
              <div className="text-2xl font-bold text-gray-900">{tier.count}</div>
              <div className="text-sm text-gray-600">members</div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Enrollment Rate</span>
              <span className="font-semibold">{analytics.enrollmentRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Participation</span>
              <span className="font-semibold">{analytics.activeParticipation || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Points per Member</span>
              <span className="font-semibold">{analytics.avgPointsPerMember || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Redemption Rate</span>
              <span className="font-semibold">{analytics.redemptionRate || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Customer earned 50 points</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Rewards Tab Component
const RewardsTab = ({ rewards, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Manage Rewards</h3>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward._id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{reward.name}</h4>
                <p className="text-sm text-gray-600">{reward.description}</p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(reward)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(reward)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Points Cost:</span>
                <span className="text-sm font-medium">{reward.pointsCost}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium capitalize">{reward.type.replace('_', ' ')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Value:</span>
                <span className="text-sm font-medium">
                  {reward.type === 'discount' ? `${reward.value}%` : formatCurrency(reward.value)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${reward.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {reward.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No rewards created</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first reward to start engaging customers
          </p>
        </div>
      )}
    </div>
  );
};

// Campaigns Tab Component
const CampaignsTab = ({ campaigns, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Manage Campaigns</h3>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Campaign
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{campaign.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Type:</span>
                    <p className="font-medium capitalize">{campaign.type.replace('_', ' ')}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Value:</span>
                    <p className="font-medium">{campaign.value}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <p className="font-medium">{formatDate(campaign.startDate)}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">End Date:</span>
                    <p className="font-medium">{formatDate(campaign.endDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1 ml-4">
                <button
                  onClick={() => onEdit(campaign)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(campaign)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns created</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create marketing campaigns to boost loyalty engagement
          </p>
        </div>
      )}
    </div>
  );
};

// Loyalty Customers Tab Component
const LoyaltyCustomersTab = ({ 
  customers, 
  customerTiers, 
  getCustomerTier, 
  selectedCustomers, 
  setSelectedCustomers,
  filters,
  setFilters
}) => {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filters.tier}
          onChange={(e) => setFilters({...filters, tier: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Tiers</option>
          {customerTiers.map((tier) => (
            <option key={tier.name} value={tier.name}>
              {tier.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Customer List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomers(customers.map(c => c._id));
                      } else {
                        setSelectedCustomers([]);
                      }
                    }}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => {
                const tier = getCustomerTier(customer.loyaltyPoints || 0);
                return (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers([...selectedCustomers, customer._id]);
                          } else {
                            setSelectedCustomers(selectedCustomers.filter(id => id !== customer._id));
                          }
                        }}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{customer.loyaltyPoints || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}>
                        <span className="mr-1">{tier.icon}</span>
                        {tier.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(customer.totalSpent || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
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

// Communication Tab Component
const CommunicationTab = ({ customers, selectedCustomers, onSendMessage }) => {
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    sendTo: 'selected'
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageForm.subject || !messageForm.message) {
      alert('Please fill in all fields');
      return;
    }

    const customerIds = messageForm.sendTo === 'all' 
      ? customers.map(c => c._id) 
      : selectedCustomers;

    if (customerIds.length === 0) {
      alert('Please select customers to send message to');
      return;
    }

    onSendMessage(customerIds, messageForm.message, messageForm.subject);
    setMessageForm({ subject: '', message: '', sendTo: 'selected' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message to Loyalty Members</h3>
        
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            <select
              value={messageForm.sendTo}
              onChange={(e) => setMessageForm({...messageForm, sendTo: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="selected">Selected Customers ({selectedCustomers.length})</option>
              <option value="all">All Loyalty Members ({customers.length})</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={messageForm.subject}
              onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Special offer for our loyal customers!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={messageForm.message}
              onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Write your message here..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Loyalty Settings Tab Component
const LoyaltySettingsTab = ({ settings, customerTiers }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Settings</h3>
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Settings Configuration</h3>
          <p className="mt-1 text-sm text-gray-500">
            Loyalty program settings coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgramManager;
