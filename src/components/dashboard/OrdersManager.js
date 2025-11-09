import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";
import { ordersApi } from "../../api";
import {
  formatCurrency,
  formatDateTime,
  getTimeAgo,
  getOrderStatusColor,
} from "../utils/helpers";

const OrdersManager = ({ restaurant }) => {
  const { socket, connected } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // Real-time updates
  useEffect(() => {
    if (socket && connected) {
      socket.on("order:new", (newOrder) => {
        setOrders((prev) => [newOrder, ...prev]);
      });

      socket.on("order:update", (updatedOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        if (selectedOrder?._id === updatedOrder._id) {
          setSelectedOrder(updatedOrder);
        }
      });

      socket.on("order:cancelled", (cancelledOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === cancelledOrder._id
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      });

      return () => {
        socket.off("order:new");
        socket.off("order:update");
        socket.off("order:cancelled");
      };
    }
  }, [socket, connected, selectedOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters = filter !== "all" ? { status: filter } : {};
      const data = await ordersApi.getAll(filters);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const data = await ordersApi.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await ordersApi.cancel(orderId);
      toast.success("Order cancelled");
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const filters = [
    { value: "all", label: "All Orders", count: orders.length },
    {
      value: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      count: orders.filter((o) => o.status === "confirmed").length,
    },
    {
      value: "preparing",
      label: "Preparing",
      count: orders.filter((o) => o.status === "preparing").length,
    },
    {
      value: "ready",
      label: "Ready",
      count: orders.filter((o) => o.status === "ready").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: orders.filter((o) => o.status === "completed").length,
    },
  ];

  const getStatusButtons = (order) => {
    const buttons = [];

    if (order.status === "pending") {
      buttons.push({
        label: "Confirm",
        action: () => updateOrderStatus(order._id, "confirmed"),
        color: "bg-blue-600 hover:bg-blue-700",
      });
      buttons.push({
        label: "Reject",
        action: () => cancelOrder(order._id),
        color: "bg-red-600 hover:bg-red-700",
      });
    }

    if (order.status === "confirmed") {
      buttons.push({
        label: "Start Preparing",
        action: () => updateOrderStatus(order._id, "preparing"),
        color: "bg-purple-600 hover:bg-purple-700",
      });
    }

    if (order.status === "preparing") {
      buttons.push({
        label: "Mark Ready",
        action: () => updateOrderStatus(order._id, "ready"),
        color: "bg-green-600 hover:bg-green-700",
      });
    }

    if (order.status === "ready") {
      buttons.push({
        label: "Complete",
        action: () => updateOrderStatus(order._id, "completed"),
        color: "bg-gray-600 hover:bg-gray-700",
      });
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">Manage incoming orders</p>
        </div>
        <div className="flex items-center space-x-2">
          {connected ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Updates
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Disconnected
            </span>
          )}
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === f.value
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === f.value
                    ? "bg-orange-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600">
            Orders from your website will appear here in real-time
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getTimeAgo(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {order.orderType}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              {order.customer && (
                <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Items Summary */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Items ({order.items?.length || 0}):
                </p>
                <div className="space-y-1">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-600">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {getStatusButtons(order).map((button, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      button.action();
                    }}
                    className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold ${button.color} transition`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-gray-600">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getOrderStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>

              {/* Customer */}
              {selectedOrder.customer && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-gray-600">
                      {selectedOrder.customer.phone}
                    </p>
                    {selectedOrder.customer.email && (
                      <p className="text-gray-600">
                        {selectedOrder.customer.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.quantity}x {item.name}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-sm text-orange-600 mt-1">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="text-sm text-gray-600 ml-4">
                          {item.modifiers.map((mod, modIdx) => (
                            <p key={modIdx}>
                              + {mod.option} ({formatCurrency(mod.price)})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {getStatusButtons(selectedOrder).map((button, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      button.action();
                      setSelectedOrder(null);
                    }}
                    className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold ${button.color}`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
