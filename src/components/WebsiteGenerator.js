import React, { useState } from "react";

const AutomatedWebsiteDeployer = ({ restaurant, onComplete }) => {
  const [deploying, setDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState(null);
  const [error, setError] = useState(null);

  const deployWebsite = async () => {
    setDeploying(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/deployments/deploy-website",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId: restaurant._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setDeploymentStatus("deployed");
        setWebsiteUrl(data.websiteUrl);
        onComplete(data.websiteUrl);
      } else {
        setError(data.message || "Deployment failed");

        // If HTML content is returned as fallback, show manual option
        if (data.htmlContent) {
          setDeploymentStatus("manual_fallback");
        }
      }
    } catch (error) {
      setError("Error deploying website: " + error.message);
    } finally {
      setDeploying(false);
    }
  };

  if (!deploymentStatus) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          🚀 Automated Website Deployment
        </h3>
        <p className="text-gray-600 mb-4">
          We'll automatically deploy your website to a global URL in seconds!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-800 mb-2">What happens:</h4>
          <ul className="text-green-700 space-y-1 text-sm">
            <li>✅ We generate your restaurant website</li>
            <li>✅ Automatically deploy to Netlify</li>
            <li>✅ Get instant global URL</li>
            <li>✅ No manual steps required!</li>
          </ul>
        </div>

        <button
          onClick={deployWebsite}
          disabled={deploying}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
        >
          {deploying ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deploying...
            </>
          ) : (
            "🚀 Deploy Website Automatically"
          )}
        </button>
      </div>
    );
  }

  if (deploymentStatus === "deployed") {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>

          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Website Deployed Successfully!
          </h3>

          <p className="text-green-700 mb-4">
            Your restaurant website is now live and accessible worldwide
          </p>

          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Your website URL:</p>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-600 hover:text-blue-800 break-all"
            >
              {websiteUrl}
            </a>
          </div>

          <div className="flex space-x-3 justify-center">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              🌐 Visit Website
            </a>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              🎉 Finish
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-red-800 mb-2">Deployment Failed</h4>
          <p className="text-red-700">{error}</p>
        </div>

        <button
          onClick={deployWebsite}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default AutomatedWebsiteDeployer;
