import React, { useState, useEffect, useCallback } from 'react';
import { Search, AlertTriangle, Clock, CheckCircle, User, MapPin, X, Plus, Home, Settings, Calendar, DollarSign } from 'lucide-react';
import { getEmployeeMaintenanceRecords, createMaintenanceRecord, getEmployeeAssignedProperties } from '../../../services/api';

const Issues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [assignedProperties, setAssignedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding new maintenance record
  const [formData, setFormData] = useState({
    serviceName: '',
    location: '',
    description: '',
    status: 'pending',
    cost: 0,
    technician: '',
    serviceDate: new Date().toISOString().split('T')[0],
    propertyId: '',
    roomId: ''
  });

  useEffect(() => {
    fetchMaintenanceRecords();
    fetchAssignedProperties();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeMaintenanceRecords();
      if (response.data.success) {
        setMaintenanceRecords(response.data.data);
      } else {
        setError('Failed to fetch maintenance records');
      }
    } catch (err) {
      console.error('Error fetching maintenance records:', err);
      setError('Failed to fetch maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedProperties = async () => {
    try {
      const response = await getEmployeeAssignedProperties();
      if (response.data.success) {
        setAssignedProperties(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching assigned properties:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createMaintenanceRecord(formData);
      if (response.data.success) {
        setMaintenanceRecords(prev => [response.data.data, ...prev]);
        setShowAddModal(false);
        setFormData({
          serviceName: '',
          location: '',
          description: '',
          status: 'pending',
          cost: 0,
          technician: '',
          serviceDate: new Date().toISOString().split('T')[0],
          propertyId: '',
          roomId: ''
        });
      }
    } catch (err) {
      console.error('Error creating maintenance record:', err);
      setError('Failed to create maintenance record');
    }
  };

  const getAvailableRooms = () => {
    const selectedProperty = assignedProperties.find(p => p.id === parseInt(formData.propertyId));
    return selectedProperty ? selectedProperty.rooms || [] : [];
  };

  const handleFormChange = useCallback((field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  }, []);

  const handlePropertyChange = useCallback((propertyId) => {
    setFormData(prevData => ({
      ...prevData,
      propertyId: propertyId,
      roomId: ''
    }));
  }, []);

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.property?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    // Map priority based on status for filtering
    const priority = record.status === 'pending' ? 'high' : 
                    record.status === 'in-progress' ? 'medium' : 'low';
    const matchesPriority = priorityFilter === 'all' || priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return AlertTriangle;
      case 'in-progress':
        return Clock;
      case 'completed':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-slate-100 p-6 rounded-xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">Maintenance Records</h1>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            Maintenance Records
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Track and manage property maintenance activities
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">All Maintenance Records</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search maintenance records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecords.map((record) => {
            const StatusIcon = getStatusIcon(record.status);
            const priority = record.status === 'pending' ? 'high' : 
                           record.status === 'in-progress' ? 'medium' : 'low';
            
            return (
              <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">{record.serviceName}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(record.status)}`}>
                      {priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{record.description || 'No description provided'}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="w-4 h-4 mr-2" />
                    <span>{record.property?.name || 'Unknown Property'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{record.location}</span>
                    {record.room && <span> - Room {record.room.number}</span>}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Service Date: {formatDate(record.serviceDate)}</span>
                  </div>
                  {record.cost > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Cost: NPR {parseFloat(record.cost).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedIssue(record);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecords.length === 0 && !loading && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {maintenanceRecords.length === 0 ? 'No Maintenance Records' : 'No Results Found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {maintenanceRecords.length === 0 
                ? 'There are no maintenance records for your assigned properties yet.' 
                : 'No maintenance records match your search criteria.'
              }
            </p>
            {maintenanceRecords.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Record
              </button>
            )}
          </div>
        )}
      </div>

      {showDetailsModal && selectedIssue && (
        <IssueDetailsModal 
          selectedIssue={selectedIssue}
          onClose={() => setShowDetailsModal(false)}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
        />
      )}
      {showAddModal && (
        <AddMaintenanceModal 
          formData={formData}
          assignedProperties={assignedProperties}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmit}
          handleFormChange={handleFormChange}
          handlePropertyChange={handlePropertyChange}
          getAvailableRooms={getAvailableRooms}
        />
      )}
    </div>
  );
};

// Move modal components outside to prevent re-creation
const IssueDetailsModal = ({ selectedIssue, onClose, getStatusColor, formatDate }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance Record Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedIssue.serviceName}</h3>
            <p className="text-gray-600">{selectedIssue.description || 'No description provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Home className="w-4 h-4 mr-2" />
                <span>Property: {selectedIssue.property?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Location: {selectedIssue.location}</span>
              </div>
              {selectedIssue.room && (
                <div className="flex items-center text-sm text-gray-600">
                  <span>Room: {selectedIssue.room.number}</span>
                </div>
              )}
              {selectedIssue.technician && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Technician: {selectedIssue.technician}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Service Date: {formatDate(selectedIssue.serviceDate)}</span>
              </div>
              {selectedIssue.cost > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Cost: NPR {parseFloat(selectedIssue.cost).toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                  Status: {selectedIssue.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AddMaintenanceModal = ({ 
  formData, 
  assignedProperties, 
  onClose, 
  onSubmit, 
  handleFormChange, 
  handlePropertyChange, 
  getAvailableRooms 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Add Maintenance Record</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={formData.serviceName}
                onChange={(e) => handleFormChange('serviceName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Plumbing repair, AC maintenance"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Kitchen, Bathroom, Main hall"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Detailed description of the maintenance work needed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property *
              </label>
              <select
                required
                value={formData.propertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Property</option>
                {assignedProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room (Optional)
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => handleFormChange('roomId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!formData.propertyId}
              >
                <option value="">Select Room</option>
                {getAvailableRooms().map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost (NPR)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleFormChange('cost', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Date
              </label>
              <input
                type="date"
                value={formData.serviceDate}
                onChange={(e) => handleFormChange('serviceDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technician
            </label>
            <input
              type="text"
              value={formData.technician}
              onChange={(e) => handleFormChange('technician', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name of the technician or service provider"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Record
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default Issues;