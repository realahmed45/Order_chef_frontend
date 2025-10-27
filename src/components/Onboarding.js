import React, { useState, useCallback, useMemo } from "react";
import AdvancedWebsiteBuilder from "./WebsitCustomizer";

const ImprovedOnboarding = () => {
  const [step, setStep] = useState(1);
  const [restaurantData, setRestaurantData] = useState({
    _id: null,
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    cuisine: "",
  });
  const [menuItems, setMenuItems] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("ai");
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [savingRestaurant, setSavingRestaurant] = useState(false);

  const totalSteps = 4;

  // Create/Save Restaurant
  const handleSaveRestaurant = useCallback(async () => {
    if (
      !restaurantData.name ||
      !restaurantData.phone ||
      !restaurantData.cuisine
    ) {
      alert(
        "Please fill in all required fields: Restaurant Name, Phone, and Cuisine Type"
      );
      return false;
    }

    setSavingRestaurant(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first");
        return false;
      }

      const response = await fetch(
        "http://localhost:5000/api/onboarding/restaurant",
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

        console.log("✅ Restaurant created with ID:", data.restaurant._id);
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

  // Navigation with restaurant creation
  const handleNextStep = useCallback(async () => {
    if (step === 1) {
      const success = await handleSaveRestaurant();
      if (!success) return;
    }

    setStep(step + 1);
  }, [step, handleSaveRestaurant]);

  // File upload handler
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setTimeout(() => {
      setMenuItems([
        {
          name: "Margherita Pizza",
          price: 12.99,
          description: "Classic tomato and mozzarella",
          category: "Pizza",
        },
        {
          name: "Caesar Salad",
          price: 8.99,
          description: "Fresh romaine with parmesan",
          category: "Salads",
        },
        {
          name: "Spaghetti Carbonara",
          price: 14.99,
          description: "Creamy pasta with bacon",
          category: "Pasta",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  // **NEW: Deploy to Vercel (real hosting)**
  const handleDeploy = useCallback(async () => {
    if (!restaurantData._id) {
      alert("Please complete restaurant setup first (Step 1)");
      setStep(1);
      return;
    }

    if (!config) {
      alert("Please customize your website first (Step 3)");
      setStep(3);
      return;
    }

    setDeploying(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      console.log("🚀 Deploying to Vercel...");
      console.log("Restaurant:", restaurantData.name);
      console.log("Config:", config);

      const response = await fetch(
        "http://localhost:5000/api/deployments/deploy-vercel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId: restaurantData._id,
            restaurantName: restaurantData.name,
            config: config,
            menuItems: menuItems,
          }),
        }
      );

      const data = await response.json();

      console.log("Deployment response:", data);

      if (response.ok && data.success) {
        setDeployed(true);
        setWebsiteUrl(data.websiteUrl);
        alert(
          `🎉 Website deployed successfully!\n\nYour website is live at:\n${data.websiteUrl}\n\nAccessible from anywhere in the world!`
        );
      } else {
        throw new Error(data.message || "Deployment failed");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      alert(
        `Deployment failed: ${error.message}\n\nPlease check:\n1. VERCEL_TOKEN is set in backend .env\n2. Backend server is running\n3. Internet connection is working`
      );
    } finally {
      setDeploying(false);
    }
  }, [restaurantData._id, restaurantData.name, config, menuItems]);

  // Save config and navigate to deployment
  const handleSaveConfig = useCallback(
    (newConfig) => {
      console.log("💾 Config saved:", newConfig);

      if (!restaurantData._id) {
        alert("⚠️ Restaurant not created yet!\n\nPlease go back to Step 1.");
        setStep(1);
        return;
      }

      setConfig(newConfig);
      alert("✅ Website customization saved!\n\nProceed to deployment step.");
      setStep(4);
    },
    [restaurantData._id]
  );

  // Step 1: Restaurant Information
  const RestaurantInfoStep = useMemo(
    () => (
      <div className="step-container animate-fade-in">
        <div className="step-header">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🍽️ Tell us about your restaurant
          </h2>
          <p className="text-gray-600">Let's start with the basics</p>
        </div>

        <div className="form-container mt-8 space-y-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={restaurantData.name}
              onChange={(e) =>
                setRestaurantData({ ...restaurantData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              placeholder="e.g., Bella's Italian Kitchen"
              required
            />
          </div>

          <div className="form-group">
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
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Tell customers what makes your restaurant special..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="form-group">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="contact@restaurant.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="form-group">
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
              required
            >
              <option value="">Select cuisine type...</option>
              <option value="pizza">Pizza</option>
              <option value="burger">Burger</option>
              <option value="italian">Italian</option>
              <option value="chinese">Chinese</option>
              <option value="mexican">Mexican</option>
              <option value="american">American</option>
              <option value="indian">Indian</option>
              <option value="japanese">Japanese</option>
              <option value="thai">Thai</option>
              <option value="cafe">Cafe</option>
              <option value="bakery">Bakery</option>
              <option value="bbq">BBQ</option>
              <option value="seafood">Seafood</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="other">Other</option>
            </select>
          </div>

          {restaurantData._id && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                ✅ Restaurant saved! ID: {restaurantData._id}
              </p>
            </div>
          )}
        </div>
      </div>
    ),
    [restaurantData]
  );

  // Step 2: Menu Upload (keeping your existing implementation)
  const MenuUploadStep = useMemo(
    () => (
      <div className="step-container animate-fade-in">
        <div className="step-header">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Add your menu
          </h2>
          <p className="text-gray-600">
            Upload your menu or add items manually
          </p>
        </div>

        <div className="mt-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadMethod("ai")}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold transition ${
                uploadMethod === "ai"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🤖 AI Extract
            </button>
            <button
              onClick={() => setUploadMethod("manual")}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold transition ${
                uploadMethod === "manual"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✍️ Manual Entry
            </button>
          </div>

          {uploadMethod === "ai" ? (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border-2 border-dashed border-orange-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📸</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Your Menu
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload a photo or PDF of your menu
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="menu-upload"
                />
                <label
                  htmlFor="menu-upload"
                  className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-orange-700 transition"
                >
                  Choose File
                </label>
              </div>

              {loading && (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  <p className="mt-4 text-orange-700 font-medium">
                    AI is extracting your menu...
                  </p>
                </div>
              )}

              {menuItems.length > 0 && !loading && (
                <div className="mt-6 bg-white rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    ✅ Extracted {menuItems.length} items
                  </h4>
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <span className="font-semibold text-orange-600">
                          ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Add Menu Items</h3>
              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-3 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...menuItems];
                        newItems[index].name = e.target.value;
                        setMenuItems(newItems);
                      }}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...menuItems];
                        newItems[index].price = parseFloat(e.target.value);
                        setMenuItems(newItems);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const newItems = menuItems.filter(
                          (_, i) => i !== index
                        );
                        setMenuItems(newItems);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setMenuItems([
                      ...menuItems,
                      { name: "", price: 0, description: "", category: "" },
                    ])
                  }
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600"
                >
                  + Add Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    [uploadMethod, loading, menuItems, handleFileUpload]
  );

  // Step 3: Advanced Website Builder
  const CustomizationStep = useMemo(
    () => (
      <div className="h-screen">
        <AdvancedWebsiteBuilder
          restaurant={restaurantData}
          menuItems={menuItems}
          onSave={handleSaveConfig}
        />
      </div>
    ),
    [restaurantData, menuItems, handleSaveConfig]
  );

  // Step 4: Deploy
  const DeploymentStep = useMemo(() => {
    if (deployed) {
      return (
        <div className="step-container animate-fade-in">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Website is Live!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Congratulations! Your website is accessible from anywhere in the
              world!
            </p>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your website URL:</p>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold text-green-700 hover:text-green-800 break-all"
              >
                {websiteUrl}
              </a>
              <p className="text-sm text-gray-600 mt-4">
                ✅ Accessible from any device, anywhere
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                🌐 Visit Website
              </a>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                📊 Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="step-container animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="step-header text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🚀 Deploy Your Website
            </h2>
            <p className="text-gray-600">
              Deploy your website to Vercel - accessible worldwide!
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">✅ Ready to Deploy</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Restaurant info saved</li>
                <li>✓ Menu items added: {menuItems.length} items</li>
                <li>✓ Website customized</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Go Live? 🚀</h3>
              <p className="text-gray-600 mb-6">
                Your website will be deployed to Vercel and accessible from
                anywhere in the world!
              </p>
              <button
                onClick={handleDeploy}
                disabled={deploying || !restaurantData._id || !config}
                className="px-12 py-4 bg-orange-600 text-white rounded-lg font-semibold text-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deploying ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deploying to Vercel...
                  </span>
                ) : (
                  "🚀 Deploy to Vercel"
                )}
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Your website URL will be:{" "}
                {restaurantData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                .vercel.app
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    deployed,
    websiteUrl,
    restaurantData,
    menuItems,
    config,
    deploying,
    handleDeploy,
  ]);

  // Progress Bar
  const ProgressBar = useMemo(
    () => (
      <div className="bg-white border-b border-gray-200 py-4 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      step >= stepNumber
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      step >= stepNumber
                        ? "text-orange-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {
                      ["Restaurant", "Menu", "Customize", "Deploy"][
                        stepNumber - 1
                      ]
                    }
                  </span>
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition ${
                      step > stepNumber ? "bg-orange-600" : "bg-gray-200"
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
      <div className="bg-white border-t border-gray-200 py-4 px-8">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={step === totalSteps || savingRestaurant}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingRestaurant
              ? "Saving..."
              : step === totalSteps
              ? "Finish"
              : "Continue →"}
          </button>
        </div>
      </div>
    ),
    [step, totalSteps, handleNextStep, savingRestaurant]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {ProgressBar}

      <div className="flex-1 overflow-y-auto p-8">
        {step === 1 && RestaurantInfoStep}
        {step === 2 && MenuUploadStep}
        {step === 3 && CustomizationStep}
        {step === 4 && DeploymentStep}
      </div>

      {step !== 3 && NavigationButtons}
    </div>
  );
};

export default ImprovedOnboarding;
