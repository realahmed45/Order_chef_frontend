import React, { useState } from "react";
import {
  formatCurrency,
  formatTime,
  getOrderAgeClass,
} from "../../utils/helpers";

const OrderCard = ({
  order,
  onUpdateStatus,
  timeElapsed,
  urgency,
  variant = "new",
}) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusButtons = () => {
    const buttons = [];

    if (order.status === "pending" || order.status === "confirmed") {
      buttons.push({
        label: "Start Cooking",
        action: () => handleStatusUpdate("preparing"),
        className: "bg-blue-600 hover:bg-blue-700 text-white",
        icon: "👨‍🍳",
      });
    }

    if (order.status === "preparing") {
      buttons.push({
        label: "Mark Ready",
        action: () => handleStatusUpdate("ready"),
        className: "bg-green-600 hover:bg-green-700 text-white",
        icon: "✅",
      });
    }

    if (order.status === "ready") {
      buttons.push({
        label: "Complete",
        action: () => handleStatusUpdate("completed"),
        className: "bg-gray-600 hover:bg-gray-700 text-white",
        icon: "📦",
      });
    }

    return buttons;
  };

  const getUrgencyClass = () => {
    const minutes = Math.floor(
      (new Date() - new Date(order.createdAt)) / 60000
    );

    if (minutes > 30) return "border-l-4 border-red-500 bg-red-50";
    if (minutes > 20) return "border-l-4 border-yellow-500 bg-yellow-50";
    return "border-l-4 border-green-500 bg-gray-50";
  };

  const getVariantStyles = () => {
    const styles = {
      new: "bg-yellow-50 border-yellow-200",
      preparing: "bg-blue-50 border-blue-200",
      ready: "bg-green-50 border-green-200",
    };
    return styles[variant] || "bg-gray-50 border-gray-200";
  };

  const statusButtons = getStatusButtons();

  return (
    <div
      className={`
      rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg
      ${getVariantStyles()} ${getUrgencyClass()}
    `}
    >
      {/* Order Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            #{order.orderNumber}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">⏰ {timeElapsed}</span>
            <span className="flex items-center">
              💰 {formatCurrency(order.totalAmount)}
            </span>
            {order.orderType && (
              <span className="flex items-center capitalize">
                {order.orderType === "dine-in"
                  ? "🍽️"
                  : order.orderType === "delivery"
                  ? "🚗"
                  : "🥡"}
                {order.orderType}
              </span>
            )}
          </div>
        </div>

        {/* Urgency Indicator */}
        <div
          className={`
          w-3 h-3 rounded-full animate-pulse
          ${
            urgency === "bg-red-500"
              ? "bg-red-500"
              : urgency === "bg-yellow-500"
              ? "bg-yellow-500"
              : "bg-green-500"
          }
        `}
          title={`Order placed ${timeElapsed} ago`}
        />
      </div>

      {/* Customer Info */}
      {order.customer && (
        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-lg">👤</span>
            <div>
              <p className="font-semibold text-gray-900">
                {order.customer.name}
              </p>
              {order.customer.phone && (
                <p className="text-sm text-gray-600">{order.customer.phone}</p>
              )}
            </div>
          </div>
          {order.tableNumber && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-lg">🪑</span>
              <span className="font-medium">Table {order.tableNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold text-gray-800 text-sm">Items:</h4>
        {order.items?.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-3 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-semibold">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>

                {/* Modifiers */}
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="mt-2 pl-4 space-y-1">
                    {item.modifiers.map((modifier, modIndex) => (
                      <div
                        key={modIndex}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="text-orange-500 mr-1">+</span>
                        {modifier.option}
                        {modifier.price > 0 && (
                          <span className="ml-1">
                            ({formatCurrency(modifier.price)})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Special Instructions */}
                {item.specialInstructions && (
                  <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
                    <span className="font-semibold text-yellow-800">
                      Note:{" "}
                    </span>
                    <span className="text-yellow-700">
                      {item.specialInstructions}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-sm font-semibold text-gray-700 ml-2">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Special Order Notes */}
      {order.notes && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-lg">📝</span>
            <div>
              <p className="font-semibold text-yellow-800 text-sm">
                Order Notes:
              </p>
              <p className="text-yellow-700 text-sm">{order.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {statusButtons.length > 0 && (
        <div className="flex space-x-2">
          {statusButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              disabled={updating}
              className={`
                flex-1 px-4 py-3 rounded-lg font-semibold text-sm
                transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${button.className}
                flex items-center justify-center space-x-2
              `}
            >
              <span>{button.icon}</span>
              <span>{updating ? "Updating..." : button.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Estimated Ready Time */}
      {order.estimatedReadyTime && order.status !== "completed" && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Estimated ready: {formatTime(order.estimatedReadyTime)}
          </p>
        </div>
      )}

      {/* Order Age Indicator */}
      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
        <span>Ordered: {formatTime(order.createdAt)}</span>
        <span
          className={`
          px-2 py-1 rounded-full font-semibold
          ${
            timeElapsed.includes("h") || parseInt(timeElapsed) > 30
              ? "bg-red-100 text-red-800"
              : parseInt(timeElapsed) > 15
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }
        `}
        >
          {timeElapsed}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
