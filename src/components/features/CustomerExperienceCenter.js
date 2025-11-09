import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  MessageCircle,
  Send,
  Phone,
  Mail,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Clock,
  User,
  Heart,
  Share2,
  Download,
  Eye,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Smartphone,
  Globe,
  Zap,
  Gift,
  Target,
  Users,
  Calendar,
  Bell,
  Settings,
} from "lucide-react";
import { formatDateTime, formatDate, formatCurrency } from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const CustomerExperienceCenter = ({ restaurant }) => {
  const [reviews, setReviews] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [orderTracking, setOrderTracking] = useState([]);
  const [mobileAppData, setMobileAppData] = useState({});

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const chatEndRef = useRef(null);

  const [feedbackForm, setFeedbackForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    category: "",
    subject: "",
    message: "",
    orderNumber: "",
    priority: "medium",
  });

  const [campaignForm, setCampaignForm] = useState({
    name: "",
    subject: "",
    content: "",
    targetSegment: "all",
    scheduledDate: "",
    template: "promotion",
    variables: {},
  });

  const feedbackCategories = [
    "Food Quality",
    "Service",
    "Delivery",
    "Pricing",
    "Ambiance",
    "Cleanliness",
    "Other",
  ];

  const supportPriorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  const campaignTemplates = [
    "Welcome",
    "Promotion",
    "Birthday",
    "Feedback Request",
    "Loyalty Reward",
    "Event Announcement",
  ];

  useEffect(() => {
    fetchCustomerData();

    // Set up real-time chat updates
    const chatInterval = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);

      const [
        reviewsRes,
        supportRes,
        chatRes,
        campaignsRes,
        feedbackRes,
        trackingRes,
        mobileRes,
      ] = await Promise.all([
        fetch("/api/customer/reviews", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/customer/support-tickets", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/customer/chat-messages", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/customer/email-campaigns", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/customer/feedback", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/customer/order-tracking", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/customer/mobile-app-stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const [
        reviewsData,
        supportData,
        chatData,
        campaignsData,
        feedbackData,
        trackingData,
        mobileData,
      ] = await Promise.all([
        reviewsRes.json(),
        supportRes.json(),
        chatRes.json(),
        campaignsRes.json(),
        feedbackRes.json(),
        trackingRes.json(),
        mobileRes.json(),
      ]);

      if (reviewsData.success) setReviews(reviewsData.reviews);
      if (supportData.success) setSupportTickets(supportData.tickets);
      if (chatData.success) setChatMessages(chatData.messages);
      if (campaignsData.success) setEmailCampaigns(campaignsData.campaigns);
      if (feedbackData.success) setCustomerFeedback(feedbackData.feedback);
      if (trackingData.success) setOrderTracking(trackingData.orders);
      if (mobileData.success) setMobileAppData(mobileData.stats);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    if (!activeChatRoom) return;

    try {
      const response = await fetch(
        `/api/customer/chat-messages/${activeChatRoom}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setChatMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatRoom) return;

    try {
      const response = await fetch("/api/customer/chat-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          chatRoomId: activeChatRoom,
          message: newMessage,
          sender: "staff",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage("");
        await fetchChatMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/customer/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(feedbackForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCustomerData();
        resetFeedbackForm();
        alert("Feedback submitted successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/customer/email-campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(campaignForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCustomerData();
        resetCampaignForm();
        alert("Email campaign created successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign");
    }
  };

  const respondToReview = async (reviewId, response) => {
    try {
      const apiResponse = await fetch(
        `/api/customer/reviews/${reviewId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ response }),
        }
      );

      const data = await apiResponse.json();
      if (data.success) {
        await fetchCustomerData();
        alert("Response posted successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error responding to review:", error);
      alert("Failed to post response");
    }
  };

  const resetFeedbackForm = () => {
    setFeedbackForm({
      customerName: "",
      customerEmail: "",
      rating: 5,
      category: "",
      subject: "",
      message: "",
      orderNumber: "",
      priority: "medium",
    });
    setShowFeedbackModal(false);
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      name: "",
      subject: "",
      content: "",
      targetSegment: "all",
      scheduledDate: "",
      template: "promotion",
      variables: {},
    });
    setShowCampaignModal(false);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading customer data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Experience Center
          </h2>
          <p className="text-gray-600">
            Manage reviews, support, feedback, and customer communications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Feedback
          </button>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {getAverageRating()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Support Tickets
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {supportTickets.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mobile Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {mobileAppData.totalUsers || 0}
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
              { id: "reviews", label: "Reviews & Ratings", icon: Star },
              { id: "support", label: "Customer Support", icon: MessageCircle },
              { id: "chat", label: "Live Chat", icon: MessageSquare },
              { id: "tracking", label: "Order Tracking", icon: MapPin },
              { id: "feedback", label: "Feedback", icon: ThumbsUp },
              { id: "email", label: "Email Marketing", icon: Mail },
              { id: "mobile", label: "Mobile App", icon: Smartphone },
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
            <CustomerDashboard
              reviews={reviews}
              supportTickets={supportTickets}
              customerFeedback={customerFeedback}
              mobileAppData={mobileAppData}
              emailCampaigns={emailCampaigns}
              getRatingDistribution={getRatingDistribution}
              getAverageRating={getAverageRating}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsManager
              reviews={reviews}
              onRespond={respondToReview}
              getRatingDistribution={getRatingDistribution}
              getAverageRating={getAverageRating}
            />
          )}

          {activeTab === "support" && (
            <SupportTickets
              tickets={supportTickets}
              supportPriorities={supportPriorities}
            />
          )}

          {activeTab === "chat" && (
            <LiveChatManager
              chatMessages={chatMessages}
              activeChatRoom={activeChatRoom}
              setActiveChatRoom={setActiveChatRoom}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              chatEndRef={chatEndRef}
            />
          )}

          {activeTab === "tracking" && (
            <OrderTrackingCenter orderTracking={orderTracking} />
          )}

          {activeTab === "feedback" && (
            <FeedbackCenter
              customerFeedback={customerFeedback}
              feedbackCategories={feedbackCategories}
            />
          )}

          {activeTab === "email" && (
            <EmailMarketingCenter
              emailCampaigns={emailCampaigns}
              campaignTemplates={campaignTemplates}
            />
          )}

          {activeTab === "mobile" && (
            <MobileAppCenter mobileAppData={mobileAppData} />
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FormModal
        isOpen={showFeedbackModal}
        onClose={resetFeedbackForm}
        onSubmit={handleSubmitFeedback}
        title="Submit Customer Feedback"
        submitText="Submit Feedback"
        size="lg"
      >
        <FeedbackForm
          feedbackForm={feedbackForm}
          setFeedbackForm={setFeedbackForm}
          feedbackCategories={feedbackCategories}
          supportPriorities={supportPriorities}
        />
      </FormModal>

      {/* Campaign Modal */}
      <FormModal
        isOpen={showCampaignModal}
        onClose={resetCampaignForm}
        onSubmit={handleCreateCampaign}
        title="Create Email Campaign"
        submitText="Create Campaign"
        size="xl"
      >
        <CampaignForm
          campaignForm={campaignForm}
          setCampaignForm={setCampaignForm}
          campaignTemplates={campaignTemplates}
        />
      </FormModal>
    </div>
  );
};

