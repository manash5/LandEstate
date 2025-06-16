import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, DollarSign, User, MapPin, Settings, Download, Plus } from 'lucide-react';
import DataTable from 'react-data-table-component';

// Mock data for demonstration
const initialServiceRecords = [
  {
    id: 1,
    serviceName: "HVAC Maintenance",
    description: "Annual heating and cooling system inspection",
    property: "Sunrise Apartments",
    date: "2024-03-15",
    location: "Building A - Unit 101",
    cost: 15000,
    status: "completed",
    technician: "Ram Kumar"
  },
  {
    id: 2,
    serviceName: "Plumbing Repair",
    description: "Kitchen sink pipe replacement",
    property: "Downtown Office",
    date: "2024-03-20",
    location: "Floor 3 - Kitchen",
    cost: 8500,
    status: "in-progress",
    technician: "Sita Sharma"
  },
  {
    id: 3,
    serviceName: "Electrical Inspection",
    description: "Safety inspection of main electrical panel",
    property: "Mountain View Resort",
    date: "2024-03-25",
    location: "Main Building - Basement",
    cost: 12000,
    status: "pending",
    technician: "Hari Thapa"
  },
  {
    id: 4,
    serviceName: "Roof Maintenance",
    description: "Gutter cleaning and minor repairs",
    property: "Lakeside Villa",
    date: "2024-03-10",
    location: "Rooftop",
    cost: 25000,
    status: "completed",
    technician: "Krishna Patel"
  },
  {
    id: 5,
    serviceName: "Garden Landscaping",
    description: "Seasonal garden maintenance and pruning",
    property: "Green Valley Complex",
    date: "2024-03-28",
    location: "Front Garden",
    cost: 18000,
    status: "in-progress",
    technician: "Maya Gurung"
  }
];

const ServiceRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [records, setRecords] = useState(initialServiceRecords);
  const [editingRow, setEditingRow] = useState(null);

  const handleStatusChange = (recordId, newStatus) => {
    setRecords(currentRecords => 
      currentRecords.map(record => 
        record.id === recordId 
          ? { ...record, status: newStatus }
          : record
      )
    );
    setEditingRow(null);
  };

  const getStatusBadge = (status, recordId, isEditable = false) => {
    const statusConfig = {
      completed: { 
        bg: 'bg-emerald-100', 
        text: 'text-emerald-800',
        dot: 'bg-emerald-500',
        hover: 'hover:bg-emerald-200'
      },
      'in-progress': { 
        bg: 'bg-amber-100', 
        text: 'text-amber-800',
        dot: 'bg-amber-500',
        hover: 'hover:bg-amber-200'
      },
      pending: { 
        bg: 'bg-rose-100', 
        text: 'text-rose-800',
        dot: 'bg-rose-500',
        hover: 'hover:bg-rose-200'
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    if (isEditable && editingRow === recordId) {
      return (
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleStatusChange(recordId, e.target.value)}
            onBlur={() => setEditingRow(null)}
            autoFocus
            className="text-xs font-medium border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none cursor-pointer pr-8"
          >
            <option value="pending" className="text-rose-800">PENDING</option>
            <option value="in-progress" className="text-amber-800">IN PROGRESS</option>
            <option value="completed" className="text-emerald-800">COMPLETED</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${config.bg} ${config.text} ${config.hover}`}
        onClick={() => isEditable && setEditingRow(recordId)}
        title={isEditable ? "Click to edit status" : ""}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
        {status.replace('-', ' ').toUpperCase()}
      </div>
    );
  };

  const columns = [
    {
      name: 'Service Details',
      selector: row => row.serviceName,
      sortable: true,
      minWidth: '280px',
      cell: row => (
        <div className="py-2">
          <div className="font-semibold text-gray-900 mb-1">{row.serviceName}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      ),
    },
    {
      name: 'Property',
      selector: row => row.property,
      sortable: true,
      minWidth: '180px',
      cell: row => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.property}</div>
            <div className="text-xs text-gray-500">{row.location}</div>
          </div>
        </div>
      ),
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
      minWidth: '120px',
      cell: row => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {new Date(row.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      ),
    },
    {
      name: 'Cost',
      selector: row => row.cost,
      sortable: true,
      minWidth: '120px',
      cell: row => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            NPR {row.cost.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      minWidth: '140px',
      cell: row => getStatusBadge(row.status, row.id, true),
    },
    {
      name: 'Technician',
      selector: row => row.technician,
      sortable: true,
      minWidth: '160px',
      cell: row => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">{row.technician}</span>
        </div>
      ),
    },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.technician.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, records]);

  const customStyles = {
    table: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        borderBottomColor: '#e2e8f0',
        borderBottomWidth: '1px',
        minHeight: '52px',
      },
    },
    headCells: {
      style: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    rows: {
      style: {
        minHeight: '80px',
        borderBottomColor: '#f1f5f9',
        borderBottomWidth: '1px',
        '&:hover': {
          backgroundColor: '#f8fafc',
          cursor: 'pointer',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
  };

  const StatusCard = ({ title, count, color, bgColor, percentage }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <div className={`w-6 h-6 ${color} rounded-full`}></div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <div className={`text-xs px-2 py-1 rounded-full ${bgColor} ${color}`}>
          {percentage}
        </div>
      </div>
    </div>
  );

  const completedCount = records.filter(r => r.status === 'completed').length;
  const inProgressCount = records.filter(r => r.status === 'in-progress').length;
  const pendingCount = records.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Service Records
            </h1>
            <p className="text-gray-600 mt-2">Track and manage all maintenance activities</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard
            title="Completed"
            count={completedCount}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
            percentage={`${Math.round((completedCount / records.length) * 100)}%`}
          />
          <StatusCard
            title="In Progress"
            count={inProgressCount}
            color="text-amber-600"
            bgColor="bg-amber-50"
            percentage={`${Math.round((inProgressCount / records.length) * 100)}%`}
          />
          <StatusCard
            title="Pending"
            count={pendingCount}
            color="text-rose-600"
            bgColor="bg-rose-50"
            percentage={`${Math.round((pendingCount / records.length) * 100)}%`}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services, properties, or technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredRecords}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            responsive
            highlightOnHover
            noDataComponent={
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceRecords;