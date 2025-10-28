import React from "react";

const EmptyState = ({
  icon = "📝",
  title = "No data found",
  description = "There's nothing here yet.",
  action,
  actionText = "Get Started",
  className = "",
  size = "md",
  variant = "default",
}) => {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "text-4xl mb-3",
      title: "text-lg",
      description: "text-sm",
      action: "px-4 py-2 text-sm",
    },
    md: {
      container: "py-12",
      icon: "text-6xl mb-4",
      title: "text-xl",
      description: "text-base",
      action: "px-6 py-3",
    },
    lg: {
      container: "py-16",
      icon: "text-8xl mb-6",
      title: "text-2xl",
      description: "text-lg",
      action: "px-8 py-4 text-lg",
    },
  };

  const variantClasses = {
    default: {
      container: "bg-white rounded-lg shadow",
      title: "text-gray-900",
      description: "text-gray-600",
      action: "bg-orange-600 text-white hover:bg-orange-700",
    },
    minimal: {
      container: "bg-transparent",
      title: "text-gray-800",
      description: "text-gray-500",
      action: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
    bordered: {
      container: "bg-white border-2 border-dashed border-gray-200 rounded-lg",
      title: "text-gray-900",
      description: "text-gray-600",
      action: "bg-orange-600 text-white hover:bg-orange-700",
    },
    gradient: {
      container:
        "bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200",
      title: "text-orange-900",
      description: "text-orange-700",
      action: "bg-orange-600 text-white hover:bg-orange-700",
    },
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  return (
    <div
      className={`
      ${currentVariant.container} 
      ${currentSize.container} 
      text-center 
      ${className}
    `}
    >
      <div className={`${currentSize.icon}`}>{icon}</div>

      <h3
        className={`
        ${currentSize.title} 
        ${currentVariant.title} 
        font-semibold 
        mb-2
      `}
      >
        {title}
      </h3>

      <p
        className={`
        ${currentSize.description} 
        ${currentVariant.description} 
        mb-6 
        max-w-md 
        mx-auto
      `}
      >
        {description}
      </p>

      {action && (
        <button
          onClick={action}
          className={`
            ${currentSize.action}
            ${currentVariant.action}
            font-semibold 
            rounded-lg 
            transition 
            duration-200
          `}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const NoOrdersEmptyState = ({ onCreateOrder }) => (
  <EmptyState
    icon="🛒"
    title="No Orders Yet"
    description="Orders from your website will appear here in real-time. Your first order is just around the corner!"
    action={onCreateOrder}
    actionText="View Website"
    variant="gradient"
  />
);

export const NoMenuItemsEmptyState = ({ onAddItem }) => (
  <EmptyState
    icon="📝"
    title="Your Menu is Empty"
    description="Add your first menu item to start accepting orders. Customers love seeing what delicious options you have!"
    action={onAddItem}
    actionText="Add Menu Item"
    variant="default"
  />
);

export const NoCustomersEmptyState = ({ onViewOrders }) => (
  <EmptyState
    icon="👥"
    title="No Customers Yet"
    description="Customer profiles will appear here as they place orders. Build your customer base by promoting your website!"
    action={onViewOrders}
    actionText="View Orders"
    variant="minimal"
  />
);

export const NoInventoryEmptyState = ({ onAddItem }) => (
  <EmptyState
    icon="📦"
    title="No Inventory Items"
    description="Track your ingredients and supplies by adding inventory items. Stay on top of stock levels automatically!"
    action={onAddItem}
    actionText="Add Inventory Item"
    variant="bordered"
  />
);

export const NoAnalyticsEmptyState = () => (
  <EmptyState
    icon="📊"
    title="No Data Available"
    description="Analytics will appear here once you start receiving orders. Your business insights are just a few orders away!"
    variant="gradient"
    size="sm"
  />
);

export const SearchEmptyState = ({ searchTerm, onClearSearch }) => (
  <EmptyState
    icon="🔍"
    title="No results found"
    description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search terms.`}
    action={onClearSearch}
    actionText="Clear Search"
    variant="minimal"
    size="sm"
  />
);

export const ErrorEmptyState = ({
  onRetry,
  message = "Something went wrong",
}) => (
  <EmptyState
    icon="⚠️"
    title="Oops! Something went wrong"
    description={message}
    action={onRetry}
    actionText="Try Again"
    variant="minimal"
  />
);

export const OfflineEmptyState = ({ onRetry }) => (
  <EmptyState
    icon="📡"
    title="You're offline"
    description="Check your internet connection and try again. Some features may not be available while offline."
    action={onRetry}
    actionText="Retry"
    variant="minimal"
  />
);

export const ComingSoonEmptyState = ({ feature = "feature" }) => (
  <EmptyState
    icon="🚀"
    title="Coming Soon"
    description={`This ${feature} is currently under development. We're working hard to bring it to you soon!`}
    variant="gradient"
  />
);

export const MaintenanceEmptyState = () => (
  <EmptyState
    icon="🔧"
    title="Under Maintenance"
    description="We're performing some updates to improve your experience. Please check back in a few minutes."
    variant="minimal"
  />
);

export default EmptyState;
