import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, getTimeAgo } from "../utils/helpers";
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  Cog6ToothIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const DashboardOverview = ({ restaurant, analytics, refreshAnalytics }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Today's Revenue",
      value: formatCurrency(analytics?.todaysStats?.revenue || 0),
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-green-600",
      change: "+12.5%",
      changeType: "positive",
      description: "vs yesterday",
    },
    {
      label: "Today's Orders",
      value: analytics?.todaysStats?.orders || 0,
      icon: ShoppingBagIcon,
      color: "from-blue-500 to-blue-600",
      change: "+8.3%",
      changeType: "positive",
      description: "vs yesterday",
    },
    {
      label: "Average Order Value",
      value: formatCurrency(analytics?.todaysStats?.averageOrderValue || 0),
      icon: ChartBarIcon,
      color: "from-purple-500 to-purple-600",
      change: "+5.2%",
      changeType: "positive",
      description: "vs yesterday",
    },
    {
      label: "Active Orders",
      value: analytics?.activeOrders || 0,
      icon: ClockIcon,
      color: "from-orange-500 to-orange-600",
      change: null,
      changeType: "neutral",
      description: "pending orders",
    },
  ];

  const quickActions = [
    {
      title: "Manage Menu",
      description: "Add, edit, or organize your menu items",
      icon: "📝",
      color: "orange",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      action: () => navigate("/dashboard/menu"),
    },
    {
      title: "View Orders",
      description: "Monitor and manage incoming orders",
      icon: "🛒",
      color: "green",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      action: () => navigate("/dashboard/orders"),
    },
    {
      title: "Kitchen Display",
      description: "Live kitchen management screen",
      icon: "👨‍🍳",
      color: "blue",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      action: () => navigate("/kitchen"),
    },
    {
      title: "Customer Database",
      description: "View and manage customer information",
      icon: "👥",
      color: "purple",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      action: () => navigate("/dashboard/customers"),
    },
    {
      title: "Analytics",
      description: "Detailed business insights and reports",
      icon: "📊",
      color: "indigo",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      action: () => navigate("/dashboard/analytics"),
    },
    {
      title: "Settings",
      description: "Configure restaurant and system settings",
      icon: "⚙️",
      color: "gray",
      bgColor: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      action: () => navigate("/dashboard/settings"),
    },
  ];

  const popularItems = analytics?.popularItems || [];

  const formatTimeString = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDateString = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-orange-100 text-lg">
              Here's what's happening with {restaurant?.name} today
            </p>
          </div>
          <div className="mt-4 lg:mt-0 lg:text-right">
            <div className="text-orange-100 text-sm">
              {formatDateString(currentTime)}
            </div>
            <div className="text-2xl font-mono font-bold">
              {formatTimeString(currentTime)}
            </div>
            <div className="text-orange-100 text-sm">
              Live updates every second
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="relative">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                {stat.change && (
                  <div
                    className={`flex items-center text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {stat.changeType === "positive" && (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.changeType === "negative" && (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>

              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </h3>

              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>

              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-1" />
            Customize Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`group bg-gradient-to-br ${action.bgColor} border-2 ${action.borderColor} p-6 rounded-xl text-left hover:shadow-lg hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                {action.title}
              </h3>

              <p className="text-sm text-gray-600 group-hover:text-gray-700">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items & Restaurant Status */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              🔥 Popular Items This Week
            </h2>
            <button
              onClick={() => navigate("/dashboard/analytics")}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
            >
              View All
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          {popularItems.length > 0 ? (
            <div className="space-y-4">
              {popularItems.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-orange-50 hover:to-orange-100 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item._id}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.count} orders sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </p>
                    <p className="text-sm text-gray-600">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No sales data available yet</p>
              <button
                onClick={() => navigate("/dashboard/menu")}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Add Menu Items →
              </button>
            </div>
          )}
        </div>

        {/* Restaurant Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Restaurant Status
            </h2>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
            >
              Settings
              <Cog6ToothIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Website Status */}
            {restaurant?.website?.isPublished ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Website is Live! 🌐
                    </h3>
                    <p className="text-sm text-green-700">
                      Published {getTimeAgo(restaurant.website.publishedAt)}
                    </p>
                  </div>
                </div>

                {restaurant.website.websiteUrl && (
                  <div className="mt-3">
                    <a
                      href={restaurant.website.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-green-700 hover:text-green-800 font-medium"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Live Website
                      <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      Website Not Published
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Complete setup to start accepting orders
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/onboarding")}
                  className="text-sm bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            )}

            {/* Restaurant Info */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Restaurant Name
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  {restaurant?.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Cuisine Type
                </span>
                <span className="text-sm text-gray-900 capitalize">
                  {restaurant?.cuisineType}
                </span>
              </div>

              {restaurant?.contact?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Phone
                  </span>
                  <span className="text-sm text-gray-900">
                    {restaurant.contact.phone}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                <span
                  className={`text-sm font-semibold ${
                    restaurant?.settings?.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {restaurant?.settings?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/kitchen")}
                  className="flex items-center justify-center p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-purple-700 font-medium text-sm">
                    👨‍🍳 Kitchen
                  </span>
                </button>

                <button
                  onClick={() => navigate("/dashboard/analytics")}
                  className="flex items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-700 font-medium text-sm">
                    📊 Reports
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Order System</p>
              <p className="text-xs text-gray-600">Operational</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Payment Gateway
              </p>
              <p className="text-xs text-gray-600">Operational</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Website</p>
              <p className="text-xs text-gray-600">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
