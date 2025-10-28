import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  className = "",
  overlayClassName = "",
  contentClassName = "",
  persistent = false,
}) => {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  const variantClasses = {
    default: "bg-white",
    dark: "bg-gray-900 text-white",
    danger: "bg-red-50 border-t-4 border-red-500",
    success: "bg-green-50 border-t-4 border-green-500",
    warning: "bg-yellow-50 border-t-4 border-yellow-500",
    info: "bg-blue-50 border-t-4 border-blue-500",
  };

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      document.body.style.overflow = "hidden";

      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = "unset";

      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closeOnEscape && !persistent) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, closeOnEscape, persistent, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop && !persistent) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!persistent) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        ${overlayClassName}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] 
          ${variantClasses[variant]}
          rounded-lg shadow-xl
          transform transition-all duration-300 ease-out
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          ${contentClassName}
        `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={handleClose}
                disabled={persistent}
                className={`
                  text-gray-400 hover:text-gray-600 focus:outline-none 
                  focus:ring-2 focus:ring-orange-500 rounded-lg p-1
                  ${persistent ? "opacity-50 cursor-not-allowed" : ""}
                `}
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className={`p-6 overflow-y-auto max-h-[60vh] ${className}`}>
          {children}
        </div>

        {footer && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    variant={variant}
    persistent={loading}
    footer={
      <>
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`
            px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50
            ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700"
            }
          `}
        >
          {loading ? "Processing..." : confirmText}
        </button>
      </>
    }
  >
    <p className="text-gray-600">{message}</p>
  </Modal>
);

export const AlertModal = ({
  isOpen,
  onClose,
  title = "Alert",
  message,
  variant = "info",
  buttonText = "OK",
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    variant={variant}
    footer={
      <button
        onClick={onClose}
        className="px-6 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg font-medium transition"
      >
        {buttonText}
      </button>
    }
  >
    <p className="text-gray-600">{message}</p>
  </Modal>
);

export const LoadingModal = ({
  isOpen,
  message = "Please wait...",
  progress,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={() => {}}
    size="sm"
    showCloseButton={false}
    closeOnBackdrop={false}
    closeOnEscape={false}
    persistent={true}
  >
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 mb-4">{message}</p>

      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  </Modal>
);

export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  loading = false,
  size = "md",
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size={size}
    persistent={loading}
    footer={
      <>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="submit"
          form="modal-form"
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Processing..." : submitText}
        </button>
      </>
    }
  >
    <form id="modal-form" onSubmit={onSubmit}>
      {children}
    </form>
  </Modal>
);

export default Modal;
