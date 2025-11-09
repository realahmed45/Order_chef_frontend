import React, { useState, useEffect } from "react";
import { api } from "../../api/index";
import {
  QrCode,
  Plus,
  Download,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Printer,
  BarChart3,
  Smartphone,
  Utensils,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const QRCodeManager = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/qr-codes");
      if (response.success) {
        setQrCodes(response.qrCodes);
      }
    } catch (error) {
      setError("Failed to fetch QR codes");
      console.error("QR fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (qrData) => {
    try {
      const response = await api.post("/qr-codes/generate", qrData);
      if (response.success) {
        setQrCodes([...qrCodes, response.qrCode]);
        setShowAddModal(false);
        setError("");
      }
    } catch (error) {
      setError("Failed to generate QR code");
    }
  };

  const handleBulkGenerate = async (tables) => {
    try {
      const response = await api.post("/qr-codes/bulk-generate", { tables });
      if (response.success) {
        setQrCodes([...qrCodes, ...response.qrCodes]);
        setShowBulkModal(false);
        setError("");
      }
    } catch (error) {
      setError("Failed to bulk generate QR codes");
    }
  };

  const handleUpdateQR = async (id, updateData) => {
    try {
      const response = await api.put(`/qr-codes/${id}`, updateData);
      if (response.success) {
        setQrCodes(qrCodes.map((qr) => (qr._id === id ? response.qrCode : qr)));
        setSelectedQR(null);
        setError("");
      }
    } catch (error) {
      setError("Failed to update QR code");
    }
  };

  const handleDeleteQR = async (id) => {
    if (!window.confirm("Are you sure you want to delete this QR code?"))
      return;

    try {
      const response = await api.delete(`/qr-codes/${id}`);
      if (response.success) {
        setQrCodes(qrCodes.filter((qr) => qr._id !== id));
        setError("");
      }
    } catch (error) {
      setError("Failed to delete QR code");
    }
  };

  const handleDownloadQR = (qrCode) => {
    const link = document.createElement("a");
    link.download = `table-${qrCode.tableNumber}-qr.png`;
    link.href = qrCode.qrCode;
    link.click();
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const getLocationColor = (location) => {
    const colors = {
      indoor: "bg-blue-100 text-blue-800",
      outdoor: "bg-green-100 text-green-800",
      patio: "bg-yellow-100 text-yellow-800",
      bar: "bg-purple-100 text-purple-800",
      private: "bg-gray-100 text-gray-800",
    };
    return colors[location] || "bg-gray-100 text-gray-800";
  };

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
          <QrCode className="text-orange-600" />
          QR Code Management
        </h1>
        <p className="text-gray-600 mt-2">
          Generate and manage QR codes for table ordering
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <QrCode className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total QR Codes</p>
              <p className="text-2xl font-bold">{qrCodes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tables</p>
              <p className="text-2xl font-bold">
                {qrCodes.filter((qr) => qr.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Smartphone className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-2xl font-bold">
                {qrCodes.reduce(
                  (total, qr) => total + (qr.analytics?.totalScans || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Utensils className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Orders from QR</p>
              <p className="text-2xl font-bold">
                {qrCodes.reduce(
                  (total, qr) => total + (qr.analytics?.totalOrders || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Generate QR Code
        </button>

        <button
          onClick={() => setShowBulkModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <QrCode size={20} />
          Bulk Generate
        </button>

        <button
          onClick={() => setShowAnalytics(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <BarChart3 size={20} />
          Analytics
        </button>

        <button
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
        >
          <Printer size={20} />
          Print All
        </button>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {qrCodes.map((qrCode) => (
          <QRCodeCard
            key={qrCode._id}
            qrCode={qrCode}
            onEdit={setSelectedQR}
            onDelete={handleDeleteQR}
            onDownload={handleDownloadQR}
            onCopyUrl={handleCopyUrl}
            getLocationColor={getLocationColor}
          />
        ))}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No QR codes yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by generating your first QR code.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus size={20} className="mr-2" />
              Generate QR Code
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddQRModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleGenerateQR}
        />
      )}

      {showBulkModal && (
        <BulkQRModal
          onClose={() => setShowBulkModal(false)}
          onSubmit={handleBulkGenerate}
        />
      )}

      {selectedQR && (
        <EditQRModal
          qrCode={selectedQR}
          onClose={() => setSelectedQR(null)}
          onSubmit={(data) => handleUpdateQR(selectedQR._id, data)}
        />
      )}

      {showAnalytics && (
        <QRAnalyticsModal
          qrCodes={qrCodes}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
};

// QR Code Card Component
const QRCodeCard = ({
  qrCode,
  onEdit,
  onDelete,
  onDownload,
  onCopyUrl,
  getLocationColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* QR Code Image */}
      <div className="p-4 bg-gray-50 text-center">
        <img
          src={qrCode.qrCode}
          alt={`QR Code for ${qrCode.tableName}`}
          className="w-32 h-32 mx-auto"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {qrCode.tableName}
            </h3>
            <p className="text-sm text-gray-500">Table #{qrCode.tableNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationColor(
                qrCode.location
              )}`}
            >
              {qrCode.location}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${
                qrCode.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>

        {/* Table Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={14} />
            <span>Seats: {qrCode.seatingCapacity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>Section: {qrCode.section}</span>
          </div>
        </div>

        {/* Analytics */}
        {qrCode.analytics && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-lg font-bold text-blue-600">
                {qrCode.analytics.totalScans || 0}
              </p>
              <p className="text-xs text-gray-600">Scans</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <p className="text-lg font-bold text-green-600">
                {qrCode.analytics.totalOrders || 0}
              </p>
              <p className="text-xs text-gray-600">Orders</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDownload(qrCode)}
            className="flex-1 bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 flex items-center justify-center gap-1"
          >
            <Download size={14} />
            Download
          </button>

          <button
            onClick={() => onCopyUrl(qrCode.orderingUrl)}
            className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            <Copy size={14} />
            Copy URL
          </button>

          <button
            onClick={() => onEdit(qrCode)}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={() => onDelete(qrCode._id)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add QR Modal
const AddQRModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tableNumber: "",
    tableName: "",
    seatingCapacity: 4,
    location: "indoor",
    section: "main",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Generate New QR Code</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Number
            </label>
            <input
              type="text"
              required
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 1, A1, VIP1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Name
            </label>
            <input
              type="text"
              required
              value={formData.tableName}
              onChange={(e) =>
                setFormData({ ...formData, tableName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Table 1, Window Table"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seating Capacity
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.seatingCapacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seatingCapacity: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="patio">Patio</option>
              <option value="bar">Bar</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., main, vip, terrace"
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
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Generate QR Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Bulk QR Modal
const BulkQRModal = ({ onClose, onSubmit }) => {
  const [tables, setTables] = useState([
    {
      tableNumber: "",
      tableName: "",
      seatingCapacity: 4,
      location: "indoor",
      section: "main",
    },
  ]);

  const addTable = () => {
    setTables([
      ...tables,
      {
        tableNumber: "",
        tableName: "",
        seatingCapacity: 4,
        location: "indoor",
        section: "main",
      },
    ]);
  };

  const removeTable = (index) => {
    setTables(tables.filter((_, i) => i !== index));
  };

  const updateTable = (index, field, value) => {
    setTables(
      tables.map((table, i) =>
        i === index ? { ...table, [field]: value } : table
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tables.filter((table) => table.tableNumber && table.tableName));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-90vh overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Bulk Generate QR Codes</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {tables.map((table, index) => (
              <div
                key={index}
                className="flex gap-4 items-end p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="text"
                    value={table.tableNumber}
                    onChange={(e) =>
                      updateTable(index, "tableNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={table.tableName}
                    onChange={(e) =>
                      updateTable(index, "tableName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={table.seatingCapacity}
                    onChange={(e) =>
                      updateTable(
                        index,
                        "seatingCapacity",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={table.location}
                    onChange={(e) =>
                      updateTable(index, "location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="patio">Patio</option>
                    <option value="bar">Bar</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => removeTable(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={addTable}
              className="px-4 py-2 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Table
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Generate All QR Codes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit QR Modal
const EditQRModal = ({ qrCode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tableName: qrCode.tableName,
    seatingCapacity: qrCode.seatingCapacity,
    location: qrCode.location,
    section: qrCode.section,
    isActive: qrCode.isActive,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit QR Code</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Name
            </label>
            <input
              type="text"
              value={formData.tableName}
              onChange={(e) =>
                setFormData({ ...formData, tableName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seating Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.seatingCapacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seatingCapacity: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
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
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Update QR Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// QR Analytics Modal
const QRAnalyticsModal = ({ qrCodes, onClose }) => {
  const totalScans = qrCodes.reduce(
    (total, qr) => total + (qr.analytics?.totalScans || 0),
    0
  );
  const totalOrders = qrCodes.reduce(
    (total, qr) => total + (qr.analytics?.totalOrders || 0),
    0
  );
  const conversionRate =
    totalScans > 0 ? ((totalOrders / totalScans) * 100).toFixed(2) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">QR Code Analytics</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <RefreshCw size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalScans}</p>
            <p className="text-sm text-gray-600">Total Scans</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {conversionRate}%
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>

        {/* Table Performance */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Table Performance</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Table
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Scans
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Orders
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {qrCodes.map((qr) => {
                  const scans = qr.analytics?.totalScans || 0;
                  const orders = qr.analytics?.totalOrders || 0;
                  const rate =
                    scans > 0 ? ((orders / scans) * 100).toFixed(1) : 0;

                  return (
                    <tr key={qr._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {qr.tableName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {scans}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {orders}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {rate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeManager;
