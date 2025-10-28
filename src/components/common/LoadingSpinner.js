import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "orange",
  variant = "spinner",
  text,
  className = "",
  fullScreen = false,
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    orange: "border-orange-600",
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    gray: "border-gray-600",
    white: "border-white",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
      {variant === "spinner" && (
        <div
          className={`
            ${sizeClasses[size]} 
            border-2 
            ${colorClasses[color]} 
            border-t-transparent 
            rounded-full 
            animate-spin
            ${className}
          `}
        />
      )}

      {variant === "dots" && (
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
                    : "w-3 h-3"
                }
                bg-orange-600 
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
      )}

      {variant === "pulse" && (
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
                    : "w-1 h-8"
                }
                bg-orange-600 
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
      )}

      {variant === "ring" && (
        <div className={`relative ${sizeClasses[size]}`}>
          <div
            className={`
              absolute inset-0 
              border-2 
              border-gray-200 
              rounded-full
            `}
          />
          <div
            className={`
              absolute inset-0 
              border-2 
              ${colorClasses[color]} 
              border-t-transparent 
              rounded-full 
              animate-spin
            `}
          />
        </div>
      )}

      {text && (
        <p
          className={`mt-3 text-gray-600 ${textSizeClasses[size]} font-medium`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Spinner />
        </div>
      </div>
    );
  }

  return <Spinner />;
};

export const PageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto mb-4 animate-pulse"></div>
      <LoadingSpinner size="lg" text={message} />
    </div>
  </div>
);

export const ButtonLoader = ({ size = "sm", color = "white" }) => (
  <LoadingSpinner
    size={size}
    color={color}
    variant="spinner"
    className="inline-block"
  />
);

export const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
    </div>
  </div>
);

export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-8 w-full rounded mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4 mb-3">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="bg-gray-200 h-6 flex-1 rounded"></div>
        ))}
      </div>
    ))}
  </div>
);

export const InlineLoader = ({ text = "Loading..." }) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <LoadingSpinner size="xs" />
    <span className="text-sm">{text}</span>
  </div>
);

export default LoadingSpinner;
