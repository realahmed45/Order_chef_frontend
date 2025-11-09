import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api";
import LoadingSpinner from "../common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    phone: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password =
            "Password must contain uppercase, lowercase, and number";
        } else {
          delete newErrors.password;
        }

        // Re-validate confirm password if it exists
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case "restaurantName":
        if (!value.trim()) {
          newErrors.restaurantName = "Restaurant name is required";
        } else if (value.trim().length < 2) {
          newErrors.restaurantName =
            "Restaurant name must be at least 2 characters";
        } else {
          delete newErrors.restaurantName;
        }
        break;

      case "phone":
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        const cleanPhone = value.replace(/\D/g, "");
        if (!value) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value) || cleanPhone.length < 10) {
          newErrors.phone = "Please enter a valid phone number";
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Real-time validation for non-checkbox fields
    if (type !== "checkbox") {
      validateField(name, fieldValue);
    }
  };

  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      const requiredFields = ["name", "email", "password", "confirmPassword"];
      const stepErrors = {};

      requiredFields.forEach((field) => {
        validateField(field, formData[field]);
      });

      return Object.keys(errors).length === 0;
    } else if (stepNumber === 2) {
      validateField("restaurantName", formData.restaurantName);
      validateField("phone", formData.phone);

      if (!formData.agreeToTerms) {
        setErrors((prev) => ({
          ...prev,
          agreeToTerms: "You must agree to the terms",
        }));
        return false;
      }

      return !errors.restaurantName && !errors.phone;
    }

    return true;
  };

  const handleNextStep = (e) => {
    e?.preventDefault();

    console.log("🔥 CONTINUE BUTTON CLICKED!");
    console.log("📋 Current form data:", {
      name: `"${formData.name}" (length: ${formData.name?.length})`,
      email: `"${formData.email}" (length: ${formData.email?.length})`,
      password: `"${formData.password}" (length: ${formData.password?.length})`,
      confirmPassword: `"${formData.confirmPassword}" (length: ${formData.confirmPassword?.length})`,
    });

    // Validate step 1 synchronously with detailed logging
    const stepErrors = {};

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      stepErrors.name = "Full name is required";
      console.log("❌ Name validation failed: empty or whitespace");
    } else if (formData.name.trim().length < 2) {
      stepErrors.name = "Name must be at least 2 characters";
      console.log("❌ Name validation failed: too short");
    } else {
      console.log("✅ Name validation passed");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      stepErrors.email = "Email is required";
      console.log("❌ Email validation failed: empty");
    } else if (!emailRegex.test(formData.email)) {
      stepErrors.email = "Please enter a valid email address";
      console.log("❌ Email validation failed: invalid format");
    } else {
      console.log("✅ Email validation passed");
    }

    // Password validation
    if (!formData.password) {
      stepErrors.password = "Password is required";
      console.log("❌ Password validation failed: empty");
    } else if (formData.password.length < 8) {
      stepErrors.password = "Password must be at least 8 characters";
      console.log("❌ Password validation failed: too short");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      stepErrors.password =
        "Password must contain uppercase, lowercase, and number";
      console.log("❌ Password validation failed: missing required characters");
    } else {
      console.log("✅ Password validation passed");
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      stepErrors.confirmPassword = "Please confirm your password";
      console.log("❌ Confirm password validation failed: empty");
    } else if (formData.confirmPassword !== formData.password) {
      stepErrors.confirmPassword = "Passwords do not match";
      console.log("❌ Confirm password validation failed: mismatch");
    } else {
      console.log("✅ Confirm password validation passed");
    }

    console.log("🔍 Validation results:", {
      hasErrors: Object.keys(stepErrors).length > 0,
      errorCount: Object.keys(stepErrors).length,
      errors: stepErrors,
    });

    if (Object.keys(stepErrors).length > 0) {
      console.log(
        "❌ VALIDATION FAILED - Setting errors and staying on step 1"
      );
      setErrors(stepErrors);
      return;
    }

    console.log("🎉 ALL VALIDATION PASSED - Moving to step 2");
    setErrors({});
    setStep(2);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Starting registration...");

    if (!validateStep(2)) {
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Only send fields that backend expects
      const response = await authApi.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        restaurantName: formData.restaurantName.trim(), // ❌ THIS FIELD
        phone: formData.phone.trim(),
      });

      if (response.success) {
        // Store restaurant name for later use during onboarding
        localStorage.setItem(
          "pendingRestaurantName",
          formData.restaurantName.trim()
        );

        toast.success(`Welcome to OrderChef, ${formData.name}! 🎉`);
        onLogin(response);
      } else {
        setErrors({ submit: response.message || "Registration failed" });
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 3)
      return { strength, label: "Medium", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Good", color: "bg-blue-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white font-bold">🍽️</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Start Your 7-Day Free Trial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join thousands of restaurants using OrderChef
        </p>
        <p className="mt-1 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:text-orange-500 transition duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 rounded ${
              step >= 2 ? "bg-orange-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Personal Info</span>
          <span>Restaurant Info</span>
        </div>
      </div>

      {/* Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) {
                handleNextStep(e);
              } else {
                handleSubmit(e);
              }
            }}
          >
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  {errors.submit}
                </div>
              </div>
            )}

            {step === 1 && (
              <>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {!errors.name && formData.name && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                    {!errors.email && formData.email && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          Password strength:
                        </span>
                        <span
                          className={`font-medium ${
                            passwordStrength.strength <= 2
                              ? "text-red-600"
                              : passwordStrength.strength <= 3
                              ? "text-yellow-600"
                              : passwordStrength.strength <= 4
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {!errors.confirmPassword &&
                      formData.confirmPassword &&
                      formData.password === formData.confirmPassword && (
                        <CheckCircleIcon className="absolute right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Restaurant Name */}
                <div>
                  <label
                    htmlFor="restaurantName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Restaurant Name *
                  </label>
                  <div className="relative">
                    <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="restaurantName"
                      name="restaurantName"
                      type="text"
                      required
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ${
                        errors.restaurantName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Bella's Italian Kitchen"
                    />
                    {!errors.restaurantName && formData.restaurantName && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.restaurantName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.restaurantName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ${
                        errors.phone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {!errors.phone && formData.phone && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-orange-600 hover:text-orange-500 font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-orange-600 hover:text-orange-500 font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                >
                  Back
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Creating account...</span>
                  </div>
                ) : step === 1 ? (
                  "Continue"
                ) : (
                  "Start Free Trial"
                )}
              </button>
            </div>
          </form>

          {/* Trial Info */}
          <div className="mt-8 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  7-Day Free Trial
                </span>
              </div>
              <p className="text-xs text-green-700">
                No credit card required • Full access to all features • Cancel
                anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
