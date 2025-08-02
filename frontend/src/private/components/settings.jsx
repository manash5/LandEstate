"use client"

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Users,
  Eye, 
  EyeOff, 
  Save, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { getCurrentUser, createEmployee, getEmployees, updateEmployee, deleteEmployee } from '../../services/api';

const settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    hireDate: '',
    isActive: true
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user information and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        if (response.data?.data) {
          const userData = response.data.data;
          setUser(userData);
          
          // Split the name into first and last name
          const nameParts = userData.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: userData.email || '',
            phone: '' // Phone not available in current user model
          }));
        }

        // Fetch employees
        await fetchEmployees();
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response.data?.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'employees', label: 'Employee Management', icon: Users }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeInputChange = (field, value) => {
    setEmployeeFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEmployee = async () => {
    try {
      if (!employeeFormData.name || !employeeFormData.email || !employeeFormData.password) {
        toast.error('Please fill in all required fields', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      const response = await createEmployee(employeeFormData);
      if (response.data?.success) {
        toast.success('Employee created successfully!', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
        setShowEmployeeModal(false);
        setEmployeeFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          hireDate: '',
          isActive: true
        });
        fetchEmployees();
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

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeFormData({
      name: employee.name,
      email: employee.email,
      password: '',
      phone: employee.phone || '',
      hireDate: employee.hireDate || (employee.created_at ? new Date(employee.created_at).toISOString().split('T')[0] : ''),
      isActive: employee.isActive !== undefined ? employee.isActive : true
    });
    setShowEmployeeModal(true);
  };

  const handleUpdateEmployee = async () => {
    try {
      const updateData = { ...employeeFormData };
      if (!updateData.password) {
        delete updateData.password; // Don't update password if not provided
      }

      const response = await updateEmployee(editingEmployee.id, updateData);
      if (response.data?.success) {
        toast.success('Employee updated successfully!', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
        setShowEmployeeModal(false);
        setEditingEmployee(null);
        setEmployeeFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          hireDate: '',
          isActive: true
        });
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await deleteEmployee(employeeId);
        if (response.data?.success) {
          toast.success('Employee deleted successfully!', {
            position: "bottom-right",
            theme: "dark",
            transition: Bounce,
          });
          fetchEmployees();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
        });
      }
    }
  };

  const handleEmployeeSubmit = async () => {
    if (editingEmployee) {
      await handleUpdateEmployee();
    } else {
      await handleCreateEmployee();
    }
  };

  const handleSave = () => {
    console.log('Saving settings:', formData);
    toast.success('Settings saved successfully!', {
      position: "bottom-right",
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      toast.success('Logged out successfully!', {
        position: "bottom-right",
        theme: "dark",
        transition: Bounce,
      });
      // Logout logic 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading settings...</p>
        </div>
      </div>
    );
  }

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-900' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-900" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-900" />
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-900" />
            Employee Management
          </h3>
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
        
        {employees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No employees added yet</p>
            <p className="text-sm text-gray-500">Create employee accounts to manage your team</p>
          </div>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{employee.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {employee.phone}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">ID:</span> {employee.id}
                      </div>
                      <div>
                        <span className="font-medium">Hired:</span> {new Date(employee.hireDate || employee.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit Employee"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'security':
        return renderSecuritySettings();
      case 'employees':
        return renderEmployeeSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
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
      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={employeeFormData.name}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={employeeFormData.phone}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingEmployee && <span className="text-gray-500 text-xs">(leave blank to keep current password)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={employeeFormData.password}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingEmployee}
                  placeholder={editingEmployee ? "Enter new password (optional)" : "Enter password"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={employeeFormData.hireDate}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={employeeFormData.isActive}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active Employee
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEmployeeModal(false);
                  setEditingEmployee(null);
                  setEmployeeFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    hireDate: '',
                    isActive: true
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmployeeSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingEmployee ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-white px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-5">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
                    Landestate Settings
                  </h1>
                  <p className="text-gray-600 mt-1 text-lg font-medium">
                    Manage your account and property preferences
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-md"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default settings;