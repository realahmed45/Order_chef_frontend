import React, { useState, useEffect } from "react";
import { ExternalLink, RefreshCw, Eye, Edit, Settings } from "lucide-react";
import toast from "react-hot-toast";

const WebsitePreview = ({ restaurant }) => {
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWebsiteData();
  }, [restaurant]);

  const loadWebsiteData = async () => {
    try {
      setLoading(true);
      // Get website deployment info
      const response = await fetch(
        `https://order-chef-backend.onrender.com/api/deployments/my-website`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setWebsiteData(data.website);
      }
    } catch (error) {
      console.error("Failed to load website:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Trigger re-deployment
      const response = await fetch(
        `https://order-chef-backend.onrender.com/api/deployments/redeploy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Website refreshed successfully!");
        await loadWebsiteData();
      } else {
        toast.error("Failed to refresh website");
      }
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh website");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!websiteData || !websiteData.websiteUrl) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🌐</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No Website Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Complete onboarding to create your website
        </p>
        <button
          onClick={() => (window.location.href = "/onboarding")}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Start Onboarding
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Website</h2>
            <p className="text-sm text-gray-600 mt-1">
              Live at:{" "}
              <a
                href={websiteData.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {websiteData.websiteUrl}
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <a
              href={websiteData.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
            >
              <ExternalLink size={18} />
              <span>View Live</span>
            </a>
          </div>
        </div>

        {/* Website Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Status", value: "Live", color: "green" },
            {
              label: "Template",
              value: websiteData.templateName || "Modern",
              color: "blue",
            },
            {
              label: "Deployed",
              value: new Date(websiteData.deployedAt).toLocaleDateString(),
              color: "purple",
            },
            {
              label: "Orders",
              value: websiteData.orderCount || 0,
              color: "orange",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 bg-gray-700 px-4 py-1 rounded text-white text-sm font-mono">
              {websiteData.websiteUrl}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye size={18} className="text-white" />
            <span className="text-white text-sm">Live Preview</span>
          </div>
        </div>

        {/* Iframe Preview */}
        <div className="relative">
          <iframe
            src={websiteData.websiteUrl}
            className="w-full h-[600px] border-0"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
            📱 Scroll to see full website
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = "/menu")}
            className="flex flex-col items-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
          >
            <Edit size={32} className="text-orange-600 mb-2" />
            <span className="font-semibold">Edit Menu</span>
            <span className="text-xs text-gray-600 mt-1">
              Update your items
            </span>
          </button>

          <button
            onClick={() => (window.location.href = "/settings")}
            className="flex flex-col items-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
          >
            <Settings size={32} className="text-blue-600 mb-2" />
            <span className="font-semibold">Settings</span>
            <span className="text-xs text-gray-600 mt-1">
              Customize website
            </span>
          </button>

          <button
            onClick={() =>
              window.open(`${websiteData.websiteUrl}?preview=true`, "_blank")
            }
            className="flex flex-col items-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
          >
            <ExternalLink size={32} className="text-green-600 mb-2" />
            <span className="font-semibold">Full Preview</span>
            <span className="text-xs text-gray-600 mt-1">Open in new tab</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
