import React, { useState } from 'react';
import { Search, Calendar, DollarSign, Wrench, Clock, CheckCircle, AlertTriangle, User, Building, Filter, Plus, X, Eye } from 'lucide-react';
import { maintenanceRecords, properties } from '../data/mockdata';

const ServiceRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    propertyId: '',
    type: 'Routine',
    description: '',
    cost: '',
    performedBy: '',
    performedDate: '',
    nextScheduled: '',
    warranty: ''
  });

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesProperty = propertyFilter === 'all' || record.propertyId.toString() === propertyFilter;
    return matchesSearch && matchesType && matchesStatus && matchesProperty;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'Emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Preventive':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Routine':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRecord = () => {
    // Here you would typically submit to backend
    console.log('New maintenance record:', newRecord);
    setShowAddModal(false);
    setNewRecord({
      propertyId: '',
      type: 'Routine',
      description: '',
      cost: '',
      performedBy: '',
      performedDate: '',
      nextScheduled: '',
      warranty: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalRecords = maintenanceRecords.length;
  const totalCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
  const completedRecords = maintenanceRecords.filter(record => record.status === 'completed').length;
  const avgCost = totalCost / totalRecords;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            Service Records
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Track and manage all maintenance activities
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{totalRecords}</h3>
          <p className="text-gray-600 text-sm">Total Records</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{completedRecords}</h3>
          <p className="text-gray-600 text-sm">Completed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">₹{totalCost.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Cost</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">₹{Math.round(avgCost).toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Avg Cost</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Emergency">Emergency</option>
              <option value="Preventive">Preventive</option>
              <option value="Routine">Routine</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Performed By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Building className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{record.propertyName}</p>
                        <p className="text-sm text-gray-500">ID: {record.propertyId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800 max-w-xs truncate">{record.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">₹{record.cost.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{record.performedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{formatDate(record.performedDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Service Record Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Property</label>
                  <p className="text-gray-800 font-medium">{selectedRecord.propertyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Type</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(selectedRecord.type)}`}>
                    {selectedRecord.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Cost</label>
                  <p className="text-gray-800 font-bold text-lg">₹{selectedRecord.cost.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedRecord.status)}`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Performed By</label>
                  <p className="text-gray-800">{selectedRecord.performedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Date Performed</label>
                  <p className="text-gray-800">{formatDate(selectedRecord.performedDate)}</p>
                </div>
                {selectedRecord.nextScheduled && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Next Scheduled</label>
                    <p className="text-gray-800">{formatDate(selectedRecord.nextScheduled)}</p>
                  </div>
                )}
                {selectedRecord.warranty && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Warranty</label>
                    <p className="text-gray-800">{selectedRecord.warranty}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{selectedRecord.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Add Service Record</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Property</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.propertyId}
                    onChange={(e) => setNewRecord({...newRecord, propertyId: e.target.value})}
                  >
                    <option value="">Select Property</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>{property.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                  >
                    <option value="Routine">Routine</option>
                    <option value="Preventive">Preventive</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Cost ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.cost}
                    onChange={(e) => setNewRecord({...newRecord, cost: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Performed By</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.performedBy}
                    onChange={(e) => setNewRecord({...newRecord, performedBy: e.target.value})}
                    placeholder="Service provider name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Date Performed</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.performedDate}
                    onChange={(e) => setNewRecord({...newRecord, performedDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Next Scheduled (Optional)</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.nextScheduled}
                    onChange={(e) => setNewRecord({...newRecord, nextScheduled: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Warranty (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.warranty}
                    onChange={(e) => setNewRecord({...newRecord, warranty: e.target.value})}
                    placeholder="e.g., 6 months, 1 year"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                    placeholder="Describe the service performed..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddRecord}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add Record
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecords;
