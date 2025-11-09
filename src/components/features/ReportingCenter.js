import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Clock,
  Mail,
  Settings,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Share2,
  Printer,
  Database,
  PieChart,
  FileSpreadsheet,
  Receipt,
  Building,
  Shield,
  CheckCircle,
  AlertCircle,
  Target,
  Globe,
  Zap,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercent,
} from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const ReportingCenter = ({ restaurant }) => {
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [complianceReports, setComplianceReports] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [reportForm, setReportForm] = useState({
    name: "",
    type: "sales",
    dateRange: "30d",
    startDate: "",
    endDate: "",
    format: "pdf",
    includeCharts: true,
    includeDetails: true,
    filters: {},
    groupBy: "day",
  });

  const [scheduleForm, setScheduleForm] = useState({
    reportId: "",
    frequency: "weekly",
    dayOfWeek: "monday",
    dayOfMonth: 1,
    time: "09:00",
    recipients: [],
    active: true,
  });

  const reportTypes = [
    {
      value: "sales",
      label: "Sales Report",
      icon: DollarSign,
      description: "Revenue and sales analytics",
    },
    {
      value: "financial",
      label: "Financial Statement",
      icon: BarChart3,
      description: "Profit & loss, balance sheet",
    },
    {
      value: "tax",
      label: "Tax Report",
      icon: Receipt,
      description: "Tax calculations and filings",
    },
    {
      value: "inventory",
      label: "Inventory Report",
      icon: Package,
      description: "Stock levels and valuations",
    },
    {
      value: "customer",
      label: "Customer Report",
      icon: Users,
      description: "Customer analytics and behavior",
    },
    {
      value: "staff",
      label: "Staff Report",
      icon: Users,
      description: "Employee performance and payroll",
    },
    {
      value: "compliance",
      label: "Compliance Report",
      icon: Shield,
      description: "Regulatory compliance data",
    },
    {
      value: "custom",
      label: "Custom Report",
      icon: Settings,
      description: "Build your own report",
    },
  ];

  const exportFormats = [
    { value: "pdf", label: "PDF Document", icon: FileText },
    { value: "excel", label: "Excel Spreadsheet", icon: FileSpreadsheet },
    { value: "csv", label: "CSV File", icon: Database },
    { value: "json", label: "JSON Data", icon: Globe },
  ];

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  useEffect(() => {
    fetchReportingData();
  }, []);

  const fetchReportingData = async () => {
    try {
      setLoading(true);

      const [
        reportsRes,
        scheduledRes,
        historyRes,
        templatesRes,
        complianceRes,
      ] = await Promise.all([
        fetch("/api/reports", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/reports/scheduled", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/reports/export-history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/reports/templates", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/reports/compliance", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const [
        reportsData,
        scheduledData,
        historyData,
        templatesData,
        complianceData,
      ] = await Promise.all([
        reportsRes.json(),
        scheduledRes.json(),
        historyRes.json(),
        templatesRes.json(),
        complianceRes.json(),
      ]);

      if (reportsData.success) setReports(reportsData.reports);
      if (scheduledData.success) setScheduledReports(scheduledData.scheduled);
      if (historyData.success) setExportHistory(historyData.history);
      if (templatesData.success) setReportTemplates(templatesData.templates);
      if (complianceData.success) setComplianceReports(complianceData.reports);
    } catch (error) {
      console.error("Error fetching reporting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportConfig) => {
    try {
      setGenerateLoading(true);

      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reportConfig),
      });

      const data = await response.json();
      if (data.success) {
        // Download the generated report
        const downloadUrl = data.downloadUrl;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = data.filename;
        link.click();

        await fetchReportingData();
        alert("Report generated successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    await generateReport(reportForm);
    resetReportForm();
  };

  const handleScheduleReport = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/reports/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(scheduleForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchReportingData();
        resetScheduleForm();
        alert("Report scheduled successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error scheduling report:", error);
      alert("Failed to schedule report");
    }
  };

  const quickGenerate = async (type, format = "pdf") => {
    const quickConfig = {
      type,
      format,
      dateRange: "30d",
      includeCharts: true,
      includeDetails: true,
    };

    await generateReport(quickConfig);
  };

  const exportData = async (type, format) => {
    try {
      const response = await fetch(`/api/exports/${type}?format=${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-export-${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);

        await fetchReportingData();
      } else {
        alert("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    }
  };

  const resetReportForm = () => {
    setReportForm({
      name: "",
      type: "sales",
      dateRange: "30d",
      startDate: "",
      endDate: "",
      format: "pdf",
      includeCharts: true,
      includeDetails: true,
      filters: {},
      groupBy: "day",
    });
    setShowReportModal(false);
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      reportId: "",
      frequency: "weekly",
      dayOfWeek: "monday",
      dayOfMonth: 1,
      time: "09:00",
      recipients: [],
      active: true,
    });
    setShowScheduleModal(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Reporting & Export Center
          </h2>
          <p className="text-gray-600">
            Generate comprehensive reports and export business data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportTypes.slice(0, 4).map((type) => (
            <div
              key={type.value}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <type.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => quickGenerate(type.value, "pdf")}
                  disabled={generateLoading}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  PDF
                </button>
                <button
                  onClick={() => quickGenerate(type.value, "excel")}
                  disabled={generateLoading}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {scheduledReports.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {exportHistory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance</p>
              <p className="text-2xl font-bold text-gray-900">
                {complianceReports.length}
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
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "reports", label: "Generated Reports", icon: FileText },
              { id: "scheduled", label: "Scheduled Reports", icon: Calendar },
              { id: "exports", label: "Export History", icon: Download },
              { id: "compliance", label: "Compliance", icon: Shield },
              { id: "templates", label: "Templates", icon: Settings },
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <ReportingDashboard
              reports={reports}
              scheduledReports={scheduledReports}
              exportHistory={exportHistory}
              onQuickGenerate={quickGenerate}
              onExportData={exportData}
            />
          )}

          {activeTab === "reports" && (
            <GeneratedReports
              reports={reports}
              getStatusColor={getStatusColor}
            />
          )}

          {activeTab === "scheduled" && (
            <ScheduledReports
              scheduledReports={scheduledReports}
              frequencies={frequencies}
            />
          )}

          {activeTab === "exports" && (
            <ExportHistory
              exportHistory={exportHistory}
              getStatusColor={getStatusColor}
            />
          )}

          {activeTab === "compliance" && (
            <ComplianceReports
              complianceReports={complianceReports}
              onGenerate={quickGenerate}
            />
          )}

          {activeTab === "templates" && (
            <ReportTemplates
              reportTemplates={reportTemplates}
              reportTypes={reportTypes}
            />
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      <FormModal
        isOpen={showReportModal}
        onClose={resetReportForm}
        onSubmit={handleCreateReport}
        title="Generate Custom Report"
        submitText={generateLoading ? "Generating..." : "Generate Report"}
        size="lg"
        loading={generateLoading}
      >
        <ReportForm
          reportForm={reportForm}
          setReportForm={setReportForm}
          reportTypes={reportTypes}
          exportFormats={exportFormats}
        />
      </FormModal>

      {/* Schedule Report Modal */}
      <FormModal
        isOpen={showScheduleModal}
        onClose={resetScheduleForm}
        onSubmit={handleScheduleReport}
        title="Schedule Automated Report"
        submitText="Schedule Report"
        size="lg"
      >
        <ScheduleForm
          scheduleForm={scheduleForm}
          setScheduleForm={setScheduleForm}
          reportTemplates={reportTemplates}
          frequencies={frequencies}
        />
      </FormModal>
    </div>
  );
};

// Reporting Dashboard Component
const ReportingDashboard = ({
  reports,
  scheduledReports,
  exportHistory,
  onQuickGenerate,
  onExportData,
}) => {
  const recentReports = reports.slice(0, 5);
  const upcomingScheduled = scheduledReports
    .filter((report) => report.active)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Reports Generated</p>
              <p className="text-3xl font-bold">{reports.length}</p>
              <p className="text-blue-100">this month</p>
            </div>
            <FileText className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Scheduled Reports</p>
              <p className="text-3xl font-bold">
                {scheduledReports.filter((r) => r.active).length}
              </p>
              <p className="text-green-100">active</p>
            </div>
            <Calendar className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Data Exported</p>
              <p className="text-3xl font-bold">{exportHistory.length}</p>
              <p className="text-purple-100">total exports</p>
            </div>
            <Download className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Export Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Data Export
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Sales Data</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onExportData("sales", "excel")}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </button>
              <button
                onClick={() => onExportData("sales", "csv")}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Database className="w-4 h-4 mr-1" />
                CSV
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Customer Data</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onExportData("customers", "excel")}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </button>
              <button
                onClick={() => onExportData("customers", "csv")}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Database className="w-4 h-4 mr-1" />
                CSV
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Inventory Data</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onExportData("inventory", "excel")}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </button>
              <button
                onClick={() => onExportData("inventory", "csv")}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Database className="w-4 h-4 mr-1" />
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Reports
          </h3>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(report.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.downloadUrl && (
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Scheduled Reports
          </h3>
          <div className="space-y-3">
            {upcomingScheduled.map((scheduled) => (
              <div
                key={scheduled.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {scheduled.reportName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {scheduled.frequency} at {scheduled.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Analytics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Report Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">45</div>
            <div className="text-sm text-gray-600">PDF Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">32</div>
            <div className="text-sm text-gray-600">Excel Exports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">18</div>
            <div className="text-sm text-gray-600">Automated Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2.3MB</div>
            <div className="text-sm text-gray-600">Avg File Size</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generated Reports Component
const GeneratedReports = ({ reports, getStatusColor }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Types</option>
          <option value="sales">Sales</option>
          <option value="financial">Financial</option>
          <option value="tax">Tax</option>
          <option value="inventory">Inventory</option>
          <option value="customer">Customer</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Format
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {report.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.format?.toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(report.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.fileSize || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {report.downloadUrl && report.status === "completed" && (
                      <a
                        href={report.downloadUrl}
                        className="text-blue-600 hover:text-blue-900"
                        download
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No reports found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No reports match your current filters
          </p>
        </div>
      )}
    </div>
  );
};

// Report Form Component
const ReportForm = ({
  reportForm,
  setReportForm,
  reportTypes,
  exportFormats,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Name *
        </label>
        <input
          type="text"
          value={reportForm.name}
          onChange={(e) =>
            setReportForm({ ...reportForm, name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Monthly Sales Report"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type *
          </label>
          <select
            value={reportForm.type}
            onChange={(e) =>
              setReportForm({ ...reportForm, type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format *
          </label>
          <select
            value={reportForm.format}
            onChange={(e) =>
              setReportForm({ ...reportForm, format: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          >
            {exportFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={reportForm.dateRange}
            onChange={(e) =>
              setReportForm({ ...reportForm, dateRange: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom range</option>
          </select>

          {reportForm.dateRange === "custom" && (
            <>
              <input
                type="date"
                value={reportForm.startDate}
                onChange={(e) =>
                  setReportForm({ ...reportForm, startDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="date"
                value={reportForm.endDate}
                onChange={(e) =>
                  setReportForm({ ...reportForm, endDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reportForm.includeCharts}
              onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  includeCharts: e.target.checked,
                })
              }
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Include charts and graphs
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reportForm.includeDetails}
              onChange={(e) =>
                setReportForm({
                  ...reportForm,
                  includeDetails: e.target.checked,
                })
              }
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Include detailed data tables
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Group Data By
        </label>
        <select
          value={reportForm.groupBy}
          onChange={(e) =>
            setReportForm({ ...reportForm, groupBy: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>
    </div>
  );
};

// Schedule Form Component
const ScheduleForm = ({
  scheduleForm,
  setScheduleForm,
  reportTemplates,
  frequencies,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Template *
        </label>
        <select
          value={scheduleForm.reportId}
          onChange={(e) =>
            setScheduleForm({ ...scheduleForm, reportId: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select a report template</option>
          {reportTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency *
          </label>
          <select
            value={scheduleForm.frequency}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, frequency: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          >
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            value={scheduleForm.time}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, time: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {scheduleForm.frequency === "weekly" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of Week
          </label>
          <select
            value={scheduleForm.dayOfWeek}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
      )}

      {scheduleForm.frequency === "monthly" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of Month
          </label>
          <select
            value={scheduleForm.dayOfMonth}
            onChange={(e) =>
              setScheduleForm({
                ...scheduleForm,
                dayOfMonth: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Recipients
        </label>
        <textarea
          value={scheduleForm.recipients.join("\n")}
          onChange={(e) =>
            setScheduleForm({
              ...scheduleForm,
              recipients: e.target.value
                .split("\n")
                .filter((email) => email.trim()),
            })
          }
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Enter email addresses (one per line)"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={scheduleForm.active}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, active: e.target.checked })
            }
            className="w-4 h-4 text-orange-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Activate this scheduled report
          </span>
        </label>
      </div>
    </div>
  );
};

// Additional tab components would continue here...
// Including ScheduledReports, ExportHistory, ComplianceReports, ReportTemplates

// ScheduledReports Component
const ScheduledReports = ({ scheduledReports, frequencies }) => {
  const [filterFrequency, setFilterFrequency] = useState("all");

  const filteredScheduled =
    filterFrequency === "all"
      ? scheduledReports
      : scheduledReports.filter(
          (report) => report.frequency === filterFrequency
        );

  const toggleScheduleActive = async (reportId, active) => {
    try {
      const response = await fetch(`/api/reports/scheduled/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ active }),
      });

      if (response.ok) {
        // Update local state
        console.log("Schedule updated successfully");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Filter by frequency:
        </label>
        <select
          value={filterFrequency}
          onChange={(e) => setFilterFrequency(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Frequencies</option>
          {frequencies.map((freq) => (
            <option key={freq.value} value={freq.value}>
              {freq.label}
            </option>
          ))}
        </select>
      </div>

      {/* Scheduled Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScheduled.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {report.reportName || report.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {report.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {report.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium capitalize">
                  {report.frequency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{report.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">
                  {report.recipients?.length || 0} emails
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next Run:</span>
                <span className="font-medium">
                  {report.nextRun
                    ? formatDateTime(report.nextRun)
                    : "Not scheduled"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </button>
                <button className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </button>
              </div>
              <button
                onClick={() => toggleScheduleActive(report.id, !report.active)}
                className={`px-3 py-1 text-sm rounded ${
                  report.active
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {report.active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredScheduled.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No scheduled reports
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterFrequency === "all"
              ? "No scheduled reports configured"
              : `No ${filterFrequency} reports found`}
          </p>
        </div>
      )}
    </div>
  );
};

// ExportHistory Component
const ExportHistory = ({ exportHistory, getStatusColor }) => {
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedHistory = [...exportHistory].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "date":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case "name":
        aValue = a.fileName || "";
        bValue = b.fileName || "";
        break;
      case "size":
        aValue = a.fileSize || 0;
        bValue = b.fileSize || 0;
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const downloadExport = async (exportId) => {
    try {
      const response = await fetch(`/api/exports/${exportId}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `export-${exportId}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {exportHistory.length} exports • Total:{" "}
          {Math.round(
            exportHistory.reduce((sum, exp) => sum + (exp.fileSize || 0), 0) /
              1024
          )}{" "}
          KB
        </div>
      </div>

      {/* Export History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Export Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedHistory.map((exportItem) => (
              <tr key={exportItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Download className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exportItem.fileName || `Export ${exportItem.id}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exportItem.description || "Data export"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {exportItem.type || "General"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      exportItem.status || "completed"
                    )}`}
                  >
                    {exportItem.status || "completed"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {exportItem.fileSize
                    ? `${Math.round(exportItem.fileSize / 1024)} KB`
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(exportItem.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => downloadExport(exportItem.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exportHistory.length === 0 && (
        <div className="text-center py-12">
          <Download className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No export history
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No data exports have been performed yet
          </p>
        </div>
      )}
    </div>
  );
};

// ComplianceReports Component
const ComplianceReports = ({ complianceReports, onGenerate }) => {
  const complianceTypes = [
    {
      type: "tax",
      name: "Tax Compliance",
      description: "Sales tax, income tax, and regulatory tax reports",
      icon: Receipt,
      color: "bg-blue-100 text-blue-800",
      requirements: [
        "Monthly sales tax",
        "Quarterly income tax",
        "Annual tax summary",
      ],
    },
    {
      type: "health",
      name: "Health Department",
      description: "Food safety and health compliance reports",
      icon: Shield,
      color: "bg-green-100 text-green-800",
      requirements: [
        "Food safety logs",
        "Temperature records",
        "Inspection reports",
      ],
    },
    {
      type: "labor",
      name: "Labor Compliance",
      description: "Employee hours, wages, and labor law compliance",
      icon: Users,
      color: "bg-purple-100 text-purple-800",
      requirements: [
        "Payroll reports",
        "Hours tracking",
        "Benefits compliance",
      ],
    },
    {
      type: "financial",
      name: "Financial Compliance",
      description: "Financial auditing and regulatory compliance",
      icon: DollarSign,
      color: "bg-orange-100 text-orange-800",
      requirements: ["Revenue reports", "Expense tracking", "Audit trails"],
    },
  ];

  const generateComplianceReport = async (type, period = "monthly") => {
    try {
      await onGenerate("compliance", "pdf");
      console.log(`Generating ${type} compliance report for ${period}`);
    } catch (error) {
      console.error("Failed to generate compliance report:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Compliance Status
            </h3>
            <p className="text-green-800">
              All regulatory requirements are up to date
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {complianceTypes.map((compliance) => (
          <div
            key={compliance.type}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <compliance.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {compliance.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {compliance.description}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${compliance.color}`}
              >
                {compliance.type}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <h5 className="text-sm font-medium text-gray-700">
                Requirements:
              </h5>
              <ul className="space-y-1">
                {compliance.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() =>
                  generateComplianceReport(compliance.type, "monthly")
                }
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-1" />
                Monthly
              </button>
              <button
                onClick={() =>
                  generateComplianceReport(compliance.type, "quarterly")
                }
                className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Quarterly
              </button>
              <button
                onClick={() =>
                  generateComplianceReport(compliance.type, "yearly")
                }
                className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Yearly
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Compliance Reports */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Compliance Reports
        </h3>
        <div className="space-y-3">
          {complianceReports.slice(0, 5).map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(report.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === "compliant"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {report.status || "compliant"}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ReportTemplates Component
const ReportTemplates = ({ reportTemplates, reportTypes }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    type: "sales",
    isPublic: false,
    fields: [],
  });

  const createTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reports/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(templateForm),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setTemplateForm({
          name: "",
          description: "",
          type: "sales",
          isPublic: false,
          fields: [],
        });
        alert("Template created successfully!");
      }
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const duplicateTemplate = async (templateId) => {
    try {
      const response = await fetch(
        `/api/reports/templates/${templateId}/duplicate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        alert("Template duplicated successfully!");
      }
    } catch (error) {
      console.error("Error duplicating template:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Report Templates
          </h3>
          <p className="text-sm text-gray-600">
            Create and manage reusable report templates
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reportTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {template.type}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fields:</span>
                <span className="font-medium">
                  {template.fields?.length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usage:</span>
                <span className="font-medium">
                  {template.usageCount || 0} times
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {formatDate(template.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <Eye className="w-4 h-4 mr-1" />
                Use
              </button>
              <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => duplicateTemplate(template.id)}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {template.isPublic && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Globe className="w-3 h-3 mr-1" />
                  Public Template
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {reportTemplates.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No templates yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first report template to get started
          </p>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <form onSubmit={createTemplate}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create Report Template
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={templateForm.description}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type *
                  </label>
                  <select
                    value={templateForm.type}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    {reportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={templateForm.isPublic}
                      onChange={(e) =>
                        setTemplateForm({
                          ...templateForm,
                          isPublic: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Make template public
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingCenter;
