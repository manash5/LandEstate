import React, { useState } from 'react';
import { User, Phone, DollarSign, Calendar, MapPin, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const TenantsOverview = ({ properties }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  return (
    <div className="space-y-6">
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
              <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tenant.propertyName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Room {tenant.roomNumber}
                      </div>
                      <div className="text-xs text-gray-400">{tenant.propertyLocation}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {tenant.contact || 'Not provided'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatRent(tenant.rent)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(tenant.rentDueDate)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tenant.status)}
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
};

export { TenantsOverview };
export default TenantsOverview;