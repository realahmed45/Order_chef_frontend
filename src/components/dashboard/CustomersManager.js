import React, { useState, useEffect } from "react";
import { customersApi } from "../../api";
import { formatCurrency, formatDate, formatPhone } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { NoCustomersEmptyState, SearchEmptyState } from "../common/EmptyState";
import Modal from "../common/Modal";

const CustomersManager = ({ restaurant }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchAnalytics();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersApi.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await customersApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
    }
  };

  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.email &&
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 500)
      return {
        name: "VIP",
        color: "bg-purple-100 text-purple-800",
        icon: "👑",
      };
    if (totalSpent >= 200)
      return {
        name: "Gold",
        color: "bg-yellow-100 text-yellow-800",
        icon: "🥇",
      };
    if (totalSpent >= 100)
      return { name: "Silver", color: "bg-gray-100 text-gray-800", icon: "🥈" };
    return {
      name: "Bronze",
      color: "bg-orange-100 text-orange-800",
      icon: "🥉",
    };
  };

  const getCustomerStatus = (lastOrderDate) => {
    const daysSinceLastOrder = Math.floor(
      (new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastOrder <= 7)
      return { name: "Active", color: "bg-green-100 text-green-800" };
    if (daysSinceLastOrder <= 30)
      return { name: "Recent", color: "bg-blue-100 text-blue-800" };
    if (daysSinceLastOrder <= 90)
      return { name: "Inactive", color: "bg-yellow-100 text-yellow-800" };
    return { name: "Dormant", color: "bg-red-100 text-red-800" };
  };

  const openCustomerDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading customers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Management
          </h2>
          <p className="text-gray-600">
            Manage your customer relationships and loyalty programs
          </p>
        </div>
      </div>

      {/* Customer Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalCustomers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.newCustomers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  VIP Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter((c) => c.totalSpent >= 500).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {customers.length === 0 ? (
        <NoCustomersEmptyState
          onViewOrders={() => (window.location.href = "/dashboard/orders")}
        />
      ) : (
        <>
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search customers by name, phone, or email..."
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
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="totalSpent">Total Spent</option>
                    <option value="totalOrders">Total Orders</option>
                    <option value="lastOrderDate">Last Order</option>
                    <option value="name">Name</option>
                    <option value="createdAt">Join Date</option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-500"
                  title={`Sort ${
                    sortOrder === "asc" ? "descending" : "ascending"
                  }`}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Customers List */}
          {filteredCustomers.length === 0 ? (
            <SearchEmptyState
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-gray-200">
                {filteredCustomers.map((customer) => {
                  const tier = getCustomerTier(customer.totalSpent);
                  const status = getCustomerStatus(customer.lastOrderDate);

                  return (
                    <div
                      key={customer._id}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => openCustomerDetail(customer)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">👤</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {customer.name}
                              </h3>

                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}
                              >
                                <span className="mr-1">{tier.icon}</span>
                                {tier.name}
                              </span>

                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                              >
                                {status.name}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>📞 {formatPhone(customer.phone)}</span>
                              {customer.email && (
                                <span>📧 {customer.email}</span>
                              )}
                              <span>
                                📅 Joined {formatDate(customer.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">
                                Total Spent
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(customer.totalSpent)}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-600">Orders</p>
                              <p className="text-lg font-bold text-gray-900">
                                {customer.totalOrders}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-600">
                                Loyalty Points
                              </p>
                              <p className="text-lg font-bold text-orange-600">
                                {customer.loyaltyPoints}
                              </p>
                            </div>

                            {customer.lastOrderDate && (
                              <div className="text-center">
                                <p className="text-sm text-gray-600">
                                  Last Order
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatDate(customer.lastOrderDate)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Customer Detail Modal */}
      <Modal
        isOpen={showCustomerDetail}
        onClose={() => setShowCustomerDetail(false)}
        title={
          selectedCustomer
            ? `Customer: ${selectedCustomer.name}`
            : "Customer Details"
        }
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {formatPhone(selectedCustomer.phone)}
                  </p>
                  {selectedCustomer.email && (
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedCustomer.email}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Member Since:</span>{" "}
                    {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Customer Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.totalOrders}
                    </p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedCustomer.loyaltyPoints}
                    </p>
                    <p className="text-sm text-gray-600">Loyalty Points</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCustomer.totalOrders > 0
                        ? formatCurrency(
                            selectedCustomer.totalSpent /
                              selectedCustomer.totalOrders
                          )
                        : formatCurrency(0)}
                    </p>
                    <p className="text-sm text-gray-600">Avg Order</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Tier & Status */}
            <div className="flex items-center justify-center space-x-6 p-4 bg-gray-50 rounded-lg">
              {(() => {
                const tier = getCustomerTier(selectedCustomer.totalSpent);
                const status = getCustomerStatus(
                  selectedCustomer.lastOrderDate
                );
                return (
                  <>
                    <div className="text-center">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${tier.color}`}
                      >
                        <span className="mr-2 text-lg">{tier.icon}</span>
                        {tier.name} Customer
                      </span>
                    </div>
                    <div className="text-center">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.color}`}
                      >
                        {status.name}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Favorite Items */}
            {selectedCustomer.favoriteItems &&
              selectedCustomer.favoriteItems.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Favorite Items
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCustomer.favoriteItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Ordered multiple times
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                📧 Send Email
              </button>
              <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition">
                🎁 Send Offer
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                📋 View Orders
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomersManager;
