import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Context
import { useSocket } from "../../context/SocketContext";

// API
import { restaurantApi, analyticsApi } from "../../api";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";

// Utils
import { playNotificationSound, showNotification } from "../utils/helpers";

// Dashboard Components
import DashboardOverview from "./DashboardOverview";
import OrdersManager from "./OrdersManager";
import MenuManager from "./MenuManager";
import CustomersManager from "./CustomersManager";
import InventoryManager from "./InventoryManager";
import Analytics from "./Analytics";
import Settings from "./Settings";

// Advanced Features
import QRCodeManager from "./QRCodeManager";
import SocialOrderingManager from "./SocialOrderingManager";
import MultiLocationManager from "./MultiLocationManager";
import LoyaltyProgramManager from "./LoyaltyProgramManager";
import AIPhoneManager from "./AIPhoneManager";
import WebsiteDeploymentManager from "./WebsiteDeploymentManager";

// NEW COMPONENTS
import StaffManager from "../features/StaffManager";
import PaymentManager from "./PaymentManager";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, connected, joinRestaurant, restaurantId } = useSocket();

  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState(0);

  // Get active tab from URL
  const getActiveTab = () => {
    const path = location.pathname.split("/dashboard/")[1] || "";
    return path || "overview";
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    fetchRestaurant();
    fetchAnalytics();
  }, []);

  // Socket.io listeners
  useEffect(() => {
    if (socket && connected && restaurantId) {
      // Listen for new orders
      socket.on("order:new", (order) => {
        console.log("🔔 New order received:", order);
        playNotificationSound();
        showNotification("New Order!", {
          body: `Order #${order.orderNumber} - $${order.totalAmount.toFixed(
            2
          )}`,
        });
        setActiveOrders((prev) => prev + 1);
        fetchAnalytics(); // Refresh stats
        toast.success(`New order #${order.orderNumber}!`);
      });

      // Listen for order updates
      socket.on("order:update", (order) => {
        console.log("📝 Order updated:", order);
        if (order.status === "completed") {
          setActiveOrders((prev) => Math.max(0, prev - 1));
        }
        fetchAnalytics();
      });

      // Listen for order cancellations
      socket.on("order:cancelled", (order) => {
        console.log("❌ Order cancelled:", order);
        setActiveOrders((prev) => Math.max(0, prev - 1));
        toast.error(`Order #${order.orderNumber} cancelled`);
      });

      return () => {
        socket.off("order:new");
        socket.off("order:update");
        socket.off("order:cancelled");
      };
    }
  }, [socket, connected, restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const data = await restaurantApi.getMyRestaurant();
      if (data.success && data.restaurant) {
        setRestaurant(data.restaurant);
        // Join restaurant room for Socket.io
        if (data.restaurant._id) {
          joinRestaurant(data.restaurant._id);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      if (error.response?.status === 404) {
        // No restaurant found, redirect to onboarding
        navigate("/onboarding");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsApi.getDashboard();
      setAnalytics(data);
      setActiveOrders(data.activeOrders || 0);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊", path: "" },
    { id: "orders", name: "Orders", icon: "🛒", path: "orders" },
    { id: "menu", name: "Menu", icon: "📝", path: "menu" },
    { id: "customers", name: "Customers", icon: "👥", path: "customers" },
    { id: "inventory", name: "Inventory", icon: "📦", path: "inventory" },
    { id: "staff", name: "Staff", icon: "👨‍💼", path: "staff" },
    { id: "payments", name: "Payments", icon: "💳", path: "payments" },
    { id: "analytics", name: "Analytics", icon: "📈", path: "analytics" },
    { id: "qr-codes", name: "QR Codes", icon: "📱", path: "qr-codes" },
    { id: "social", name: "Social", icon: "💬", path: "social" },
    { id: "loyalty", name: "Loyalty", icon: "🎯", path: "loyalty" },
    { id: "ai-phone", name: "AI Phone", icon: "☎️", path: "ai-phone" },
    { id: "website", name: "Website", icon: "🌐", path: "website" },
    { id: "multi-location", name: "Locations", icon: "🏢", path: "locations" },
    { id: "settings", name: "Settings", icon: "⚙️", path: "settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Restaurant Found
          </h2>
          <p className="text-gray-600 mb-6">
            You need to set up your restaurant first before accessing the
            dashboard.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Set Up Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name}!
                </p>
                {connected ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    Disconnected
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {activeOrders > 0 && (
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold">
                  {activeOrders} Active Order{activeOrders !== 1 ? "s" : ""}
                </div>
              )}
              <button
                onClick={() => navigate("/kitchen")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center space-x-2"
              >
                <span>👨‍🍳</span>
                <span>Kitchen Display</span>
              </button>
              {restaurant.website?.websiteUrl && (
                <a
                  href={restaurant.website.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>🌐</span>
                  <span>View Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/dashboard/${tab.path}`)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardOverview
                restaurant={restaurant}
                analytics={analytics}
                refreshAnalytics={fetchAnalytics}
              />
            }
          />
          <Route
            path="orders"
            element={<OrdersManager restaurant={restaurant} />}
          />
          <Route
            path="menu"
            element={<MenuManager restaurant={restaurant} />}
          />
          <Route
            path="customers"
            element={<CustomersManager restaurant={restaurant} />}
          />
          <Route
            path="inventory"
            element={<InventoryManager restaurant={restaurant} />}
          />
          <Route
            path="staff"
            element={<StaffManager restaurant={restaurant} />}
          />
          <Route
            path="payments"
            element={<PaymentManager restaurant={restaurant} />}
          />
          <Route
            path="analytics"
            element={<Analytics restaurant={restaurant} />}
          />
          <Route
            path="qr-codes"
            element={<QRCodeManager restaurant={restaurant} />}
          />
          <Route
            path="social"
            element={<SocialOrderingManager restaurant={restaurant} />}
          />
          <Route
            path="loyalty"
            element={<LoyaltyProgramManager restaurant={restaurant} />}
          />
          <Route
            path="ai-phone"
            element={<AIPhoneManager restaurant={restaurant} />}
          />
          <Route
            path="website"
            element={<WebsiteDeploymentManager restaurant={restaurant} />}
          />
          <Route
            path="locations"
            element={<MultiLocationManager restaurant={restaurant} />}
          />
          <Route
            path="settings"
            element={
              <Settings
                restaurant={restaurant}
                onRestaurantUpdate={setRestaurant}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
