import React, { useState, useEffect } from "react";
import { api } from "../../api";
import {
  Users,
  Plus,
  Clock,
  DollarSign,
  Calendar,
  Edit3,
  Trash2,
  UserCheck,
  TrendingUp,
  Award,
  AlertCircle,
} from "lucide-react";

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("staff");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const [staffRes, scheduleRes] = await Promise.all([
        api.get("/staff"),
        api.get("/staff/schedule"),
      ]);

      if (staffRes.success) setStaff(staffRes.staff);
      if (scheduleRes.success) setSchedules(scheduleRes.schedule);
    } catch (error) {
      setError("Failed to fetch staff data");
      console.error("Staff fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      const response = await api.post("/staff", staffData);
      if (response.success) {
        setStaff([...staff, response.staff]);
        setShowAddStaff(false);
        setError("");
      }
    } catch (error) {
      setError("Failed to add staff member");
    }
  };

  const handleUpdateStaff = async (id, staffData) => {
    try {
      const response = await api.put(`/staff/${id}`, staffData);
      if (response.success) {
        setStaff(staff.map((s) => (s._id === id ? response.staff : s)));
        setSelectedStaff(null);
        setError("");
      }
    } catch (error) {
      setError("Failed to update staff member");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (
      !window.confirm("Are you sure you want to terminate this staff member?")
    )
      return;

    try {
      const response = await api.delete(`/staff/${id}`);
      if (response.success) {
        setStaff(staff.filter((s) => s._id !== id));
        setError("");
      }
    } catch (error) {
      setError("Failed to terminate staff member");
    }
  };

  const handleClockIn = async (staffId) => {
    try {
      const response = await api.post(`/staff/${staffId}/clock-in`, {
        location: { latitude: 0, longitude: 0 },
        method: "manual",
      });
      if (response.success) {
        // Refresh timesheet data
        fetchTimesheetData(staffId);
      }
    } catch (error) {
      setError("Failed to clock in");
    }
  };

  const handleClockOut = async (staffId) => {
    try {
      const response = await api.post(`/staff/${staffId}/clock-out`, {
        location: { latitude: 0, longitude: 0 },
        method: "manual",
      });
      if (response.success) {
        fetchTimesheetData(staffId);
      }
    } catch (error) {
      setError("Failed to clock out");
    }
  };

  const fetchTimesheetData = async (staffId) => {
    try {
      const response = await api.get(
        `/staff/${staffId}/timesheet?startDate=${
          new Date().toISOString().split("T")[0]
        }`
      );
      if (response.success) {
        setTimesheets(response.timesheets);
      }
    } catch (error) {
      console.error("Timesheet fetch error:", error);
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      kitchen: "bg-red-100 text-red-800",
      "front-of-house": "bg-blue-100 text-blue-800",
      management: "bg-purple-100 text-purple-800",
      delivery: "bg-green-100 text-green-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role) => {
    const icons = {
      manager: Award,
      chef: Users,
      server: UserCheck,
      cashier: DollarSign,
      delivery: TrendingUp,
    };
    return icons[role] || Users;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="text-orange-600" />
          Staff Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your team, schedules, and performance
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Today</p>
              <p className="text-2xl font-bold">
                {staff.filter((s) => s.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours This Week</p>
              <p className="text-2xl font-bold">
                {timesheets
                  .reduce((total, ts) => total + (ts.totalHours || 0), 0)
                  .toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payroll Est.</p>
              <p className="text-2xl font-bold">
                $
                {staff
                  .reduce((total, s) => total + s.hourlyRate * 40, 0)
                  .toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: "staff", label: "Staff List", icon: Users },
            { key: "schedule", label: "Schedule", icon: Calendar },
            { key: "timesheet", label: "Time Tracking", icon: Clock },
            { key: "payroll", label: "Payroll", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "staff" && (
        <div>
          {/* Add Staff Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Staff Members</h2>
            <button
              onClick={() => setShowAddStaff(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Staff Member
            </button>
          </div>

          {/* Staff List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hourly Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <RoleIcon className="text-orange-600" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {member.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {member.role}
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(
                            member.department
                          )}`}
                        >
                          {member.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${member.hourlyRate}/hr
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            member.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedStaff(member)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleClockIn(member._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Clock In"
                        >
                          <UserCheck size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaff && (
        <AddStaffModal
          onClose={() => setShowAddStaff(false)}
          onSubmit={handleAddStaff}
        />
      )}

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onSubmit={(data) => handleUpdateStaff(selectedStaff._id, data)}
        />
      )}

      {/* Other tab content will be implemented in separate components */}
      {activeTab === "schedule" && <ScheduleManager staff={staff} />}
      {activeTab === "timesheet" && <TimesheetManager staff={staff} />}
      {activeTab === "payroll" && (
        <PayrollManager staff={staff} timesheets={timesheets} />
      )}
    </div>
  );
};

// Add Staff Modal Component
const AddStaffModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "server",
    department: "front-of-house",
    hourlyRate: "",
    permissions: {
      canAccessPOS: false,
      canManageInventory: false,
      canViewReports: false,
      canManageStaff: false,
      canProcessRefunds: false,
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-90vh overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Add New Staff Member</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="server">Server</option>
              <option value="cashier">Cashier</option>
              <option value="cleaner">Cleaner</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.hourlyRate}
              onChange={(e) =>
                setFormData({ ...formData, hourlyRate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Staff Modal (similar structure)
const EditStaffModal = ({ staff, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: staff.name || "",
    email: staff.email || "",
    phone: staff.phone || "",
    role: staff.role || "server",
    hourlyRate: staff.hourlyRate || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit Staff Member</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.hourlyRate}
              onChange={(e) =>
                setFormData({ ...formData, hourlyRate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Update Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Schedule Manager Component (simplified for now)
const ScheduleManager = ({ staff }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Staff Schedule</h3>
      <p className="text-gray-600">Schedule management coming soon...</p>
      {/* Full schedule component would be implemented here */}
    </div>
  );
};

// Timesheet Manager Component
const TimesheetManager = ({ staff }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Time Tracking</h3>
      <p className="text-gray-600">Time tracking interface coming soon...</p>
    </div>
  );
};

// Payroll Manager Component
const PayrollManager = ({ staff, timesheets }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Payroll Management</h3>
      <p className="text-gray-600">Payroll calculations coming soon...</p>
    </div>
  );
};

export default StaffManager;
