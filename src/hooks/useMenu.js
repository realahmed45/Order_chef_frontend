import { useState, useEffect, useCallback } from "react";
import { menuApi } from "../api";
import toast from "react-hot-toast";

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch menu items
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuApi.getAll();
      const items = Array.isArray(data) ? data : [];
      setMenuItems(items);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(items.map((item) => item.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError(err.message || "Failed to load menu");
      setMenuItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Create menu item
  const createMenuItem = useCallback(
    async (itemData) => {
      try {
        const newItem = await menuApi.create(itemData);
        setMenuItems((prev) => [newItem, ...prev]);

        // Update categories if new category added
        if (itemData.category && !categories.includes(itemData.category)) {
          setCategories((prev) => [...prev, itemData.category]);
        }

        toast.success("Menu item added successfully!");
        return newItem;
      } catch (err) {
        console.error("Error creating menu item:", err);
        toast.error("Failed to add menu item");
        throw err;
      }
    },
    [categories]
  );

  // Update menu item
  const updateMenuItem = useCallback(
    async (itemId, updateData) => {
      try {
        const updatedItem = await menuApi.update(itemId, updateData);
        setMenuItems((prev) =>
          prev.map((item) => (item._id === itemId ? updatedItem : item))
        );

        // Update categories if category changed
        if (updateData.category && !categories.includes(updateData.category)) {
          setCategories((prev) => [...prev, updateData.category]);
        }

        toast.success("Menu item updated successfully!");
        return updatedItem;
      } catch (err) {
        console.error("Error updating menu item:", err);
        toast.error("Failed to update menu item");
        throw err;
      }
    },
    [categories]
  );

  // Delete menu item
  const deleteMenuItem = useCallback(async (itemId) => {
    try {
      await menuApi.delete(itemId);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Menu item deleted successfully!");
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error("Failed to delete menu item");
      throw err;
    }
  }, []);

  // Toggle item availability
  const toggleAvailability = useCallback(async (itemId, isAvailable) => {
    try {
      const updatedItem = await menuApi.update(itemId, { isAvailable });
      setMenuItems((prev) =>
        prev.map((item) => (item._id === itemId ? updatedItem : item))
      );
      toast.success(
        `Item ${isAvailable ? "enabled" : "disabled"} successfully!`
      );
      return updatedItem;
    } catch (err) {
      console.error("Error toggling availability:", err);
      toast.error("Failed to update item availability");
      throw err;
    }
  }, []);

  // Upload menu (batch create)
  const uploadMenu = useCallback(async (file) => {
    try {
      const result = await menuApi.uploadMenu(file);
      if (result.items) {
        setMenuItems((prev) => [...result.items, ...prev]);
        toast.success(
          `Successfully imported ${result.items.length} menu items!`
        );
      }
      return result;
    } catch (err) {
      console.error("Error uploading menu:", err);
      toast.error("Failed to upload menu");
      throw err;
    }
  }, []);

  // Utility functions
  const getItemsByCategory = useCallback(
    (category) => {
      if (!category || category === "all") return menuItems;
      if (category === "uncategorized")
        return menuItems.filter((item) => !item.category);
      return menuItems.filter((item) => item.category === category);
    },
    [menuItems]
  );

  const getAvailableItems = useCallback(() => {
    return menuItems.filter((item) => item.isAvailable !== false);
  }, [menuItems]);

  const getUnavailableItems = useCallback(() => {
    return menuItems.filter((item) => item.isAvailable === false);
  }, [menuItems]);

  const searchItems = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) return menuItems;

      const term = searchTerm.toLowerCase();
      return menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.category && item.category.toLowerCase().includes(term))
      );
    },
    [menuItems]
  );

  const getItemById = useCallback(
    (itemId) => {
      return menuItems.find((item) => item._id === itemId);
    },
    [menuItems]
  );

  const getStats = useCallback(() => {
    return {
      total: menuItems.length,
      available: getAvailableItems().length,
      unavailable: getUnavailableItems().length,
      categories: categories.length,
      avgPrice:
        menuItems.length > 0
          ? menuItems.reduce((sum, item) => sum + item.price, 0) /
            menuItems.length
          : 0,
    };
  }, [menuItems, categories, getAvailableItems, getUnavailableItems]);

  const sortItems = useCallback(
    (sortBy = "name", order = "asc") => {
      const sorted = [...menuItems].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Handle special sorting cases
        if (sortBy === "price") {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setMenuItems(sorted);
    },
    [menuItems]
  );

  return {
    // State
    menuItems,
    loading,
    error,
    categories,

    // Actions
    fetchMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    uploadMenu,
    sortItems,

    // Utilities
    getItemsByCategory,
    getAvailableItems,
    getUnavailableItems,
    searchItems,
    getItemById,
    getStats,
  };
};

export default useMenu;
