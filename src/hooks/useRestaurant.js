import { useState, useEffect, useCallback } from "react";
import { restaurantApi } from "../api";
import toast from "react-hot-toast";

export const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch restaurant data
  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantApi.getMyRestaurant();

      if (data.success && data.restaurant) {
        setRestaurant(data.restaurant);
        setIsOwner(true);
      } else {
        setRestaurant(null);
        setIsOwner(false);
      }
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      if (err.response?.status === 404) {
        setError("No restaurant found. Please complete onboarding.");
        setRestaurant(null);
        setIsOwner(false);
      } else {
        setError(err.message || "Failed to load restaurant");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  // Update restaurant
  const updateRestaurant = useCallback(
    async (updateData) => {
      try {
        const updatedRestaurant = await restaurantApi.update(
          restaurant._id,
          updateData
        );
        setRestaurant(updatedRestaurant);
        toast.success("Restaurant updated successfully!");
        return updatedRestaurant;
      } catch (err) {
        console.error("Error updating restaurant:", err);
        toast.error("Failed to update restaurant");
        throw err;
      }
    },
    [restaurant]
  );

  // Update restaurant settings
  const updateSettings = useCallback(
    async (settings) => {
      try {
        const updatedRestaurant = await updateRestaurant({ settings });
        return updatedRestaurant;
      } catch (err) {
        throw err;
      }
    },
    [updateRestaurant]
  );

  // Update operating hours
  const updateHours = useCallback(
    async (hours) => {
      try {
        const updatedRestaurant = await updateRestaurant({ hours });
        return updatedRestaurant;
      } catch (err) {
        throw err;
      }
    },
    [updateRestaurant]
  );

  // Update branding
  const updateBranding = useCallback(
    async (branding) => {
      try {
        const updatedRestaurant = await updateRestaurant({ branding });
        return updatedRestaurant;
      } catch (err) {
        throw err;
      }
    },
    [updateRestaurant]
  );

  // Update contact information
  const updateContact = useCallback(
    async (contact) => {
      try {
        const updatedRestaurant = await updateRestaurant({ contact });
        return updatedRestaurant;
      } catch (err) {
        throw err;
      }
    },
    [updateRestaurant]
  );

  // Toggle restaurant active status
  const toggleActive = useCallback(async () => {
    try {
      const newStatus = !restaurant.settings?.isActive;
      const updatedRestaurant = await updateSettings({
        ...restaurant.settings,
        isActive: newStatus,
      });

      toast.success(`Restaurant ${newStatus ? "activated" : "deactivated"}!`);
      return updatedRestaurant;
    } catch (err) {
      throw err;
    }
  }, [restaurant, updateSettings]);

  // Toggle ordering enabled
  const toggleOrdering = useCallback(async () => {
    try {
      const newStatus = !restaurant.settings?.orderingEnabled;
      const updatedRestaurant = await updateSettings({
        ...restaurant.settings,
        orderingEnabled: newStatus,
      });

      toast.success(`Ordering ${newStatus ? "enabled" : "disabled"}!`);
      return updatedRestaurant;
    } catch (err) {
      throw err;
    }
  }, [restaurant, updateSettings]);

  // Utility functions
  const isOpen = useCallback(
    (day = null, time = null) => {
      if (!restaurant?.hours) return false;

      const currentDay = day || new Date().toLocaleLowerCase().substring(0, 3);
      const currentTime = time || new Date().toTimeString().substring(0, 5);

      const dayKey = Object.keys(restaurant.hours).find((key) =>
        key.toLowerCase().startsWith(currentDay)
      );

      if (!dayKey || restaurant.hours[dayKey].closed) return false;

      const { open, close } = restaurant.hours[dayKey];
      return currentTime >= open && currentTime <= close;
    },
    [restaurant]
  );

  const isActive = useCallback(() => {
    return restaurant?.settings?.isActive !== false;
  }, [restaurant]);

  const isOrderingEnabled = useCallback(() => {
    return restaurant?.settings?.orderingEnabled !== false;
  }, [restaurant]);

  const canAcceptOrders = useCallback(() => {
    return isActive() && isOrderingEnabled() && isOpen();
  }, [isActive, isOrderingEnabled, isOpen]);

  const getWebsiteUrl = useCallback(() => {
    if (restaurant?.website?.websiteUrl) {
      return restaurant.website.websiteUrl;
    }
    if (restaurant?.slug) {
      return `https://${restaurant.slug}.orderchef.com`;
    }
    return null;
  }, [restaurant]);

  const isWebsitePublished = useCallback(() => {
    return restaurant?.website?.isPublished === true;
  }, [restaurant]);

  const getQRCodeUrl = useCallback(() => {
    const websiteUrl = getWebsiteUrl();
    if (!websiteUrl) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      websiteUrl
    )}`;
  }, [getWebsiteUrl]);

  const getBusinessHours = useCallback(() => {
    if (!restaurant?.hours) return {};

    const businessHours = {};
    Object.entries(restaurant.hours).forEach(([day, hours]) => {
      if (hours.closed) {
        businessHours[day] = "Closed";
      } else {
        businessHours[day] = `${hours.open} - ${hours.close}`;
      }
    });

    return businessHours;
  }, [restaurant]);

  const getTodaysHours = useCallback(() => {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const dayKey = Object.keys(restaurant?.hours || {}).find(
      (key) => key.toLowerCase() === today
    );

    if (!dayKey || restaurant.hours[dayKey].closed) {
      return "Closed today";
    }

    const { open, close } = restaurant.hours[dayKey];
    return `${open} - ${close}`;
  }, [restaurant]);

  const getRestaurantStats = useCallback(() => {
    if (!restaurant) return null;

    return {
      name: restaurant.name,
      slug: restaurant.slug,
      cuisineType: restaurant.cuisineType,
      isActive: isActive(),
      isOrderingEnabled: isOrderingEnabled(),
      isOpen: isOpen(),
      canAcceptOrders: canAcceptOrders(),
      isWebsitePublished: isWebsitePublished(),
      websiteUrl: getWebsiteUrl(),
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };
  }, [
    restaurant,
    isActive,
    isOrderingEnabled,
    isOpen,
    canAcceptOrders,
    isWebsitePublished,
    getWebsiteUrl,
  ]);

  // Address helper
  const getFullAddress = useCallback(() => {
    if (!restaurant?.contact?.address) return "";

    const addr = restaurant.contact.address;
    const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(
      Boolean
    );
    return parts.join(", ");
  }, [restaurant]);

  // Primary color helper
  const getPrimaryColor = useCallback(() => {
    return restaurant?.branding?.primaryColor || "#EA580C";
  }, [restaurant]);

  // Secondary color helper
  const getSecondaryColor = useCallback(() => {
    return restaurant?.branding?.secondaryColor || "#F97316";
  }, [restaurant]);

  return {
    // State
    restaurant,
    loading,
    error,
    isOwner,

    // Actions
    fetchRestaurant,
    updateRestaurant,
    updateSettings,
    updateHours,
    updateBranding,
    updateContact,
    toggleActive,
    toggleOrdering,

    // Status checks
    isOpen,
    isActive,
    isOrderingEnabled,
    canAcceptOrders,
    isWebsitePublished,

    // Utilities
    getWebsiteUrl,
    getQRCodeUrl,
    getBusinessHours,
    getTodaysHours,
    getRestaurantStats,
    getFullAddress,
    getPrimaryColor,
    getSecondaryColor,
  };
};

export default useRestaurant;
