import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  FileText,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Filter,
  Search,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Users,
  BarChart3,
  PieChart,
  TrendingUp,
  Database,
  Shield,
  Globe,
  Archive,
  Copy,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Target
} from 'lucide-react';

// Scheduled Reports Component
const ScheduledReports = () => {
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 'SR-001',
      name: 'Daily Sales Summary',
      description: 'Daily overview of sales performance and metrics',
      template: 'Sales Performance',
      frequency: 'daily',
      time: '09:00',
      recipients: ['manager@company.com', 'sales@company.com'],
      status: 'active',
      lastRun: '2024-10-29T09:00:00Z',
      nextRun: '2024-10-30T09:00:00Z',
      format: 'PDF',
      createdBy: 'John Doe',
      createdAt: '2024-10-01T10:00:00Z'
    },
    {
      id: 'SR-002',
      name: 'Weekly Customer Analytics',
      description: 'Weekly customer behavior and engagement metrics',
      template: 'Customer Analytics',
      frequency: 'weekly',
      time: '08:00',
      recipients: ['analytics@company.com'],
      status: 'active',
      lastRun: '2024-10-28T08:00:00Z',
      nextRun: '2024-11-04T08:00:00Z',
      format: 'Excel',
      createdBy: 'Jane Smith',
      createdAt: '2024-09-15T14:30:00Z'
    },
    {
      id: 'SR-003',
      name: 'Monthly Financial Report',
      description: 'Comprehensive monthly financial overview',
      template: 'Financial Summary',
      frequency: 'monthly',
      time: '10:00',
      recipients: ['finance@company.com', 'ceo@company.com'],
      status: 'paused',
      lastRun: '2024-10-01T10:00:00Z',
      nextRun: '2024-11-01T10:00:00Z',
      format: 'PDF',
      createdBy: 'Mike Johnson',
      createdAt: '2024-08-20T16:15:00Z'
    }
  ]);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    template: '',
    frequency: 'daily',
    time: '09:00',
    recipients: '',
    format: 'PDF'
  });

  const frequencies = ['daily', 'weekly', 'monthly', 'quarterly'];
  const formats = ['PDF', 'Excel', 'CSV'];
  const templates = ['Sales Performance', 'Customer Analytics', 'Financial Summary', 'Inventory Report', 'Marketing Dashboard'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <Calendar className="w-4 h-4" />;
      case 'quarterly': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateSchedule = () => {
    const schedule = {
      ...newSchedule,
      id: `SR-${String(scheduledReports.length + 1).padStart(3, '0')}`,
      recipients: newSchedule.recipients.split(',').map(email => email.trim()).filter(email => email),
      status: 'active',
      lastRun: null,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    setScheduledReports([...scheduledReports, schedule]);
    setNewSchedule({
      name: '',
      description: '',
      template: '',
      frequency: 'daily',
      time: '09:00',
      recipients: '',
      format: 'PDF'
    });
    setShowScheduleForm(false);
  };

  const handleToggleStatus = (id) => {
    setScheduledReports(scheduledReports.map(report => 
      report.id === id 
        ? { ...report, status: report.status === 'active' ? 'paused' : 'active' }
        : report
    ));
  };

  const handleDeleteSchedule = (id) => {
    setScheduledReports(scheduledReports.filter(report => report.id !== id));
  };

  const handleRunNow = (id) => {
    setScheduledReports(scheduledReports.map(report => 
      report.id === id 
        ? { ...report, lastRun: new Date().toISOString() }
        : report
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
          <p className="text-sm text-gray-600">Automate report generation and distribution</p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      {/* Scheduled Reports List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.description}</div>
                      <div className="text-xs text-gray-400 mt-1">Template: {report.template}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getFrequencyIcon(report.frequency)}
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{report.frequency}</div>
                        <div className="text-xs text-gray-500">at {report.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{report.recipients.length} recipient(s)</div>
                    <div className="text-xs text-gray-500">{report.format} format</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {report.lastRun ? new Date(report.lastRun).toLocaleDateString() : 'Never'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Next: {new Date(report.nextRun).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunNow(report.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Run Now"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(report.id)}
                        className={`${report.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={report.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {report.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(report.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name *</label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Template *</label>
                  <select
                    value={newSchedule.template}
                    onChange={(e) => setNewSchedule({ ...newSchedule, template: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Template</option>
                    {templates.map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={newSchedule.format}
                    onChange={(e) => setNewSchedule({ ...newSchedule, format: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {formats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients (comma-separated emails)</label>
                <input
                  type="text"
                  value={newSchedule.recipients}
                  onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="user1@example.com, user2@example.com"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Schedule Report
              </button>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export History Component
const ExportHistory = () => {
  const [exportHistory, setExportHistory] = useState([
    {
      id: 'EXP-001',
      fileName: 'sales_report_2024_10_29.pdf',
      reportType: 'Sales Performance',
      format: 'PDF',
      size: '2.4 MB',
      status: 'completed',
      exportedBy: 'John Doe',
      exportedAt: '2024-10-29T14:30:00Z',
      downloadUrl: '/downloads/sales_report_2024_10_29.pdf',
      expiresAt: '2024-11-05T14:30:00Z'
    },
    {
      id: 'EXP-002',
      fileName: 'customer_analytics_weekly.xlsx',
      reportType: 'Customer Analytics',
      format: 'Excel',
      size: '1.8 MB',
      status: 'completed',
      exportedBy: 'Jane Smith',
      exportedAt: '2024-10-29T10:15:00Z',
      downloadUrl: '/downloads/customer_analytics_weekly.xlsx',
      expiresAt: '2024-11-05T10:15:00Z'
    },
    {
      id: 'EXP-003',
      fileName: 'inventory_report_2024_10.csv',
      reportType: 'Inventory Report',
      format: 'CSV',
      size: '856 KB',
      status: 'processing',
      exportedBy: 'Mike Johnson',
      exportedAt: '2024-10-29T16:45:00Z',
      downloadUrl: null,
      expiresAt: '2024-11-05T16:45:00Z'
    },
    {
      id: 'EXP-004',
      fileName: 'financial_summary_q3.pdf',
      reportType: 'Financial Summary',
      format: 'PDF',
      size: '3.2 MB',
      status: 'failed',
      exportedBy: 'Sarah Wilson',
      exportedAt: '2024-10-29T12:20:00Z',
      downloadUrl: null,
      expiresAt: '2024-11-05T12:20:00Z',
      error: 'Insufficient permissions to access financial data'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');

  const statuses = ['completed', 'processing', 'failed'];
  const formats = ['PDF', 'Excel', 'CSV'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'PDF': return <FileText className="w-4 h-4 text-red-500" />;
      case 'Excel': return <FileText className="w-4 h-4 text-green-500" />;
      case 'CSV': return <Database className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredExports = exportHistory.filter(exportItem => {
    const matchesSearch = exportItem.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exportItem.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exportItem.exportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exportItem.status === statusFilter;
    const matchesFormat = formatFilter === 'all' || exportItem.format === formatFilter;
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const handleDownload = (exportItem) => {
    if (exportItem.status === 'completed' && exportItem.downloadUrl) {
      // Simulate file download
      console.log(`Downloading ${exportItem.fileName}`);
    }
  };

  const handleRetryExport = (id) => {
    setExportHistory(exportHistory.map(item => 
      item.id === id 
        ? { ...item, status: 'processing', error: undefined }
        : item
    ));
  };

  const handleDeleteExport = (id) => {
    setExportHistory(exportHistory.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
          <p className="text-sm text-gray-600">View and manage exported reports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Formats</option>
            {formats.map(format => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Export History Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exported By
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
              {filteredExports.map((exportItem) => (
                <tr key={exportItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFormatIcon(exportItem.format)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{exportItem.fileName}</div>
                        <div className="text-xs text-gray-500">{exportItem.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{exportItem.reportType}</div>
                    <div className="text-xs text-gray-500">{exportItem.format}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exportItem.status)}`}>
                        {getStatusIcon(exportItem.status)}
                        {exportItem.status}
                      </span>
                    </div>
                    {exportItem.error && (
                      <div className="text-xs text-red-600 mt-1">{exportItem.error}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{exportItem.exportedBy}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(exportItem.exportedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(exportItem.exportedAt).toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-400">Expires: {new Date(exportItem.expiresAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {exportItem.status === 'completed' && (
                        <button
                          onClick={() => handleDownload(exportItem)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {exportItem.status === 'failed' && (
                        <button
                          onClick={() => handleRetryExport(exportItem.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Retry Export"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteExport(exportItem.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Compliance Reports Component
const ComplianceReports = () => {
  const [complianceReports, setComplianceReports] = useState([
    {
      id: 'COMP-001',
      name: 'GDPR Data Processing Report',
      description: 'Monthly report on personal data processing activities',
      type: 'Data Privacy',
      regulation: 'GDPR',
      frequency: 'monthly',
      status: 'compliant',
      lastGenerated: '2024-10-01T09:00:00Z',
      nextDue: '2024-11-01T09:00:00Z',
      responsible: 'Legal Team',
      findings: 3,
      criticalIssues: 0
    },
    {
      id: 'COMP-002',
      name: 'SOX Financial Controls Report',
      description: 'Quarterly assessment of financial controls and procedures',
      type: 'Financial',
      regulation: 'SOX',
      frequency: 'quarterly',
      status: 'pending_review',
      lastGenerated: '2024-10-15T14:30:00Z',
      nextDue: '2024-12-31T23:59:00Z',
      responsible: 'Finance Team',
      findings: 2,
      criticalIssues: 1
    },
    {
      id: 'COMP-003',
      name: 'ISO 27001 Security Assessment',
      description: 'Annual information security management system review',
      type: 'Security',
      regulation: 'ISO 27001',
      frequency: 'annually',
      status: 'non_compliant',
      lastGenerated: '2024-09-30T16:00:00Z',
      nextDue: '2024-12-30T23:59:00Z',
      responsible: 'Security Team',
      findings: 8,
      criticalIssues: 3
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showNewReportForm, setShowNewReportForm] = useState(false);

  const complianceTypes = ['Data Privacy', 'Financial', 'Security', 'Environmental', 'Healthcare'];
  const regulations = ['GDPR', 'CCPA', 'SOX', 'ISO 27001', 'HIPAA', 'PCI DSS'];
  const frequencies = ['monthly', 'quarterly', 'annually'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'pending_review': return <Clock className="w-4 h-4" />;
      case 'non_compliant': return <AlertCircle className="w-4 h-4" />;
      case 'overdue': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getRiskLevel = (criticalIssues, findings) => {
    if (criticalIssues > 2) return { level: 'High', color: 'text-red-600' };
    if (criticalIssues > 0 || findings > 5) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compliance Reports</h3>
          <p className="text-sm text-gray-600">Monitor regulatory compliance and audit requirements</p>
        </div>
        <button
          onClick={() => setShowNewReportForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Compliance Report
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Compliant</p>
              <p className="text-lg font-semibold text-gray-900">
                {complianceReports.filter(r => r.status === 'compliant').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-lg font-semibold text-gray-900">
                {complianceReports.filter(r => r.status === 'pending_review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Non-Compliant</p>
              <p className="text-lg font-semibold text-gray-900">
                {complianceReports.filter(r => r.status === 'non_compliant').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Critical Issues</p>
              <p className="text-lg font-semibold text-gray-900">
                {complianceReports.reduce((sum, r) => sum + r.criticalIssues, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {complianceReports.map((report) => {
          const risk = getRiskLevel(report.criticalIssues, report.findings);
          return (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {report.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Regulation:</span>
                  <span className="font-medium text-gray-900">{report.regulation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900">{report.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="text-gray-900 capitalize">{report.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Responsible:</span>
                  <span className="text-gray-900">{report.responsible}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Due:</span>
                  <span className="text-gray-900">{new Date(report.nextDue).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                  <span className={`text-sm font-medium ${risk.color}`}>{risk.level}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Findings: {report.findings}</span>
                  <span>Critical: {report.criticalIssues}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
                >
                  View Details
                </button>
                <button className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedReport.name}</h3>
                <p className="text-sm text-gray-600">{selectedReport.description}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Report Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regulation:</span>
                      <span className="text-gray-900">{selectedReport.regulation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">{selectedReport.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="text-gray-900 capitalize">{selectedReport.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Responsible Team:</span>
                      <span className="text-gray-900">{selectedReport.responsible}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Generated:</span>
                      <span className="text-gray-900">{new Date(selectedReport.lastGenerated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Due:</span>
                      <span className="text-gray-900">{new Date(selectedReport.nextDue).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Compliance Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {getStatusIcon(selectedReport.status)}
                        {selectedReport.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Findings:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedReport.findings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Critical Issues:</span>
                      <span className="text-sm font-medium text-red-600">{selectedReport.criticalIssues}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Findings</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Data retention policy violation</p>
                        <p className="text-xs text-gray-600">Personal data retained beyond required period</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Missing privacy notice</p>
                        <p className="text-xs text-gray-600">Website privacy policy requires updates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Access controls verified</p>
                        <p className="text-xs text-gray-600">All data access properly logged</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Actions Required</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                      <span className="text-sm text-gray-700">Update data retention procedures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                      <span className="text-sm text-gray-700">Revise privacy policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="w-4 h-4 text-orange-600 rounded" />
                      <span className="text-sm text-gray-700">Conduct staff training</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Generate Report
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Status
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Export Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Report Templates Component
const ReportTemplates = () => {
  const [templates, setTemplates] = useState([
    {
      id: 'TPL-001',
      name: 'Sales Performance Dashboard',
      description: 'Comprehensive sales metrics and performance indicators',
      category: 'Sales',
      type: 'Dashboard',
      format: 'PDF',
      lastModified: '2024-10-25T14:30:00Z',
      createdBy: 'John Doe',
      usageCount: 15,
      isDefault: true,
      sections: ['Revenue Overview', 'Sales by Region', 'Top Products', 'Team Performance'],
      charts: ['Bar Chart', 'Line Graph', 'Pie Chart', 'Table']
    },
    {
      id: 'TPL-002',
      name: 'Customer Analytics Report',
      description: 'Customer behavior analysis and segmentation metrics',
      category: 'Analytics',
      type: 'Report',
      format: 'Excel',
      lastModified: '2024-10-20T09:15:00Z',
      createdBy: 'Jane Smith',
      usageCount: 8,
      isDefault: false,
      sections: ['Customer Demographics', 'Behavior Patterns', 'Retention Analysis', 'Satisfaction Scores'],
      charts: ['Funnel Chart', 'Heat Map', 'Scatter Plot', 'Table']
    },
    {
      id: 'TPL-003',
      name: 'Financial Summary Template',
      description: 'Monthly financial overview with key metrics',
      category: 'Finance',
      type: 'Summary',
      format: 'PDF',
      lastModified: '2024-10-15T16:45:00Z',
      createdBy: 'Mike Johnson',
      usageCount: 12,
      isDefault: true,
      sections: ['Revenue & Expenses', 'Profit Analysis', 'Cash Flow', 'Budget Variance'],
      charts: ['Line Graph', 'Bar Chart', 'Waterfall Chart', 'Table']
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['Sales', 'Analytics', 'Finance', 'Marketing', 'Operations'];
  const types = ['Dashboard', 'Report', 'Summary', 'Analysis'];
  const formats = ['PDF', 'Excel', 'CSV', 'PowerPoint'];
  const availableCharts = ['Bar Chart', 'Line Graph', 'Pie Chart', 'Funnel Chart', 'Heat Map', 'Scatter Plot', 'Waterfall Chart', 'Table'];

  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: '',
    type: '',
    format: 'PDF',
    sections: [],
    charts: []
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    const template = {
      ...templateForm,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      lastModified: new Date().toISOString(),
      createdBy: 'Current User',
      usageCount: 0,
      isDefault: false
    };
    setTemplates([...templates, template]);
    resetForm();
  };

  const handleUpdateTemplate = () => {
    setTemplates(templates.map(template => 
      template.id === selectedTemplate.id 
        ? { ...template, ...templateForm, lastModified: new Date().toISOString() }
        : template
    ));
    resetForm();
  };

  const resetForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      category: '',
      type: '',
      format: 'PDF',
      sections: [],
      charts: []
    });
    setShowTemplateForm(false);
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template) => {
    setTemplateForm(template);
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowTemplateForm(true);
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleCloneTemplate = (template) => {
    const clonedTemplate = {
      ...template,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      lastModified: new Date().toISOString(),
      createdBy: 'Current User',
      usageCount: 0,
      isDefault: false
    };
    setTemplates([...templates, clonedTemplate]);
  };

  const toggleSection = (section) => {
    const updatedSections = templateForm.sections.includes(section)
      ? templateForm.sections.filter(s => s !== section)
      : [...templateForm.sections, section];
    setTemplateForm({ ...templateForm, sections: updatedSections });
  };

  const toggleChart = (chart) => {
    const updatedCharts = templateForm.charts.includes(chart)
      ? templateForm.charts.filter(c => c !== chart)
      : [...templateForm.charts, chart];
    setTemplateForm({ ...templateForm, charts: updatedCharts });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
          <p className="text-sm text-gray-600">Create and manage reusable report templates</p>
        </div>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {template.isDefault && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="text-gray-900">{template.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900">{template.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="text-gray-900">{template.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usage:</span>
                <span className="text-gray-900">{template.usageCount} times</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modified:</span>
                <span className="text-gray-900">{new Date(template.lastModified).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Sections ({template.sections.length})</h5>
              <div className="flex flex-wrap gap-1">
                {template.sections.slice(0, 3).map((section, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {section}
                  </span>
                ))}
                {template.sections.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{template.sections.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
              >
                Use Template
              </button>
              <button
                onClick={() => handleEditTemplate(template)}
                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCloneTemplate(template)}
                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
              {!template.isDefault && (
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-2 bg-red-200 text-red-700 text-sm rounded-lg hover:bg-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit Template' : 'Create New Template'}
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={templateForm.format}
                    onChange={(e) => setTemplateForm({ ...templateForm, format: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {formats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Sections</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {['Revenue Overview', 'Sales by Region', 'Top Products', 'Team Performance', 'Customer Demographics', 'Behavior Patterns', 'Retention Analysis', 'Satisfaction Scores', 'Revenue & Expenses', 'Profit Analysis', 'Cash Flow', 'Budget Variance'].map((section) => (
                    <label key={section} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={templateForm.sections.includes(section)}
                        onChange={() => toggleSection(section)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chart Types</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableCharts.map((chart) => (
                    <label key={chart} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={templateForm.charts.includes(chart)}
                        onChange={() => toggleChart(chart)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{chart}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={isEditing ? handleUpdateTemplate : handleCreateTemplate}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                {isEditing ? 'Update Template' : 'Create Template'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && !showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Template Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Category: {selectedTemplate.category}</div>
                  <div>Type: {selectedTemplate.type}</div>
                  <div>Format: {selectedTemplate.format}</div>
                  <div>Usage: {selectedTemplate.usageCount} times</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Sections ({selectedTemplate.sections.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.sections.map((section, index) => (
                    <span key={index} className="px-2 py-1 bg-white text-gray-700 text-sm rounded border">
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Chart Types ({selectedTemplate.charts.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.charts.map((chart, index) => (
                    <span key={index} className="px-2 py-1 bg-white text-gray-700 text-sm rounded border">
                      {chart}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Generate Report
              </button>
              <button
                onClick={() => handleEditTemplate(selectedTemplate)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Template
              </button>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ScheduledReports, ExportHistory, ComplianceReports, ReportTemplates };
