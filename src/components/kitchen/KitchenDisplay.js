import React, { useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { ordersApi } from "../../api";
import OrderCard from "./OrderCard";
import {
  formatTime,
  getOrderAgeColor,
  getOrderAgeClass,
  playNotificationSound,
} from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

const KitchenDisplay = ({ user }) => {
  const { socket, connected, joinRestaurant } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    avgPrepTime: 0,
  });

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Real-time updates
  useEffect(() => {
    if (socket && connected) {
      socket.on("order:new", handleNewOrder);
      socket.on("order:update", handleOrderUpdate);
      socket.on("kitchen:refresh", fetchKitchenOrders);

      return () => {
        socket.off("order:new");
        socket.off("order:update");
        socket.off("kitchen:refresh");
      };
    }
  }, [socket, connected]);

  const fetchKitchenOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getKitchenOrders();
      setOrders(Array.isArray(data) ? data : []);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList) => {
    const stats = {
      pending: ordersList.filter(
        (o) => o.status === "pending" || o.status === "confirmed"
      ).length,
      preparing: ordersList.filter((o) => o.status === "preparing").length,
      ready: ordersList.filter((o) => o.status === "ready").length,
      avgPrepTime: 0,
    };

    const completedOrders = ordersList.filter(
      (o) => o.status === "completed" && o.actualReadyTime && o.createdAt
    );

    if (completedOrders.length > 0) {
      const totalPrepTime = completedOrders.reduce((sum, order) => {
        const prepTime =
          new Date(order.actualReadyTime) - new Date(order.createdAt);
        return sum + prepTime / 60000; // Convert to minutes
      }, 0);
      stats.avgPrepTime = Math.round(totalPrepTime / completedOrders.length);
    }

    setStats(stats);
  };

  const handleNewOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    playNotificationSound();
    calculateStats([newOrder, ...orders]);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prev) =>
      prev
        .map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
        .filter(
          (order) =>
            // Remove completed orders from kitchen display
            order.status !== "completed" && order.status !== "cancelled"
        )
    );

    // Recalculate stats
    const updatedOrders = orders.map((order) =>
      order._id === updatedOrder._id ? updatedOrder : order
    );
    calculateStats(updatedOrders);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await ordersApi.updateStatus(orderId, newStatus);

      setOrders((prev) =>
        prev
          .map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
          .filter(
            (order) =>
              // Remove from display if completed
              !(newStatus === "completed" && order._id === orderId)
          )
      );

      // Emit kitchen update via socket
      if (socket) {
        socket.emit("kitchen:update", { orderId, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => {
      if (status === "new") {
        return order.status === "pending" || order.status === "confirmed";
      }
      return order.status === status;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-yellow-500",
      preparing: "bg-blue-500",
      ready: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getTimeElapsed = (createdAt) => {
    const minutes = Math.floor((currentTime - new Date(createdAt)) / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          color="white"
          text="Loading kitchen orders..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">
              ðŸ³ Kitchen Display
            </h1>

            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-300">
                {connected ? "Live" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-gray-300">Current Time: </span>
              <span className="font-mono text-white">
                {formatTime(currentTime)}
              </span>
            </div>

            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-gray-300">Avg Prep: </span>
              <span className="font-bold text-white">
                {stats.avgPrepTime}min
              </span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-center space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">
              New Orders: <span className="font-bold">{stats.pending}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">
              Preparing: <span className="font-bold">{stats.preparing}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">
              Ready: <span className="font-bold">{stats.ready}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="p-12">
          <EmptyState
            icon="ðŸ‘¨â€ðŸ³"
            title="No Active Orders"
            description="All caught up! New orders will appear here automatically."
            variant="minimal"
            size="lg"
          />
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Orders Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <h2 className="text-xl font-semibold">
                  New Orders ({stats.pending})
                </h2>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getOrdersByStatus("new").map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    timeElapsed={getTimeElapsed(order.createdAt)}
                    urgency={getOrderAgeColor(order.createdAt)}
                    variant="new"
                  />
                ))}
              </div>
            </div>

            {/* Preparing Orders Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <h2 className="text-xl font-semibold">
                  Preparing ({stats.preparing})
                </h2>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getOrdersByStatus("preparing").map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    timeElapsed={getTimeElapsed(order.createdAt)}
                    urgency={getOrderAgeColor(order.createdAt)}
                    variant="preparing"
                  />
                ))}
              </div>
            </div>

            {/* Ready Orders Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <h2 className="text-xl font-semibold">Ready ({stats.ready})</h2>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                {getOrdersByStatus("ready").map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    timeElapsed={getTimeElapsed(order.createdAt)}
                    urgency={getOrderAgeColor(order.createdAt)}
                    variant="ready"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Auto-updating</span>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;
