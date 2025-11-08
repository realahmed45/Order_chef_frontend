import React, { useState, useEffect } from 'react';
import { 
  Shield,
  Lock,
  Key,
  Download,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Globe,
  User,
  Users,
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Wifi,
  Database,
  Server,
  HardDrive,
  Cloud,
  Save,
  RefreshCw,
  Bell,
  Mail,
  Phone,
  FileText,
  Archive,
  History,
  Activity
} from 'lucide-react';

// Backup Manager Component
const BackupManager = () => {
  const [backups, setBackups] = useState([
    {
      id: 'BK-001',
      name: 'Daily Database Backup',
      type: 'database',
      status: 'completed',
      size: '2.4 GB',
      startTime: '2024-10-29T02:00:00Z',
      endTime: '2024-10-29T02:45:00Z',
      duration: '45 minutes',
      location: 'AWS S3 - us-east-1',
      encryption: true,
      retention: '30 days',
      nextScheduled: '2024-10-30T02:00:00Z'
    },
    {
      id: 'BK-002',
      name: 'Weekly System Backup',
      type: 'system',
      status: 'running',
      size: '15.2 GB (estimated)',
      startTime: '2024-10-29T01:00:00Z',
      endTime: null,
      duration: 'In progress',
      location: 'Azure Blob Storage',
      encryption: true,
      retention: '90 days',
      nextScheduled: '2024-11-05T01:00:00Z'
    },
    {
      id: 'BK-003',
      name: 'User Files Backup',
      type: 'files',
      status: 'failed',
      size: '0 GB',
      startTime: '2024-10-28T23:30:00Z',
      endTime: '2024-10-28T23:35:00Z',
      duration: '5 minutes',
      location: 'Google Cloud Storage',
      encryption: true,
      retention: '60 days',
      nextScheduled: '2024-10-29T23:30:00Z',
      error: 'Authentication failed - check credentials'
    }
  ]);

  const [showBackupForm, setShowBackupForm] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const backupTypes = ['database', 'system', 'files', 'application'];
  const storageLocations = ['AWS S3', 'Azure Blob Storage', 'Google Cloud Storage', 'Local Storage'];
  const retentionPeriods = ['7 days', '30 days', '60 days', '90 days', '1 year'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'database': return <Database className="w-5 h-5 text-blue-600" />;
      case 'system': return <Server className="w-5 h-5 text-green-600" />;
      case 'files': return <HardDrive className="w-5 h-5 text-purple-600" />;
      case 'application': return <Cloud className="w-5 h-5 text-orange-600" />;
      default: return <Archive className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleRunBackup = (backupId) => {
    setBackups(backups.map(backup => 
      backup.id === backupId 
        ? { ...backup, status: 'running', startTime: new Date().toISOString() }
        : backup
    ));
  };

  const handleDeleteBackup = (backupId) => {
    setBackups(backups.filter(backup => backup.id !== backupId));
  };

  const handleRetryBackup = (backupId) => {
    setBackups(backups.map(backup => 
      backup.id === backupId 
        ? { ...backup, status: 'running', startTime: new Date().toISOString(), error: undefined }
        : backup
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Backup Manager</h3>
          <p className="text-sm text-gray-600">Monitor and manage system backups</p>
        </div>
        <button
          onClick={() => setShowBackupForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Backup
        </button>
      </div>

      {/* Backup Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-lg font-semibold text-gray-900">
                {backups.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Running</p>
              <p className="text-lg font-semibold text-gray-900">
                {backups.filter(b => b.status === 'running').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-lg font-semibold text-gray-900">
                {backups.filter(b => b.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Archive className="w-8 h-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Size</p>
              <p className="text-lg font-semibold text-gray-900">17.6 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Backup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(backup.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{backup.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{backup.type} backup</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                        {getStatusIcon(backup.status)}
                        {backup.status}
                      </span>
                    </div>
                    {backup.error && (
                      <div className="text-xs text-red-600 mt-1">{backup.error}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{backup.size}</div>
                    {backup.encryption && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Lock className="w-3 h-3" />
                        Encrypted
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{backup.duration}</div>
                    {backup.startTime && (
                      <div className="text-xs text-gray-500">
                        Started: {new Date(backup.startTime).toLocaleTimeString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{backup.location}</div>
                    <div className="text-xs text-gray-500">Retention: {backup.retention}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(backup.nextScheduled).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(backup.nextScheduled).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {backup.status !== 'running' && (
                        <button
                          onClick={() => handleRunBackup(backup.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Run Now"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      {backup.status === 'failed' && (
                        <button
                          onClick={() => handleRetryBackup(backup.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Retry"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBackup(backup)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup Detail Modal */}
      {selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedBackup.name}</h3>
                <p className="text-sm text-gray-600">Backup Details</p>
              </div>
              <button
                onClick={() => setSelectedBackup(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Backup Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900 capitalize">{selectedBackup.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="text-gray-900">{selectedBackup.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">{selectedBackup.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Encrypted:</span>
                      <span className="text-gray-900">{selectedBackup.encryption ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Storage Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{selectedBackup.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retention:</span>
                      <span className="text-gray-900">{selectedBackup.retention}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Run:</span>
                      <span className="text-gray-900">{new Date(selectedBackup.nextScheduled).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Execution Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="text-gray-900">
                      {selectedBackup.startTime ? new Date(selectedBackup.startTime).toLocaleString() : 'Not started'}
                    </span>
                  </div>
                  {selectedBackup.endTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Time:</span>
                      <span className="text-gray-900">{new Date(selectedBackup.endTime).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBackup.status)}`}>
                      {selectedBackup.status}
                    </span>
                  </div>
                  {selectedBackup.error && (
                    <div className="mt-2">
                      <span className="text-gray-600">Error:</span>
                      <div className="text-red-600 mt-1">{selectedBackup.error}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {selectedBackup.status === 'completed' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download Backup
                </button>
              )}
              {selectedBackup.status !== 'running' && (
                <button
                  onClick={() => {
                    handleRunBackup(selectedBackup.id);
                    setSelectedBackup(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Run Backup
                </button>
              )}
              <button
                onClick={() => setSelectedBackup(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Login Sessions Manager Component
const LoginSessionsManager = () => {
  const [sessions, setSessions] = useState([
    {
      id: 'SES-001',
      user: 'john.doe@company.com',
      device: 'Desktop - Chrome',
      location: 'New York, US',
      ipAddress: '192.168.1.100',
      loginTime: '2024-10-29T09:30:00Z',
      lastActivity: '2024-10-29T14:45:00Z',
      status: 'active',
      sessionId: 'sess_abc123xyz789',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 'SES-002',
      user: 'jane.smith@company.com',
      device: 'Mobile - Safari',
      location: 'Los Angeles, US',
      ipAddress: '10.0.1.25',
      loginTime: '2024-10-29T08:15:00Z',
      lastActivity: '2024-10-29T14:30:00Z',
      status: 'active',
      sessionId: 'sess_def456uvw012',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    },
    {
      id: 'SES-003',
      user: 'mike.johnson@company.com',
      device: 'Tablet - Edge',
      location: 'Chicago, US',
      ipAddress: '172.16.0.50',
      loginTime: '2024-10-28T16:45:00Z',
      lastActivity: '2024-10-28T18:20:00Z',
      status: 'expired',
      sessionId: 'sess_ghi789rst345',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  const statuses = ['active', 'expired', 'terminated'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (device) => {
    if (device.includes('Mobile')) return <Smartphone className="w-4 h-4" />;
    if (device.includes('Tablet')) return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTerminateSession = (sessionId) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'terminated' }
        : session
    ));
  };

  const handleTerminateAllSessions = (user) => {
    setSessions(sessions.map(session => 
      session.user === user 
        ? { ...session, status: 'terminated' }
        : session
    ));
  };

  const getSessionDuration = (loginTime, lastActivity) => {
    const start = new Date(loginTime);
    const end = new Date(lastActivity);
    const duration = Math.floor((end - start) / (1000 * 60 * 60)); // hours
    return `${duration}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Login Sessions Manager</h3>
          <p className="text-sm text-gray-600">Monitor and manage user login sessions</p>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Sessions</p>
              <p className="text-lg font-semibold text-gray-900">
                {sessions.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Unique Users</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Set(sessions.map(s => s.user)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Monitor className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Desktop Sessions</p>
              <p className="text-lg font-semibold text-gray-900">
                {sessions.filter(s => s.device.includes('Desktop')).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Smartphone className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Mobile Sessions</p>
              <p className="text-lg font-semibold text-gray-900">
                {sessions.filter(s => s.device.includes('Mobile')).length}
              </p>
            </div>
          </div>
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
                placeholder="Search sessions..."
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
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
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
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.device)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.user}</div>
                        <div className="text-xs text-gray-500">{session.device}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{session.location}</div>
                        <div className="text-xs text-gray-500">{session.ipAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(session.loginTime).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(session.loginTime).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(session.lastActivity).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(session.lastActivity).toLocaleTimeString()} 
                      ({getSessionDuration(session.loginTime, session.lastActivity)})
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {session.status === 'active' && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Terminate Session"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
                <p className="text-sm text-gray-600">{selectedSession.user}</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Session Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session ID:</span>
                      <span className="text-gray-900 font-mono text-xs">{selectedSession.sessionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Device:</span>
                      <span className="text-gray-900">{selectedSession.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                        {selectedSession.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">{getSessionDuration(selectedSession.loginTime, selectedSession.lastActivity)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Location & Network</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{selectedSession.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IP Address:</span>
                      <span className="text-gray-900 font-mono">{selectedSession.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Login Time:</span>
                      <span className="text-gray-900">{new Date(selectedSession.loginTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity:</span>
                      <span className="text-gray-900">{new Date(selectedSession.lastActivity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">User Agent</h4>
                <p className="text-xs text-gray-600 font-mono break-all">{selectedSession.userAgent}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {selectedSession.status === 'active' && (
                <>
                  <button
                    onClick={() => {
                      handleTerminateSession(selectedSession.id);
                      setSelectedSession(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Terminate Session
                  </button>
                  <button
                    onClick={() => {
                      handleTerminateAllSessions(selectedSession.user);
                      setSelectedSession(null);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Terminate All User Sessions
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90,
      preventReuse: 5
    },
    accountLockout: {
      enabled: true,
      maxAttempts: 5,
      lockoutDuration: 30,
      resetAfter: 60
    },
    twoFactorAuth: {
      enforced: false,
      allowSMS: true,
      allowEmail: true,
      allowAuthenticator: true,
      backupCodes: true
    },
    sessionManagement: {
      sessionTimeout: 120,
      multipleLogins: true,
      rememberDevice: 30,
      forceLogoutOnPasswordChange: true
    },
    encryption: {
      dataAtRest: true,
      dataInTransit: true,
      algorithm: 'AES-256',
      keyRotation: 365
    },
    auditLogging: {
      enabled: true,
      logSuccessfulLogins: true,
      logFailedLogins: true,
      logPasswordChanges: true,
      logPermissionChanges: true,
      retentionDays: 365
    }
  });

  const [activeTab, setActiveTab] = useState('password');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const tabs = [
    { id: 'password', name: 'Password Policy', icon: Lock },
    { id: 'lockout', name: 'Account Lockout', icon: Shield },
    { id: '2fa', name: 'Two-Factor Auth', icon: Key },
    { id: 'session', name: 'Session Management', icon: Clock },
    { id: 'encryption', name: 'Encryption', icon: Lock },
    { id: 'audit', name: 'Audit Logging', icon: FileText }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          <p className="text-sm text-gray-600">Configure security policies and settings</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      {showSaveConfirm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="ml-2 text-sm text-green-800">Security settings saved successfully!</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Password Policy Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      value={settings.passwordPolicy.minLength}
                      onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={settings.passwordPolicy.passwordExpiry}
                      onChange={(e) => handleSettingChange('passwordPolicy', 'passwordExpiry', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h5>
                  <div className="space-y-3">
                    {[
                      { key: 'requireUppercase', label: 'Require uppercase letters' },
                      { key: 'requireLowercase', label: 'Require lowercase letters' },
                      { key: 'requireNumbers', label: 'Require numbers' },
                      { key: 'requireSpecialChars', label: 'Require special characters' }
                    ].map((requirement) => (
                      <label key={requirement.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.passwordPolicy[requirement.key]}
                          onChange={(e) => handleSettingChange('passwordPolicy', requirement.key, e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{requirement.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Lockout Tab */}
          {activeTab === 'lockout' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Lockout Policy</h4>
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.accountLockout.enabled}
                      onChange={(e) => handleSettingChange('accountLockout', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable account lockout</span>
                  </label>
                </div>
                {settings.accountLockout.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Failed Attempts
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={settings.accountLockout.maxAttempts}
                        onChange={(e) => handleSettingChange('accountLockout', 'maxAttempts', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={settings.accountLockout.lockoutDuration}
                        onChange={(e) => handleSettingChange('accountLockout', 'lockoutDuration', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reset Counter After (minutes)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="180"
                        value={settings.accountLockout.resetAfter}
                        onChange={(e) => handleSettingChange('accountLockout', 'resetAfter', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Two-Factor Auth Tab */}
          {activeTab === '2fa' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth.enforced}
                      onChange={(e) => handleSettingChange('twoFactorAuth', 'enforced', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enforce 2FA for all users</span>
                  </label>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Allowed 2FA Methods</h5>
                  <div className="space-y-3">
                    {[
                      { key: 'allowSMS', label: 'SMS/Text Message', icon: Phone },
                      { key: 'allowEmail', label: 'Email', icon: Mail },
                      { key: 'allowAuthenticator', label: 'Authenticator App', icon: Smartphone },
                      { key: 'backupCodes', label: 'Backup Codes', icon: Key }
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label key={method.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.twoFactorAuth[method.key]}
                            onChange={(e) => handleSettingChange('twoFactorAuth', method.key, e.target.checked)}
                            className="w-4 h-4 text-orange-600 rounded"
                          />
                          <Icon className="w-4 h-4 ml-2 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-700">{method.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Management Tab */}
          {activeTab === 'session' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="480"
                      value={settings.sessionManagement.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionManagement', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remember Device (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={settings.sessionManagement.rememberDevice}
                      onChange={(e) => handleSettingChange('sessionManagement', 'rememberDevice', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { key: 'multipleLogins', label: 'Allow multiple concurrent sessions' },
                    { key: 'forceLogoutOnPasswordChange', label: 'Force logout on password change' }
                  ].map((setting) => (
                    <label key={setting.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.sessionManagement[setting.key]}
                        onChange={(e) => handleSettingChange('sessionManagement', setting.key, e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{setting.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Encryption Tab */}
          {activeTab === 'encryption' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Encryption Settings</h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {[
                      { key: 'dataAtRest', label: 'Encrypt data at rest' },
                      { key: 'dataInTransit', label: 'Encrypt data in transit' }
                    ].map((setting) => (
                      <label key={setting.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.encryption[setting.key]}
                          onChange={(e) => handleSettingChange('encryption', setting.key, e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{setting.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Encryption Algorithm
                      </label>
                      <select
                        value={settings.encryption.algorithm}
                        onChange={(e) => handleSettingChange('encryption', 'algorithm', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="AES-256">AES-256</option>
                        <option value="AES-128">AES-128</option>
                        <option value="ChaCha20">ChaCha20</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Rotation (days)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="730"
                        value={settings.encryption.keyRotation}
                        onChange={(e) => handleSettingChange('encryption', 'keyRotation', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logging Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Audit Logging</h4>
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.auditLogging.enabled}
                      onChange={(e) => handleSettingChange('auditLogging', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable audit logging</span>
                  </label>
                </div>
                {settings.auditLogging.enabled && (
                  <>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Events to Log</h5>
                      <div className="space-y-3">
                        {[
                          { key: 'logSuccessfulLogins', label: 'Successful logins' },
                          { key: 'logFailedLogins', label: 'Failed login attempts' },
                          { key: 'logPasswordChanges', label: 'Password changes' },
                          { key: 'logPermissionChanges', label: 'Permission changes' }
                        ].map((event) => (
                          <label key={event.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.auditLogging[event.key]}
                              onChange={(e) => handleSettingChange('auditLogging', event.key, e.target.checked)}
                              className="w-4 h-4 text-orange-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{event.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Log Retention Period (days)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="2555"
                        value={settings.auditLogging.retentionDays}
                        onChange={(e) => handleSettingChange('auditLogging', 'retentionDays', parseInt(e.target.value))}
                        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// GDPR Compliance Component
const GDPRCompliance = () => {
  const [requests, setRequests] = useState([
    {
      id: 'GDPR-001',
      type: 'data_access',
      email: 'john.doe@example.com',
      status: 'completed',
      submittedAt: '2024-10-25T10:30:00Z',
      completedAt: '2024-10-27T14:20:00Z',
      description: 'Request for personal data access under Article 15'
    },
    {
      id: 'GDPR-002',
      type: 'data_deletion',
      email: 'jane.smith@example.com',
      status: 'in_progress',
      submittedAt: '2024-10-28T09:15:00Z',
      completedAt: null,
      description: 'Request for personal data deletion under Article 17'
    },
    {
      id: 'GDPR-003',
      type: 'data_portability',
      email: 'mike.wilson@example.com',
      status: 'pending',
      submittedAt: '2024-10-29T11:45:00Z',
      completedAt: null,
      description: 'Request for data portability under Article 20'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const requestTypes = ['data_access', 'data_deletion', 'data_rectification', 'data_portability'];
  const statuses = ['pending', 'in_progress', 'completed', 'rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'data_access': return <Eye className="w-4 h-4" />;
      case 'data_deletion': return <Trash2 className="w-4 h-4" />;
      case 'data_rectification': return <Edit className="w-4 h-4" />;
      case 'data_portability': return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'data_access': return 'Data Access';
      case 'data_deletion': return 'Data Deletion';
      case 'data_rectification': return 'Data Rectification';
      case 'data_portability': return 'Data Portability';
      default: return type;
    }
  };

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null
          }
        : request
    ));
  };

  const getDaysRemaining = (submittedAt) => {
    const submitted = new Date(submittedAt);
    const dueDate = new Date(submitted.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date();
    const remaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    return remaining;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">GDPR Compliance</h3>
          <p className="text-sm text-gray-600">Manage data subject requests and compliance</p>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-lg font-semibold text-gray-900">
                {requests.filter(r => r.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-lg font-semibold text-gray-900">
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-lg font-semibold text-gray-900">
                {requests.filter(r => getDaysRemaining(r.submittedAt) < 0 && r.status !== 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => {
                const daysRemaining = getDaysRemaining(request.submittedAt);
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.id}</div>
                        <div className="text-xs text-gray-500">{request.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="text-sm text-gray-900">{getTypeName(request.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${getStatusColor(request.status)}`}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(request.submittedAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(request.submittedAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'completed' && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Download Response"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedRequest.id}</h3>
                <p className="text-sm text-gray-600">{getTypeName(selectedRequest.type)} Request</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">{getTypeName(selectedRequest.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{selectedRequest.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleString()}</span>
                  </div>
                  {selectedRequest.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="text-gray-900">{new Date(selectedRequest.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="text-gray-900">
                      {new Date(new Date(selectedRequest.submittedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-700">{selectedRequest.description}</p>
              </div>

              {selectedRequest.type === 'data_access' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Data Categories</h4>
                  <div className="text-sm text-gray-700">
                    <p>The following data categories were requested:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Personal identification information</li>
                      <li>Account and profile data</li>
                      <li>Usage and activity logs</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              {selectedRequest.status !== 'completed' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'completed');
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              )}
              {selectedRequest.status === 'completed' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download Response
                </button>
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { BackupManager, LoginSessionsManager, SecuritySettings, GDPRCompliance };
