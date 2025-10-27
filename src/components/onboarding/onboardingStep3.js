import React, { useState } from "react";
import WebsiteGenerator from "../WebsiteGenerator";

const OnboardingStep3 = ({ restaurant, onComplete }) => {
  const [websiteGenerated, setWebsiteGenerated] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(null);

  const handleGenerationComplete = (url) => {
    setWebsiteGenerated(true);
    setWebsiteUrl(url);
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🌐</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Get Your Website Live!
        </h1>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate your restaurant website and get a global URL in 2 minutes. No
          technical skills needed!
        </p>
      </div>

      <WebsiteGenerator
        restaurant={restaurant}
        onComplete={handleGenerationComplete}
      />

      {websiteGenerated && (
        <div className="text-center mt-8">
          <button
            onClick={handleFinish}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            🎉 Finish Setup & Go to Dashboard
          </button>

          <div className="mt-4 text-sm text-gray-600">
            Your website will be available at: <strong>{websiteUrl}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep3;
