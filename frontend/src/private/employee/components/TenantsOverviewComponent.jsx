import React, { useState, useEffect } from 'react';
import { User, Phone, DollarSign, Calendar, MapPin, AlertTriangle, CheckCircle, Search, Loader, Edit2, Trash2, X, Save } from 'lucide-react';
import { getEmployeeDashboard, updateRoom } from '../../../services/api';
import { toast } from 'react-toastify';

export default function TenantsOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTenant, setEditingTenant] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPropertiesData();
  }, []);

  const fetchPropertiesData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeDashboard();
      
      if (response.data.success) {
        setProperties(response.data.data.properties || []);
        setError(null); // Clear any previous errors
      } else {
        setError('Failed to fetch properties data');
        toast.error('Failed to fetch properties data', {
          theme: 'dark',
          position: 'top-right'
        });
      }
    } catch (error) {
      console.error('Error fetching properties data:', error);
      setError('Failed to load properties data. Please try again.');
      toast.error('Failed to load properties data. Please try again.', {
        theme: 'dark',
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant.id);
    setEditForm({
      tenant: tenant.name,
      tenantContact: tenant.contact || '',
      rent: tenant.rent || '',
      rentDueDate: tenant.rentDueDate ? tenant.rentDueDate.split('T')[0] : '',
      status: tenant.status
    });
  };

  const handleCancelEdit = () => {
    setEditingTenant(null);
    setEditForm({});
  };

  const handleSaveEdit = async (tenant) => {
    try {
      setActionLoading(true);
      
      // Validate required fields
      if (!editForm.tenant || editForm.tenant.trim() === '') {
        toast.error('Tenant name is required!', {
          theme: 'dark',
          position: 'top-right'
        });
        return;
      }
      
      // Prepare the room data with proper field mapping
      const roomData = {
        number: tenant.roomNumber, // Keep the existing room number
        tenant: editForm.tenant.trim(),
        tenantContact: editForm.tenantContact.trim(),
        rent: parseFloat(editForm.rent) || 0,
        rentDueDate: editForm.rentDueDate ? new Date(editForm.rentDueDate).toISOString() : null,
        status: editForm.status
      };

      console.log('Updating room with data:', roomData); // Debug log

      await updateRoom(tenant.roomId, roomData);
      
      // Refresh the data
      await fetchPropertiesData();
      
      setEditingTenant(null);
      setEditForm({});
      
      // Show success message
      toast.success('Tenant information updated successfully!', {
        theme: 'dark',
        position: 'top-right'
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error('Failed to update tenant. Please try again.', {
        theme: 'dark',
        position: 'top-right'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveTenant = async (tenant) => {
    if (!window.confirm(`Are you sure you want to remove ${tenant.name} from Room ${tenant.roomNumber}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      
      // Clear tenant data and set room as vacant
      const roomData = {
        number: tenant.roomNumber,
        tenant: '',
        tenantContact: '',
        rent: tenant.rent, // Keep the rent amount for future tenants
        rentDueDate: '',
        status: 'vacant'
      };

      await updateRoom(tenant.roomId, roomData);
      
      // Refresh the data
      await fetchPropertiesData();
      
      // Show success message
      toast.success(`${tenant.name} has been removed successfully!`, {
        theme: 'dark',
        position: 'top-right'
      });
    } catch (error) {
      console.error('Error removing tenant:', error);
      toast.error('Failed to remove tenant. Please try again.', {
        theme: 'dark',
        position: 'top-right'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Extract all tenants from all properties
  const getAllTenants = () => {
    const tenants = [];
    
    properties.forEach(property => {
      if (property.rooms) {
        property.rooms.forEach(room => {
          if (room.tenant && room.tenant.trim() !== '') {
            tenants.push({
              id: `${property.id}-${room.id}`,
              name: room.tenant,
              contact: room.tenantContact,
              rent: room.rent,
              rentDueDate: room.rentDueDate,
              status: room.status,
              roomNumber: room.number,
              propertyName: property.name,
              propertyLocation: property.location,
              propertyId: property.id,
              roomId: room.id
            });
          }
        });
      }
    });
    
    return tenants;
  };

  const tenants = getAllTenants();

  // Filter tenants based on search and status
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Paid' },
      unpaid: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Unpaid' },
      vacant: { color: 'bg-gray-100 text-gray-800', icon: User, text: 'Vacant' }
    };

    const config = statusConfig[status] || statusConfig.vacant;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRent = (rent) => {
    if (!rent || rent === 0) return 'Not set';
    return `₹ ${parseFloat(rent).toLocaleString()}`;
  };

  const totalTenants = tenants.length;
  const paidTenants = tenants.filter(t => t.status === 'paid').length;
  const unpaidTenants = tenants.filter(t => t.status === 'unpaid').length;
  const totalRent = tenants.reduce((sum, tenant) => sum + (parseFloat(tenant.rent) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading tenants data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPropertiesData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            Tenants Overview
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Manage and view all tenants from your assigned properties
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tenants Overview</h2>
          <span className="text-sm text-gray-500">{totalTenants} total tenants</span>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Tenants</p>
                <p className="text-2xl font-bold text-blue-700">{totalTenants}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-green-600 font-medium">Paid</p>
                <p className="text-2xl font-bold text-green-700">{paidTenants}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm text-red-600 font-medium">Unpaid</p>
                <p className="text-2xl font-bold text-red-700">{unpaidTenants}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Rent</p>
                <p className="text-2xl font-bold text-purple-700">₹ {totalRent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by tenant name, property, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="vacant">Vacant</option>
          </select>
        </div>
      </div>

      {/* Tenants list */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {filteredTenants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
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
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    {/* Tenant Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          {editingTenant === tenant.id ? (
                            <input
                              type="text"
                              value={editForm.tenant || ''}
                              onChange={(e) => setEditForm({...editForm, tenant: e.target.value})}
                              className="text-sm font-medium text-gray-900 border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-40"
                              placeholder="Enter tenant name"
                              required
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Property & Room */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tenant.propertyName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Room {tenant.roomNumber}
                      </div>
                      <div className="text-xs text-gray-400">{tenant.propertyLocation}</div>
                    </td>
                    
                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        {editingTenant === tenant.id ? (
                          <input
                            type="tel"
                            value={editForm.tenantContact || ''}
                            onChange={(e) => setEditForm({...editForm, tenantContact: e.target.value})}
                            className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-32"
                            placeholder="Phone number"
                          />
                        ) : (
                          tenant.contact || 'Not provided'
                        )}
                      </div>
                    </td>
                    
                    {/* Rent */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {editingTenant === tenant.id ? (
                          <input
                            type="number"
                            value={editForm.rent || ''}
                            onChange={(e) => setEditForm({...editForm, rent: e.target.value})}
                            className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
                            placeholder="Amount"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatRent(tenant.rent)
                        )}
                      </div>
                    </td>
                    
                    {/* Due Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        {editingTenant === tenant.id ? (
                          <input
                            type="date"
                            value={editForm.rentDueDate || ''}
                            onChange={(e) => setEditForm({...editForm, rentDueDate: e.target.value})}
                            className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          formatDate(tenant.rentDueDate)
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingTenant === tenant.id ? (
                        <select
                          value={editForm.status || 'unpaid'}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                          className="border border-blue-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                        </select>
                      ) : (
                        getStatusBadge(tenant.status)
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingTenant === tenant.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(tenant)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50 p-1 rounded hover:bg-green-50"
                            title="Save changes"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={actionLoading}
                            className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 p-1 rounded hover:bg-gray-50"
                            title="Cancel editing"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditTenant(tenant)}
                            disabled={actionLoading}
                            className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 p-1 rounded hover:bg-blue-50"
                            title="Edit tenant information"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveTenant(tenant)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 p-1 rounded hover:bg-red-50"
                            title="Remove tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            {tenants.length === 0 ? (
              <>
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Tenants Found</h3>
                <p className="text-gray-500">There are no tenants in your assigned properties yet.</p>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
                <p className="text-gray-500">No tenants match your search criteria.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
