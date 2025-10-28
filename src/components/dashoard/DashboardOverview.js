import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils/helpers";

const DashboardOverview = ({ restaurant, analytics, refreshAnalytics }) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Today's Revenue",
      value: formatCurrency(analytics?.todaysStats?.revenue || 0),
      icon: "💰",
      color: "from-blue-500 to-blue-600",
      change: "+12%",
    },
    {
      label: "Today's Orders",
      value: analytics?.todaysStats?.orders || 0,
      icon: "🛒",
      color: "from-green-500 to-green-600",
      change: "+8%",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(analytics?.todaysStats?.averageOrderValue || 0),
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      change: "+5%",
    },
    {
      label: "Active Orders",
      value: analytics?.activeOrders || 0,
      icon: "🔥",
      color: "from-orange-500 to-orange-600",
      change: "",
    },
  ];

  const quickActions = [
    {
      title: "Manage Menu",
      description: "Add or edit menu items",
      icon: "📝",
      color: "orange",
      action: () => navigate("/dashboard/menu"),
    },
    {
      title: "View Orders",
      description: "Manage incoming orders",
      icon: "🛒",
      color: "green",
      action: () => navigate("/dashboard/orders"),
    },
    {
      title: "Kitchen Display",
      description: "Live kitchen screen",
      icon: "👨‍🍳",
      color: "blue",
      action: () => navigate("/kitchen"),
    },
    {
      title: "Customers",
      description: "View customer database",
      icon: "👥",
      color: "purple",
      action: () => navigate("/dashboard/customers"),
    },
  ];

  const popularItems = analytics?.popularItems || [];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-lg shadow-lg`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium opacity-90">{stat.label}</h3>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            {stat.change && (
              <p className="text-sm opacity-90">
                <span className="font-semibold">{stat.change}</span> vs
                yesterday
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white border-2 border-gray-200 p-6 rounded-lg text-left hover:border-orange-500 hover:shadow-lg transition group"
            >
              <div
                className={`w-12 h-12 bg-${action.color}-100 rounded-lg mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition`}
              >
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      {popularItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Popular Items This Week
          </h2>
          <div className="space-y-4">
            {popularItems.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center font-bold text-orange-600">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item._id}</h4>
                    <p className="text-sm text-gray-600">{item.count} orders</p>
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
        </div>
      )}

      {/* Restaurant Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Restaurant Info
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{restaurant.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cuisine Type</p>
              <p className="font-semibold text-gray-900 capitalize">
                {restaurant.cuisineType}
              </p>
            </div>
            {restaurant.contact?.phone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.contact.phone}
                </p>
              </div>
            )}
            {restaurant.contact?.email && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.contact.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Website Status
          </h2>
          {restaurant.website?.isPublished ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="font-semibold text-green-700">
                  Website is Live
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(restaurant.website.publishedAt)}
                </p>
              </div>
              {restaurant.website.websiteUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Your Website</p>
                  <a
                    href={restaurant.website.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 font-medium break-all"
                  >
                    {restaurant.website.websiteUrl}
                  </a>
                </div>
              )}
              <button
                onClick={() => navigate("/onboarding")}
                className="mt-4 w-full bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200"
              >
                Update Website
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌐</span>
              </div>
              <p className="text-gray-600 mb-4">
                Your website is not published yet
              </p>
              <button
                onClick={() => navigate("/onboarding")}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700"
              >
                Publish Website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
