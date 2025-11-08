import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "orange",
  variant = "spinner",
  text,
  className = "",
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  const colorClasses = {
    orange: {
      primary: "border-orange-600",
      secondary: "border-orange-200",
      text: "text-orange-600",
      bg: "bg-orange-600",
    },
    blue: {
      primary: "border-blue-600",
      secondary: "border-blue-200",
      text: "text-blue-600",
      bg: "bg-blue-600",
    },
    green: {
      primary: "border-green-600",
      secondary: "border-green-200",
      text: "text-green-600",
      bg: "bg-green-600",
    },
    red: {
      primary: "border-red-600",
      secondary: "border-red-200",
      text: "text-red-600",
      bg: "bg-red-600",
    },
    gray: {
      primary: "border-gray-600",
      secondary: "border-gray-200",
      text: "text-gray-600",
      bg: "bg-gray-600",
    },
    white: {
      primary: "border-white",
      secondary: "border-white/30",
      text: "text-white",
      bg: "bg-white",
    },
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const colors = colorClasses[color];

  const renderSpinner = () => {
    switch (variant) {
      case "spinner":
        return (
          <div
            className={`
              ${sizeClasses[size]} 
              border-2 
              ${colors.primary} 
              border-t-transparent 
              rounded-full 
              animate-spin
              ${className}
            `}
          />
        );

      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`
                  ${
                    size === "xs"
                      ? "w-1 h-1"
                      : size === "sm"
                      ? "w-2 h-2"
                      : size === "lg"
                      ? "w-4 h-4"
                      : size === "xl"
                      ? "w-5 h-5"
                      : size === "2xl"
                      ? "w-6 h-6"
                      : "w-3 h-3"
                  }
                  ${colors.bg} 
                  rounded-full 
                  animate-bounce
                `}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.6s",
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`
                  ${
                    size === "xs"
                      ? "w-1 h-4"
                      : size === "sm"
                      ? "w-1 h-6"
                      : size === "lg"
                      ? "w-2 h-12"
                      : size === "xl"
                      ? "w-3 h-16"
                      : size === "2xl"
                      ? "w-4 h-20"
                      : "w-1 h-8"
                  }
                  ${colors.bg} 
                  rounded-full 
                  animate-pulse
                `}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        );

      case "ring":
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div
              className={`
                absolute inset-0 
                border-2 
                ${colors.secondary} 
                rounded-full
              `}
            />
            <div
              className={`
                absolute inset-0 
                border-2 
                ${colors.primary} 
                border-t-transparent 
                rounded-full 
                animate-spin
              `}
            />
          </div>
        );

      case "orbit":
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <div
              className={`
                absolute inset-0 
                border-2 
                ${colors.secondary} 
                rounded-full
              `}
            />
            <div
              className={`
                absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                w-2 h-2 ${colors.bg} rounded-full animate-spin
              `}
              style={{
                transformOrigin: `0 ${
                  sizeClasses[size].includes("w-3")
                    ? "6px"
                    : sizeClasses[size].includes("w-4")
                    ? "8px"
                    : sizeClasses[size].includes("w-8")
                    ? "16px"
                    : sizeClasses[size].includes("w-12")
                    ? "24px"
                    : sizeClasses[size].includes("w-16")
                    ? "32px"
                    : "40px"
                }`,
              }}
            />
          </div>
        );

      case "gradient":
        return (
          <div
            className={`
              ${sizeClasses[size]} 
              rounded-full 
              animate-spin
              bg-gradient-to-r from-transparent via-current to-transparent
              ${colors.text}
            `}
            style={{
              background: `conic-gradient(from 0deg, transparent, ${
                color === "orange"
                  ? "#ea580c"
                  : color === "blue"
                  ? "#2563eb"
                  : color === "green"
                  ? "#16a34a"
                  : color === "red"
                  ? "#dc2626"
                  : color === "white"
                  ? "#ffffff"
                  : "#4b5563"
              })`,
              borderRadius: "50%",
            }}
          />
        );

      case "squares":
        return (
          <div className="grid grid-cols-2 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`
                  ${
                    size === "xs"
                      ? "w-1 h-1"
                      : size === "sm"
                      ? "w-2 h-2"
                      : size === "lg"
                      ? "w-4 h-4"
                      : size === "xl"
                      ? "w-6 h-6"
                      : size === "2xl"
                      ? "w-8 h-8"
                      : "w-3 h-3"
                  }
                  ${colors.bg} 
                  animate-pulse
                `}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <div
            className={`
              ${sizeClasses[size]} 
              border-2 
              ${colors.primary} 
              border-t-transparent 
              rounded-full 
              animate-spin
              ${className}
            `}
          />
        );
    }
  };

  const SpinnerComponent = () => (
    <div className="flex flex-col items-center justify-center">
      {renderSpinner()}
      {text && (
        <p
          className={`mt-3 ${colors.text} ${textSizeClasses[size]} font-medium text-center`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
          <SpinnerComponent />
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
        <SpinnerComponent />
      </div>
    );
  }

  return <SpinnerComponent />;
};

// Specialized Loading Components
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 animate-pulse flex items-center justify-center shadow-lg">
        <span className="text-3xl text-white">🍽️</span>
      </div>
      <LoadingSpinner size="lg" variant="gradient" text={message} />
    </div>
  </div>
);

export const ButtonLoader = ({
  size = "sm",
  color = "white",
  variant = "spinner",
}) => (
  <LoadingSpinner
    size={size}
    color={color}
    variant={variant}
    className="inline-block"
  />
);

export const CardLoader = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
    </div>
  </div>
);

export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-12 w-full rounded-lg mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4 mb-4">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="bg-gray-200 h-8 flex-1 rounded-lg"></div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonLoader = ({
  width = "w-full",
  height = "h-4",
  className = "",
}) => (
  <div
    className={`bg-gray-200 ${width} ${height} rounded animate-pulse ${className}`}
  ></div>
);

export const InlineLoader = ({
  text = "Loading...",
  size = "xs",
  color = "gray",
}) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <LoadingSpinner size={size} color={color} />
    <span className="text-sm">{text}</span>
  </div>
);

export const FullScreenLoader = ({
  message = "Please wait...",
  submessage,
  progress,
  variant = "spinner",
}) => (
  <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full mx-4 text-center">
      <div className="mb-6">
        <LoadingSpinner size="xl" variant={variant} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>

      {submessage && <p className="text-sm text-gray-600 mb-4">{submessage}</p>}

      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  </div>
);

export const ContentLoader = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;
