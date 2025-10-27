import React, { useState } from "react";

const OnboardingStep2 = ({ restaurant, onNext, onUpdateRestaurant }) => {
  const [formData, setFormData] = useState({
    hours: restaurant.hours || {
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "22:00", closed: false },
      saturday: { open: "10:00", close: "22:00", closed: false },
      sunday: { open: "10:00", close: "20:00", closed: false },
    },
    branding: restaurant.branding || {
      primaryColor: "#EA580C",
      secondaryColor: "#F97316",
    },
  });
  const [loading, setLoading] = useState(false);

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const handleHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: field === "closed" ? value === "true" : value,
        },
      },
    }));
  };

  const handleBrandingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/onboarding/update-restaurant/${restaurant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedRestaurant = await response.json();
        onUpdateRestaurant(updatedRestaurant);
        onNext();
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customize Your Website 🎨
        </h1>
        <p className="text-gray-600">
          Set your hours and customize how your website looks.
        </p>
      </div>

      <div className="space-y-8">
        {/* Operating Hours */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Operating Hours</h3>
          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day.key}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={!formData.hours[day.key]?.closed}
                    onChange={(e) =>
                      handleHoursChange(day.key, "closed", !e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="font-medium w-24">{day.label}</span>
                </div>

                {!formData.hours[day.key]?.closed ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={formData.hours[day.key]?.open || ""}
                      onChange={(e) =>
                        handleHoursChange(day.key, "open", e.target.value)
                      }
                      className="px-3 py-2 border rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={formData.hours[day.key]?.close || ""}
                      onChange={(e) =>
                        handleHoursChange(day.key, "close", e.target.value)
                      }
                      className="px-3 py-2 border rounded"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Branding */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Website Colors</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.branding.primaryColor}
                  onChange={(e) =>
                    handleBrandingChange("primaryColor", e.target.value)
                  }
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.branding.primaryColor}
                  onChange={(e) =>
                    handleBrandingChange("primaryColor", e.target.value)
                  }
                  className="px-3 py-2 border rounded flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.branding.secondaryColor}
                  onChange={(e) =>
                    handleBrandingChange("secondaryColor", e.target.value)
                  }
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.branding.secondaryColor}
                  onChange={(e) =>
                    handleBrandingChange("secondaryColor", e.target.value)
                  }
                  className="px-3 py-2 border rounded flex-1 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Website Preview */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Website Preview</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-lg mx-auto mb-4"
                style={{ backgroundColor: formData.branding.primaryColor }}
              ></div>
              <h4
                className="text-2xl font-bold mb-2"
                style={{ color: formData.branding.primaryColor }}
              >
                {restaurant.name}
              </h4>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div
                className="inline-block px-6 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: formData.branding.secondaryColor }}
              >
                View Menu
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue to Publish →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;
