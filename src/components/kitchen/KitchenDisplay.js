import React, { useState, useEffect, useRef } from "react";
import { ordersApi } from "../../api";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const EnhancedKitchenDisplay = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [restaurant, setRestaurant] = useState(null);
  const socket = useSocket();
  const audioRef = useRef(null);

  useEffect(() => {
    loadRestaurant();
    loadOrders();
  }, [filter]);

  useEffect(() => {
    if (restaurant && socket) {
      console.log("🔌 Joining restaurant room:", restaurant._id);
      socket.emit("join:restaurant", restaurant._id);

      socket.on("order:new", handleNewOrder);
      socket.on("order:update", handleOrderUpdate);

      return () => {
        socket.off("order:new", handleNewOrder);
        socket.off("order:update", handleOrderUpdate);
      };
    }
  }, [restaurant, socket]);

  const loadRestaurant = async () => {
    try {
      const response = await fetch(
        "https://order-chef-backend.onrender.com/api/onboarding/my-restaurant",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && data.restaurant) {
        setRestaurant(data.restaurant);
      }
    } catch (error) {
      console.error("Failed to load restaurant:", error);
      toast.error("Failed to load restaurant data");
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      let filters = {};

      if (filter === "active") {
        filters.status = "pending,confirmed,preparing";
      } else if (filter === "completed") {
        filters.status = "ready,out-for-delivery,delivered";
      }

      const data = await ordersApi.getAll(filters);
      if (data.success) {
        const sortedOrders = data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = (orderData) => {
    console.log("🔔 New order received:", orderData);
    setOrders((prev) => [orderData.order, ...prev]);
    playSound();
    toast.success(`New Order #${orderData.order.orderNumber}! 🍽️`, {
      duration: 5000,
      icon: "🔔",
    });
  };

  const handleOrderUpdate = (orderData) => {
    console.log("🔄 Order updated:", orderData);
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderData.order._id ? orderData.order : order
      )
    );
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.error("Sound play failed:", e));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const data = await ordersApi.updateStatus(orderId, newStatus);

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        if (socket && restaurant) {
          socket.emit("order:update", {
            restaurantId: restaurant._id,
            order: { _id: orderId, status: newStatus },
          });
        }

        toast.success(`Order updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-orange-100 text-orange-800 border-orange-300",
      ready: "bg-green-100 text-green-800 border-green-300",
      "out-for-delivery": "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-gray-100 text-gray-800 border-gray-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "out-for-delivery",
      "out-for-delivery": "delivered",
    };
    return statusFlow[currentStatus];
  };

  const getStatusLabel = (status) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "active") {
      return ["pending", "confirmed", "preparing"].includes(order.status);
    } else if (filter === "completed") {
      return ["ready", "out-for-delivery", "delivered"].includes(order.status);
    }
    return true;
  });

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <audio ref={audioRef} preload="auto">
        <source
          src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  🍽️ Kitchen Display System
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {restaurant?.name || "Your Restaurant"}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === "active"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Active (
                    {
                      orders.filter((o) =>
                        ["pending", "confirmed", "preparing"].includes(o.status)
                      ).length
                    }
                    )
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === "completed"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === "all"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    All
                  </button>
                </div>

                <button
                  onClick={loadOrders}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  title="Refresh orders"
                >
                  🔄
                </button>

                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      socket?.connected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {socket?.connected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600">
              {filter === "active"
                ? "Waiting for new orders..."
                : "No orders in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-2xl ${
                  order.status === "pending"
                    ? "border-yellow-400 animate-pulse"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`p-4 ${
                    order.status === "pending"
                      ? "bg-yellow-50"
                      : order.status === "preparing"
                      ? "bg-orange-50"
                      : order.status === "ready"
                      ? "bg-green-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      #{order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      🕐 {getTimeAgo(order.createdAt)}
                    </span>
                    <span className="font-semibold text-orange-600">
                      {order.orderType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">👤</span>
                    <span className="font-semibold text-gray-900">
                      {order.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>📞</span>
                    <span>{order.customer.phone}</span>
                  </div>
                  {order.customer.address?.street && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <span>📍</span>
                      <span className="line-clamp-1">
                        {order.customer.address.street}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">📋</span>
                    Order Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-orange-600 text-lg">
                              {item.quantity}x
                            </span>
                            <span className="font-semibold text-gray-900">
                              {item.name}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-600 ml-8 mt-1 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {(order.notes || order.specialInstructions) && (
                  <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Special Instructions:
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {order.notes || order.specialInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${order.finalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold text-green-600">
                      💵 Cash on Delivery
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          getNextStatus(order.status)
                        )
                      }
                      className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition mb-2"
                    >
                      Mark as {getStatusLabel(getNextStatus(order.status))}
                    </button>
                  )}

                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "cancelled")}
                      className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.status === "delivered" && (
                    <div className="text-center text-green-600 font-semibold py-2">
                      ✅ Order Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedKitchenDisplay;
