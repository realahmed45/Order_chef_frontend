import React, { useState, useEffect } from "react";
import { restaurantApi } from "../../api";
import { formatCurrency } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";
import toast from "react-hot-toast";

const Settings = ({ restaurant, onRestaurantUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      cuisineType: restaurant?.cuisineType || "",
      phone: restaurant?.contact?.phone || "",
      email: restaurant?.contact?.email || "",
      address: restaurant?.contact?.address?.street || "",
    },
    hours: restaurant?.hours || {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "23:00", closed: false },
      saturday: { open: "09:00", close: "23:00", closed: false },
      sunday: { open: "10:00", close: "21:00", closed: false },
    },
    branding: {
      primaryColor: restaurant?.branding?.primaryColor || "#EA580C",
      secondaryColor: restaurant?.branding?.secondaryColor || "#F97316",
      logo: restaurant?.branding?.logo || "",
    },
    ordering: {
      isActive: restaurant?.settings?.isActive !== false,
      orderingEnabled: restaurant?.settings?.orderingEnabled !== false,
      minOrderAmount: 0,
      deliveryFee: 0,
      taxRate: 0,
      acceptCash: true,
      acceptCard: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newOrderSound: true,
      browserNotifications: true,
    },
  });

  const tabs = [
    { id: "general", name: "General", icon: "🏪" },
    { id: "hours", name: "Operating Hours", icon: "🕒" },
    { id: "branding", name: "Branding", icon: "🎨" },
    { id: "ordering", name: "Ordering", icon: "🛒" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "website", name: "Website", icon: "🌐" },
  ];

  const cuisineTypes = [
    "pizza",
    "burger",
    "mexican",
    "italian",
    "chinese",
    "indian",
    "thai",
    "american",
    "cafe",
    "bakery",
    "bbq",
    "seafood",
    "vegetarian",
    "other",
  ];

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateHours = (day, field, value) => {
    setSettings((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };

  const saveSettings = async (section) => {
    try {
      setLoading(true);

      let updateData = {};

      switch (section) {
        case "general":
          updateData = {
            name: settings.general.name,
            description: settings.general.description,
            cuisineType: settings.general.cuisineType,
            contact: {
              phone: settings.general.phone,
              email: settings.general.email,
              address: {
                street: settings.general.address,
              },
            },
          };
          break;
        case "hours":
          updateData = { hours: settings.hours };
          break;
        case "branding":
          updateData = { branding: settings.branding };
          break;
        case "ordering":
          updateData = {
            settings: {
              isActive: settings.ordering.isActive,
              orderingEnabled: settings.ordering.orderingEnabled,
            },
          };
          break;
        default:
          break;
      }

      const response = await restaurantApi.update(restaurant._id, updateData);

      if (response.success) {
        onRestaurantUpdate(response.restaurant);
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const deployWebsite = async () => {
    try {
      setDeploying(true);
      // This would integrate with the deployment API
      toast.success("Website deployment started!");
      setShowDeployModal(false);
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Failed to deploy website");
    } finally {
      setDeploying(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Restaurant Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={settings.general.name}
              onChange={(e) => updateSetting("general", "name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type *
            </label>
            <select
              value={settings.general.cuisineType}
              onChange={(e) =>
                updateSetting("general", "cuisineType", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {cuisineTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={settings.general.description}
              onChange={(e) =>
                updateSetting("general", "description", e.target.value)
              }
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Tell customers about your restaurant..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.general.phone}
              onChange={(e) =>
                updateSetting("general", "phone", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.general.email}
              onChange={(e) =>
                updateSetting("general", "email", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={settings.general.address}
              onChange={(e) =>
                updateSetting("general", "address", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="123 Main St, City, State 12345"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings("general")}
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderHoursSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Operating Hours
        </h3>
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-24">
                <span className="font-medium text-gray-900 capitalize">
                  {day}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!settings.hours[day].closed}
                  onChange={(e) =>
                    updateHours(day, "closed", !e.target.checked)
                  }
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <span className="text-sm text-gray-600">Open</span>
              </div>

              {!settings.hours[day].closed && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={settings.hours[day].open}
                      onChange={(e) => updateHours(day, "open", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={settings.hours[day].close}
                      onChange={(e) =>
                        updateHours(day, "close", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {settings.hours[day].closed && (
                <span className="text-red-600 font-medium">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings("hours")}
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Hours"}
        </button>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Brand Colors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.branding.primaryColor}
                onChange={(e) =>
                  updateSetting("branding", "primaryColor", e.target.value)
                }
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.branding.primaryColor}
                onChange={(e) =>
                  updateSetting("branding", "primaryColor", e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="#EA580C"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.branding.secondaryColor}
                onChange={(e) =>
                  updateSetting("branding", "secondaryColor", e.target.value)
                }
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.branding.secondaryColor}
                onChange={(e) =>
                  updateSetting("branding", "secondaryColor", e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="#F97316"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <label htmlFor="logo-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload a logo
              </span>
              <input
                id="logo-upload"
                name="logo-upload"
                type="file"
                className="sr-only"
                accept="image/*"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings("branding")}
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Branding"}
        </button>
      </div>
    </div>
  );

  const renderOrderingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ordering Status
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Restaurant Active</h4>
              <p className="text-sm text-gray-600">
                Turn off to temporarily close your restaurant
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ordering.isActive}
                onChange={(e) =>
                  updateSetting("ordering", "isActive", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Online Ordering</h4>
              <p className="text-sm text-gray-600">
                Accept orders through your website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ordering.orderingEnabled}
                onChange={(e) =>
                  updateSetting("ordering", "orderingEnabled", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveSettings("ordering")}
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              desc: "Receive order updates via email",
            },
            {
              key: "smsNotifications",
              label: "SMS Notifications",
              desc: "Get text messages for new orders",
            },
            {
              key: "newOrderSound",
              label: "Order Sound",
              desc: "Play sound when new orders arrive",
            },
            {
              key: "browserNotifications",
              label: "Browser Notifications",
              desc: "Show browser popup notifications",
            },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">{setting.label}</h4>
                <p className="text-sm text-gray-600">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[setting.key]}
                  onChange={(e) =>
                    updateSetting(
                      "notifications",
                      setting.key,
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWebsiteSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Website Status
        </h3>
        {restaurant?.website?.isPublished ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">
                  Website is Live!
                </h4>
                <p className="text-green-700">
                  Your website is published and accepting orders
                </p>
              </div>
            </div>

            {restaurant.website.websiteUrl && (
              <div className="mt-4">
                <p className="text-sm text-green-700 mb-2">Website URL:</p>
                <a
                  href={restaurant.website.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 font-medium break-all"
                >
                  {restaurant.website.websiteUrl}
                </a>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowDeployModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                🚀 Redeploy Website
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">
                ⚙️ Customize
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900">
                  Website Not Published
                </h4>
                <p className="text-yellow-700">
                  Complete your setup to publish your website
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => (window.location.href = "/onboarding")}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
              >
                🔧 Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Website Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-gray-900">Website Analytics</p>
                <p className="text-sm text-gray-600">View visitor statistics</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="font-semibold text-gray-900">Share Links</p>
                <p className="text-sm text-gray-600">Get shareable QR codes</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-semibold text-gray-900">Theme Editor</p>
                <p className="text-sm text-gray-600">Customize your design</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold text-gray-900">Mobile Preview</p>
                <p className="text-sm text-gray-600">Test on mobile devices</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "hours":
        return renderHoursSettings();
      case "branding":
        return renderBrandingSettings();
      case "ordering":
        return renderOrderingSettings();
      case "notifications":
        return renderNotificationSettings();
      case "website":
        return renderWebsiteSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Restaurant Settings
        </h2>
        <p className="text-gray-600">
          Manage your restaurant configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">{renderTabContent()}</div>

      {/* Deploy Modal */}
      <ConfirmModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        onConfirm={deployWebsite}
        title="Redeploy Website"
        message="This will update your live website with any changes you've made. The process takes about 2-3 minutes."
        confirmText="Deploy Now"
        loading={deploying}
        variant="info"
      />
    </div>
  );
};

export default Settings;
