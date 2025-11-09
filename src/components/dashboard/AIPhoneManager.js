import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Settings,
  Bot,
  MessageSquare,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  Headphones,
  Zap,
  Brain,
  Waves,
  Plus,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  formatDuration,
} from "../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import { FormModal, ConfirmModal } from "../common/Modal";

const AIPhoneManager = ({ restaurant }) => {
  const [aiSettings, setAISettings] = useState({});
  const [callHistory, setCallHistory] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isListening, setIsListening] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchAIPhoneData();
    fetchAnalytics();
    initializeSpeechRecognition();

    // Set up real-time call monitoring
    const interval = setInterval(fetchActiveCall, 5000);
    return () => clearInterval(interval);
  }, []);

  const initializeSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          processVoiceCommand(lastResult[0].transcript);
        }
      };
    }
  };

  const fetchAIPhoneData = async () => {
    try {
      setLoading(true);

      const [settingsRes, callsRes, commandsRes, numbersRes] =
        await Promise.all([
          fetch("/api/ai-phone/settings", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/ai-phone/calls", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/ai-phone/voice-commands", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("/api/ai-phone/numbers", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      const [settingsData, callsData, commandsData, numbersData] =
        await Promise.all([
          settingsRes.json(),
          callsRes.json(),
          commandsRes.json(),
          numbersRes.json(),
        ]);

      if (settingsData.success) setAISettings(settingsData.settings);
      if (callsData.success) setCallHistory(callsData.calls);
      if (commandsData.success) setVoiceCommands(commandsData.commands);
      if (numbersData.success) setPhoneNumbers(numbersData.numbers);
    } catch (error) {
      console.error("Error fetching AI phone data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/ai-phone/analytics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching AI phone analytics:", error);
    }
  };

  const fetchActiveCall = async () => {
    try {
      const response = await fetch("/api/ai-phone/active-call", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        setActiveCall(data.call);
      }
    } catch (error) {
      console.error("Error fetching active call:", error);
    }
  };

  const toggleAIPhone = async () => {
    try {
      const response = await fetch("/api/ai-phone/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ enabled: !aiSettings.enabled }),
      });

      const data = await response.json();
      if (data.success) {
        setAISettings({ ...aiSettings, enabled: !aiSettings.enabled });
        alert(
          `AI Phone ${
            !aiSettings.enabled ? "enabled" : "disabled"
          } successfully!`
        );
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error toggling AI phone:", error);
      alert("Failed to toggle AI phone");
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = async (transcript) => {
    try {
      const response = await fetch("/api/ai-phone/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      if (data.success) {
        // Handle the processed command
        console.log("Command processed:", data.action);
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
    }
  };

  const playCallRecording = (recording) => {
    if (audioRef.current) {
      audioRef.current.src = recording.audioUrl;
      audioRef.current.play();
    }
  };

  const downloadCallRecording = (recording) => {
    const link = document.createElement("a");
    link.href = recording.audioUrl;
    link.download = `call-${recording.id}.mp3`;
    link.click();
  };

  const getCallStatusColor = (status) => {
    const colors = {
      answered: "bg-green-100 text-green-800",
      missed: "bg-red-100 text-red-800",
      ongoing: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getCallStatusIcon = (status) => {
    const icons = {
      answered: <PhoneIncoming className="w-4 h-4" />,
      missed: <PhoneMissed className="w-4 h-4" />,
      ongoing: <PhoneCall className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />,
    };
    return icons[status] || <Phone className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading AI phone system..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            AI Phone Answering
          </h2>
          <p className="text-gray-600">
            Intelligent phone system with voice AI and automated order
            processing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleAIPhone}
            className={`flex items-center px-4 py-2 rounded-lg ${
              aiSettings.enabled
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Bot className="w-4 h-4 mr-2" />
            {aiSettings.enabled ? "Disable AI" : "Enable AI"}
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* AI Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                aiSettings.enabled ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Bot
                className={`w-8 h-8 ${
                  aiSettings.enabled ? "text-green-600" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                AI Phone Assistant
              </h3>
              <p
                className={`text-lg font-medium ${
                  aiSettings.enabled ? "text-green-600" : "text-gray-500"
                }`}
              >
                {aiSettings.enabled ? "Active & Ready" : "Offline"}
              </p>
              <p className="text-sm text-gray-600">
                {aiSettings.enabled
                  ? "Answering calls and processing orders automatically"
                  : 'Click "Enable AI" to start answering calls'}
              </p>
            </div>
          </div>

          {activeCall && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium text-blue-900">
                  Call in Progress
                </span>
              </div>
              <p className="text-sm text-blue-700">
                From: {activeCall.callerNumber}
              </p>
              <p className="text-sm text-blue-700">
                Duration: {formatDuration(activeCall.duration)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalCalls || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Answered by AI
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.aiAnswered || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Phone Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.phoneOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.successRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Control Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Voice Control
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isListening
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 mr-2" />
            ) : (
              <Mic className="w-5 h-5 mr-2" />
            )}
            {isListening ? "Stop Listening" : "Start Voice Control"}
          </button>

          {isListening && (
            <div className="flex items-center space-x-2">
              <Waves className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-blue-600 font-medium">
                Listening for commands...
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Available Voice Commands:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>"Answer the phone"</div>
            <div>"Transfer to manager"</div>
            <div>"Take an order"</div>
            <div>"Check call status"</div>
            <div>"Play last recording"</div>
            <div>"Show call analytics"</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "calls", label: "Call History", icon: Phone },
              { id: "recordings", label: "Recordings", icon: Headphones },
              { id: "commands", label: "Voice Commands", icon: Mic },
              { id: "numbers", label: "Phone Numbers", icon: PhoneCall },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
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
            <AIPhoneDashboard analytics={analytics} aiSettings={aiSettings} />
          )}

          {activeTab === "calls" && (
            <CallHistoryTab
              calls={callHistory}
              onSelectCall={setSelectedCall}
              getCallStatusColor={getCallStatusColor}
              getCallStatusIcon={getCallStatusIcon}
            />
          )}

          {activeTab === "recordings" && (
            <RecordingsTab
              calls={callHistory.filter((call) => call.hasRecording)}
              onPlayRecording={playCallRecording}
              onDownloadRecording={downloadCallRecording}
            />
          )}

          {activeTab === "commands" && (
            <VoiceCommandsTab commands={voiceCommands} />
          )}

          {activeTab === "numbers" && (
            <PhoneNumbersTab numbers={phoneNumbers} />
          )}

          {activeTab === "analytics" && (
            <AIPhoneAnalyticsTab analytics={analytics} />
          )}
        </div>
      </div>

      {/* Audio Player */}
      <audio ref={audioRef} controls className="hidden" />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={aiSettings}
        onUpdate={setAISettings}
      />

      {/* Call Details Modal */}
      {selectedCall && (
        <CallDetailsModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          onPlayRecording={playCallRecording}
        />
      )}
    </div>
  );
};

// AI Phone Dashboard Component
const AIPhoneDashboard = ({ analytics, aiSettings }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Call Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Answer Rate</span>
              <span className="font-semibold">
                {analytics.answerRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Talk Time</span>
              <span className="font-semibold">
                {formatDuration(analytics.avgTalkTime || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Conversion</span>
              <span className="font-semibold">
                {analytics.orderConversion || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Satisfaction</span>
              <span className="font-semibold">
                {analytics.satisfaction || 0}/5
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Configuration
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Voice Model:</span>
              <span className="font-medium">
                {aiSettings.voiceModel || "Default"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium">
                {aiSettings.language || "English"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Call Duration:</span>
              <span className="font-medium">
                {aiSettings.maxDuration || 10} minutes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto Transfer:</span>
              <span className="font-medium">
                {aiSettings.autoTransfer ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Call answered and order processed
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(25.99)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Call History Tab Component
const CallHistoryTab = ({
  calls,
  onSelectCall,
  getCallStatusColor,
  getCallStatusIcon,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Call History</h3>
        <span className="text-sm text-gray-600">
          {calls.length} total calls
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Caller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calls.map((call) => (
              <tr key={call.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {call.callerName || "Unknown Caller"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {call.callerNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(call.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCallStatusColor(
                      call.status
                    )}`}
                  >
                    {getCallStatusIcon(call.status)}
                    <span className="ml-1 capitalize">{call.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {call.orderValue ? formatCurrency(call.orderValue) : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(call.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onSelectCall(call)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {calls.length === 0 && (
        <div className="text-center py-12">
          <Phone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No calls yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Call history will appear here as customers call your restaurant
          </p>
        </div>
      )}
    </div>
  );
};

// Recordings Tab Component
const RecordingsTab = ({ calls, onPlayRecording, onDownloadRecording }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Call Recordings</h3>
        <span className="text-sm text-gray-600">{calls.length} recordings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calls.map((call) => (
          <div key={call.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {call.callerName || call.callerNumber}
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDateTime(call.timestamp)}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {formatDuration(call.duration)}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  call.orderValue
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {call.orderValue ? formatCurrency(call.orderValue) : "No Order"}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onPlayRecording(call)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-1" />
                Play
              </button>
              <button
                onClick={() => onDownloadRecording(call)}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>

            {call.transcript && (
              <div className="mt-3 p-3 bg-white rounded border">
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Transcript:
                </h5>
                <p className="text-sm text-gray-600">{call.transcript}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {calls.length === 0 && (
        <div className="text-center py-12">
          <Headphones className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No recordings available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Call recordings will appear here when recording is enabled
          </p>
        </div>
      )}
    </div>
  );
};

// Voice Commands Tab Component
const VoiceCommandsTab = ({ commands }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Voice Commands</h3>
        <span className="text-sm text-gray-600">
          {commands.length} commands
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commands.map((command, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Mic className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">"{command.phrase}"</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{command.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Category: {command.category}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  command.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {command.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {commands.length === 0 && (
        <div className="text-center py-12">
          <Mic className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No voice commands configured
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Set up voice commands to control the AI phone system
          </p>
        </div>
      )}
    </div>
  );
};

// Phone Numbers Tab Component
const PhoneNumbersTab = ({ numbers }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Phone Numbers</h3>
        <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Number
        </button>
      </div>

      <div className="space-y-3">
        {numbers.map((number) => (
          <div
            key={number.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <PhoneCall className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">{number.number}</h4>
                <p className="text-sm text-gray-600">{number.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  number.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {number.status}
              </span>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {numbers.length === 0 && (
        <div className="text-center py-12">
          <PhoneCall className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No phone numbers configured
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add phone numbers for the AI system to answer
          </p>
        </div>
      )}
    </div>
  );
};

// AI Phone Analytics Tab Component
const AIPhoneAnalyticsTab = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Call Volume</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Today</span>
              <span className="font-medium">{analytics.callsToday || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-medium">
                {analytics.callsThisWeek || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium">
                {analytics.callsThisMonth || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">AI Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy Rate</span>
              <span className="font-medium">
                {analytics.accuracyRate || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">
                {analytics.responseTime || 0}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transfer Rate</span>
              <span className="font-medium">
                {analytics.transferRate || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Revenue Impact</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Orders via Phone</span>
              <span className="font-medium">{analytics.phoneOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Revenue</span>
              <span className="font-medium">
                {formatCurrency(analytics.phoneRevenue || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Order Value</span>
              <span className="font-medium">
                {formatCurrency(analytics.avgPhoneOrder || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Settings Modal Component
const AISettingsModal = ({ isOpen, onClose, settings, onUpdate }) => {
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/ai-phone/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        onUpdate(formData);
        onClose();
        alert("Settings updated successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="AI Phone Settings"
      submitText="Save Settings"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Model
            </label>
            <select
              value={formData.voiceModel || "default"}
              onChange={(e) =>
                setFormData({ ...formData, voiceModel: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="default">Default</option>
              <option value="natural">Natural</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language || "en"}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Call Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.maxDuration || 10}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDuration: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.confidenceThreshold || 80}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confidenceThreshold: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.autoTransfer || false}
              onChange={(e) =>
                setFormData({ ...formData, autoTransfer: e.target.checked })
              }
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Auto-transfer complex orders to staff
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.recordCalls || false}
              onChange={(e) =>
                setFormData({ ...formData, recordCalls: e.target.checked })
              }
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Record all calls for quality assurance
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enableTranscription || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  enableTranscription: e.target.checked,
                })
              }
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Enable real-time transcription
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Greeting Message
          </label>
          <textarea
            value={formData.greetingMessage || ""}
            onChange={(e) =>
              setFormData({ ...formData, greetingMessage: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Thank you for calling [Restaurant Name]. How can I help you today?"
          />
        </div>
      </div>
    </FormModal>
  );
};

// Call Details Modal Component
const CallDetailsModal = ({ call, onClose, onPlayRecording }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Call Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Caller
                </label>
                <p className="font-medium">
                  {call.callerName || call.callerNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Duration
                </label>
                <p className="font-medium">{formatDuration(call.duration)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <p className="font-medium">{call.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Order Value
                </label>
                <p className="font-medium">
                  {call.orderValue
                    ? formatCurrency(call.orderValue)
                    : "No order"}
                </p>
              </div>
            </div>

            {call.transcript && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Transcript
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{call.transcript}</p>
                </div>
              </div>
            )}

            {call.hasRecording && (
              <div className="flex space-x-3">
                <button
                  onClick={() => onPlayRecording(call)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Recording
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPhoneManager;
