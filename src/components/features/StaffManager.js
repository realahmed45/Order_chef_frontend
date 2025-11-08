import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar, 
  DollarSign,
  Award,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  MapPin,
  Phone,
  Mail,
  Eye,
  Settings,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatTime } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { FormModal, ConfirmModal } from './common/Modal';

const StaffManager = ({ restaurant }) => {
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [timeTracking, setTimeTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, staff: null });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('staff');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    location: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [analytics, setAnalytics] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active',
    hourlyRate: '',
    address: '',
    emergencyContact: '',
    startDate: '',
    skills: [],
    notes: ''
  });

  const roles = [
    { value: 'manager', label: 'Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'chef', label: 'Chef', color: 'bg-red-100 text-red-800' },
    { value: 'cook', label: 'Cook', color: 'bg-orange-100 text-orange-800' },
    { value: 'server', label: 'Server', color: 'bg-blue-100 text-blue-800' },
    { value: 'cashier', label: 'Cashier', color: 'bg-green-100 text-green-800' },
    { value: 'delivery', label: 'Delivery', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'cleaner', label: 'Cleaner', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    fetchStaffData();
    fetchAnalytics();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      
      // Fetch staff, shifts, and time tracking data
      const [staffRes, shiftsRes, timeRes] = await Promise.all([
        fetch('/api/staff', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/staff/shifts', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/staff/time-tracking', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const [staffData, shiftsData, timeData] = await Promise.all([
        staffRes.json(),
        shiftsRes.json(),
        timeRes.json()
      ]);

      if (staffData.success) setStaff(staffData.staff);
      if (shiftsData.success) setShifts(shiftsData.shifts);
      if (timeData.success) setTimeTracking(timeData.timeTracking);

    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/staff/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching staff analytics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const url = editingStaff ? `/api/staff/${editingStaff._id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchStaffData();
        resetForm();
        alert(`Staff member ${editingStaff ? 'updated' : 'added'} successfully!`);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving staff member:', error);
      alert('Failed to save staff member');
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone || '',
      role: staffMember.role,
      status: staffMember.status,
      hourlyRate: staffMember.hourlyRate?.toString() || '',
      address: staffMember.address || '',
      emergencyContact: staffMember.emergencyContact || '',
      startDate: staffMember.startDate ? staffMember.startDate.split('T')[0] : '',
      skills: staffMember.skills || [],
      notes: staffMember.notes || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/staff/${deleteModal.staff._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await response.json();
      if (data.success) {
        await fetchStaffData();
        setDeleteModal({ show: false, staff: null });
        alert('Staff member deleted successfully');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Failed to delete staff member');
    }
  };

  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/staff/${staffId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        await fetchStaffData();
        alert(`Staff member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling staff status:', error);
      alert('Failed to update staff status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      status: 'active',
      hourlyRate: '',
      address: '',
      emergencyContact: '',
      startDate: '',
      skills: [],
      notes: ''
    });
    setEditingStaff(null);
    setShowAddModal(false);
  };

  const getRoleColor = (role) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig ? roleConfig.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === 'all' || member.role === filters.role;
    const matchesStatus = filters.status === 'all' || member.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const exportStaffData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Hourly Rate', 'Start Date'],
      ...filteredStaff.map(member => [
        member.name,
        member.email,
        member.phone || '',
        member.role,
        member.status,
        member.hourlyRate || '',
        member.startDate ? new Date(member.startDate).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading staff data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600">Manage your team, schedules, and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportStaffData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours This Week</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.weeklyHours || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payroll Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.weeklyPayroll || 0)}
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
              { id: 'staff', label: 'Staff Members', icon: Users },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'timesheet', label: 'Time Tracking', icon: Clock },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'staff' && (
            <StaffMembersTab
              staff={filteredStaff}
              filters={filters}
              setFilters={setFilters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              roles={roles}
              onEdit={handleEdit}
              onDelete={(member) => setDeleteModal({ show: true, staff: member })}
              onToggleStatus={toggleStaffStatus}
              onViewDetails={setSelectedStaff}
              getRoleColor={getRoleColor}
              getStatusColor={getStatusColor}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab shifts={shifts} staff={staff} onUpdateShifts={fetchStaffData} />
          )}

          {activeTab === 'timesheet' && (
            <TimesheetTab timeTracking={timeTracking} staff={staff} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab analytics={analytics} staff={staff} />
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={resetForm}
        onSubmit={handleSubmit}
        title={editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        submitText={editingStaff ? 'Update Staff' : 'Add Staff'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="15.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Jane Doe - (555) 987-6543"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Additional notes about this staff member..."
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, staff: null })}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete "${deleteModal.staff?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

// Staff Members Tab Component
const StaffMembersTab = ({ 
  staff, 
  filters, 
  setFilters, 
  searchTerm, 
  setSearchTerm, 
  roles,
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewDetails,
  getRoleColor,
  getStatusColor
}) => {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <select
          value={filters.role}
          onChange={(e) => setFilters({...filters, role: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Roles</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(member)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(member)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </div>

              {member.hourlyRate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rate:</span>
                  <span className="text-sm font-medium">{formatCurrency(member.hourlyRate)}/hr</span>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm">{member.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => onToggleStatus(member._id, member.status)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  member.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {member.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => onViewDetails(member)}
                className="flex-1 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first staff member to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

// Schedule Tab Component
const ScheduleTab = ({ shifts, staff, onUpdateShifts }) => {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Schedule Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          Schedule management features coming soon
        </p>
      </div>
    </div>
  );
};

// Timesheet Tab Component
const TimesheetTab = ({ timeTracking, staff }) => {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Time Tracking</h3>
        <p className="mt-1 text-sm text-gray-500">
          Time tracking features coming soon
        </p>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analytics, staff }) => {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Staff Analytics</h3>
        <p className="mt-1 text-sm text-gray-500">
          Advanced analytics features coming soon
        </p>
      </div>
    </div>
  );
};

export default StaffManager;
