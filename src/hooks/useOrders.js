import { useState, useEffect, useCallback } from "react";
import { ordersApi } from "../api";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

export const useOrders = (filters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  });

  const { socket, connected } = useSocket();

  // Fetch orders
  const fetchOrders = useCallback(
    async (queryFilters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const mergedFilters = { ...filters, ...queryFilters };
        const data = await ordersApi.getAll(mergedFilters);
        const ordersList = Array.isArray(data) ? data : [];
        setOrders(ordersList);
        updateStats(ordersList);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Update statistics
  const updateStats = useCallback((ordersList) => {
    const newStats = {
      total: ordersList.length,
      pending: ordersList.filter((o) => o.status === "pending").length,
      confirmed: ordersList.filter((o) => o.status === "confirmed").length,
      preparing: ordersList.filter((o) => o.status === "preparing").length,
      ready: ordersList.filter((o) => o.status === "ready").length,
      completed: ordersList.filter((o) => o.status === "completed").length,
      cancelled: ordersList.filter((o) => o.status === "cancelled").length,
    };
    setStats(newStats);
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (socket && connected) {
      const handleNewOrder = (newOrder) => {
        setOrders((prev) => [newOrder, ...prev]);
        setStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
        }));
        toast.success(`New order #${newOrder.orderNumber}!`);
      };

      const handleOrderUpdate = (updatedOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        // Recalculate stats
        fetchOrders();
      };

      const handleOrderCancelled = (cancelledOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === cancelledOrder._id
              ? { ...order, status: "cancelled" }
              : order
          )
        );
        fetchOrders();
      };

      socket.on("order:new", handleNewOrder);
      socket.on("order:update", handleOrderUpdate);
      socket.on("order:cancelled", handleOrderCancelled);

      return () => {
        socket.off("order:new", handleNewOrder);
        socket.off("order:update", handleOrderUpdate);
        socket.off("order:cancelled", handleOrderCancelled);
      };
    }
  }, [socket, connected, fetchOrders]);

  // Update order status
  const updateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      try {
        const updatedOrder = await ordersApi.updateStatus(orderId, newStatus);
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Emit real-time update
        if (socket) {
          socket.emit("order:statusUpdate", { orderId, status: newStatus });
        }

        toast.success(`Order #${updatedOrder.orderNumber} ${newStatus}!`);
        return updatedOrder;
      } catch (err) {
        console.error("Error updating order status:", err);
        toast.error("Failed to update order status");
        throw err;
      }
    },
    [socket]
  );

  // Cancel order
  const cancelOrder = useCallback(async (orderId) => {
    try {
      await ordersApi.cancel(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel order");
      throw err;
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback(async (orderId) => {
    try {
      const order = await ordersApi.getById(orderId);
      return order;
    } catch (err) {
      console.error("Error fetching order:", err);
      throw err;
    }
  }, []);

  // Get kitchen orders (active orders only)
  const getKitchenOrders = useCallback(async () => {
    try {
      const data = await ordersApi.getKitchenOrders();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching kitchen orders:", err);
      return [];
    }
  }, []);

  // Filter functions
  const getOrdersByStatus = useCallback(
    (status) => {
      if (!status || status === "all") return orders;
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  const getOrdersByType = useCallback(
    (type) => {
      if (!type || type === "all") return orders;
      return orders.filter((order) => order.orderType === type);
    },
    [orders]
  );

  const getOrdersByDate = useCallback(
    (date) => {
      const targetDate = new Date(date);
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === targetDate.toDateString();
      });
    },
    [orders]
  );

  const getTodaysOrders = useCallback(() => {
    return getOrdersByDate(new Date());
  }, [getOrdersByDate]);

  const getActiveOrders = useCallback(() => {
    return orders.filter((order) =>
      ["pending", "confirmed", "preparing", "ready"].includes(order.status)
    );
  }, [orders]);

  // Search and sort functions
  const searchOrders = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) return orders;

      const term = searchTerm.toLowerCase();
      return orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(term) ||
          (order.customer?.name &&
            order.customer.name.toLowerCase().includes(term)) ||
          (order.customer?.phone && order.customer.phone.includes(term)) ||
          order.items?.some((item) => item.name.toLowerCase().includes(term))
      );
    },
    [orders]
  );

  const sortOrders = useCallback(
    (sortBy = "createdAt", order = "desc") => {
      const sorted = [...orders].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Handle date sorting
        if (sortBy === "createdAt" || sortBy === "updatedAt") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle number sorting
        if (sortBy === "totalAmount") {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        if (order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setOrders(sorted);
    },
    [orders]
  );

  // Analytics functions
  const getRevenue = useCallback(
    (dateRange = "today") => {
      let filteredOrders = orders.filter(
        (order) => order.status === "completed" || order.status === "ready"
      );

      if (dateRange === "today") {
        filteredOrders = getTodaysOrders().filter(
          (order) => order.status === "completed" || order.status === "ready"
        );
      } else if (dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.createdAt) >= weekAgo
        );
      }

      return filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    },
    [orders, getTodaysOrders]
  );

  const getAverageOrderValue = useCallback(() => {
    const completedOrders = orders.filter(
      (order) => order.status === "completed" || order.status === "ready"
    );

    if (completedOrders.length === 0) return 0;

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    return totalRevenue / completedOrders.length;
  }, [orders]);

  const getOrderTrends = useCallback(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = getOrdersByDate(date);
      return {
        date: date.toDateString(),
        count: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      };
    }).reverse();

    return last7Days;
  }, [getOrdersByDate]);

  return {
    // State
    orders,
    loading,
    error,
    stats,

    // Actions
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderById,
    getKitchenOrders,
    sortOrders,

    // Filters
    getOrdersByStatus,
    getOrdersByType,
    getOrdersByDate,
    getTodaysOrders,
    getActiveOrders,
    searchOrders,

    // Analytics
    getRevenue,
    getAverageOrderValue,
    getOrderTrends,
  };
};

export default useOrders;
