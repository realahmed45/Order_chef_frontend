import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Star,
  Send,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Settings,
  Archive,
  Tag,
  Users,
  BarChart3
} from 'lucide-react';

// Support Tickets Component
const SupportTickets = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Login Issues',
      customer: 'John Doe',
      email: 'john@example.com',
      priority: 'High',
      status: 'Open',
      category: 'Technical',
      assignedTo: 'Sarah Wilson',
      createdAt: '2024-10-29T08:30:00Z',
      lastUpdate: '2024-10-29T14:20:00Z',
      description: 'Customer unable to login to their account despite correct credentials.',
      responses: 3
    },
    {
      id: 'TKT-002',
      subject: 'Billing Question',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      priority: 'Medium',
      status: 'In Progress',
      category: 'Billing',
      assignedTo: 'Mike Johnson',
      createdAt: '2024-10-28T15:45:00Z',
      lastUpdate: '2024-10-29T09:15:00Z',
      description: 'Customer questioning charges on their latest invoice.',
      responses: 5
    },
    {
      id: 'TKT-003',
      subject: 'Feature Request',
      customer: 'Bob Wilson',
      email: 'bob@example.com',
      priority: 'Low',
      status: 'Closed',
      category: 'Feature Request',
      assignedTo: 'Emily Davis',
      createdAt: '2024-10-27T10:20:00Z',
      lastUpdate: '2024-10-29T16:30:00Z',
      description: 'Customer requesting dark mode feature for the mobile app.',
      responses: 2
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    customer: '',
    email: '',
    priority: 'Medium',
    category: 'General',
    description: ''
  });

  const [newResponse, setNewResponse] = useState('');

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Open', 'In Progress', 'Pending', 'Closed'];
  const categories = ['Technical', 'Billing', 'General', 'Feature Request', 'Bug Report'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateTicket = () => {
    const ticket = {
      ...newTicket,
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      status: 'Open',
      assignedTo: 'Unassigned',
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      responses: 0
    };
    setTickets([...tickets, ticket]);
    setNewTicket({
      subject: '',
      customer: '',
      email: '',
      priority: 'Medium',
      category: 'General',
      description: ''
    });
    setShowTicketForm(false);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, lastUpdate: new Date().toISOString() }
        : ticket
    ));
  };

  const handleAddResponse = (ticketId) => {
    if (!newResponse.trim()) return;
    
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            responses: ticket.responses + 1,
            lastUpdate: new Date().toISOString()
          }
        : ticket
    ));
    setNewResponse('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <p className="text-sm text-gray-600">Manage customer support requests</p>
        </div>
        <button
          onClick={() => setShowTicketForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                      <div className="text-sm text-gray-500">{ticket.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.customer}</div>
                      <div className="text-sm text-gray-500">{ticket.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${getStatusColor(ticket.status)}`}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.lastUpdate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Ticket</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={newTicket.customer}
                    onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newTicket.email}
                    onChange={(e) => setNewTicket({ ...newTicket, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Create Ticket
              </button>
              <button
                onClick={() => setShowTicketForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTicket.id}: {selectedTicket.subject}</h3>
                <p className="text-sm text-gray-600">Created by {selectedTicket.customer} on {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Add Response</h4>
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Type your response..."
                  />
                  <button
                    onClick={() => handleAddResponse(selectedTicket.id)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Response
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Ticket Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-900">{selectedTicket.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="text-gray-900">{selectedTicket.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Responses:</span>
                      <span className="text-gray-900">{selectedTicket.responses}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedTicket.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedTicket.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Live Chat Manager Component
const LiveChatManager = () => {
  const [activeChats, setActiveChats] = useState([
    {
      id: 'chat-001',
      customer: 'Alice Johnson',
      email: 'alice@example.com',
      status: 'active',
      agent: 'Sarah Wilson',
      startTime: '2024-10-29T14:30:00Z',
      lastMessage: 'Thank you for your help!',
      lastMessageTime: '2024-10-29T14:45:00Z',
      messageCount: 12,
      waitTime: '2m 15s',
      priority: 'Medium'
    },
    {
      id: 'chat-002',
      customer: 'Bob Smith',
      email: 'bob@example.com',
      status: 'waiting',
      agent: null,
      startTime: '2024-10-29T14:50:00Z',
      lastMessage: 'I need help with my order',
      lastMessageTime: '2024-10-29T14:50:00Z',
      messageCount: 3,
      waitTime: '5m 30s',
      priority: 'High'
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({
    'chat-001': [
      { id: 1, sender: 'customer', message: 'Hi, I need help with my account', time: '14:30' },
      { id: 2, sender: 'agent', message: 'Hello! I\'d be happy to help you with your account. What specific issue are you experiencing?', time: '14:31' },
      { id: 3, sender: 'customer', message: 'I can\'t access my purchase history', time: '14:32' },
      { id: 4, sender: 'agent', message: 'I understand. Let me check your account details. Can you please confirm your email address?', time: '14:33' },
      { id: 5, sender: 'customer', message: 'alice@example.com', time: '14:34' },
      { id: 6, sender: 'agent', message: 'Thank you. I can see your account. It looks like there was a temporary issue. I\'ve refreshed your access. Please try logging in again.', time: '14:35' },
      { id: 7, sender: 'customer', message: 'That worked! Thank you for your help!', time: '14:45' }
    ],
    'chat-002': [
      { id: 1, sender: 'customer', message: 'I need help with my order', time: '14:50' },
      { id: 2, sender: 'customer', message: 'Order #12345', time: '14:50' },
      { id: 3, sender: 'customer', message: 'When will it arrive?', time: '14:51' }
    ]
  });

  const [newMessage, setNewMessage] = useState('');
  const [quickReplies] = useState([
    'Thank you for contacting us. How can I help you today?',
    'I understand your concern. Let me look into this for you.',
    'I\'ve updated your information. Is there anything else I can help you with?',
    'Your issue has been resolved. Please let me know if you need further assistance.',
    'I\'m transferring your chat to a specialist who can better assist you.'
  ]);

  const [chatStats] = useState({
    totalChats: 47,
    activeChats: 5,
    waitingChats: 2,
    avgWaitTime: '3m 45s',
    avgResponseTime: '1m 12s',
    satisfactionScore: 4.8
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now(),
      sender: 'agent',
      message: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), message]
    }));

    setActiveChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: newMessage, lastMessageTime: new Date().toISOString(), messageCount: chat.messageCount + 1 }
        : chat
    ));

    setNewMessage('');
  };

  const handleAssignChat = (chatId, agentName) => {
    setActiveChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, agent: agentName, status: 'active' }
        : chat
    ));
  };

  const handleEndChat = (chatId) => {
    setActiveChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, status: 'ended' }
        : chat
    ));
    setSelectedChat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Chat Manager</h3>
          <p className="text-sm text-gray-600">Manage real-time customer conversations</p>
        </div>
      </div>

      {/* Chat Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Chats</p>
              <p className="text-lg font-semibold text-gray-900">{chatStats.totalChats}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-lg font-semibold text-gray-900">{chatStats.activeChats}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Waiting</p>
              <p className="text-lg font-semibold text-gray-900">{chatStats.waitingChats}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Wait</p>
              <p className="text-lg font-semibold text-gray-900">{chatStats.avgWaitTime}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Response Time</p>
              <p className="text-lg font-semibold text-gray-900">{chatStats.avgResponseTime}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Satisfaction</p>
              <p className="text-lg font-semibold text-gray-900">{chatStats.satisfactionScore}/5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Active Conversations</h4>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{chat.customer}</p>
                      <p className="text-sm text-gray-500">{chat.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                        {chat.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(chat.priority)}`}>
                        {chat.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Wait: {chat.waitTime}</span>
                    <span>{chat.messageCount} messages</span>
                  </div>
                  {chat.agent && (
                    <p className="text-xs text-gray-500 mt-1">Agent: {chat.agent}</p>
                  )}
                  {!chat.agent && chat.status === 'waiting' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignChat(chat.id, 'Current User');
                      }}
                      className="mt-2 w-full px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                    >
                      Accept Chat
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <div className="bg-white rounded-lg border border-gray-200 h-96">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedChat.customer}</h4>
                  <p className="text-sm text-gray-500">{selectedChat.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEndChat(selectedChat.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    End Chat
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {(chatMessages[selectedChat.id] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'agent'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'agent' ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 mb-2">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => setNewMessage(reply)}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 truncate max-w-48"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Tracking Center Component
const OrderTrackingCenter = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      status: 'shipped',
      total: '$299.99',
      orderDate: '2024-10-25T10:30:00Z',
      estimatedDelivery: '2024-10-30T18:00:00Z',
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: '$199.99' },
        { name: 'Phone Case', quantity: 2, price: '$49.99' }
      ],
      timeline: [
        { status: 'Order Placed', date: '2024-10-25T10:30:00Z', completed: true },
        { status: 'Processing', date: '2024-10-25T14:00:00Z', completed: true },
        { status: 'Shipped', date: '2024-10-26T09:15:00Z', completed: true },
        { status: 'In Transit', date: '2024-10-27T08:30:00Z', completed: true },
        { status: 'Out for Delivery', date: null, completed: false },
        { status: 'Delivered', date: null, completed: false }
      ],
      shippingAddress: '123 Main St, Anytown, ST 12345',
      paymentMethod: '**** 1234'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      status: 'processing',
      total: '$149.99',
      orderDate: '2024-10-28T15:45:00Z',
      estimatedDelivery: '2024-11-02T18:00:00Z',
      trackingNumber: null,
      carrier: null,
      items: [
        { name: 'Bluetooth Speaker', quantity: 1, price: '$149.99' }
      ],
      timeline: [
        { status: 'Order Placed', date: '2024-10-28T15:45:00Z', completed: true },
        { status: 'Processing', date: '2024-10-28T16:00:00Z', completed: true },
        { status: 'Shipped', date: null, completed: false },
        { status: 'In Transit', date: null, completed: false },
        { status: 'Out for Delivery', date: null, completed: false },
        { status: 'Delivered', date: null, completed: false }
      ],
      shippingAddress: '456 Oak Ave, Another City, ST 67890',
      paymentMethod: '**** 5678'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orderStatuses = ['processing', 'shipped', 'in_transit', 'delivered', 'cancelled'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId, newStatus, trackingNumber = null) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (trackingNumber) {
          updatedOrder.trackingNumber = trackingNumber;
          updatedOrder.carrier = 'FedEx';
        }
        return updatedOrder;
      }
      return order;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order Tracking Center</h3>
          <p className="text-sm text-gray-600">Monitor and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{order.id}</h4>
                <p className="text-sm text-gray-600">{order.customer}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-gray-900">{order.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Delivery:</span>
                <span className="text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className="text-gray-900 font-mono text-xs">{order.trackingNumber}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <h5 className="font-medium text-gray-900 text-sm">Items:</h5>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x{item.quantity}</span>
                  <span className="text-gray-900">{item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
              >
                View Details
              </button>
              {order.status === 'processing' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'shipped', `TRK${Date.now()}`)}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Ship
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order {selectedOrder.id}</h3>
                <p className="text-sm text-gray-600">Order details and tracking information</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900">{item.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                      <span className="font-medium text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-gray-900">{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.trackingNumber && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Shipping Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier:</span>
                        <span className="text-gray-900">{selectedOrder.carrier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="text-gray-900 font-mono">{selectedOrder.trackingNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Timeline */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Order Timeline</h4>
                <div className="space-y-4">
                  {selectedOrder.timeline.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.status}
                        </p>
                        {step.date && (
                          <p className="text-sm text-gray-600">
                            {new Date(step.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedOrder.status === 'processing' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">Update Order Status</h5>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'shipped', `TRK${Date.now()}`);
                          setSelectedOrder(null);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'cancelled');
                          setSelectedOrder(null);
                        }}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SupportTickets, LiveChatManager, OrderTrackingCenter };
