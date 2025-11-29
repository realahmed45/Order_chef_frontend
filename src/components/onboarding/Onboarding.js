// Place this file at: frontend/src/components/onboarding/Onboarding.js
// COMPLETE REPLACEMENT

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { authApi } from "../../api";

const ImprovedOnboarding = ({ user, onUpdateUser }) => {
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [restaurantData, setRestaurantData] = useState({
    _id: null,
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cuisine: "",
  });
  const [menuItems, setMenuItems] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [savingRestaurant, setSavingRestaurant] = useState(false);

  const totalSteps = 4;

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch(
        "https://order-chef-backend.onrender.com/api/templates/list"
      );
      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates);
        console.log("✅ Loaded", data.templates.length, "templates");
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  // Create/Save Restaurant
  const handleSaveRestaurant = useCallback(async () => {
    if (
      !restaurantData.name ||
      !restaurantData.phone ||
      !restaurantData.cuisine
    ) {
      alert("Please fill in: Restaurant Name, Phone, and Cuisine Type");
      return false;
    }

    setSavingRestaurant(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://order-chef-backend.onrender.com/api/onboarding/restaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: restaurantData.name,
            description: restaurantData.description,
            cuisineType: restaurantData.cuisine,
            contact: {
              phone: restaurantData.phone,
              email: restaurantData.email,
              address: {
                street: restaurantData.address,
                city: restaurantData.city,
                state: restaurantData.state,
                zipCode: restaurantData.zipCode,
              },
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.restaurant) {
        setRestaurantData((prev) => ({
          ...prev,
          _id: data.restaurant._id || data.restaurant.id,
        }));

        console.log("✅ Restaurant created:", data.restaurant._id);
        return true;
      } else {
        throw new Error(data.message || "Failed to create restaurant");
      }
    } catch (error) {
      console.error("Restaurant creation error:", error);
      alert(`Failed to save restaurant: ${error.message}`);
      return false;
    } finally {
      setSavingRestaurant(false);
    }
  }, [restaurantData]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    try {
      const response = await authApi.completeOnboarding();
      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.user));
        if (onUpdateUser) {
          onUpdateUser(response.user);
        }
        return true;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      throw error;
    }
  }, [onUpdateUser]);

  // Deploy website
  const handleDeploy = useCallback(async () => {
    if (!restaurantData._id) {
      alert("Please complete restaurant setup first");
      setStep(2);
      return;
    }

    if (!selectedTemplate) {
      alert("Please select a template");
      setStep(1);
      return;
    }

    setDeploying(true);

    try {
      const token = localStorage.getItem("token");

      console.log("🚀 Deploying React website...");

      const response = await fetch(
        "https://order-chef-backend.onrender.com/api/deployments/deploy-react",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId: restaurantData._id,
            templateId: selectedTemplate.id,
            restaurantData: restaurantData,
            menuItems: menuItems.filter((i) => i.name && i.price),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setDeployed(true);
        setWebsiteUrl(data.websiteUrl);

        try {
          await completeOnboarding();
          alert(
            `🎉 Website deployed!\n\nYour live website:\n${data.websiteUrl}\n\n✅ Onboarding complete!`
          );
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } catch (error) {
          alert(
            `🎉 Website deployed!\n\n${data.websiteUrl}\n\n⚠️ Please refresh to access dashboard.`
          );
        }
      } else {
        throw new Error(data.message || "Deployment failed");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      alert(`Deployment failed: ${error.message}`);
    } finally {
      setDeploying(false);
    }
  }, [restaurantData, selectedTemplate, menuItems, completeOnboarding]);

  // Navigation
  const handleNextStep = useCallback(async () => {
    if (step === 1 && !selectedTemplate) {
      alert("Please select a template");
      return;
    }

    if (step === 2) {
      const success = await handleSaveRestaurant();
      if (!success) return;
    }

    setStep(step + 1);
  }, [step, selectedTemplate, handleSaveRestaurant]);

  // Menu management
  const addMenuItem = () => {
    setMenuItems([
      ...menuItems,
      {
        id: Date.now(),
        name: "",
        price: "",
        description: "",
        category: "",
      },
    ]);
  };

  const updateMenuItem = (id, field, value) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  // STEP 1: Template Selection
  const TemplateSelectionStep = useMemo(
    () => (
      <div className="step-container animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🎨 Choose Your Template
            </h2>
            <p className="text-xl text-gray-600">
              Select a professional design for your restaurant website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                  selectedTemplate?.id === template.id
                    ? "ring-4 ring-orange-500"
                    : "hover:shadow-2xl"
                }`}
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${template.thumbnail})` }}
                >
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Selected
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {template.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-semibold">
                      {template.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {template.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading templates...</p>
            </div>
          )}
        </div>
      </div>
    ),
    [templates, selectedTemplate]
  );

  // STEP 2: Restaurant Info
  const RestaurantInfoStep = useMemo(
    () => (
      <div className="step-container animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              🏪 Restaurant Information
            </h2>
            <p className="text-gray-600">Tell us about your restaurant</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  value={restaurantData.name}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Joe's Pizza Palace"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={restaurantData.description}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      description: e.target.value,
                    })
                  }
                  placeholder="What makes your restaurant special..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={restaurantData.phone}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type *
                </label>
                <select
                  value={restaurantData.cuisine}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      cuisine: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="italian">Italian</option>
                  <option value="chinese">Chinese</option>
                  <option value="mexican">Mexican</option>
                  <option value="indian">Indian</option>
                  <option value="american">American</option>
                  <option value="pizza">Pizza</option>
                  <option value="thai">Thai</option>
                  <option value="burger">Burger</option>
                  <option value="cafe">Cafe</option>
                  <option value="bakery">Bakery</option>
                  <option value="bbq">BBQ</option>
                  <option value="seafood">Seafood</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={restaurantData.email}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      email: e.target.value,
                    })
                  }
                  placeholder="contact@restaurant.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={restaurantData.address}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      address: e.target.value,
                    })
                  }
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={restaurantData.city}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      city: e.target.value,
                    })
                  }
                  placeholder="New York"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={restaurantData.state}
                  onChange={(e) =>
                    setRestaurantData({
                      ...restaurantData,
                      state: e.target.value,
                    })
                  }
                  placeholder="NY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [restaurantData]
  );

  // STEP 3: Menu Items
  const MenuItemsStep = useMemo(
    () => (
      <div className="step-container animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              📋 Add Menu Items
            </h2>
            <p className="text-gray-600">Add dishes to your menu</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-6 rounded-lg relative"
                >
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl font-bold"
                  >
                    ✕
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dish Name *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateMenuItem(item.id, "name", e.target.value)
                        }
                        placeholder="Margherita Pizza"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateMenuItem(item.id, "price", e.target.value)
                        }
                        placeholder="12.99"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateMenuItem(item.id, "description", e.target.value)
                        }
                        placeholder="Delicious description..."
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) =>
                          updateMenuItem(item.id, "category", e.target.value)
                        }
                        placeholder="Appetizers, Mains, Desserts"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addMenuItem}
                className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition font-semibold text-lg"
              >
                + Add Menu Item
              </button>

              {menuItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No menu items yet</p>
                  <p className="text-sm mt-2">
                    Click "Add Menu Item" above to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    [menuItems]
  );

  // STEP 4: Deploy
  const DeployStep = useMemo(
    () => (
      <div className="step-container animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              🚀 Ready to Launch!
            </h2>
            <p className="text-gray-600 text-xl">
              We'll build your professional React website and deploy it live
            </p>
          </div>

          {!deployed && !deploying && (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="mb-10">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mx-auto flex items-center justify-center mb-8 animate-pulse">
                  <span className="text-6xl">🎨</span>
                </div>
                <h3 className="text-3xl font-bold mb-6">Review Your Details</h3>
                <div className="text-left max-w-lg mx-auto space-y-4 mb-10 bg-gray-50 p-8 rounded-xl">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">Template:</span>
                    <span className="font-bold text-orange-600">
                      {selectedTemplate?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">
                      Restaurant:
                    </span>
                    <span className="font-bold">{restaurantData.name}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">
                      Menu Items:
                    </span>
                    <span className="font-bold text-green-600">
                      {menuItems.filter((i) => i.name && i.price).length} items
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDeploy}
                className="px-16 py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold text-xl hover:from-orange-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl"
              >
                🚀 Deploy My Website Now
              </button>

              <p className="text-sm text-gray-500 mt-8 font-medium">
                ⏱️ This may take 2-3 minutes. Please don't close this window.
              </p>
            </div>
          )}

          {deploying && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="animate-spin w-24 h-24 border-8 border-orange-500 border-t-transparent rounded-full mx-auto mb-10"></div>
              <h3 className="text-3xl font-bold mb-6">
                Building Your Website...
              </h3>
              <p className="text-xl text-gray-600 mb-10">
                Installing dependencies, compiling React, and deploying...
              </p>
              <div className="space-y-4 text-lg text-gray-500 max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  <p>Installing packages...</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  <p>Building production bundle...</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  <p>Deploying to server...</p>
                </div>
              </div>
            </div>
          )}

          {deployed && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-7xl">🎉</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Your Website is Live!
              </h2>
              <p className="text-2xl text-gray-600 mb-12">
                Congratulations! Your restaurant website is now online!
              </p>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-10 mb-10">
                <p className="text-lg text-gray-600 mb-4 font-medium">
                  Your website URL:
                </p>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl font-bold text-green-700 hover:text-green-800 break-all underline"
                >
                  {websiteUrl}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-6 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
                >
                  🌐 Visit Website
                </a>
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="py-6 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg"
                >
                  📊 Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    [
      deployed,
      deploying,
      selectedTemplate,
      restaurantData,
      menuItems,
      websiteUrl,
      handleDeploy,
    ]
  );

  // Progress Bar
  const ProgressBar = useMemo(
    () => (
      <div className="bg-white border-b-2 border-gray-200 py-6 px-8 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                      step >= stepNumber
                        ? "bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`text-sm mt-3 font-semibold ${
                      step >= stepNumber ? "text-orange-600" : "text-gray-400"
                    }`}
                  >
                    {["Template", "Details", "Menu", "Deploy"][stepNumber - 1]}
                  </span>
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-1 mx-6 rounded transition-all ${
                      step > stepNumber
                        ? "bg-gradient-to-r from-orange-500 to-pink-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    ),
    [step]
  );

  // Navigation Buttons
  const NavigationButtons = useMemo(
    () => (
      <div className="bg-white border-t-2 border-gray-200 py-6 px-8 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || deployed || deploying}
            className="px-10 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {!deployed && !deploying && step < 4 && (
            <button
              onClick={handleNextStep}
              disabled={savingRestaurant}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-700 transition disabled:opacity-50 shadow-lg"
            >
              {savingRestaurant ? "Saving..." : "Continue →"}
            </button>
          )}
        </div>
      </div>
    ),
    [step, deployed, deploying, savingRestaurant, handleNextStep]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>

      {ProgressBar}

      <div className="flex-1 overflow-y-auto p-10">
        {step === 1 && TemplateSelectionStep}
        {step === 2 && RestaurantInfoStep}
        {step === 3 && MenuItemsStep}
        {step === 4 && DeployStep}
      </div>

      {step < 4 && NavigationButtons}
    </div>
  );
};

export default ImprovedOnboarding;
