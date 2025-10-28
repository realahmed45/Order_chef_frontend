import React, { useState, useCallback } from "react";
import { ChromePicker } from "react-color";

const AdvancedWebsiteBuilder = ({
  restaurant,
  menuItems,
  onDeploy,
  onSave,
}) => {
  const [config, setConfig] = useState({
    // Branding
    brandName: restaurant?.name || "",
    tagline: restaurant?.description || "Order delicious food online",
    logo: restaurant?.logo || "",

    // Colors - WITH WORKING PICKER!
    primaryColor: "#EA580C",
    secondaryColor: "#F97316",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    accentColor: "#10B981",

    // Layout
    template: "modern", // modern, classic, minimal, bold
    headerStyle: "gradient",
    heroStyle: "full",
    menuLayout: "grid",

    // Content
    heroTitle: `Welcome to ${restaurant?.name || "Our Restaurant"}`,
    heroSubtitle: "Experience authentic flavors delivered to your door",
    heroCTA: "View Menu",

    // Features
    showHero: true,
    showFeatures: true,
    showGallery: false,

    // Contact
    contactInfo: {
      phone: restaurant?.phone || "",
      email: restaurant?.email || "",
      address: restaurant?.address || "",
    },

    // SEO
    metaTitle: `${restaurant?.name || "Restaurant"} - Order Online`,
    metaDescription: "Order delicious food online",
  });

  const [activeTab, setActiveTab] = useState("template");
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [isSaving, setIsSaving] = useState(false);

  // **FIXED: Color picker handler**
  const handleColorChange = useCallback((colorKey, color) => {
    setConfig((prev) => ({
      ...prev,
      [colorKey]: color.hex, // ✅ Extract hex value from color object
    }));
  }, []);

  // Update config
  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update nested config
  const updateNestedConfig = useCallback((parent, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  }, []);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(config);
      alert("✅ Website configuration saved!");
    } catch (error) {
      alert("❌ Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Templates
  const templates = [
    {
      id: "modern",
      name: "Modern",
      icon: "🎨",
      colors: {
        primaryColor: "#EA580C",
        secondaryColor: "#F97316",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        accentColor: "#10B981",
      },
    },
    {
      id: "classic",
      name: "Classic",
      icon: "📜",
      colors: {
        primaryColor: "#8B4513",
        secondaryColor: "#D2691E",
        backgroundColor: "#FFF8DC",
        textColor: "#2F2F2F",
        accentColor: "#228B22",
      },
    },
    {
      id: "minimal",
      name: "Minimal",
      icon: "⚪",
      colors: {
        primaryColor: "#000000",
        secondaryColor: "#333333",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        accentColor: "#0066CC",
      },
    },
    {
      id: "bold",
      name: "Bold",
      icon: "⚡",
      colors: {
        primaryColor: "#DC2626",
        secondaryColor: "#EF4444",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        accentColor: "#FBBF24",
      },
    },
  ];

  // Apply template
  const applyTemplate = useCallback((template) => {
    setConfig((prev) => ({
      ...prev,
      template: template.id,
      ...template.colors,
    }));
  }, []);

  // Tabs
  const tabs = [
    { id: "template", label: "Template", icon: "🎨" },
    { id: "colors", label: "Colors", icon: "🌈" },
    { id: "layout", label: "Layout", icon: "📐" },
    { id: "content", label: "Content", icon: "📝" },
    { id: "seo", label: "SEO", icon: "🔍" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Builder */}
      <div className="w-2/5 overflow-y-auto border-r border-gray-200 bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎨 Website Builder
            </h2>
            <p className="text-sm text-gray-600">
              Customize your restaurant website
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Template Tab */}
            {activeTab === "template" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Choose Template
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className={`p-4 border-2 rounded-lg transition ${
                        config.template === template.id
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="text-4xl mb-2">{template.icon}</div>
                      <div className="font-semibold">{template.name}</div>
                      <div className="flex space-x-1 mt-2">
                        {Object.values(template.colors)
                          .slice(0, 3)
                          .map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === "colors" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Customize Colors
                </h3>

                {/* Color Pickers */}
                {[
                  { key: "primaryColor", label: "Primary Color" },
                  { key: "secondaryColor", label: "Secondary Color" },
                  { key: "backgroundColor", label: "Background Color" },
                  { key: "textColor", label: "Text Color" },
                  { key: "accentColor", label: "Accent Color" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          setActiveColorPicker(
                            activeColorPicker === key ? null : key
                          )
                        }
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-orange-500 transition"
                        style={{ backgroundColor: config[key] }}
                      />
                      <input
                        type="text"
                        value={config[key]}
                        onChange={(e) => updateConfig(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="#000000"
                      />
                    </div>

                    {/* **FIXED: Color Picker** */}
                    {activeColorPicker === key && (
                      <div className="mt-2">
                        <ChromePicker
                          color={config[key]}
                          onChange={(color) => handleColorChange(key, color)}
                          onChangeComplete={(color) =>
                            handleColorChange(key, color)
                          }
                          disableAlpha={true}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Layout Tab */}
            {activeTab === "layout" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Layout Options
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["gradient", "solid", "minimal"].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateConfig("headerStyle", style)}
                        className={`px-3 py-2 rounded-lg capitalize ${
                          config.headerStyle === style
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Layout
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["grid", "list"].map((layout) => (
                      <button
                        key={layout}
                        onClick={() => updateConfig("menuLayout", layout)}
                        className={`px-3 py-2 rounded-lg capitalize ${
                          config.menuLayout === layout
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.showHero}
                      onChange={(e) =>
                        updateConfig("showHero", e.target.checked)
                      }
                      className="w-5 h-5 text-orange-600 rounded"
                    />
                    <span>Show Hero Section</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.showFeatures}
                      onChange={(e) =>
                        updateConfig("showFeatures", e.target.checked)
                      }
                      className="w-5 h-5 text-orange-600 rounded"
                    />
                    <span>Show Features</span>
                  </label>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Content</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => updateConfig("brandName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => updateConfig("tagline", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => updateConfig("heroTitle", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    value={config.heroSubtitle}
                    onChange={(e) =>
                      updateConfig("heroSubtitle", e.target.value)
                    }
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  SEO Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={config.metaTitle}
                    onChange={(e) => updateConfig("metaTitle", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={config.metaDescription}
                    onChange={(e) =>
                      updateConfig("metaDescription", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "💾 Save Configuration"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Live Preview</h3>
          <div className="flex space-x-2">
            {["desktop", "tablet", "mobile"].map((mode) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`p-2 rounded ${
                  previewMode === mode
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                title={mode}
              >
                {mode === "desktop" && "🖥️"}
                {mode === "tablet" && "📱"}
                {mode === "mobile" && "📲"}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Container */}
        <div
          className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
            previewMode === "mobile"
              ? "max-w-sm mx-auto"
              : previewMode === "tablet"
              ? "max-w-2xl mx-auto"
              : "w-full"
          }`}
        >
          <LivePreview config={config} menuItems={menuItems} />
        </div>
      </div>
    </div>
  );
};

// Live Preview Component
const LivePreview = ({ config, menuItems }) => {
  return (
    <div
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
    >
      {/* Header */}
      <header
        className="p-6"
        style={{
          background:
            config.headerStyle === "gradient"
              ? `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
              : config.primaryColor,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            {config.logo && (
              <img src={config.logo} alt="Logo" className="h-12 mb-2" />
            )}
            <h1 className="text-2xl font-bold text-white">
              {config.brandName}
            </h1>
            <p className="text-white opacity-90 text-sm">{config.tagline}</p>
          </div>
          <button
            style={{ backgroundColor: config.accentColor }}
            className="px-6 py-2 text-white rounded-lg font-semibold"
          >
            Order Now
          </button>
        </div>
      </header>

      {/* Hero */}
      {config.showHero && (
        <section
          className="py-16 px-6 text-center"
          style={{ backgroundColor: `${config.primaryColor}10` }}
        >
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: config.primaryColor }}
          >
            {config.heroTitle}
          </h2>
          <p className="text-lg mb-6 text-gray-600">{config.heroSubtitle}</p>
          <button
            style={{ backgroundColor: config.primaryColor }}
            className="px-8 py-3 text-white rounded-lg font-semibold"
          >
            {config.heroCTA}
          </button>
        </section>
      )}

      {/* Menu Preview */}
      <section className="py-12 px-6">
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: config.primaryColor }}
        >
          Our Menu
        </h2>
        <div
          className={`grid gap-6 ${
            config.menuLayout === "grid" ? "grid-cols-3" : "grid-cols-1"
          }`}
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <div className="h-40 bg-gray-200 rounded-lg mb-3" />
              <h3 className="font-semibold text-lg">Menu Item {i}</h3>
              <p className="text-sm text-gray-600 my-2">Delicious food</p>
              <div className="flex justify-between items-center">
                <span
                  className="text-xl font-bold"
                  style={{ color: config.primaryColor }}
                >
                  $12.99
                </span>
                <button
                  style={{ backgroundColor: config.accentColor }}
                  className="px-4 py-2 text-white rounded-lg text-sm font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center text-white"
        style={{ backgroundColor: config.primaryColor }}
      >
        <p className="mb-2 font-semibold">{config.brandName}</p>
        <p className="text-sm opacity-90">
          {config.contactInfo.phone && `📞 ${config.contactInfo.phone}`}
        </p>
        <p className="text-xs mt-4 opacity-75">
          © 2025 {config.brandName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdvancedWebsiteBuilder;
