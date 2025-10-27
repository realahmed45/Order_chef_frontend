import React from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$97",
      period: "/month",
      description: "Perfect for new restaurants and food trucks",
      features: [
        "Online ordering website",
        "QR code ordering",
        "Basic analytics",
        "Up to 500 orders/month",
        "Email support",
        "Cancel anytime",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$197",
      period: "/month",
      description: "Most popular - everything growing restaurants need",
      features: [
        "Everything in Starter",
        "WhatsApp + Instagram ordering",
        "Staff management",
        "Inventory tracking",
        "Unlimited orders",
        "Customer loyalty program",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$397",
      period: "/month",
      description: "For restaurant groups and high-volume operations",
      features: [
        "Everything in Pro",
        "Multi-location management",
        "AI phone answering",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 7-day free trial. No credit card required. Cancel
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.highlighted
                  ? "ring-2 ring-orange-500 transform scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="bg-orange-500 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold ${
                    plan.highlighted
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎁 Free 7-Day Trial Included
            </h2>
            <p className="text-gray-600 mb-6">
              Try all Pro features free for 7 days. No credit card required. You
              can downgrade to Starter or cancel anytime.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>All features included</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
