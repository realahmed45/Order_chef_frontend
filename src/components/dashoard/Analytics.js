import React, { useState, useEffect } from "react";
import { analyticsApi } from "../../api";
import { formatCurrency, formatDate } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { NoAnalyticsEmptyState } from "../common/EmptyState";

const Analytics = ({ restaurant }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await analyticsApi.getDashboard();

      // Simulate more comprehensive analytics data
      const enhancedData = {
        ...analyticsData,
        revenue: {
          current: analyticsData.todaysStats?.revenue || 0,
          previous: 850,
          growth: 12.5,
          trend: "up",
        },
        orders: {
          current: analyticsData.todaysStats?.orders || 0,
          previous: 45,
          growth: 8.9,
          trend: "up",
        },
        customers: {
          current: 34,
          previous: 28,
          growth: 21.4,
          trend: "up",
        },
        avgOrderValue: {
          current: analyticsData.todaysStats?.averageOrderValue || 0,
          previous: 18.9,
          growth: 3.2,
          trend: "up",
        },
        topItems: analyticsData.popularItems || [],
        recentSales: generateMockSalesData(),
        hourlyData: generateHourlyData(),
        weeklyData: generateWeeklyData(),
      };

      setData(enhancedData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSalesData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      revenue: Math.floor(Math.random() * 1000) + 200,
      orders: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const generateHourlyData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders:
        Math.floor(Math.random() * 15) +
        (i >= 11 && i <= 13 ? 10 : i >= 18 && i <= 20 ? 8 : 2),
      revenue:
        Math.floor(Math.random() * 300) +
        (i >= 11 && i <= 13 ? 200 : i >= 18 && i <= 20 ? 150 : 50),
    }));
  };

  const generateWeeklyData = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.map((day) => ({
      day,
      orders: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 2000) + 500,
    }));
  };

  const timeframes = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
  ];

  const metrics = [
    {
      key: "revenue",
      label: "Revenue",
      icon: "💰",
      color: "green",
      format: (value) => formatCurrency(value),
    },
    {
      key: "orders",
      label: "Orders",
      icon: "🛒",
      color: "blue",
      format: (value) => value.toString(),
    },
    {
      key: "customers",
      label: "Customers",
      icon: "👥",
      color: "purple",
      format: (value) => value.toString(),
    },
    {
      key: "avgOrderValue",
      label: "Avg Order Value",
      icon: "📊",
      color: "orange",
      format: (value) => formatCurrency(value),
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (!data || (!data.revenue.current && !data.orders.current)) {
    return (
      <div className="p-6">
        <NoAnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your restaurant's performance and growth
          </p>
        </div>

        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeframe === tf.value
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const metricData = data[metric.key];
          const isPositive = metricData.growth > 0;

          return (
            <div
              key={metric.key}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-transform hover:scale-105 ${
                selectedMetric === metric.key ? "ring-2 ring-orange-500" : ""
              }`}
              onClick={() => setSelectedMetric(metric.key)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{metric.icon}</span>
                <div
                  className={`text-sm font-semibold flex items-center ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="mr-1">{isPositive ? "↗️" : "↘️"}</span>
                  {Math.abs(metricData.growth).toFixed(1)}%
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {metric.label}
              </h3>

              <p className="text-2xl font-bold text-gray-900 mb-1">
                {metric.format(metricData.current)}
              </p>

              <p className="text-xs text-gray-500">
                vs {metric.format(metricData.previous)} last period
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Trend (Last 30 Days)
          </h3>
          <div className="h-64 flex items-end space-x-1">
            {data.recentSales.slice(-10).map((day, index) => {
              const height = Math.max(
                (day.revenue /
                  Math.max(...data.recentSales.map((d) => d.revenue))) *
                  100,
                5
              );
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-orange-500 rounded-t hover:bg-orange-600 transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${formatDate(day.date)}: ${formatCurrency(
                      day.revenue
                    )}`}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {day.date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Orders Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Orders by Hour (Today)
          </h3>
          <div className="h-64 flex items-end space-x-1">
            {data.hourlyData.map((hour, index) => {
              const height = Math.max(
                (hour.orders /
                  Math.max(...data.hourlyData.map((h) => h.orders))) *
                  100,
                5
              );
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${hour.hour}:00 - ${hour.orders} orders`}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {hour.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Selling Items
          </h3>

          {data.topItems.length > 0 ? (
            <div className="space-y-3">
              {data.topItems.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item._id}</p>
                      <p className="text-sm text-gray-600">
                        {item.count} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </p>
                    <p className="text-sm text-gray-600">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No sales data available yet
            </p>
          )}
        </div>

        {/* Weekly Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Performance
          </h3>

          <div className="space-y-3">
            {data.weeklyData.map((day, index) => {
              const maxRevenue = Math.max(
                ...data.weeklyData.map((d) => d.revenue)
              );
              const percentage = (day.revenue / maxRevenue) * 100;

              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{day.day}</span>
                    <span className="text-gray-600">
                      {day.orders} orders • {formatCurrency(day.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export Data
        </h3>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            📊 Export to Excel
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            📄 Generate PDF Report
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            📧 Email Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
