import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Components
import Navbar from "./components/common/Navbar";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Public Pages
import Home from "./components/public/Home";
import Pricing from "./components/public/Pricing";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Main Pages
import Onboarding from "./components/onboarding/Onboarding";
import Dashboard from "./components/dashboard/Dashboard";
import KitchenDisplay from "./components/kitchen/KitchenDisplay";

// Feature Centers (New Advanced Features)
import CustomerExperienceCenter from "./components/features/CustomerExperienceCenter";
import IntegrationCenter from "./components/features/IntegrationCenter";
import MobileAccessibilityCenter from "./components/features/MobileAccessibilityCenter";
import NotificationCenter from "./components/features/NotificationCenter";
import PaymentProcessor from "./components/features/PaymentProcessor";
import ReportingCenter from "./components/features/ReportingCenter";
import SecurityCenter from "./components/features/SecurityCenter";
import StaffManager from "./components/features/StaffManager";

// Context Providers
import { SocketProvider } from "./context/SocketContext";

// API
import { authApi } from "./api";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await authApi.getCurrentUser();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  };

  const login = (userData) => {
    setUser(userData.user || userData);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SocketProvider user={user}>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "#059669",
                  },
                },
                error: {
                  style: {
                    background: "#DC2626",
                  },
                },
              }}
            />

            <Navbar user={user} onLogout={logout} />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home user={user} />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  !user ? (
                    <Login onLogin={login} />
                  ) : user.onboarding?.completed ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  !user ? (
                    <Register onLogin={login} />
                  ) : user.onboarding?.completed ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  user ? (
                    <Onboarding user={user} onUpdateUser={updateUser} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Main Dashboard - SIMPLIFIED FOR TESTING */}
              <Route
                path="/dashboard/*"
                element={
                  user ? (
                    <Dashboard user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Kitchen Display */}
              <Route
                path="/kitchen"
                element={
                  user ? (
                    <KitchenDisplay user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Advanced Feature Centers */}
              <Route
                path="/features/customer-experience"
                element={
                  user ? (
                    <CustomerExperienceCenter user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/integrations"
                element={
                  user ? (
                    <IntegrationCenter user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/mobile"
                element={
                  user ? (
                    <MobileAccessibilityCenter user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/notifications"
                element={
                  user ? (
                    <NotificationCenter user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/payments"
                element={
                  user ? (
                    <PaymentProcessor user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/reporting"
                element={
                  user ? (
                    <ReportingCenter user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/security"
                element={
                  user ? (
                    <SecurityCenter user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/features/staff"
                element={
                  user ? (
                    <StaffManager user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </ErrorBoundary>
  );
}

export default App;
