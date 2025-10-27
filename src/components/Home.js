import React from "react";
import { Link } from "react-router-dom";

const Home = ({ user }) => {
  const features = [
    {
      icon: "📱",
      title: "Beautiful Ordering Website",
      description:
        "Custom website that works on all devices. Customers can order directly from your brand.",
    },
    {
      icon: "👨‍🍳",
      title: "Smart Kitchen Display",
      description:
        "Color-coded orders tell your kitchen what to cook first. No more shouting or paper tickets.",
    },
    {
      icon: "📦",
      title: "Auto Inventory Tracking",
      description:
        "Every sale deducts ingredients automatically. Get alerts before you run out.",
    },
    {
      icon: "👥",
      title: "Customer & Loyalty System",
      description:
        "Build your customer list. Automatic loyalty points and marketing.",
    },
    {
      icon: "⏰",
      title: "Easy Staff Management",
      description:
        "Scheduling, time tracking, and shift swapping - all in one place.",
    },
    {
      icon: "📊",
      title: "Live Analytics Dashboard",
      description:
        "See sales, popular items, and profits in real-time. Make smarter decisions.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$97",
      period: "/month",
      description: "Perfect for new restaurants",
      features: [
        "Online Ordering Website",
        "QR Code Ordering",
        "Basic Analytics",
        "500 Orders/Month",
        "Email Support",
      ],
    },
    {
      name: "Pro",
      price: "$197",
      period: "/month",
      description: "Everything growing restaurants need",
      features: [
        "All Starter Features",
        "WhatsApp + Instagram Ordering",
        "Staff Management",
        "Inventory Tracking",
        "Unlimited Orders",
        "Loyalty Program",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$397",
      period: "/month",
      description: "For multi-location restaurants",
      features: [
        "All Pro Features",
        "Multi-Location Management",
        "AI Phone Answering",
        "Advanced Analytics",
        "Dedicated Support",
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Complete Restaurant Operating System
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            From menu to customer to kitchen to payment - fully automated in 5
            minutes. All 6 core features in one simple platform.
          </p>
          <div className="space-x-4">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Start 7-Day Free Trial
                </Link>
                <Link
                  to="/pricing"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600"
                >
                  View Pricing
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            No more juggling 6 different apps. OrderChef brings all restaurant
            operations together.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free for 7 days. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
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

                <div className="p-6">
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

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
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
            <p className="text-gray-600">
              All plans include 7-day free trial. No contracts, cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-8">
            Join the restaurants that automated their operations with OrderChef
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100"
            >
              Start Your 7-Day Free Trial
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
