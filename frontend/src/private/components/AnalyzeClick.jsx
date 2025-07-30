import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Home, ArrowLeft, User, Calendar, AlertTriangle, DollarSign, Wrench, Phone, Mail, Plus, ShoppingCart } from 'lucide-react';
import Sidebar from './sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyDetails, getEmployees, createEmployee, updateProperty, transferPropertyOwnership } from '../../services/api';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Simple DataTable component since we can't import react-data-table-component
const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.cell ? column.cell(row) : row[column.selector]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PropertyDetailsPage = () => {
  const navigate = useNavigate(); 
  const { id: propertyId } = useParams();
  
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempEmployee, setTempEmployee] = useState({});
  
  // Property editing state
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [tempPropertyData, setTempPropertyData] = useState({});
  
  // Employee assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // Sell property modal state
  const [showSellModal, setShowSellModal] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');

  // Fetch property details from API
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const response = await getPropertyDetails(propertyId);
        const property = response.data.data;
        
        setPropertyData(property);
        setEmployee(property.employee);
        setTempEmployee(property.employee ? { ...property.employee } : {});
        setTempPropertyData({ ...property }); // Initialize temp property data
        setError(null);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  // Calculate statistics for properties with employees
  const stats = propertyData && propertyData.employee ? {
    totalRooms: propertyData.rooms?.length || 0,
    occupiedRooms: propertyData.rooms?.filter(room => room.status !== 'vacant').length || 0,
    vacantRooms: propertyData.rooms?.filter(room => room.status === 'vacant').length || 0,
    totalRent: propertyData.rooms?.reduce((sum, room) => sum + (parseFloat(room.rent) || 0), 0) || 0,
    paidRent: propertyData.rooms?.filter(room => room.status === 'paid').reduce((sum, room) => sum + (parseFloat(room.rent) || 0), 0) || 0,
    unpaidRent: propertyData.rooms?.filter(room => room.status === 'unpaid').reduce((sum, room) => sum + (parseFloat(room.rent) || 0), 0) || 0,
    openIssues: propertyData.rooms?.filter(room => room.issue).length || 0,
    lastMaintenanceDate: propertyData.maintenanceRecords?.[0]?.serviceDate || propertyData.maintenanceRecords?.[0]?.createdAt
  } : null;

  const handleEdit = () => {
    setIsEditing(true);
    setTempEmployee({ ...employee });
  };

  const handleSave = () => {
    setEmployee({ ...tempEmployee });
    setIsEditing(false);
    // In real app, make API call to update employee
  };

  const handleCancel = () => {
    setTempEmployee({ ...employee });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Property editing handlers
  const handleEditProperty = () => {
    setIsEditingProperty(true);
    setTempPropertyData({ ...propertyData });
  };

  const handleSaveProperty = async () => {
    try {
      const response = await updateProperty(propertyId, tempPropertyData);
      if (response.data) {
        setPropertyData({ ...tempPropertyData });
        setIsEditingProperty(false);
        toast.success('Property updated successfully!', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleCancelPropertyEdit = () => {
    setTempPropertyData({ ...propertyData });
    setIsEditingProperty(false);
  };

  const handlePropertyInputChange = (field, value) => {
    setTempPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch employees when modal opens
  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response.data?.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Handle opening assignment modal
  const handleAssignEmployee = () => {
    setShowAssignModal(true);
    fetchEmployees();
  };

  // Handle employee assignment
  const handleConfirmAssignment = async () => {
    if (!selectedEmployeeId) {
      toast.error('Please select an employee', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      const response = await updateProperty(propertyId, { employeeId: selectedEmployeeId });
      if (response.data) {
        toast.success('Employee assigned successfully!', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
        
        // Refresh property data
        const propertyResponse = await getPropertyDetails(propertyId);
        const property = propertyResponse.data.data;
        setPropertyData(property);
        setEmployee(property.employee);
        setTempEmployee(property.employee ? { ...property.employee } : {});
        
        setShowAssignModal(false);
        setSelectedEmployeeId('');
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      toast.error('Failed to assign employee', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Handle new employee creation
  const handleCreateEmployee = async () => {
    if (!newEmployeeData.name || !newEmployeeData.email || !newEmployeeData.password) {
      toast.error('Please fill in all required fields', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    try {
      const response = await createEmployee(newEmployeeData);
      if (response.data?.success) {
        toast.success('Employee created successfully!', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
        
        // Refresh employees list
        fetchEmployees();
        
        // Auto-select the newly created employee
        setSelectedEmployeeId(response.data.data.id.toString());
        
        // Reset form and close modal
        setNewEmployeeData({
          name: '',
          email: '',
          password: '',
          phone: ''
        });
        setShowCreateEmployeeModal(false);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Failed to create employee', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Handle property transfer/sell
  const handleSellProperty = async () => {
    try {
      const response = await transferPropertyOwnership(propertyId, newOwnerName);
      if (response.data) {
        toast.success(response.data.message, {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
        
        // Refresh property data
        const propertyResponse = await getPropertyDetails(propertyId);
        const property = propertyResponse.data.data;
        setPropertyData(property);
        setEmployee(property.employee);
        setTempEmployee(property.employee ? { ...property.employee } : {});
        
        setShowSellModal(false);
        setNewOwnerName('');
      }
    } catch (error) {
      console.error('Error transferring property:', error);
      const errorMessage = error.response?.data?.message || 'Failed to transfer property';
      toast.error(errorMessage, {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Columns for rooms table when employee is assigned
  const roomColumns = [
    {
      name: 'Room',
      selector: 'number',
      sortable: true,
    },
    {
      name: 'Tenant',
      selector: 'tenant',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.tenant || 'Vacant'}</div>
          {row.tenantContact && (
            <div className="text-xs text-gray-500">{row.tenantContact}</div>
          )}
        </div>
      ),
    },
    {
      name: 'Rent',
      selector: 'rent',
      cell: (row) => (
        <span className="font-medium">
          {row.rent && parseFloat(row.rent) > 0 ? `Rs. ${parseFloat(row.rent).toLocaleString()}` : 'N/A'}
        </span>
      ),
    },
    {
      name: 'Status',
      selector: 'status',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'unpaid'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      name: 'Issue',
      selector: 'issue',
      cell: (row) => (
        <span className={`text-sm ${
          !row.issue 
            ? 'text-gray-500' 
            : 'text-red-600'
        }`}>
          {row.issue || 'No issue'}
        </span>
      ),
    },
    {
      name: 'Last Updated',
      selector: 'lastUpdated',
      cell: (row) => (
        <span className="text-xs text-gray-500">
          {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  // Columns for maintenance records
  const maintenanceColumns = [
    {
      name: 'Service',
      selector: 'serviceName',
      sortable: true,
    },
    {
      name: 'Location',
      selector: 'location',
    },
    {
      name: 'Date',
      selector: 'date',
      cell: (row) => row.serviceDate ? new Date(row.serviceDate).toLocaleDateString() : (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'),
    },
    {
      name: 'Status',
      selector: 'status',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'in-progress'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      name: 'Cost',
      selector: 'cost',
      cell: (row) => row.cost && parseFloat(row.cost) > 0 ? `Rs. ${parseFloat(row.cost).toLocaleString()}` : 'N/A',
    },
    {
      name: 'Technician',
      selector: 'technician',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="min-w-[75vw] m-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="min-w-[75vw] m-10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error</p>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/layout', { state: { showAnalyze: true } })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="min-w-[75vw] m-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Property not found</p>
            <button 
              onClick={() => navigate('/layout', { state: { showAnalyze: true } })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="min-w-[75vw] m-10 overflow-y-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <ArrowLeft 
                className="cursor-pointer hover:text-blue-600" 
                onClick={() => navigate('/layout', { state: { showAnalyze: true } })}
              />
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Property Analysis</h1>
                <p className="text-gray-600">{propertyData.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSellModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Sell Property
            </button>
          </div>
        </div>

        {/* Property Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Property Information
            </h2>
            {!isEditingProperty ? (
              <button
                onClick={handleEditProperty}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Property
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProperty}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancelPropertyEdit}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-start gap-6">
            <img 
              src={propertyData.mainImage || propertyData.images?.[0] || '/noimage.jpg'} 
              alt={propertyData.name}
              className="w-48 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              {/* Property Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name
                </label>
                {isEditingProperty ? (
                  <input
                    type="text"
                    value={tempPropertyData.name || ''}
                    onChange={(e) => handlePropertyInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xl font-semibold"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900">{propertyData.name}</h2>
                )}
              </div>

              {/* Property Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditingProperty ? (
                  <input
                    type="text"
                    value={tempPropertyData.location || ''}
                    onChange={(e) => handlePropertyInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-600">{propertyData.location}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  {isEditingProperty ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={tempPropertyData.price || ''}
                        onChange={(e) => handlePropertyInputChange('price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Price"
                      />
                      <select
                        value={tempPropertyData.priceDuration || 'One Day'}
                        onChange={(e) => handlePropertyInputChange('priceDuration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="One Day">Per Day</option>
                        <option value="One Week">Per Week</option>
                        <option value="One Month">Per Month</option>
                        <option value="One Year">Per Year</option>
                      </select>
                    </div>
                  ) : (
                    <div className="font-medium">Rs. {parseFloat(propertyData.price).toLocaleString()}/{propertyData.priceDuration}</div>
                  )}
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  {isEditingProperty ? (
                    <input
                      type="number"
                      value={tempPropertyData.beds || ''}
                      onChange={(e) => handlePropertyInputChange('beds', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min="0"
                    />
                  ) : (
                    <div className="font-medium">{propertyData.beds}</div>
                  )}
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  {isEditingProperty ? (
                    <input
                      type="number"
                      value={tempPropertyData.baths || ''}
                      onChange={(e) => handlePropertyInputChange('baths', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min="0"
                    />
                  ) : (
                    <div className="font-medium">{propertyData.baths}</div>
                  )}
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sqm)
                  </label>
                  {isEditingProperty ? (
                    <input
                      type="number"
                      value={tempPropertyData.areaSqm || ''}
                      onChange={(e) => handlePropertyInputChange('areaSqm', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min="0"
                    />
                  ) : (
                    <div className="font-medium">{propertyData.areaSqm} sqm</div>
                  )}
                </div>
              </div>

              {/* Property Type */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                {isEditingProperty ? (
                  <select
                    value={tempPropertyData.type || 'House'}
                    onChange={(e) => handlePropertyInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condo">Condo</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                ) : (
                  <div className="font-medium">{propertyData.type || 'House'}</div>
                )}
              </div>

              {/* Amenities */}
              {isEditingProperty && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempPropertyData.hasKitchen || false}
                        onChange={(e) => handlePropertyInputChange('hasKitchen', e.target.checked)}
                        className="mr-2"
                      />
                      Kitchen
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempPropertyData.hasBalcony || false}
                        onChange={(e) => handlePropertyInputChange('hasBalcony', e.target.checked)}
                        className="mr-2"
                      />
                      Balcony
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tempPropertyData.hasParking || false}
                        onChange={(e) => handlePropertyInputChange('hasParking', e.target.checked)}
                        className="mr-2"
                      />
                      Parking
                    </label>
                  </div>
                </div>
              )}

              {/* Description */}
              {(propertyData.description || isEditingProperty) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditingProperty ? (
                    <textarea
                      value={tempPropertyData.description || ''}
                      onChange={(e) => handlePropertyInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      rows="3"
                      placeholder="Property description..."
                    />
                  ) : (
                    <p className="text-gray-700">{propertyData.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {propertyData.employee ? (
          // Show detailed management view when employee is assigned
          <>
            {/* Statistics Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Occupancy</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.occupiedRooms}/{stats.totalRooms}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                      <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalRent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Open Issues</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.openIssues}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                      <Wrench className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Last Service</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.lastMaintenanceDate 
                          ? new Date(stats.lastMaintenanceDate).toLocaleDateString() 
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Employee Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Assigned Employee
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempEmployee.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {employee?.name || 'N/A'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempEmployee.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {employee?.email || 'N/A'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempEmployee.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {employee?.phone || 'N/A'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {employee?.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms Table */}
            {propertyData.rooms && propertyData.rooms.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Management</h2>
                <DataTable 
                  columns={roomColumns} 
                  data={propertyData.rooms}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Management</h2>
                <div className="text-center py-8">
                  <p className="text-gray-500">No rooms have been added yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Employee can add rooms from their portal.</p>
                </div>
              </div>
            )}

            {/* Maintenance Records */}
            {propertyData.maintenanceRecords && propertyData.maintenanceRecords.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Records</h2>
                <DataTable 
                  columns={maintenanceColumns} 
                  data={propertyData.maintenanceRecords}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Records</h2>
                <div className="text-center py-8">
                  <p className="text-gray-500">No maintenance records found.</p>
                  <p className="text-sm text-gray-400 mt-2">Employee can add maintenance records from their portal.</p>
                </div>
              </div>
            )}
          </>
        ) : (
          // Show basic property view when no employee is assigned
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employee Assigned</h3>
              <p className="text-gray-600 mb-6">
                This property doesn't have an assigned employee yet. Only basic property information is available.
              </p>
              
              {/* Basic property amenities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto text-left">
                {propertyData.hasKitchen && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Kitchen Available
                  </div>
                )}
                {propertyData.hasBalcony && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Balcony Available
                  </div>
                )}
                {propertyData.hasParking && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Parking Available
                  </div>
                )}
                {!propertyData.hasKitchen && !propertyData.hasBalcony && !propertyData.hasParking && (
                  <div className="col-span-3 text-center">
                    <p className="text-sm text-gray-400">No additional amenities listed</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleAssignEmployee}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign Employee
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Assign Employee</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Don't have the employee you need?</span>
                <button
                  type="button"
                  onClick={() => setShowCreateEmployeeModal(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create New
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployeeId('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Employee</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newEmployeeData.name}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newEmployeeData.email}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newEmployeeData.phone}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={newEmployeeData.password}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowCreateEmployeeModal(false);
                  setNewEmployeeData({
                    name: '',
                    email: '',
                    password: '',
                    phone: ''
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateEmployee}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Property Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Sell Property</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Owner's Name (Optional)
                </label>
                <input
                  type="text"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  placeholder="Enter new owner's name or leave empty"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  If you enter a name, the property will be transferred to that user. 
                  If left empty, the property ownership will be removed.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowSellModal(false);
                  setNewOwnerName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSellProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {newOwnerName.trim() ? 'Transfer Property' : 'Remove Ownership'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default PropertyDetailsPage;