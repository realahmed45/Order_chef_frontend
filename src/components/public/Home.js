import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon, CheckIcon } from "@heroicons/react/24/outline";

const Home = ({ user }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: "🌐",
      title: "Beautiful Online Ordering Website",
      description:
        "Custom-branded website that works perfectly on all devices. Your customers order directly from your brand, not a third party.",
      benefits: [
        "Mobile-optimized design",
        "Custom branding",
        "SEO optimized",
        "Social media integration",
      ],
    },
    {
      icon: "👨‍🍳",
      title: "Smart Kitchen Display System",
      description:
        "Color-coded orders that tell your kitchen staff exactly what to cook and when. Eliminate confusion and speed up service.",
      benefits: [
        "Real-time order tracking",
        "Priority alerts",
        "Prep time optimization",
        "Staff coordination",
      ],
    },
    {
      icon: "📦",
      title: "Automatic Inventory Management",
      description:
        "Every sale automatically deducts ingredients. Get low-stock alerts before you run out of popular items.",
      benefits: [
        "Auto-deduction",
        "Smart alerts",
        "Cost tracking",
        "Waste reduction",
      ],
    },
    {
      icon: "👥",
      title: "Customer Loyalty & Analytics",
      description:
        "Build your customer database automatically. Track preferences, send promotions, and increase repeat orders.",
      benefits: [
        "Customer profiles",
        "Loyalty points",
        "Targeted marketing",
        "Behavior analytics",
      ],
    },
    {
      icon: "📊",
      title: "Real-Time Business Analytics",
      description:
        "See your sales, popular items, and profits in real-time. Make data-driven decisions to grow your business.",
      benefits: [
        "Live dashboard",
        "Sales reports",
        "Performance metrics",
        "Trend analysis",
      ],
    },
    {
      icon: "🔧",
      title: "Complete Staff Management",
      description:
        "Schedule shifts, track time, manage roles, and streamline communication - all in one integrated platform.",
      benefits: [
        "Shift scheduling",
        "Time tracking",
        "Role management",
        "Team communication",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      restaurant: "Bella's Italian Kitchen",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b9e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      quote:
        "OrderChef transformed our business. We went from 50 orders a day to 200+ orders within 2 months. The kitchen display system alone saved us 2 hours daily.",
      metrics: "300% increase in orders",
    },
    {
      name: "James Chen",
      restaurant: "Dragon Bowl Express",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      quote:
        "The automated inventory tracking has saved us thousands in food waste. We always know exactly what we need to order and when.",
      metrics: "40% reduction in food waste",
    },
    {
      name: "Sarah Johnson",
      restaurant: "Sunrise Cafe",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      quote:
        "Our customers love the easy ordering experience. The loyalty program has increased our repeat customers by 60%.",
      metrics: "60% more repeat customers",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: 97,
      period: "month",
      description: "Perfect for new restaurants getting started",
      popular: false,
      features: [
        "Professional ordering website",
        "QR code ordering system",
        "Basic analytics dashboard",
        "Up to 500 orders/month",
        "Email support",
        "Mobile app access",
      ],
      limitations: ["Limited customization", "Basic reporting"],
    },
    {
      name: "Professional",
      price: 197,
      period: "month",
      description: "Everything growing restaurants need to scale",
      popular: true,
      features: [
        "Everything in Starter plan",
        "WhatsApp & Instagram integration",
        "Complete staff management",
        "Advanced inventory tracking",
        "Unlimited orders",
        "Customer loyalty program",
        "Priority support",
        "Advanced analytics",
      ],
      limitations: [],
    },
    {
      name: "Enterprise",
      price: 397,
      period: "month",
      description: "For restaurant groups and high-volume operations",
      popular: false,
      features: [
        "Everything in Professional plan",
        "Multi-location management",
        "AI-powered insights",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom training sessions",
      ],
      limitations: [],
    },
  ];

  const stats = [
    { number: "10,000+", label: "Orders Processed Daily" },
    { number: "500+", label: "Happy Restaurants" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "35%", label: "Average Revenue Increase" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  Now serving 500+ restaurants
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Complete
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {" "}
                  Restaurant Operating System
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop juggling 6 different apps. OrderChef brings everything
                together - from online ordering to kitchen management to
                customer loyalty - in one beautiful, easy-to-use platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Start Free 7-Day Trial
                      <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="#demo"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-orange-600 hover:text-orange-600 transition-all duration-200"
                    >
                      Watch Demo
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard
                    <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                No credit card required • Cancel anytime • Setup in 5 minutes
              </div>
            </div>

            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Bella's Kitchen
                          </h3>
                          <p className="text-sm text-gray-500">
                            Live Dashboard
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Live</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          47
                        </div>
                        <div className="text-sm text-gray-600">
                          Orders Today
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          $1,247
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-yellow-600">⏰</span>
                          <span className="text-sm font-medium">
                            Order #1247
                          </span>
                        </div>
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-600">👨‍🍳</span>
                          <span className="text-sm font-medium">
                            Order #1246
                          </span>
                        </div>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                          COOKING
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-green-600">✅</span>
                          <span className="text-sm font-medium">
                            Order #1245
                          </span>
                        </div>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                          READY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in{" "}
              <span className="text-orange-600">One Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop paying for multiple disconnected tools. OrderChef brings all
              your restaurant operations together in one beautifully designed,
              easy-to-use system.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Restaurant Owners
            </h2>
            <p className="text-xl text-gray-600">
              See how OrderChef is transforming businesses just like yours
            </p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <blockquote className="text-xl lg:text-2xl text-gray-900 leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        Owner, {testimonials[currentTestimonial].restaurant}
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        📈 {testimonials[currentTestimonial].metrics}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial
                      ? "bg-orange-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with a free trial. No contracts, cancel anytime.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "border-orange-500 transform scale-105"
                    : "border-gray-100 hover:border-orange-200"
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 text-sm font-semibold">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    {plan.name === "Starter" && (
                      <p className="text-sm text-gray-500">
                        $0 for first 7 days
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl"
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
            <div className="inline-flex items-center space-x-6 text-sm text-gray-600 bg-white rounded-xl px-6 py-4 shadow-md">
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                7-day free trial
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Join thousands of restaurants that have automated their operations
            and increased revenue with OrderChef. Setup takes less than 5
            minutes.
          </p>

          {!user && (
            <div className="space-y-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white text-orange-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
              >
                Start Your Free Trial Now
                <ChevronRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-orange-100 text-sm">
                No credit card required • Full access for 7 days • Setup in 5
                minutes
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
