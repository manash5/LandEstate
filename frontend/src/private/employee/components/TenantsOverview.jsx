import React, { useState } from 'react';
import { Search, User, Phone, DollarSign, MapPin, Edit3, X } from 'lucide-react';
import { properties } from '../data/mockdata';

const TenantsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTenant, setEditedTenant] = useState(null);
  const [propertiesData, setPropertiesData] = useState(properties);

  // Flatten all tenants from all properties
  const allTenants = propertiesData.flatMap(property => 
    property.rooms.map(room => ({
      ...room,
      propertyName: property.name,
      propertyId: property.id
    }))
  );

  const filteredTenants = allTenants.filter(tenant => {
    const matchesSearch = tenant.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
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
    // Update the properties data with the edited tenant information
    const updatedProperties = propertiesData.map(property => {
      if (property.id === editedTenant.propertyId) {
        return {
          ...property,
          rooms: property.rooms.map(room => {
            if (room.id === editedTenant.id) {
              return {
                ...room,
                tenant: editedTenant.tenant,
                tenantContact: editedTenant.tenantContact,
                number: editedTenant.number,
                rent: editedTenant.rent,
                status: editedTenant.status,
                rentDueDate: editedTenant.rentDueDate,
                issue: editedTenant.issue,
                lastUpdated: new Date().toISOString().split('T')[0] // Update the last updated date
              };
            }
            return room;
          })
        };
      }
      return property;
    });

    // Update the state with the new data
    setPropertiesData(updatedProperties);
    
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
                    value={editedTenant.tenant}
                    onChange={(e) => handleInputChange('tenant', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={editedTenant.tenantContact}
                    onChange={(e) => handleInputChange('tenantContact', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={editedTenant.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={editedTenant.rent}
                    onChange={(e) => handleInputChange('rent', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={editedTenant.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div>
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
    <div className="space-y-6 p-6">
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            Tenants Overview
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Manage all tenants across your assigned properties
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants, rooms, or properties..."
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
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <tr key={`${tenant.propertyId}-${tenant.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <User className="w-8 h-8 p-2 bg-gray-100 rounded-full mr-3" />
                      <div>
                        <p className="font-medium text-gray-800">{tenant.tenant}</p>
                        <p className="text-sm text-gray-500">ID: {tenant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">{tenant.tenantContact}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium text-gray-800">{tenant.propertyName}</p>
                        <p className="text-sm text-gray-500">Room {tenant.number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <div>
                        <p className="font-medium text-gray-800">NPR {tenant.rent.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Due: {new Date(tenant.rentDueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                      {tenant.status === 'paid' ? 'PAID' : 'NOT PAID'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {tenant.issue ? (
                      <span className="text-orange-600 text-sm">{tenant.issue}</span>
                    ) : (
                      <span className="text-green-600 text-sm">No Issue</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => handleEditClick(tenant)}
                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg transition-colors text-sm"
                    >
                      <Edit3 className="w-3 h-3" />
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