import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Eye,
  BarChart3,
  Users,
  DollarSign,
  Package,
  Settings,
  Copy,
  Switch,
  Globe,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Building,
  Navigation,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import { formatCurrency, formatDateTime, formatDate } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const MultiLocationManager = ({ currentUser }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [globalAnalytics, setGlobalAnalytics] = useState({});
  const [locationAnalytics, setLocationAnalytics] = useState({});
  const [staff, setStaff] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    location: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    managerId: "",
    timezone: "",
    operatingHours: {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "22:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: false },
      sunday: { open: "09:00", close: "22:00", closed: false },
    },
    settings: {
      allowOnlineOrdering: true,
      allowPhoneOrdering: true,
      deliveryRadius: 5,
      minimumOrder: 15,
      taxRate: 8.5,
      currency: "USD",
    },
  });

  useEffect(() => {
    fetchLocationsData();
    fetchGlobalAnalytics();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchLocationSpecificData(selectedLocation._id);
    }
  }, [selectedLocation]);

  const fetchLocationsData = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/locations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();
      if (data.success) {
        setLocations(data.locations);
        if (data.locations.length > 0 && !selectedLocation) {
          setSelectedLocation(data.locations[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalAnalytics = async () => {
    try {
      const response = await fetch("/api/locations/analytics/global", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();
      if (data.success) {
        setGlobalAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching global analytics:", error);
    }
  };

  const fetchLocationSpecificData = async (locationId) => {
    try {
      const [analyticsRes, staffRes, inventoryRes] = await Promise.all([
        fetch(`/api/locations/${locationId}/analytics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`/api/locations/${locationId}/staff`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`/api/locations/${locationId}/inventory`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const [analyticsData, staffData, inventoryData] = await Promise.all([
        analyticsRes.json(),
        staffRes.json(),
        inventoryRes.json(),
      ]);

      if (analyticsData.success) setLocationAnalytics(analyticsData.analytics);
      if (staffData.success) setStaff(staffData.staff);
      if (inventoryData.success) setInventory(inventoryData.inventory);
    } catch (error) {
      console.error("Error fetching location specific data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const url = editingLocation
        ? `/api/locations/${editingLocation._id}`
        : "/api/locations";
      const method = editingLocation ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchLocationsData();
        resetForm();
        alert(
          `Location ${editingLocation ? "updated" : "added"} successfully!`
        );
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location");
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      phone: location.phone || "",
      email: location.email || "",
      managerId: location.managerId || "",
      timezone: location.timezone || "",
      operatingHours: location.operatingHours || formData.operatingHours,
      settings: location.settings || formData.settings,
    });
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/locations/${deleteModal.location._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchLocationsData();
        setDeleteModal({ show: false, location: null });
        if (selectedLocation?._id === deleteModal.location._id) {
          setSelectedLocation(locations[0] || null);
        }
        alert("Location deleted successfully");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("Failed to delete location");
    }
  };

  const duplicateLocation = async (location) => {
    const duplicatedData = {
      ...location,
      name: `${location.name} (Copy)`,
      _id: undefined,
    };

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(duplicatedData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchLocationsData();
        alert("Location duplicated successfully!");
      } else {
        alert("Error duplicating location: " + data.message);
      }
    } catch (error) {
      console.error("Error duplicating location:", error);
      alert("Failed to duplicate location");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      managerId: "",
      timezone: "",
      operatingHours: {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "22:00", closed: false },
        saturday: { open: "09:00", close: "22:00", closed: false },
        sunday: { open: "09:00", close: "22:00", closed: false },
      },
      settings: {
        allowOnlineOrdering: true,
        allowPhoneOrdering: true,
        deliveryRadius: 5,
        minimumOrder: 15,
        taxRate: 8.5,
        currency: "USD",
      },
    });
    setEditingLocation(null);
    setShowAddModal(false);
  };

  const getLocationStatus = (location) => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const currentDay = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][now.getDay()];

    const todayHours = location.operatingHours?.[currentDay];
    if (!todayHours || todayHours.closed) return "closed";

    const openTime = parseInt(todayHours.open.replace(":", ""));
    const closeTime = parseInt(todayHours.close.replace(":", ""));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return "open";
    }
    return "closed";
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading locations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Multi-Location Management
          </h2>
          <p className="text-gray-600">
            Manage all your restaurant locations from one dashboard
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </button>
        </div>
      </div>

      {/* Global Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Locations
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(globalAnalytics.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalAnalytics.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avg Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(globalAnalytics.avgOrderValue || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Selector */}
      {locations.length > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Viewing:
            </span>
            {locations.map((location) => (
              <button
                key={location._id}
                onClick={() => setSelectedLocation(location)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedLocation?._id === location._id
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>{location.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    getLocationStatus(location) === "open"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {locations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Locations Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first restaurant location to get started
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add First Location
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <LocationCard
                key={location._id}
                location={location}
                isSelected={selectedLocation?._id === location._id}
                onSelect={() => setSelectedLocation(location)}
                onEdit={() => handleEdit(location)}
                onDelete={() => setDeleteModal({ show: true, location })}
                onDuplicate={() => duplicateLocation(location)}
                getLocationStatus={getLocationStatus}
              />
            ))}
          </div>

          {/* Location Dashboard */}
          {selectedLocation && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview", icon: BarChart3 },
                    { id: "staff", label: "Staff", icon: Users },
                    { id: "inventory", label: "Inventory", icon: Package },
                    { id: "settings", label: "Settings", icon: Settings },
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

              <div className="p-6">
                {activeTab === "overview" && (
                  <LocationOverview
                    location={selectedLocation}
                    analytics={locationAnalytics}
                  />
                )}

                {activeTab === "staff" && (
                  <LocationStaff location={selectedLocation} staff={staff} />
                )}

                {activeTab === "inventory" && (
                  <LocationInventory
                    location={selectedLocation}
                    inventory={inventory}
                  />
                )}

                {activeTab === "settings" && (
                  <LocationSettings
                    location={selectedLocation}
                    onUpdate={fetchLocationsData}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Location Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={resetForm}
        onSubmit={handleSubmit}
        title={editingLocation ? "Edit Location" : "Add New Location"}
        submitText={editingLocation ? "Update Location" : "Add Location"}
        size="xl"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Downtown Branch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="123 Main St, City, State 12345"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="location@restaurant.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Timezone</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Operating Hours
            </h3>
            <div className="space-y-3">
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </span>
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          operatingHours: {
                            ...formData.operatingHours,
                            [day]: { ...hours, closed: !e.target.checked },
                          },
                        })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Open</span>
                  </label>

                  {!hours.closed && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            operatingHours: {
                              ...formData.operatingHours,
                              [day]: { ...hours, open: e.target.value },
                            },
                          })
                        }
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            operatingHours: {
                              ...formData.operatingHours,
                              [day]: { ...hours, close: e.target.value },
                            },
                          })
                        }
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Location Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Radius (miles)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.settings.deliveryRadius}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        deliveryRadius: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.settings.minimumOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        minimumOrder: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.settings.taxRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        taxRate: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.settings.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        currency: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.settings.allowOnlineOrdering}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        allowOnlineOrdering: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Allow Online Ordering
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.settings.allowPhoneOrdering}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        allowPhoneOrdering: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Allow Phone Ordering
                </span>
              </label>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, location: null })}
        onConfirm={handleDelete}
        title="Delete Location"
        message={`Are you sure you want to delete "${deleteModal.location?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete Location"
        variant="danger"
      />
    </div>
  );
};

// Location Card Component
const LocationCard = ({
  location,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  getLocationStatus,
}) => {
  const status = getLocationStatus(location);

  return (
    <div
      className={`bg-white border-2 rounded-lg p-6 hover:shadow-md transition cursor-pointer ${
        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1" onClick={onSelect}>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {location.name}
            </h3>
            <span
              className={`w-3 h-3 rounded-full ${
                status === "open" ? "bg-green-400" : "bg-red-400"
              }`}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">{location.address}</p>
          {location.phone && (
            <p className="text-sm text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {location.phone}
            </p>
          )}
        </div>

        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1 text-gray-400 hover:text-green-600"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Status:</span>
          <p
            className={`font-medium ${
              status === "open" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "open" ? "Open" : "Closed"}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Manager:</span>
          <p className="font-medium">
            {location.manager?.name || "Unassigned"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Location Overview Component
const LocationOverview = ({ location, analytics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.todayRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.todayOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.avgRating || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{location.address}</span>
            </div>
            {location.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{location.phone}</span>
              </div>
            )}
            {location.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{location.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Delivery Radius:</span>
              <p className="font-medium">
                {location.settings?.deliveryRadius || 0} miles
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Minimum Order:</span>
              <p className="font-medium">
                {formatCurrency(location.settings?.minimumOrder || 0)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Tax Rate:</span>
              <p className="font-medium">{location.settings?.taxRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Location Staff Component
const LocationStaff = ({ location, staff }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
        <span className="text-sm text-gray-600">{staff.length} total</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((member) => (
          <div key={member._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No staff assigned
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Assign staff members to this location
          </p>
        </div>
      )}
    </div>
  );
};

// Location Inventory Component
const LocationInventory = ({ location, inventory }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Inventory Status
        </h3>
        <span className="text-sm text-gray-600">{inventory.length} items</span>
      </div>

      <div className="space-y-3">
        {inventory.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {item.quantity} {item.unit}
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.quantity <= item.lowStockThreshold
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {item.quantity <= item.lowStockThreshold
                  ? "Low Stock"
                  : "In Stock"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {inventory.length === 0 && (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No inventory data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Inventory tracking for this location is not set up
          </p>
        </div>
      )}
    </div>
  );
};

// Location Settings Component
const LocationSettings = ({ location, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Location Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Advanced location settings and configuration options
        </p>
      </div>
    </div>
  );
};

export default MultiLocationManager;
