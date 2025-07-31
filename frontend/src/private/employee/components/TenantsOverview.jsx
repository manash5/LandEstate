import React, { useState } from 'react';
import { Search, User, Phone, DollarSign, MapPin, Edit3, X, Calendar, Mail, AlertTriangle } from 'lucide-react';
import { properties, tenants } from '../data/mockdata';

const TenantsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTenant, setEditedTenant] = useState(null);
  const [tenantsData, setTenantsData] = useState(tenants);

  const filteredTenants = tenantsData.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.paymentStatus === statusFilter;
    const matchesProperty = propertyFilter === 'all' || tenant.propertyId.toString() === propertyFilter;
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const getStatusColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setEditedTenant({ ...tenant });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Update the tenants data with the edited tenant information
    const updatedTenants = tenantsData.map(tenant => {
      if (tenant.id === editedTenant.id) {
        return {
          ...tenant,
          name: editedTenant.name,
          phone: editedTenant.phone,
          email: editedTenant.email,
          roomNumber: editedTenant.roomNumber,
          rentAmount: editedTenant.rentAmount,
          paymentStatus: editedTenant.paymentStatus,
          rentDueDate: editedTenant.rentDueDate,
          issue: editedTenant.issue,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return tenant;
    });

    // Update the state with the new data
    setTenantsData(updatedTenants);
    
    // Close the modal and reset states
    setShowEditModal(false);
    setSelectedTenant(null);
    setEditedTenant(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedTenant(null);
    setEditedTenant(null);
  };

  const handleInputChange = (field, value) => {
    setEditedTenant(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const EditTenantModal = () => {
    if (!showEditModal || !editedTenant) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                Edit Tenant Information
              </h2>
              <button 
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    value={editedTenant.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editedTenant.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={editedTenant.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={editedTenant.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Amount ($)
                  </label>
                  <input
                    type="number"
                    value={editedTenant.rentAmount}
                    onChange={(e) => handleInputChange('rentAmount', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={editedTenant.paymentStatus}
                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Due Date
                  </label>
                  <input
                    type="date"
                    value={editedTenant.rentDueDate}
                    onChange={(e) => handleInputChange('rentDueDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue (if any)
                </label>
                <input
                  type="text"
                  value={editedTenant.issue || ''}
                  onChange={(e) => handleInputChange('issue', e.target.value)}
                  placeholder="Enter any issues or leave empty if none"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            Tenants Overview
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Manage all tenants across your assigned properties
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
              <User className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{tenantsData.length}</h3>
          <p className="text-gray-600 text-sm">Total Tenants</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{tenantsData.filter(t => t.paymentStatus === 'paid').length}</h3>
          <p className="text-gray-600 text-sm">Paid This Month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{tenantsData.filter(t => t.paymentStatus === 'unpaid').length}</h3>
          <p className="text-gray-600 text-sm">Unpaid</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{tenantsData.filter(t => t.issue).length}</h3>
          <p className="text-gray-600 text-sm">With Issues</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants, rooms, or properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id.toString()}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Property & Room</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {tenant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{tenant.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">{tenant.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium text-gray-800">{tenant.propertyName}</p>
                        <p className="text-sm text-gray-500">Room {tenant.roomNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <div>
                        <p className="font-medium text-gray-800">${tenant.rentAmount.toLocaleString()}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {new Date(tenant.rentDueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.paymentStatus)}`}>
                      {tenant.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {tenant.issue ? (
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="text-orange-600 text-sm">{tenant.issue}</span>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm">No Issues</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => handleEditClick(tenant)}
                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tenants found matching your criteria.</p>
          </div>
        )}
      </div>

      <EditTenantModal />
    </div>
  );
};

export default TenantsOverview;