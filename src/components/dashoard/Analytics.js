import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  PieChart,
  LineChart,
  Activity,
  Clock,
  Star,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Eye,
  Settings,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Zap,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
} from "../utils/helpers";
import LoadingSpinner from "./common/LoadingSpinner";
import { FormModal } from "./common/Modal";

const Analytics = ({ restaurant }) => {
  const [analytics, setAnalytics] = useState({});
  const [profitAnalysis, setProfitAnalysis] = useState({});
  const [salesForecast, setSalesForecast] = useState({});
  const [customerBehavior, setCustomerBehavior] = useState({});
  const [staffPerformance, setStaffPerformance] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [customReports, setCustomReports] = useState([]);

  const [reportBuilder, setReportBuilder] = useState({
    name: "",
    type: "revenue",
    timeRange: "30d",
    filters: [],
    metrics: [],
    groupBy: "day",
    format: "chart",
  });

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
    { value: "custom", label: "Custom range" },
  ];

  const availableMetrics = [
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "orders", label: "Orders", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "profit", label: "Profit", icon: TrendingUp },
    { id: "costs", label: "Costs", icon: TrendingDown },
    { id: "avg_order", label: "Avg Order Value", icon: Target },
    { id: "conversion", label: "Conversion Rate", icon: Activity },
    { id: "rating", label: "Rating", icon: Star },
  ];

  useEffect(() => {
    fetchAnalyticsData();
    fetchCustomReports();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [analyticsRes, profitRes, forecastRes, behaviorRes, staffRes] =
        await Promise.all([
          fetch(`/api/analytics/overview?timeRange=${timeRange}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`/api/analytics/profit?timeRange=${timeRange}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`/api/analytics/forecast?timeRange=${timeRange}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`/api/analytics/customer-behavior?timeRange=${timeRange}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`/api/analytics/staff-performance?timeRange=${timeRange}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      const [analyticsData, profitData, forecastData, behaviorData, staffData] =
        await Promise.all([
          analyticsRes.json(),
          profitRes.json(),
          forecastRes.json(),
          behaviorRes.json(),
          staffRes.json(),
        ]);

      if (analyticsData.success) setAnalytics(analyticsData.analytics);
      if (profitData.success) setProfitAnalysis(profitData.analysis);
      if (forecastData.success) setSalesForecast(forecastData.forecast);
      if (behaviorData.success) setCustomerBehavior(behaviorData.behavior);
      if (staffData.success) setStaffPerformance(staffData.performance);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomReports = async () => {
    try {
      const response = await fetch("/api/analytics/custom-reports", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        setCustomReports(data.reports);
      }
    } catch (error) {
      console.error("Error fetching custom reports:", error);
    }
  };

  const createCustomReport = async () => {
    try {
      const response = await fetch("/api/analytics/custom-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reportBuilder),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCustomReports();
        setShowReportBuilder(false);
        setReportBuilder({
          name: "",
          type: "revenue",
          timeRange: "30d",
          filters: [],
          metrics: [],
          groupBy: "day",
          format: "chart",
        });
        alert("Custom report created successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating custom report:", error);
      alert("Failed to create custom report");
    }
  };

  const exportData = async (type) => {
    try {
      const response = await fetch(
        `/api/analytics/export/${type}?timeRange=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-analytics-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    }
  };

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced Analytics
          </h2>
          <p className="text-gray-600">
            Comprehensive business intelligence and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowReportBuilder(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Custom Report
          </button>

          <button
            onClick={() => exportData("all")}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <button
            onClick={fetchAnalyticsData}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue || 0)}
          previousValue={analytics.previousRevenue || 0}
          currentValue={analytics.totalRevenue || 0}
          icon={DollarSign}
          color="green"
        />

        <MetricCard
          title="Profit Margin"
          value={formatPercent(analytics.profitMargin || 0)}
          previousValue={analytics.previousProfitMargin || 0}
          currentValue={analytics.profitMargin || 0}
          icon={TrendingUp}
          color="blue"
        />

        <MetricCard
          title="Total Orders"
          value={analytics.totalOrders?.toLocaleString() || "0"}
          previousValue={analytics.previousOrders || 0}
          currentValue={analytics.totalOrders || 0}
          icon={BarChart3}
          color="purple"
        />

        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(analytics.avgOrderValue || 0)}
          previousValue={analytics.previousAvgOrderValue || 0}
          currentValue={analytics.avgOrderValue || 0}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Best Performing Day
                </p>
                <p className="text-lg font-bold text-green-900">
                  {analytics.bestDay || "Saturday"}
                </p>
                <p className="text-sm text-green-700">
                  {formatCurrency(analytics.bestDayRevenue || 0)} revenue
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Peak Hours</p>
                <p className="text-lg font-bold text-blue-900">
                  {analytics.peakHours || "12-2 PM"}
                </p>
                <p className="text-sm text-blue-700">
                  {analytics.peakOrdersPercent || 35}% of daily orders
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Top Menu Item
                </p>
                <p className="text-lg font-bold text-purple-900">
                  {analytics.topItem || "Margherita Pizza"}
                </p>
                <p className="text-sm text-purple-700">
                  {analytics.topItemOrders || 45} orders this period
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "profit", label: "Profit Analysis", icon: DollarSign },
              { id: "forecast", label: "Sales Forecast", icon: TrendingUp },
              { id: "customers", label: "Customer Behavior", icon: Users },
              { id: "staff", label: "Staff Performance", icon: Activity },
              { id: "reports", label: "Custom Reports", icon: FileText },
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
          {activeTab === "overview" && <OverviewTab analytics={analytics} />}

          {activeTab === "profit" && (
            <ProfitAnalysisTab
              profitAnalysis={profitAnalysis}
              onExport={() => exportData("profit")}
            />
          )}

          {activeTab === "forecast" && (
            <SalesForecastTab
              forecast={salesForecast}
              onExport={() => exportData("forecast")}
            />
          )}

          {activeTab === "customers" && (
            <CustomerBehaviorTab
              behavior={customerBehavior}
              onExport={() => exportData("customers")}
            />
          )}

          {activeTab === "staff" && (
            <StaffPerformanceTab
              performance={staffPerformance}
              onExport={() => exportData("staff")}
            />
          )}

          {activeTab === "reports" && (
            <CustomReportsTab
              reports={customReports}
              onCreateNew={() => setShowReportBuilder(true)}
            />
          )}
        </div>
      </div>

      {/* Custom Report Builder Modal */}
      <FormModal
        isOpen={showReportBuilder}
        onClose={() => setShowReportBuilder(false)}
        onSubmit={(e) => {
          e.preventDefault();
          createCustomReport();
        }}
        title="Create Custom Report"
        submitText="Create Report"
        size="lg"
      >
        <ReportBuilderForm
          reportBuilder={reportBuilder}
          setReportBuilder={setReportBuilder}
          availableMetrics={availableMetrics}
        />
      </FormModal>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({
  title,
  value,
  previousValue,
  currentValue,
  icon: Icon,
  color,
}) => {
  const change = calculateChange(currentValue, previousValue);
  const isPositive = change > 0;
  const isNegative = change < 0;

  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {previousValue !== undefined && (
            <div className="flex items-center mt-1">
              {isPositive && (
                <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
              )}
              {isNegative && (
                <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPositive
                    ? "text-green-600"
                    : isNegative
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {Math.abs(change).toFixed(1)}% vs previous period
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// All the remaining tab components remain the same...
// (I'll include them to complete the file)

// Overview Tab Component
const OverviewTab = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trends
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today</span>
              <span className="font-semibold">
                {formatCurrency(analytics.todayRevenue || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold">
                {formatCurrency(analytics.weekRevenue || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold">
                {formatCurrency(analytics.monthRevenue || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Year</span>
              <span className="font-semibold">
                {formatCurrency(analytics.yearRevenue || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-semibold">
                {analytics.totalOrders?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">
                {analytics.completedOrders?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled</span>
              <span className="font-semibold text-red-600">
                {analytics.cancelledOrders?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">
                {formatPercent(analytics.completionRate || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Items
        </h3>
        <div className="space-y-3">
          {analytics.topItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{item.orders} orders</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

// Profit Analysis Tab Component
const ProfitAnalysisTab = ({ profitAnalysis, onExport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Profit Analysis</h3>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Profit Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Gross Profit</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(profitAnalysis.grossProfit || 0)}
              </p>
              <p className="text-sm text-green-700">
                {formatPercent(profitAnalysis.grossMargin || 0)} margin
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(profitAnalysis.netProfit || 0)}
              </p>
              <p className="text-sm text-blue-700">
                {formatPercent(profitAnalysis.netMargin || 0)} margin
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-600">COGS</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(profitAnalysis.cogs || 0)}
              </p>
              <p className="text-sm text-purple-700">
                {formatPercent(profitAnalysis.cogsPercent || 0)} of revenue
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Food Costs</span>
              <span className="font-medium">
                {formatCurrency(profitAnalysis.foodCosts || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Labor Costs</span>
              <span className="font-medium">
                {formatCurrency(profitAnalysis.laborCosts || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overhead</span>
              <span className="font-medium">
                {formatCurrency(profitAnalysis.overhead || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Other Expenses</span>
              <span className="font-medium">
                {formatCurrency(profitAnalysis.otherExpenses || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Profitability by Item
          </h4>
          <div className="space-y-3">
            {profitAnalysis.itemProfitability?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <p className="text-sm text-gray-600">
                    {formatPercent(item.margin)} margin
                  </p>
                </div>
                <span className="font-medium">
                  {formatCurrency(item.profit)}
                </span>
              </div>
            )) || []}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sales Forecast Tab Component
const SalesForecastTab = ({ forecast, onExport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Sales Forecast</h3>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Forecast Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600">Next Week</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(forecast.nextWeek || 0)}
              </p>
              <p className="text-sm text-blue-700">Predicted revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Next Month</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(forecast.nextMonth || 0)}
              </p>
              <p className="text-sm text-green-700">Predicted revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-600">Confidence</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatPercent(forecast.confidence || 0)}
              </p>
              <p className="text-sm text-purple-700">Prediction accuracy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Forecast Factors</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Seasonal Trends</span>
              <span className="font-medium">
                {formatPercent(forecast.seasonalImpact || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Historical Growth</span>
              <span className="font-medium">
                {formatPercent(forecast.growthRate || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Market Conditions</span>
              <span className="font-medium">
                {forecast.marketConditions || "Stable"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Competition Impact</span>
              <span className="font-medium">
                {formatPercent(forecast.competitionImpact || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Recommendations</h4>
          <div className="space-y-3">
            {forecast.recommendations?.map((rec, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
              >
                <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-orange-900">{rec.title}</h5>
                  <p className="text-sm text-orange-700">{rec.description}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Impact: {rec.impact}
                  </p>
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Behavior Tab Component
const CustomerBehaviorTab = ({ behavior, onExport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Behavior Analysis
        </h3>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Customer Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600">New Customers</p>
            <p className="text-2xl font-bold text-blue-900">
              {behavior.newCustomers || 0}
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">Repeat Rate</p>
            <p className="text-2xl font-bold text-green-900">
              {formatPercent(behavior.repeatRate || 0)}
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600">Avg Frequency</p>
            <p className="text-2xl font-bold text-purple-900">
              {behavior.avgFrequency || 0}x/month
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-600">CLV</p>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(behavior.customerLifetimeValue || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Customer Segments
          </h4>
          <div className="space-y-3">
            {behavior.segments?.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h5 className="font-medium text-gray-900">{segment.name}</h5>
                  <p className="text-sm text-gray-600">{segment.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{segment.count} customers</p>
                  <p className="text-sm text-gray-600">
                    {formatPercent(segment.percentage)}
                  </p>
                </div>
              </div>
            )) || []}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Popular Order Times
          </h4>
          <div className="space-y-3">
            {behavior.orderTimes?.map((time, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{time.hour}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${time.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{time.orders}</span>
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>
    </div>
  );
};

// Staff Performance Tab Component
const StaffPerformanceTab = ({ performance, onExport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Staff Performance Metrics
        </h3>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Performance Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600">Avg Efficiency</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatPercent(performance.avgEfficiency || 0)}
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">Avg Order Time</p>
            <p className="text-2xl font-bold text-green-900">
              {performance.avgOrderTime || 0}min
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="text-center">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600">
              Customer Rating
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {performance.avgRating || 0}/5
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-600">
              Sales per Hour
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(performance.salesPerHour || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h4 className="font-semibold text-gray-900">
            Individual Performance
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Orders Handled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avg Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performance.staffMetrics?.map((staff, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-medium text-sm">
                          {staff.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {staff.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.ordersHandled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.avgTime}min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {staff.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(staff.sales)}
                  </td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Custom Reports Tab Component
const CustomReportsTab = ({ reports, onCreateNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Custom Reports</h3>
        <button
          onClick={onCreateNew}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-green-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{report.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{report.timeRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {formatDate(report.createdAt)}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              View Report
            </button>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No custom reports
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create custom reports to track specific metrics
          </p>
        </div>
      )}
    </div>
  );
};

// Report Builder Form Component
const ReportBuilderForm = ({
  reportBuilder,
  setReportBuilder,
  availableMetrics,
}) => {
  const addMetric = (metricId) => {
    if (!reportBuilder.metrics.includes(metricId)) {
      setReportBuilder({
        ...reportBuilder,
        metrics: [...reportBuilder.metrics, metricId],
      });
    }
  };

  const removeMetric = (metricId) => {
    setReportBuilder({
      ...reportBuilder,
      metrics: reportBuilder.metrics.filter((m) => m !== metricId),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Name
        </label>
        <input
          type="text"
          value={reportBuilder.name}
          onChange={(e) =>
            setReportBuilder({ ...reportBuilder, name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="My Custom Report"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            value={reportBuilder.type}
            onChange={(e) =>
              setReportBuilder({ ...reportBuilder, type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="revenue">Revenue Analysis</option>
            <option value="orders">Order Analysis</option>
            <option value="customers">Customer Analysis</option>
            <option value="products">Product Analysis</option>
            <option value="staff">Staff Analysis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={reportBuilder.timeRange}
            onChange={(e) =>
              setReportBuilder({ ...reportBuilder, timeRange: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Metrics to Include
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {availableMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => addMetric(metric.id)}
              disabled={reportBuilder.metrics.includes(metric.id)}
              className={`flex items-center p-2 border rounded-lg text-sm ${
                reportBuilder.metrics.includes(metric.id)
                  ? "bg-orange-100 border-orange-300 text-orange-700"
                  : "border-gray-300 hover:border-orange-300"
              }`}
            >
              <metric.icon className="w-4 h-4 mr-2" />
              {metric.label}
            </button>
          ))}
        </div>

        {reportBuilder.metrics.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Selected metrics:</p>
            <div className="flex flex-wrap gap-2">
              {reportBuilder.metrics.map((metricId) => {
                const metric = availableMetrics.find((m) => m.id === metricId);
                return (
                  <span
                    key={metricId}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {metric?.label}
                    <button
                      onClick={() => removeMetric(metricId)}
                      className="ml-2 hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group By
          </label>
          <select
            value={reportBuilder.groupBy}
            onChange={(e) =>
              setReportBuilder({ ...reportBuilder, groupBy: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="category">Category</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            value={reportBuilder.format}
            onChange={(e) =>
              setReportBuilder({ ...reportBuilder, format: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="chart">Chart</option>
            <option value="table">Table</option>
            <option value="both">Chart + Table</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
