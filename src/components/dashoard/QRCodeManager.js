import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Eye, 
  Printer,
  MapPin,
  Smartphone,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Copy,
  ExternalLink,
  Zap
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { FormModal, ConfirmModal } from './common/Modal';
import QRCode from 'qrcode.react';

const QRCodeManager = ({ restaurant }) => {
  const [tables, setTables] = useState([]);
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, table: null });
  const [selectedQR, setSelectedQR] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState('tables');
  const printRef = useRef();

  const [formData, setFormData] = useState({
    tableNumber: '',
    location: '',
    capacity: '',
    notes: '',
    isActive: true
  });

  useEffect(() => {
    fetchTablesAndQR();
    fetchAnalytics();
  }, []);

  const fetchTablesAndQR = async () => {
    try {
      setLoading(true);
      
      const [tablesRes, qrRes] = await Promise.all([
        fetch('/api/tables', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/qr-codes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const [tablesData, qrData] = await Promise.all([
        tablesRes.json(),
        qrRes.json()
      ]);

      if (tablesData.success) setTables(tablesData.tables);
      if (qrData.success) setQRCodes(qrData.qrCodes);

    } catch (error) {
      console.error('Error fetching tables and QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/qr-codes/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching QR analytics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tableNumber) {
      alert('Table number is required');
      return;
    }

    try {
      const url = editingTable ? `/api/tables/${editingTable._id}` : '/api/tables';
      const method = editingTable ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchTablesAndQR();
        resetForm();
        alert(`Table ${editingTable ? 'updated' : 'added'} successfully!`);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving table:', error);
      alert('Failed to save table');
    }
  };

  const generateQRCode = async (tableId) => {
    try {
      const response = await fetch(`/api/tables/${tableId}/generate-qr`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      if (data.success) {
        await fetchTablesAndQR();
        alert('QR Code generated successfully!');
      } else {
        alert('Error generating QR code: ' + data.message);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      location: table.location || '',
      capacity: table.capacity?.toString() || '',
      notes: table.notes || '',
      isActive: table.isActive !== false
    });
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tables/${deleteModal.table._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      if (data.success) {
        await fetchTablesAndQR();
        setDeleteModal({ show: false, table: null });
        alert('Table deleted successfully');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Failed to delete table');
    }
  };

  const toggleTableStatus = async (tableId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await fetch(`/api/tables/${tableId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        await fetchTablesAndQR();
        alert(`Table ${newStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling table status:', error);
      alert('Failed to update table status');
    }
  };

  const copyQRLink = (qrCode) => {
    const link = `${window.location.origin}/order?table=${qrCode.tableId}&qr=${qrCode.qrId}`;
    navigator.clipboard.writeText(link);
    alert('QR link copied to clipboard!');
  };

  const printQRCode = (qrCode) => {
    const table = tables.find(t => t._id === qrCode.tableId);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Table ${table?.tableNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              border: 2px solid #000;
              padding: 20px;
              margin: 20px auto;
              width: 300px;
              background: white;
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #EA580C;
            }
            .table-info {
              font-size: 18px;
              margin: 10px 0;
            }
            .instructions {
              font-size: 14px;
              color: #666;
              margin-top: 15px;
            }
            .qr-code {
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="restaurant-name">${restaurant?.name || 'Restaurant'}</div>
            <div class="table-info">Table ${table?.tableNumber}</div>
            <div class="qr-code">
              <canvas id="qr-canvas"></canvas>
            </div>
            <div class="instructions">
              Scan this QR code with your phone<br>
              to view our menu and place your order
            </div>
          </div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
          <script>
            new QRious({
              element: document.getElementById('qr-canvas'),
              value: '${window.location.origin}/order?table=${qrCode.tableId}&qr=${qrCode.qrId}',
              size: 200
            });
            window.print();
            window.onafterprint = function() { window.close(); };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const downloadAllQRCodes = () => {
    const zip = new JSZip();
    
    qrCodes.forEach((qrCode) => {
      const table = tables.find(t => t._id === qrCode.tableId);
      const canvas = document.createElement('canvas');
      const qr = new QRCode(canvas, {
        text: `${window.location.origin}/order?table=${qrCode.tableId}&qr=${qrCode.qrId}`,
        width: 200,
        height: 200
      });
      
      canvas.toBlob((blob) => {
        zip.file(`table-${table?.tableNumber}-qr.png`, blob);
      });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-codes.zip';
      a.click();
    });
  };

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      location: '',
      capacity: '',
      notes: '',
      isActive: true
    });
    setEditingTable(null);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading QR code system..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Ordering</h2>
          <p className="text-gray-600">Manage tables and QR codes for contactless ordering</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadAllQRCodes}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active QR Codes</p>
              <p className="text-2xl font-bold text-gray-900">
                {qrCodes.filter(qr => qr.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">QR Scans Today</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.todayScans || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">QR Orders Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.qrRevenue || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'tables', label: 'Tables', icon: MapPin },
              { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'tables' && (
            <TablesTab
              tables={tables}
              onEdit={handleEdit}
              onDelete={(table) => setDeleteModal({ show: true, table })}
              onToggleStatus={toggleTableStatus}
              onGenerateQR={generateQRCode}
            />
          )}

          {activeTab === 'qrcodes' && (
            <QRCodesTab
              qrCodes={qrCodes}
              tables={tables}
              restaurant={restaurant}
              onCopyLink={copyQRLink}
              onPrint={printQRCode}
              onPreview={setSelectedQR}
            />
          )}

          {activeTab === 'analytics' && (
            <QRAnalyticsTab analytics={analytics} />
          )}
        </div>
      </div>

      {/* Add/Edit Table Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={resetForm}
        onSubmit={handleSubmit}
        title={editingTable ? 'Edit Table' : 'Add Table'}
        submitText={editingTable ? 'Update Table' : 'Add Table'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Number *
            </label>
            <input
              type="text"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., T1, A-5, 101"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Main Dining, Patio, Window Side"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (seats)
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Additional notes about this table..."
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-orange-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Table is active</span>
            </label>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, table: null })}
        onConfirm={handleDelete}
        title="Delete Table"
        message={`Are you sure you want to delete table "${deleteModal.table?.tableNumber}"? This will also delete its QR code.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* QR Preview Modal */}
      {selectedQR && (
        <QRPreviewModal
          qrCode={selectedQR}
          table={tables.find(t => t._id === selectedQR.tableId)}
          restaurant={restaurant}
          onClose={() => setSelectedQR(null)}
        />
      )}
    </div>
  );
};

// Tables Tab Component
const TablesTab = ({ tables, onEdit, onDelete, onToggleStatus, onGenerateQR }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Table {table.tableNumber}
                </h3>
                {table.location && (
                  <p className="text-sm text-gray-600">{table.location}</p>
                )}
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(table)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(table)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {table.capacity && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="text-sm font-medium">{table.capacity} seats</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {table.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QR Code:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.hasQRCode 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {table.hasQRCode ? 'Generated' : 'Not Generated'}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onToggleStatus(table._id, table.isActive)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  table.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {table.isActive ? 'Deactivate' : 'Activate'}
              </button>
              
              {!table.hasQRCode ? (
                <button
                  onClick={() => onGenerateQR(table._id)}
                  className="flex-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
                >
                  Generate QR
                </button>
              ) : (
                <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                  QR Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tables found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first table to start generating QR codes
          </p>
        </div>
      )}
    </div>
  );
};

// QR Codes Tab Component
const QRCodesTab = ({ qrCodes, tables, restaurant, onCopyLink, onPrint, onPreview }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qrCode) => {
          const table = tables.find(t => t._id === qrCode.tableId);
          const qrUrl = `${window.location.origin}/order?table=${qrCode.tableId}&qr=${qrCode.qrId}`;
          
          return (
            <div key={qrCode._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Table {table?.tableNumber}
                </h3>
                
                <div className="bg-white p-4 border rounded-lg inline-block">
                  <QRCode 
                    value={qrUrl}
                    size={120}
                    level="M"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scans:</span>
                  <span className="text-sm font-medium">{qrCode.scanCount || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    qrCode.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {qrCode.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm">{formatDateTime(qrCode.createdAt)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onCopyLink(qrCode)}
                  className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Link
                </button>
                
                <button
                  onClick={() => onPrint(qrCode)}
                  className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </button>
                
                <button
                  onClick={() => onPreview(qrCode)}
                  className="flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
                
                <button
                  onClick={() => window.open(qrUrl, '_blank')}
                  className="flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Test
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes generated</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate QR codes for your tables to enable contactless ordering
          </p>
        </div>
      )}
    </div>
  );
};

// QR Analytics Tab Component
const QRAnalyticsTab = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalScans || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgSessionTime || 0}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Detailed Analytics</h3>
        <p className="mt-1 text-sm text-gray-500">
          Advanced QR code analytics features coming soon
        </p>
      </div>
    </div>
  );
};

// QR Preview Modal Component
const QRPreviewModal = ({ qrCode, table, restaurant, onClose }) => {
  const qrUrl = `${window.location.origin}/order?table=${qrCode.tableId}&qr=${qrCode.qrId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">QR Code Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="text-center">
          <div className="mb-4">
            <h4 className="text-xl font-bold text-orange-600">
              {restaurant?.name || 'Restaurant'}
            </h4>
            <p className="text-lg font-semibold">Table {table?.tableNumber}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <QRCode 
              value={qrUrl}
              size={200}
              level="M"
            />
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code with your phone to view our menu and place your order
          </p>

          <div className="text-xs text-gray-500 break-all">
            {qrUrl}
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => navigator.clipboard.writeText(qrUrl)}
              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Copy Link
            </button>
            <button
              onClick={() => window.open(qrUrl, '_blank')}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Test Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeManager;
