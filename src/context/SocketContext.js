import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import {
  playNotificationSound,
  showNotification,
  requestNotificationPermission,
} from "../components/utils/helpers";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (user) {
      initializeSocket();
      requestNotificationPermission();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const initializeSocket = () => {
    console.log("🔌 Initializing Socket.IO connection...");

    const newSocket = io(
      process.env.REACT_APP_API_URL || "http://localhost:5000",
      {
        auth: {
          userId: user.id,
          userType: user.role || "owner",
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
      }
    );

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setConnected(true);
      toast.success("Connected to live updates");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnected(false);
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setConnected(false);
      toast.error("Connection lost. Trying to reconnect...");
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      setConnected(true);
      toast.success("Reconnected to live updates");
    });

    newSocket.on("order:new", handleNewOrder);
    newSocket.on("order:update", handleOrderUpdate);
    newSocket.on("order:cancelled", handleOrderCancelled);
    newSocket.on("kitchen:update", handleKitchenUpdate);
    newSocket.on("notification", handleNotification);
    newSocket.on("user:count", handleUserCount);

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
      setSocket(null);
      setConnected(false);
      setRestaurantId(null);
    }
  };

  const joinRestaurant = (resId) => {
    if (socket && resId) {
      console.log("🏪 Joining restaurant room:", resId);
      socket.emit("join:restaurant", resId);
      setRestaurantId(resId);
    }
  };

  const leaveRestaurant = () => {
    if (socket && restaurantId) {
      console.log("🚪 Leaving restaurant room:", restaurantId);
      socket.emit("leave:restaurant", restaurantId);
      setRestaurantId(null);
    }
  };

  const handleNewOrder = (order) => {
    console.log("🔔 New order received:", order);

    playNotificationSound();
    showNotification("New Order!", {
      body: `Order #${order.orderNumber} - $${order.totalAmount?.toFixed(2)}`,
      icon: "/logo192.png",
      tag: "new-order",
    });

    toast.success(`New order #${order.orderNumber}!`, {
      duration: 5000,
      icon: "🛒",
    });
  };

  const handleOrderUpdate = (order) => {
    console.log("📝 Order updated:", order);

    const statusMessages = {
      confirmed: "Order confirmed",
      preparing: "Started preparing",
      ready: "Order is ready!",
      completed: "Order completed",
    };

    const message = statusMessages[order.status] || "Order updated";

    toast.success(`#${order.orderNumber}: ${message}`, {
      icon: getStatusIcon(order.status),
    });
  };

  const handleOrderCancelled = (order) => {
    console.log("❌ Order cancelled:", order);

    playNotificationSound();
    toast.error(`Order #${order.orderNumber} cancelled`, {
      duration: 4000,
      icon: "❌",
    });
  };

  const handleKitchenUpdate = (data) => {
    console.log("👨‍🍳 Kitchen update:", data);
  };

  const handleNotification = (notification) => {
    console.log("🔔 Notification:", notification);

    toast(notification.message, {
      icon: notification.icon || "ℹ️",
      duration: notification.duration || 4000,
      style: {
        background: notification.type === "error" ? "#FEE2E2" : "#F0FDF4",
        color: notification.type === "error" ? "#DC2626" : "#16A34A",
      },
    });

    if (notification.sound) {
      playNotificationSound();
    }

    if (notification.browser) {
      showNotification(notification.title || "OrderChef", {
        body: notification.message,
        icon: "/logo192.png",
      });
    }
  };

  const handleUserCount = (count) => {
    setOnlineUsers(count);
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "🔔",
      completed: "✅",
      cancelled: "❌",
    };
    return icons[status] || "📝";
  };

  const emitEvent = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const updateOrderStatus = (orderId, status) => {
    emitEvent("order:updateStatus", { orderId, status });
  };

  const sendKitchenUpdate = (update) => {
    emitEvent("kitchen:update", update);
  };

  const value = {
    socket,
    connected,
    restaurantId,
    onlineUsers,
    joinRestaurant,
    leaveRestaurant,
    emitEvent,
    updateOrderStatus,
    sendKitchenUpdate,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
