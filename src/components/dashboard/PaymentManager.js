import React, { useState, useEffect } from "react";
import api from "../../api";
import {
  CreditCard,
  DollarSign,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Settings,
} from "lucide-react";

const PaymentManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, settingsRes] = await Promise.all([
        api.get("/payments/transactions"),
        api.get("/payments/settings"),
      ]);

      if (transactionsRes.success)
        setTransactions(transactionsRes.transactions);
      if (settingsRes.success) setPaymentSettings(settingsRes.settings);
    } catch (error) {
      setError("Failed to fetch payment data");
      console.error("Payment fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentData) => {
    try {
      const response = await api.post("/payments/process", paymentData);
      if (response.success) {
        setTransactions([response.payment, ...transactions]);
        setError("");
        return { success: true };
      }
    } catch (error) {
      setError("Failed to process payment");
      return { success: false, error: error.message };
    }
  };

  const handleRefund = async (paymentId, refundData) => {
    try {
      const response = await api.post(
        `/payments/${paymentId}/refund`,
        refundData
      );
      if (response.success) {
        setTransactions(
          transactions.map((t) => (t._id === paymentId ? response.payment : t))
        );
        setShowRefundModal(false);
        setSelectedTransaction(null);
        setError("");
      }
    } catch (error) {
      setError("Failed to process refund");
    }
  };

  const handleUpdateSettings = async (settings) => {
    try {
      const response = await api.put("/payments/settings", settings);
      if (response.success) {
        setPaymentSettings({ ...paymentSettings, ...settings });
        setError("");
      }
    } catch (error) {
      setError("Failed to update payment settings");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      succeeded: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
      refunded: "bg-blue-100 text-blue-800",
      partially_refunded: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      succeeded: CheckCircle,
      pending: RefreshCw,
      failed: XCircle,
      cancelled: XCircle,
      refunded: RefreshCw,
      partially_refunded: RefreshCw,
    };
    return icons[status] || AlertCircle;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: CreditCard,
      cash: DollarSign,
      digital_wallet: CreditCard,
    };
    return icons[method] || CreditCard;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    const matchesSearch =
      transaction.orderId?.orderNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.receiptNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const calculateSummary = () => {
    const summary = filteredTransactions.reduce(
      (acc, transaction) => {
        acc.totalAmount += transaction.amount || 0;
        acc.totalTips += transaction.tip || 0;
        acc.totalTransactions += 1;
        if (transaction.status === "succeeded") {
          acc.successfulTransactions += 1;
        }
        return acc;
      },
      {
        totalAmount: 0,
        totalTips: 0,
        totalTransactions: 0,
        successfulTransactions: 0,
      }
    );

    summary.successRate =
      summary.totalTransactions > 0
        ? (
            (summary.successfulTransactions / summary.totalTransactions) *
            100
          ).toFixed(1)
        : 0;

    return summary;
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="text-orange-600" />
          Payment Processing
        </h1>
        <p className="text-gray-600 mt-2">
          Manage transactions, refunds, and payment settings
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${summary.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-2xl font-bold">{summary.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold">{summary.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tips</p>
              <p className="text-2xl font-bold">
                ${summary.totalTips.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: "transactions", label: "Transactions", icon: CreditCard },
            { key: "settings", label: "Payment Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search orders, receipts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => {
                  const StatusIcon = getStatusIcon(transaction.status);
                  const PaymentIcon = getPaymentMethodIcon(transaction.method);

                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <PaymentIcon
                                className="text-orange-600"
                                size={20}
                              />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.receiptNumber ||
                                transaction._id.slice(-6)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.transactionId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.orderId?.orderNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </div>
                        {transaction.tip > 0 && (
                          <div className="text-sm text-gray-500">
                            +${transaction.tip.toFixed(2)} tip
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {transaction.method}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.provider}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          <StatusIcon size={12} className="mr-1" />
                          {transaction.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {transaction.status === "succeeded" && (
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowRefundModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-900"
                            title="Process Refund"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            window.open(transaction.receiptUrl, "_blank")
                          }
                          className="text-green-600 hover:text-green-900"
                          title="Download Receipt"
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No transactions found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No transactions match your current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Settings Tab */}
      {activeTab === "settings" && paymentSettings && (
        <PaymentSettings
          settings={paymentSettings}
          onUpdate={handleUpdateSettings}
        />
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && !showRefundModal && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <RefundModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedTransaction(null);
          }}
          onSubmit={(refundData) =>
            handleRefund(selectedTransaction._id, refundData)
          }
        />
      )}
    </div>
  );
};

// Payment Settings Component
const PaymentSettings = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    acceptedMethods: settings.acceptedMethods || ["card", "cash"],
    currency: settings.currency || "USD",
    taxRate: settings.taxRate || 0,
    serviceFee: settings.serviceFee || 0,
    minimumOrder: settings.minimumOrder || 0,
    stripe: {
      enabled: settings.stripe?.enabled || false,
      publicKey: settings.stripe?.publicKey || "",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-6">Payment Settings</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Accepted Payment Methods
          </label>
          <div className="space-y-2">
            {["card", "cash", "digital_wallet"].map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.acceptedMethods.includes(method)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        acceptedMethods: [...formData.acceptedMethods, method],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        acceptedMethods: formData.acceptedMethods.filter(
                          (m) => m !== method
                        ),
                      });
                    }
                  }}
                  className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {method.replace("_", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  taxRate: parseFloat(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

// Transaction Details Modal
const TransactionDetailsModal = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Transaction Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Receipt Number:</span>
              <p className="text-gray-900">{transaction.receiptNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Amount:</span>
              <p className="text-gray-900">${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Payment Method:</span>
              <p className="text-gray-900 capitalize">{transaction.method}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className="text-gray-900 capitalize">{transaction.status}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <p className="text-gray-900">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Provider:</span>
              <p className="text-gray-900">{transaction.provider}</p>
            </div>
          </div>

          {transaction.paymentDetails &&
            Object.keys(transaction.paymentDetails).length > 0 && (
              <div>
                <span className="font-medium text-gray-700">
                  Payment Details:
                </span>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <pre className="text-sm text-gray-900">
                    {JSON.stringify(transaction.paymentDetails, null, 2)}
                  </pre>
                </div>
              </div>
            )}

          {transaction.refunds && transaction.refunds.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">Refunds:</span>
              <div className="mt-2 space-y-2">
                {transaction.refunds.map((refund, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-900">
                        ${refund.amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(refund.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {refund.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Refund Modal
const RefundModal = ({ transaction, onClose, onSubmit }) => {
  const [refundAmount, setRefundAmount] = useState(transaction.amount);
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(refundAmount),
      reason,
    });
  };

  const maxRefundable = transaction.amount - (transaction.totalRefunded || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Process Refund</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount (Max: ${maxRefundable.toFixed(2)})
            </label>
            <input
              type="number"
              step="0.01"
              max={maxRefundable}
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentManager;
