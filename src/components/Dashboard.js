import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
    fetchAnalytics();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/onboarding/my-restaurant",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "menu", name: "Menu", icon: "📝" },
    { id: "orders", name: "Orders", icon: "🛒" },
    { id: "kitchen", name: "Kitchen", icon: "👨‍🍳" },
    { id: "customers", name: "Customers", icon: "👥" },
    { id: "inventory", name: "Inventory", icon: "📦" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Manage {restaurant?.name} from one place
              </p>
            </div>
            {restaurant && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Your website:</p>
                <a
                  href={`http://${restaurant.slug}.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 font-semibold hover:text-orange-700"
                >
                  {restaurant.slug}.orderchef.com
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === "overview" && (
            <OverviewTab analytics={analytics} restaurant={restaurant} />
          )}
          {activeTab === "menu" && <MenuTab restaurant={restaurant} />}
          {activeTab === "orders" && <OrdersTab restaurant={restaurant} />}
          {activeTab === "kitchen" && <KitchenTab restaurant={restaurant} />}
          {activeTab === "customers" && (
            <CustomersTab restaurant={restaurant} />
          )}
          {activeTab === "inventory" && (
            <InventoryTab restaurant={restaurant} />
          )}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ analytics, restaurant }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Business Overview</h2>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <h3 className="text-sm font-medium opacity-90">Today's Revenue</h3>
        <p className="text-3xl font-bold mt-2">
          ${analytics?.todaysStats?.revenue?.toFixed(2) || "0.00"}
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
        <h3 className="text-sm font-medium opacity-90">Today's Orders</h3>
        <p className="text-3xl font-bold mt-2">
          {analytics?.todaysStats?.orders || 0}
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
        <h3 className="text-sm font-medium opacity-90">Avg Order Value</h3>
        <p className="text-3xl font-bold mt-2">
          ${analytics?.todaysStats?.averageOrderValue?.toFixed(2) || "0.00"}
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
        <h3 className="text-sm font-medium opacity-90">Active Orders</h3>
        <p className="text-3xl font-bold mt-2">
          {analytics?.activeOrders || 0}
        </p>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Link
        to="/menu"
        className="bg-white border-2 border-gray-200 p-6 rounded-lg text-center hover:border-orange-500 transition-colors"
      >
        <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
          📝
        </div>
        <h3 className="font-semibold mb-2">Manage Menu</h3>
        <p className="text-sm text-gray-600">Add or edit menu items</p>
      </Link>

      <Link
        to="/orders"
        className="bg-white border-2 border-gray-200 p-6 rounded-lg text-center hover:border-orange-500 transition-colors"
      >
        <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
          🛒
        </div>
        <h3 className="font-semibold mb-2">View Orders</h3>
        <p className="text-sm text-gray-600">Manage incoming orders</p>
      </Link>

      <Link
        to="/kitchen"
        className="bg-white border-2 border-gray-200 p-6 rounded-lg text-center hover:border-orange-500 transition-colors"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
          👨‍🍳
        </div>
        <h3 className="font-semibold mb-2">Kitchen Display</h3>
        <p className="text-sm text-gray-600">Live kitchen screen</p>
      </Link>

      <Link
        to="/customers"
        className="bg-white border-2 border-gray-200 p-6 rounded-lg text-center hover:border-orange-500 transition-colors"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl">
          👥
        </div>
        <h3 className="font-semibold mb-2">Customers</h3>
        <p className="text-sm text-gray-600">View customer database</p>
      </Link>
    </div>
  </div>
);

const MenuTab = ({ restaurant }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Menu Management</h2>
      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
        + Add Menu Item
      </button>
    </div>
    <p className="text-gray-600 mb-6">
      Manage your menu items, prices, and availability. Changes appear instantly
      on your website.
    </p>
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl">
        📝
      </div>
      <h3 className="text-lg font-semibold mb-2">Your Menu is Empty</h3>
      <p className="text-gray-600 mb-4">
        Add your first menu item to start accepting orders
      </p>
      <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
        Create Your First Menu Item
      </button>
    </div>
  </div>
);

const OrdersTab = ({ restaurant }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Order Management</h2>
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl">
        🛒
      </div>
      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
      <p className="text-gray-600 mb-4">
        Orders from your website will appear here in real-time
      </p>
      <p className="text-sm text-gray-500">
        Share your website link:{" "}
        <strong>{restaurant?.slug}.orderchef.com</strong>
      </p>
    </div>
  </div>
);

const KitchenTab = ({ restaurant }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Kitchen Display</h2>
    <div className="bg-gray-900 text-white rounded-lg p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl">
          👨‍🍳
        </div>
        <h3 className="text-xl font-semibold mb-2">Kitchen Display Ready</h3>
        <p className="text-gray-400">
          Active orders will appear here automatically
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Display this screen in your kitchen on a tablet or TV
        </div>
      </div>
    </div>
  </div>
);

const CustomersTab = ({ restaurant }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Customer Management</h2>
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl">
        👥
      </div>
      <h3 className="text-lg font-semibold mb-2">No Customers Yet</h3>
      <p className="text-gray-600">
        Customer profiles are created automatically when they place orders
      </p>
    </div>
  </div>
);

const InventoryTab = ({ restaurant }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
        + Add Inventory Item
      </button>
    </div>
    <p className="text-gray-600 mb-6">
      Track your ingredients and get automatic low stock alerts
    </p>
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl">
        📦
      </div>
      <h3 className="text-lg font-semibold mb-2">No Inventory Items</h3>
      <p className="text-gray-600 mb-4">
        Add your ingredients to start tracking inventory
      </p>
      <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
        Add Your First Ingredient
      </button>
    </div>
  </div>
);

export default Dashboard;
