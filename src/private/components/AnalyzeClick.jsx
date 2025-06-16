import React, { useState } from 'react';
import { Edit3, Save, X, Home, ArrowLeft } from 'lucide-react';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';

// Mock data for the rental units
const mockRentalData = [
  {
    id: 1,
    unit: 'A101',
    type: 'Rent',
    amount: '$1,200',
    status: 'Paid',
    issue: 'No issue'
  },
  {
    id: 2,
    unit: 'A102',
    type: 'Rent',
    amount: '$1,200',
    status: 'Unpaid',
    issue: 'lacakg'
  },
  {
    id: 3,
    unit: 'A103',
    type: 'Rent',
    amount: '$1,200',
    status: 'Unpaid',
    issue: 'No issue'
  },
  {
    id: 4,
    unit: 'A104',
    type: 'Rent',
    amount: '$1,200',
    status: 'Unpaid',
    issue: 'Electrical issue'
  }
];

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
    
  const [employee, setEmployee] = useState({
    username: 'Ramesh',
    password: 'Edit'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempEmployee, setTempEmployee] = useState({ ...employee });

  const handleEdit = () => {
    setIsEditing(true);
    setTempEmployee({ ...employee });
  };

  const handleSave = () => {
    setEmployee({ ...tempEmployee });
    setIsEditing(false);
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

  // Define columns for the data table
  const columns = [
    {
      name: 'Unit',
      selector: 'unit',
      sortable: true,
    },
    {
      name: 'Type',
      selector: 'type',
      sortable: true,
    },
    {
      name: 'Amount',
      selector: 'amount',
      sortable: true,
    },
    {
      name: 'Status',
      selector: 'status',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Paid' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Issue',
      selector: 'issue',
      cell: (row) => (
        <span className={`text-sm ${
          row.issue === 'No issue' 
            ? 'text-gray-500' 
            : 'text-red-600'
        }`}>
          {row.issue}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="min-w-[75vw] m-10 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
          <ArrowLeft onClick={()=>navigate('/layout', { state: { showAnalyze: true } })}/>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Details</h1>
              <p className="text-gray-600">House 1</p>
            </div>
          </div>
        </div>

        {/* Employee Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Employee Information</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempEmployee.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {employee.username}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempEmployee.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {employee.password}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rental Units Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rental Units</h2>
          <DataTable 
            columns={columns} 
            data={mockRentalData}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;