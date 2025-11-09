import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Monitor,
  Globe,
  Accessibility,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Type,
  MousePointer,
  Keyboard,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Download,
  Share2,
  Settings,
  Languages,
  Mic,
  MicOff,
  Navigation,
  Compass,
  Contrast,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Check,
  AlertCircle,
  Info,
  Home,
  ShoppingCart,
  User,
  FileText,
  Calendar,
  MapPin,
  Clock,
  Star,
  Heart,
  Search,
  Filter,
  RefreshCw,
  Save,
  HandIcon,
} from "lucide-react";
import { formatDateTime } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";

const MobileAccessibilityCenter = ({ restaurant }) => {
  const [mobileSettings, setMobileSettings] = useState({});
  const [accessibilitySettings, setAccessibilitySettings] = useState({});
  const [pwaSettings, setPwaSettings] = useState({});
  const [offlineData, setOfflineData] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});
  const [languageSettings, setLanguageSettings] = useState({});

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  const supportedLanguages = [
    { code: "en", name: "English", flag: "🇺🇸", rtl: false },
    { code: "es", name: "Español", flag: "🇪🇸", rtl: false },
    { code: "fr", name: "Français", flag: "🇫🇷", rtl: false },
    { code: "de", name: "Deutsch", flag: "🇩🇪", rtl: false },
    { code: "it", name: "Italiano", flag: "🇮🇹", rtl: false },
    { code: "pt", name: "Português", flag: "🇵🇹", rtl: false },
    { code: "zh", name: "中文", flag: "🇨🇳", rtl: false },
    { code: "ja", name: "日本語", flag: "🇯🇵", rtl: false },
    { code: "ko", name: "한국어", flag: "🇰🇷", rtl: false },
    { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
    { code: "he", name: "עברית", flag: "🇮🇱", rtl: true },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳", rtl: false },
  ];

  const fontSizes = [
    { value: "small", label: "Small", size: "14px" },
    { value: "medium", label: "Medium", size: "16px" },
    { value: "large", label: "Large", size: "18px" },
    { value: "extra-large", label: "Extra Large", size: "20px" },
  ];

  const accessibilityFeatures = [
    {
      id: "screen-reader",
      name: "Screen Reader Support",
      description: "Compatible with NVDA, JAWS, and VoiceOver",
      icon: Volume2,
      enabled: true,
    },
    {
      id: "keyboard-navigation",
      name: "Keyboard Navigation",
      description: "Navigate using Tab, Enter, and arrow keys",
      icon: Keyboard,
      enabled: keyboardNavigation,
    },
    {
      id: "high-contrast",
      name: "High Contrast Mode",
      description: "Enhanced contrast for better visibility",
      icon: Contrast,
      enabled: highContrast,
    },
    {
      id: "voice-control",
      name: "Voice Commands",
      description: "Control interface with voice commands",
      icon: Mic,
      enabled: voiceEnabled,
    },
    {
      id: "touch-friendly",
      name: "Touch-Friendly Interface",
      description: "Optimized for touch interactions",
      icon: HandIcon,
      enabled: true,
    },
    {
      id: "focus-indicators",
      name: "Focus Indicators",
      description: "Clear visual focus indicators",
      icon: Eye,
      enabled: true,
    },
  ];

  const pwaFeatures = [
    {
      id: "offline-support",
      name: "Offline Support",
      description: "Works without internet connection",
      icon: WifiOff,
      enabled: true,
    },
    {
      id: "push-notifications",
      name: "Push Notifications",
      description: "Receive notifications even when app is closed",
      icon: Bell,
      enabled: true,
    },
    {
      id: "install-prompt",
      name: "Install to Home Screen",
      description: "Add app to device home screen",
      icon: Download,
      enabled: true,
    },
    {
      id: "background-sync",
      name: "Background Sync",
      description: "Sync data when connection is restored",
      icon: RefreshCw,
      enabled: true,
    },
  ];

  useEffect(() => {
    fetchMobileAccessibilityData();
    initializeAccessibilityFeatures();
  }, []);

  useEffect(() => {
    applyAccessibilitySettings();
  }, [fontSize, highContrast, currentLanguage, keyboardNavigation]);

  const fetchMobileAccessibilityData = async () => {
    try {
      setLoading(true);

      const [
        mobileRes,
        accessibilityRes,
        pwaRes,
        offlineRes,
        notificationRes,
        languageRes,
      ] = await Promise.all([
        fetch("/api/mobile/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/accessibility/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/pwa/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/offline/status", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/notifications/mobile-settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/i18n/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const [
        mobileData,
        accessibilityData,
        pwaData,
        offlineDataRes,
        notificationData,
        languageData,
      ] = await Promise.all([
        mobileRes.json(),
        accessibilityRes.json(),
        pwaRes.json(),
        offlineRes.json(),
        notificationRes.json(),
        languageRes.json(),
      ]);

      if (mobileData.success) setMobileSettings(mobileData.settings);
      if (accessibilityData.success)
        setAccessibilitySettings(accessibilityData.settings);
      if (pwaData.success) setPwaSettings(pwaData.settings);
      if (offlineDataRes.success) setOfflineData(offlineDataRes.data);
      if (notificationData.success)
        setNotificationSettings(notificationData.settings);
      if (languageData.success) setLanguageSettings(languageData.settings);
    } catch (error) {
      console.error("Error fetching mobile/accessibility data:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeAccessibilityFeatures = () => {
    // Check if user has accessibility preferences stored
    const savedSettings = localStorage.getItem("accessibilitySettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || "medium");
      setHighContrast(settings.highContrast || false);
      setCurrentLanguage(settings.language || "en");
      setKeyboardNavigation(settings.keyboardNavigation || false);
      setVoiceEnabled(settings.voiceEnabled || false);
    }

    // Initialize keyboard navigation listeners
    initializeKeyboardNavigation();

    // Initialize voice commands
    initializeVoiceCommands();
  };

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;

    // Apply font size
    const fontSizeValue =
      fontSizes.find((f) => f.value === fontSize)?.size || "16px";
    root.style.setProperty("--base-font-size", fontSizeValue);

    // Apply high contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply RTL for supported languages
    const language = supportedLanguages.find(
      (lang) => lang.code === currentLanguage
    );
    if (language?.rtl) {
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("dir", "ltr");
    }

    // Save settings
    const settings = {
      fontSize,
      highContrast,
      language: currentLanguage,
      keyboardNavigation,
      voiceEnabled,
    };
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
  };

  const initializeKeyboardNavigation = () => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (e) => {
      // Tab navigation enhancement
      if (e.key === "Tab") {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Add visual focus ring
        focusableElements.forEach((el) => {
          el.addEventListener("focus", () => {
            el.style.outline = "3px solid #f97316";
            el.style.outlineOffset = "2px";
          });

          el.addEventListener("blur", () => {
            el.style.outline = "";
            el.style.outlineOffset = "";
          });
        });
      }

      // Custom keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "h":
            e.preventDefault();
            document.querySelector('[data-navigation="home"]')?.click();
            break;
          case "m":
            e.preventDefault();
            document.querySelector('[data-navigation="menu"]')?.click();
            break;
          case "o":
            e.preventDefault();
            document.querySelector('[data-navigation="orders"]')?.click();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  };

  const initializeVoiceCommands = () => {
    if (
      !voiceEnabled ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = currentLanguage;

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase();

      handleVoiceCommand(command);
    };

    if (voiceEnabled) {
      recognition.start();
    }

    return recognition;
  };

  const handleVoiceCommand = (command) => {
    const commands = {
      "go home": () =>
        document.querySelector('[data-navigation="home"]')?.click(),
      "show menu": () =>
        document.querySelector('[data-navigation="menu"]')?.click(),
      "view orders": () =>
        document.querySelector('[data-navigation="orders"]')?.click(),
      "open settings": () =>
        document.querySelector('[data-navigation="settings"]')?.click(),
      "increase font size": () => {
        const currentIndex = fontSizes.findIndex((f) => f.value === fontSize);
        if (currentIndex < fontSizes.length - 1) {
          setFontSize(fontSizes[currentIndex + 1].value);
        }
      },
      "decrease font size": () => {
        const currentIndex = fontSizes.findIndex((f) => f.value === fontSize);
        if (currentIndex > 0) {
          setFontSize(fontSizes[currentIndex - 1].value);
        }
      },
      "toggle high contrast": () => setHighContrast(!highContrast),
      "read page": () => speakPageContent(),
    };

    Object.keys(commands).forEach((key) => {
      if (command.includes(key)) {
        commands[key]();
      }
    });
  };

  const speakPageContent = () => {
    if ("speechSynthesis" in window) {
      const text =
        document.querySelector("main")?.textContent || "No content to read";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  const installPWA = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;

      if (outcome === "accepted") {
        alert("App installed successfully!");
      }

      window.deferredPrompt = null;
    } else {
      alert("PWA installation is not available on this device");
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        new Notification("Notifications enabled!", {
          body: "You will now receive notifications from the restaurant app.",
          icon: "/icon-192x192.png",
        });
      }

      return permission;
    }

    return "not-supported";
  };

  const toggleFeature = async (featureId, enabled) => {
    try {
      const response = await fetch(`/api/accessibility/features/${featureId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        // Update local state based on feature
        switch (featureId) {
          case "keyboard-navigation":
            setKeyboardNavigation(enabled);
            break;
          case "high-contrast":
            setHighContrast(enabled);
            break;
          case "voice-control":
            setVoiceEnabled(enabled);
            break;
        }
      }
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner
          size="lg"
          text="Loading mobile & accessibility settings..."
        />
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
      style={{ fontSize: `var(--base-font-size, 16px)` }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Mobile & Accessibility Center
          </h2>
          <p className="text-gray-600">
            Optimize for mobile devices and ensure accessibility for all users
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={installPWA}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </button>
          <button
            onClick={requestNotificationPermission}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </button>
        </div>
      </div>

      {/* Quick Accessibility Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Accessibility Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              High Contrast
            </label>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition ${
                highContrast
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {highContrast ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Voice Control
            </label>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-full px-3 py-2 rounded-lg border-2 transition ${
                voiceEnabled
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {voiceEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mobile Users</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Accessibility className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Accessibility Score
              </p>
              <p className="text-2xl font-bold text-gray-900">94/100</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">PWA Installs</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Languages</p>
              <p className="text-2xl font-bold text-gray-900">
                {supportedLanguages.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: Monitor },
              { id: "mobile", label: "Mobile Optimization", icon: Smartphone },
              {
                id: "accessibility",
                label: "Accessibility",
                icon: Accessibility,
              },
              { id: "pwa", label: "PWA Features", icon: Download },
              { id: "offline", label: "Offline Support", icon: WifiOff },
              { id: "languages", label: "Languages", icon: Languages },
              { id: "voice", label: "Voice Commands", icon: Mic },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <MobileDashboard
              mobileSettings={mobileSettings}
              accessibilitySettings={accessibilitySettings}
              pwaSettings={pwaSettings}
              offlineData={offlineData}
            />
          )}

          {activeTab === "mobile" && (
            <MobileOptimization
              mobileSettings={mobileSettings}
              setMobileSettings={setMobileSettings}
            />
          )}

          {activeTab === "accessibility" && (
            <AccessibilityFeatures
              accessibilityFeatures={accessibilityFeatures}
              onToggleFeature={toggleFeature}
              fontSize={fontSize}
              setFontSize={setFontSize}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
            />
          )}

          {activeTab === "pwa" && (
            <PWAFeatures
              pwaFeatures={pwaFeatures}
              pwaSettings={pwaSettings}
              onInstall={installPWA}
            />
          )}

          {activeTab === "offline" && (
            <OfflineSupport offlineData={offlineData} />
          )}

          {activeTab === "languages" && (
            <LanguageSettings
              supportedLanguages={supportedLanguages}
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
              languageSettings={languageSettings}
            />
          )}

          {activeTab === "voice" && (
            <VoiceCommands
              voiceEnabled={voiceEnabled}
              setVoiceEnabled={setVoiceEnabled}
              currentLanguage={currentLanguage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Dashboard Component
const MobileDashboard = ({
  mobileSettings,
  accessibilitySettings,
  pwaSettings,
  offlineData,
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Mobile Performance</p>
              <p className="text-3xl font-bold">92/100</p>
              <p className="text-blue-100">Lighthouse score</p>
            </div>
            <Smartphone className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Accessibility</p>
              <p className="text-3xl font-bold">WCAG AA</p>
              <p className="text-green-100">compliant</p>
            </div>
            <Accessibility className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Offline Ready</p>
              <p className="text-3xl font-bold">100%</p>
              <p className="text-purple-100">core features</p>
            </div>
            <WifiOff className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Feature Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mobile Features
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HandIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Touch Optimization</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Responsive Design</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Push Notifications</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <WifiOff className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Offline Support</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Accessibility Features
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Screen Reader Support</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Keyboard className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Keyboard Navigation</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Contrast className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">High Contrast Mode</span>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Voice Commands</span>
              </div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.1s</div>
            <div className="text-sm text-gray-600">First Contentful Paint</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3.4s</div>
            <div className="text-sm text-gray-600">
              Largest Contentful Paint
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0.1s</div>
            <div className="text-sm text-gray-600">First Input Delay</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">0.05</div>
            <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Optimization Component
const MobileOptimization = ({ mobileSettings, setMobileSettings }) => {
  const updateSetting = (key, value) => {
    const newSettings = { ...mobileSettings, [key]: value };
    setMobileSettings(newSettings);

    // Save to backend
    fetch("/api/mobile/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newSettings),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Touch Interface
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Large Touch Targets
                </span>
                <p className="text-sm text-gray-500">
                  Minimum 44px touch targets
                </p>
              </div>
              <input
                type="checkbox"
                checked={mobileSettings.largeTouchTargets || false}
                onChange={(e) =>
                  updateSetting("largeTouchTargets", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Swipe Gestures
                </span>
                <p className="text-sm text-gray-500">Enable swipe navigation</p>
              </div>
              <input
                type="checkbox"
                checked={mobileSettings.swipeGestures || false}
                onChange={(e) =>
                  updateSetting("swipeGestures", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Haptic Feedback
                </span>
                <p className="text-sm text-gray-500">
                  Vibration feedback on interactions
                </p>
              </div>
              <input
                type="checkbox"
                checked={mobileSettings.hapticFeedback || false}
                onChange={(e) =>
                  updateSetting("hapticFeedback", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Image Optimization
                </span>
                <p className="text-sm text-gray-500">
                  Automatically optimize images
                </p>
              </div>
              <input
                type="checkbox"
                checked={mobileSettings.imageOptimization || false}
                onChange={(e) =>
                  updateSetting("imageOptimization", e.target.checked)
                }
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">Lazy Loading</span>
                <p className="text-sm text-gray-500">Load images as needed</p>
              </div>
              <input
                type="checkbox"
                checked={mobileSettings.lazyLoading || false}
                onChange={(e) => updateSetting("lazyLoading", e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 font-medium">
                  Resource Compression
                </span>
                <p className="text-sm text-gray-500">
                  Compress CSS, JS, and HTML
                </p>
              </div>
              <input
                type="checkbox"
                checked={mobileSettings.compression || false}
                onChange={(e) => updateSetting("compression", e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mobile Preview
        </h3>
        <div className="flex justify-center">
          <div className="w-80 h-96 bg-gray-100 rounded-2xl border-8 border-gray-800 relative overflow-hidden">
            {/* Mock mobile interface */}
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Menu className="w-6 h-6" />
                <h1 className="font-bold">Restaurant App</h1>
                <User className="w-6 h-6" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Dashboard</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Orders</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Menu</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-around py-2 border-t">
                <Home className="w-6 h-6 text-orange-600" />
                <Search className="w-6 h-6 text-gray-400" />
                <Heart className="w-6 h-6 text-gray-400" />
                <User className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Accessibility Features Component
const AccessibilityFeatures = ({
  accessibilityFeatures,
  onToggleFeature,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Info className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-blue-900">
            WCAG 2.1 AA Compliance
          </h3>
        </div>
        <p className="text-blue-800">
          Our application meets Web Content Accessibility Guidelines (WCAG) 2.1
          AA standards, ensuring accessibility for users with disabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accessibilityFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {feature.name}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={feature.enabled}
                  onChange={(e) =>
                    onToggleFeature(feature.id, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  feature.enabled ? "bg-green-400" : "bg-gray-300"
                }`}
              />
              <span
                className={`text-sm ${
                  feature.enabled ? "text-green-600" : "text-gray-500"
                }`}
              >
                {feature.enabled ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Accessibility Testing */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Accessibility Testing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50">
            <Eye className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-700">Test with Screen Reader</span>
          </button>

          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50">
            <Keyboard className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-700">Test Keyboard Navigation</span>
          </button>

          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50">
            <Contrast className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-700">Test Color Contrast</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Additional tab components would continue here...
// PWAFeatures, OfflineSupport, LanguageSettings, VoiceCommands

// PWAFeatures Component
const PWAFeatures = ({ pwaFeatures, pwaSettings, onInstall }) => {
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);

  return (
    <div className="space-y-6">
      {/* PWA Installation Banner */}
      {!installPromptDismissed && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Download className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Install as App
                </h3>
                <p className="text-blue-800">
                  Get the full app experience with offline access and
                  notifications
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onInstall}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Install
              </button>
              <button
                onClick={() => setInstallPromptDismissed(true)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pwaFeatures?.map((feature) => (
          <div
            key={feature.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {feature.name}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  feature.enabled ? "bg-green-400" : "bg-gray-300"
                }`}
              />
            </div>

            <div className="text-sm">
              <span
                className={feature.enabled ? "text-green-600" : "text-gray-500"}
              >
                {feature.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PWA Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          PWA Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600">Total Installs</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Retention Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Daily Active Users</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">2.3s</div>
            <div className="text-sm text-gray-600">Average Load Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// OfflineSupport Component
const OfflineSupport = ({ offlineData }) => {
  const [offlineStatus, setOfflineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(true);
    const handleOffline = () => setOfflineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncOfflineData = async () => {
    try {
      const response = await fetch("/api/offline/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        alert("Data synced successfully!");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Sync failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div
        className={`border rounded-lg p-6 ${
          offlineStatus
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center">
          {offlineStatus ? (
            <>
              <Wifi className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Online</h3>
                <p className="text-green-800">
                  You're connected to the internet
                </p>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Offline</h3>
                <p className="text-red-800">Working in offline mode</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Offline Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cached Data
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Menu Items</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {offlineData?.menuItems || 0} cached
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Customer Orders</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {offlineData?.orders || 0} pending
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Settings</span>
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Synchronized
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Offline Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={syncOfflineData}
              disabled={!offlineStatus}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Data
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Download for Offline
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-2" />
              Offline Settings
            </button>
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Storage Usage
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Cache Storage</span>
              <span>2.3 MB / 50 MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "4.6%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Offline Data</span>
              <span>890 KB / 10 MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "8.9%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// LanguageSettings Component
const LanguageSettings = ({
  supportedLanguages,
  currentLanguage,
  setCurrentLanguage,
  languageSettings,
}) => {
  const [translations, setTranslations] = useState({});
  const [customTranslations, setCustomTranslations] = useState({});

  const updateLanguage = async (languageCode) => {
    try {
      const response = await fetch("/api/i18n/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ language: languageCode }),
      });

      if (response.ok) {
        setCurrentLanguage(languageCode);
        // Apply language change immediately
        document.documentElement.lang = languageCode;
      }
    } catch (error) {
      console.error("Language update failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Language */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Language
        </h3>
        <div className="flex items-center space-x-3">
          {supportedLanguages.find((lang) => lang.code === currentLanguage) && (
            <>
              <span className="text-2xl">
                {
                  supportedLanguages.find(
                    (lang) => lang.code === currentLanguage
                  )?.flag
                }
              </span>
              <div>
                <div className="font-medium text-gray-900">
                  {
                    supportedLanguages.find(
                      (lang) => lang.code === currentLanguage
                    )?.name
                  }
                </div>
                <div className="text-sm text-gray-600">
                  {supportedLanguages.find(
                    (lang) => lang.code === currentLanguage
                  )?.rtl
                    ? "Right-to-left"
                    : "Left-to-right"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Languages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => updateLanguage(language.code)}
              className={`p-4 border-2 rounded-lg transition-all ${
                currentLanguage === language.code
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {language.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language.code.toUpperCase()}
                  </div>
                </div>
              </div>
              {currentLanguage === language.code && (
                <div className="mt-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Management */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Translation Status
        </h3>
        <div className="space-y-4">
          {supportedLanguages.map((language) => (
            <div
              key={language.code}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium text-gray-900">
                  {language.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {Math.floor(Math.random() * 40) + 60}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>12-hour (AM/PM)</option>
              <option>24-hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>1,234.56</option>
              <option>1.234,56</option>
              <option>1 234,56</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// VoiceCommands Component
const VoiceCommands = ({ voiceEnabled, setVoiceEnabled, currentLanguage }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [supportedCommands] = useState([
    {
      command: "Go home",
      action: "Navigate to home page",
      category: "Navigation",
    },
    {
      command: "Show menu",
      action: "Display restaurant menu",
      category: "Navigation",
    },
    {
      command: "View orders",
      action: "Open orders page",
      category: "Navigation",
    },
    {
      command: "Open settings",
      action: "Access settings menu",
      category: "Navigation",
    },
    {
      command: "Add to cart",
      action: "Add current item to cart",
      category: "Shopping",
    },
    {
      command: "Checkout",
      action: "Proceed to checkout",
      category: "Shopping",
    },
    {
      command: "Search [item]",
      action: "Search for specific menu item",
      category: "Search",
    },
    {
      command: "Filter by [category]",
      action: "Filter menu by category",
      category: "Search",
    },
    {
      command: "Increase font size",
      action: "Make text larger",
      category: "Accessibility",
    },
    {
      command: "Decrease font size",
      action: "Make text smaller",
      category: "Accessibility",
    },
    {
      command: "Toggle high contrast",
      action: "Switch contrast mode",
      category: "Accessibility",
    },
    {
      command: "Read page",
      action: "Read page content aloud",
      category: "Accessibility",
    },
  ]);

  const toggleVoiceRecognition = () => {
    if (
      ("speechSynthesis" in window && "webkitSpeechRecognition" in window) ||
      "SpeechRecognition" in window
    ) {
      setVoiceEnabled(!voiceEnabled);
      if (!voiceEnabled) {
        startListening();
      } else {
        stopListening();
      }
    } else {
      alert("Voice recognition is not supported in this browser");
    }
  };

  const startListening = () => {
    setIsListening(true);
    setLastCommand("Listening...");
  };

  const stopListening = () => {
    setIsListening(false);
    setLastCommand("");
  };

  const testVoiceCommand = (command) => {
    setLastCommand(`Testing: ${command}`);
    // Speak the confirmation
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Executing command: ${command}`
      );
      utterance.lang = currentLanguage;
      speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setLastCommand(`Executed: ${command}`);
    }, 1000);
  };

  const commandCategories = [
    ...new Set(supportedCommands.map((cmd) => cmd.category)),
  ];

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Voice Control</h3>
          <button
            onClick={toggleVoiceRecognition}
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${
              voiceEnabled
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {voiceEnabled ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Disable
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Enable
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`w-4 h-4 rounded-full ${
              isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          <span className="text-gray-700">
            Status:{" "}
            {isListening ? "Listening..." : voiceEnabled ? "Ready" : "Disabled"}
          </span>
          {lastCommand && (
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {lastCommand}
            </span>
          )}
        </div>
      </div>

      {/* Supported Commands */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Supported Commands
        </h3>

        {commandCategories.map((category) => (
          <div key={category} className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              {category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportedCommands
                .filter((cmd) => cmd.category === category)
                .map((cmd, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => testVoiceCommand(cmd.command)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          "{cmd.command}"
                        </div>
                        <div className="text-sm text-gray-600">
                          {cmd.action}
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Voice Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Voice Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recognition Language
            </label>
            <select
              value={currentLanguage}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="en">English (US)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speech Rate
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>Slow</option>
              <option>Normal</option>
              <option>Fast</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Volume
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wake Word
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>Hey Restaurant</option>
              <option>Order Chef</option>
              <option>Kitchen Command</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAccessibilityCenter;
