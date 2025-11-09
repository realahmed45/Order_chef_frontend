import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { menuApi } from "../../api";
import { formatCurrency } from "../utils/helpers";

const MenuManager = ({ restaurant }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await menuApi.getAll();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      if (editingItem) {
        await menuApi.update(editingItem._id, formData);
        toast.success("Menu item updated!");
      } else {
        await menuApi.create(formData);
        toast.success("Menu item added!");
      }

      fetchMenu();
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Failed to save menu item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await menuApi.delete(id);
      toast.success("Menu item deleted");
      fetchMenu();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await menuApi.update(item._id, { isAvailable: !item.isAvailable });
      toast.success(
        item.isAvailable ? "Item marked unavailable" : "Item marked available"
      );
      fetchMenu();
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    });
    setEditingItem(null);
    setShowAddModal(false);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category || "",
      isAvailable: item.isAvailable !== false,
    });
    setShowAddModal(true);
  };

  const categories = [
    ...new Set(menuItems.map((item) => item.category)),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-600">
            Add, edit, or remove menu items. Changes appear instantly on your
            website.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Menu Items */}
      {menuItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Your Menu is Empty
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first menu item to start accepting orders
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Create Your First Menu Item
          </button>
        </div>
      ) : (
        <div>
          {/* Categories */}
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div
                      key={item._id}
                      className={`bg-white rounded-lg shadow hover:shadow-lg transition p-6 ${
                        !item.isAvailable ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <span className="text-xl font-bold text-orange-600">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isAvailable !== false}
                            onChange={() => toggleAvailability(item)}
                            className="w-5 h-5 text-orange-600 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Available
                          </span>
                        </label>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Uncategorized */}
          {menuItems.filter((item) => !item.category).length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Uncategorized
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter((item) => !item.category)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow p-6"
                    >
                      {/* Same card content as above */}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe your dish..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="12.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Pizza"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Available for ordering
                  </span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
