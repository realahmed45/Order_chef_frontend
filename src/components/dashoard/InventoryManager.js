import React, { useState, useEffect } from "react";
import { inventoryApi } from "../../api";
import { formatCurrency, formatDate } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { NoInventoryEmptyState } from "../common/EmptyState";
import { FormModal, ConfirmModal } from "../common/Modal";
import toast from "react-hot-toast";

const InventoryManager = ({ restaurant }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    currentStock: "",
    unit: "",
    reorderPoint: "",
    costPerUnit: "",
    supplier: "",
    autoDeduct: true,
  });

  useEffect(() => {
    fetchInventory();
    fetchLowStockAlerts();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getAll();
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockAlerts = async () => {
    try {
      const alerts = await inventoryApi.getAlerts();
      setLowStockAlerts(Array.isArray(alerts) ? alerts : []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      currentStock: "",
      unit: "",
      reorderPoint: "",
      costPerUnit: "",
      supplier: "",
      autoDeduct: true,
    });
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.currentStock || !formData.unit) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const itemData = {
        ...formData,
        currentStock: parseFloat(formData.currentStock),
        reorderPoint: parseFloat(formData.reorderPoint) || 0,
        costPerUnit: parseFloat(formData.costPerUnit) || 0,
      };

      if (editingItem) {
        await inventoryApi.update(editingItem._id, itemData);
        toast.success("Inventory item updated!");
      } else {
        await inventoryApi.create(itemData);
        toast.success("Inventory item added!");
      }

      fetchInventory();
      fetchLowStockAlerts();
      resetForm();
    } catch (error) {
      console.error("Error saving inventory item:", error);
      toast.error("Failed to save inventory item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || "",
      currentStock: item.currentStock.toString(),
      unit: item.unit,
      reorderPoint: item.reorderPoint?.toString() || "",
      costPerUnit: item.costPerUnit?.toString() || "",
      supplier: item.supplier || "",
      autoDeduct: item.autoDeduct !== false,
    });
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    try {
      await inventoryApi.delete(deleteModal.item._id);
      toast.success("Inventory item deleted");
      fetchInventory();
      fetchLowStockAlerts();
      setDeleteModal({ show: false, item: null });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    }
  };

  const updateStock = async (itemId, newStock) => {
    try {
      await inventoryApi.update(itemId, { currentStock: newStock });
      fetchInventory();
      fetchLowStockAlerts();
      toast.success("Stock updated");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const categories = [
    ...new Set(inventory.map((item) => item.category).filter(Boolean)),
  ];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category &&
        item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.supplier &&
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "uncategorized" && !item.category) ||
      item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    const { currentStock, reorderPoint } = item;
    if (currentStock <= 0)
      return { status: "out", color: "bg-red-100 text-red-800", icon: "ðŸš«" };
    if (currentStock <= reorderPoint)
      return {
        status: "low",
        color: "bg-yellow-100 text-yellow-800",
        icon: "âš ï¸",
      };
    return {
      status: "good",
      color: "bg-green-100 text-green-800",
      icon: "âœ…",
    };
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => {
      return total + item.currentStock * (item.costPerUnit || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading inventory..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Inventory Management
          </h2>
          <p className="text-gray-600">
            Track ingredients and supplies to optimize your operations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Item</span>
        </button>
      </div>

      {/* Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-yellow-600 text-xl mr-2">âš ï¸</span>
            <h3 className="text-lg font-semibold text-yellow-800">
              Low Stock Alerts ({lowStockAlerts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockAlerts.map((item) => (
              <div
                key={item._id}
                className="bg-white p-3 rounded border border-yellow-200"
              >
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Current: {item.currentStock} {item.unit} | Reorder at:{" "}
                  {item.reorderPoint} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">ðŸ“¦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">ðŸ’°</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalValue())}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">âš ï¸</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockAlerts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">ðŸ“Š</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {inventory.length === 0 ? (
        <NoInventoryEmptyState onAddItem={() => setShowAddModal(true)} />
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="uncategorized">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reorder Point
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const totalValue =
                      item.currentStock * (item.costPerUnit || 0);

                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.supplier && (
                              <div className="text-sm text-gray-500">
                                Supplier: {item.supplier}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {item.currentStock} {item.unit}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() =>
                                  updateStock(
                                    item._id,
                                    Math.max(0, item.currentStock - 1)
                                  )
                                }
                                className="w-6 h-6 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-bold"
                              >
                                -
                              </button>
                              <button
                                onClick={() =>
                                  updateStock(item._id, item.currentStock + 1)
                                }
                                className="w-6 h-6 bg-green-100 text-green-600 rounded hover:bg-green-200 text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.reorderPoint || 0} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.costPerUnit
                            ? formatCurrency(item.costPerUnit)
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(totalValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}
                          >
                            <span className="mr-1">{stockStatus.icon}</span>
                            {stockStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({ show: true, item })
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={resetForm}
        onSubmit={handleSubmit}
        title={editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
        submitText={editingItem ? "Update Item" : "Add Item"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                placeholder="e.g., Tomatoes"
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
                placeholder="e.g., Vegetables"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.currentStock}
                onChange={(e) =>
                  setFormData({ ...formData, currentStock: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="kg, lbs, pieces"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Point
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.reorderPoint}
                onChange={(e) =>
                  setFormData({ ...formData, reorderPoint: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Unit
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) =>
                  setFormData({ ...formData, costPerUnit: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2.50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Fresh Farms Co"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.autoDeduct}
                onChange={(e) =>
                  setFormData({ ...formData, autoDeduct: e.target.checked })
                }
                className="w-5 h-5 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Auto-deduct when items are sold
              </span>
            </label>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, item: null })}
        onConfirm={handleDelete}
        title="Delete Inventory Item"
        message={`Are you sure you want to delete "${deleteModal.item?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default InventoryManager;