// Customer Dashboard Component
const CustomerDashboard = ({
  reviews,
  supportTickets,
  customerFeedback,
  mobileAppData,
  emailCampaigns,
  getRatingDistribution,
  getAverageRating,
}) => {
  const ratingDistribution = getRatingDistribution();
  const recentReviews = reviews.slice(0, 5);
  const pendingTickets = supportTickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Average Rating</p>
              <p className="text-3xl font-bold">{getAverageRating()}</p>
              <p className="text-yellow-100">out of 5.0</p>
            </div>
            <Star className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Customer Satisfaction</p>
              <p className="text-3xl font-bold">92%</p>
              <p className="text-blue-100">this month</p>
            </div>
            <ThumbsUp className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Response Time</p>
              <p className="text-3xl font-bold">2.5h</p>
              <p className="text-green-100">average</p>
            </div>
            <Clock className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rating Distribution
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${
                      reviews.length > 0
                        ? (ratingDistribution[rating] / reviews.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12">
                {ratingDistribution[rating]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Reviews
          </h3>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="border-l-4 border-yellow-400 pl-4"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {review.customerName}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {review.comment}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(review.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Support Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-800">Pending Tickets</span>
              <span className="font-bold text-red-900">{pendingTickets}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-800">Resolved Today</span>
              <span className="font-bold text-green-900">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-800">Customer Satisfaction</span>
              <span className="font-bold text-blue-900">4.8/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App & Email Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mobile App Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Downloads:</span>
              <span className="font-medium">
                {mobileAppData.totalDownloads || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Users:</span>
              <span className="font-medium">
                {mobileAppData.activeUsers || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">App Rating:</span>
              <span className="font-medium">{mobileAppData.rating || 0}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Orders via App:</span>
              <span className="font-medium">
                {mobileAppData.ordersViaApp || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Email Marketing
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Campaigns:</span>
              <span className="font-medium">
                {emailCampaigns.filter((c) => c.status === "active").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Open Rate:</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Click Rate:</span>
              <span className="font-medium">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subscribers:</span>
              <span className="font-medium">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reviews Manager Component
const ReviewsManager = ({
  reviews,
  onRespond,
  getRatingDistribution,
  getAverageRating,
}) => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState("");

  const handleRespond = async () => {
    if (!responseText.trim() || !selectedReview) return;

    await onRespond(selectedReview.id, responseText);
    setSelectedReview(null);
    setResponseText("");
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Reviews & Ratings
          </h3>
          <p className="text-gray-600">
            Manage and respond to customer feedback
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {getAverageRating()}
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(getAverageRating())
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">{reviews.length} reviews</div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.customerName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Respond
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {review.response && (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-400">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Restaurant Response
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{review.response}</p>
              </div>
            )}

            {review.orderNumber && (
              <div className="mt-4 text-sm text-gray-500">
                Order #{review.orderNumber}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Respond to Review
                </h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedReview.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">
                    {selectedReview.customerName}
                  </span>
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Thank you for your feedback..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRespond}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Post Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Additional tab components would continue here...
// Including SupportTickets, LiveChatManager, OrderTrackingCenter, etc.

// Feedback Form Component
const FeedbackForm = ({
  feedbackForm,
  setFeedbackForm,
  feedbackCategories,
  supportPriorities,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            value={feedbackForm.customerName}
            onChange={(e) =>
              setFeedbackForm({ ...feedbackForm, customerName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={feedbackForm.customerEmail}
            onChange={(e) =>
              setFeedbackForm({
                ...feedbackForm,
                customerEmail: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <select
            value={feedbackForm.rating}
            onChange={(e) =>
              setFeedbackForm({
                ...feedbackForm,
                rating: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={feedbackForm.category}
            onChange={(e) =>
              setFeedbackForm({ ...feedbackForm, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">Select Category</option>
            {feedbackCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Number
          </label>
          <input
            type="text"
            value={feedbackForm.orderNumber}
            onChange={(e) =>
              setFeedbackForm({ ...feedbackForm, orderNumber: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="ORD-123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={feedbackForm.priority}
            onChange={(e) =>
              setFeedbackForm({ ...feedbackForm, priority: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {supportPriorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          value={feedbackForm.subject}
          onChange={(e) =>
            setFeedbackForm({ ...feedbackForm, subject: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Brief description of the feedback"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          value={feedbackForm.message}
          onChange={(e) =>
            setFeedbackForm({ ...feedbackForm, message: e.target.value })
          }
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Detailed feedback message..."
          required
        />
      </div>
    </div>
  );
};

// Campaign Form Component
const CampaignForm = ({ campaignForm, setCampaignForm, campaignTemplates }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name *
          </label>
          <input
            type="text"
            value={campaignForm.name}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Summer Special Campaign"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template
          </label>
          <select
            value={campaignForm.template}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, template: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {campaignTemplates.map((template) => (
              <option key={template} value={template.toLowerCase()}>
                {template}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Segment
          </label>
          <select
            value={campaignForm.targetSegment}
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                targetSegment: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Customers</option>
            <option value="new">New Customers</option>
            <option value="loyal">Loyal Customers</option>
            <option value="inactive">Inactive Customers</option>
            <option value="vip">VIP Customers</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scheduled Date
          </label>
          <input
            type="datetime-local"
            value={campaignForm.scheduledDate}
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                scheduledDate: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line *
        </label>
        <input
          type="text"
          value={campaignForm.subject}
          onChange={(e) =>
            setCampaignForm({ ...campaignForm, subject: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="🍕 Special Offer Just for You!"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Content *
        </label>
        <textarea
          value={campaignForm.content}
          onChange={(e) =>
            setCampaignForm({ ...campaignForm, content: e.target.value })
          }
          rows="8"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="Dear {customer_name}, we have an exciting offer for you..."
          required
        />
      </div>
    </div>
  );
};

// Missing Components - Added as stubs
const SupportTickets = ({ tickets, supportPriorities }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">Support Tickets</h3>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          New Ticket
        </button>
      </div>
    </div>

    <div className="space-y-4">
      {tickets && tickets.length > 0 ? (
        tickets.slice(0, 5).map((ticket, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  #{ticket.id || index + 1} -{" "}
                  {ticket.subject || "Support Request"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {ticket.description || "Customer needs assistance"}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ticket.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : ticket.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {ticket.priority || "Low"}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No support tickets available</p>
          <p className="text-sm text-gray-400 mt-1">
            Support ticket management coming soon...
          </p>
        </div>
      )}
    </div>
  </div>
);

const LiveChatManager = ({
  chatMessages,
  activeChatRoom,
  setActiveChatRoom,
  newMessage,
  setNewMessage,
  onSendMessage,
  chatEndRef,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">Live Chat Manager</h3>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Active Rooms: {activeChatRoom ? 1 : 0}
        </span>
        <div
          className={`w-2 h-2 rounded-full ${
            activeChatRoom ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
      </div>
    </div>

    <div className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto mb-4">
      {chatMessages && chatMessages.length > 0 ? (
        <div className="space-y-3">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "customer" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender === "customer"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-orange-500 text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp
                    ? new Date(message.timestamp).toLocaleTimeString()
                    : "Now"}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No active chat sessions</p>
        </div>
      )}
    </div>

    <div className="flex space-x-2">
      <input
        type="text"
        value={newMessage || ""}
        onChange={(e) => setNewMessage && setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        onKeyPress={(e) =>
          e.key === "Enter" && onSendMessage && onSendMessage()
        }
      />
      <button
        onClick={() => onSendMessage && onSendMessage()}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
      >
        Send
      </button>
    </div>
  </div>
);

const OrderTrackingCenter = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">
        Order Tracking Center
      </h3>
      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        Refresh Tracking
      </button>
    </div>

    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Real-time Order Tracking</h4>
        <p className="text-sm text-gray-600 mt-2">
          Track customer orders in real-time with SMS and email notifications.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-lg font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-600">Preparing</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-lg font-bold text-orange-600">5</p>
            <p className="text-xs text-gray-600">Out for Delivery</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-lg font-bold text-green-600">23</p>
            <p className="text-xs text-gray-600">Delivered Today</p>
          </div>
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-gray-500">
          Advanced order tracking features coming soon...
        </p>
      </div>
    </div>
  </div>
);

const FeedbackCenter = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">
        Customer Feedback Center
      </h3>
      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        View All Feedback
      </button>
    </div>

    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Recent Feedback</h4>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">
                ⭐⭐⭐⭐⭐ Excellent service!
              </p>
              <p className="text-sm text-green-600">
                Food was amazing, fast delivery
              </p>
            </div>
            <span className="text-xs text-green-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="font-medium text-yellow-800">⭐⭐⭐⭐ Good food</p>
              <p className="text-sm text-yellow-600">Could improve packaging</p>
            </div>
            <span className="text-xs text-yellow-500">5 hours ago</span>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-500">
          Advanced feedback management coming soon...
        </p>
      </div>
    </div>
  </div>
);

const EmailMarketingCenter = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">
        Email Marketing Center
      </h3>
      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        Create Campaign
      </button>
    </div>

    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">2,345</p>
          <p className="text-sm text-gray-600">Subscribers</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">24%</p>
          <p className="text-sm text-gray-600">Open Rate</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">8</p>
          <p className="text-sm text-gray-600">Active Campaigns</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">Recent Campaigns</h4>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium">Weekend Special Offers</span>
            <span className="text-xs text-gray-500">Sent 2 days ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium">New Menu Launch</span>
            <span className="text-xs text-gray-500">Sent 1 week ago</span>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-500">
          Advanced email marketing tools coming soon...
        </p>
      </div>
    </div>
  </div>
);

const MobileAppCenter = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-medium text-gray-900">Mobile App Center</h3>
      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        App Settings
      </button>
    </div>

    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">1,234</p>
          <p className="text-sm text-gray-600">App Downloads</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">89%</p>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900">App Features</h4>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Push Notifications</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Offline Mode</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Beta
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Loyalty Integration</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-500">
          Advanced mobile app features coming soon...
        </p>
      </div>
    </div>
  </div>
);

export default CustomerExperienceCenter;
