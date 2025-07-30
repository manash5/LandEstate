import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import {upload, getCurrentUser, getEmployees, createEmployee} from '../../services/api'
import { ToastContainer, Bounce, toast } from "react-toastify";



const AddPropertyModal = ({
  isOpen,
  onClose,
  onAddProperty,
  onPropertyAdded
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
  defaultValues: {
    name: "",
    location: "",
    price: "",
    priceDuration: "one time",
    type: "House", // Add type with default value
    beds: "",
    baths: "",
    areaSqm: "",
    hasKitchen: false,
    hasBalcony: false,
    hasParking: false,
    description: "",
    images: [],
    employeeId: "",
  },
});

const [selectedFiles, setSelectedFiles] = React.useState([]);
const [currentUser, setCurrentUser] = useState(null);
const [employees, setEmployees] = useState([]);
const [showEmployeeModal, setShowEmployeeModal] = useState(false);
const [employeeFormData, setEmployeeFormData] = useState({
  name: '',
  email: '',
  password: '',
  phone: ''
});
const images = watch("images", []);

// Fetch current user and employees on component mount
useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      // Debug: Check all localStorage items
      console.log('All localStorage items:', Object.keys(localStorage));
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        toast.error('Authentication token not found. Please login again.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      console.log('Token found:', token.substring(0, 20) + '...');
      
      const response = await getCurrentUser();
      console.log('getCurrentUser response:', response);
      
      if (response.data?.data) {
        setCurrentUser(response.data.data);
        console.log('Current user set:', response.data.data);
      } else {
        console.error('No user data in response:', response);
        toast.error('No user data received from server', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to fetch user information';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please check your authentication.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response.data?.data) {
        setEmployees(response.data.data);
        console.log('Employees fetched:', response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      // Don't show error toast for employees as it's optional
    }
  };

  fetchCurrentUser();
  fetchEmployees();
}, []);

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
          phone: ''
        });
        
        // Refresh employees list
        const employeesResponse = await getEmployees();
        if (employeesResponse.data?.data) {
          setEmployees(employeesResponse.data.data);
        }
        
        // Auto-select the newly created employee
        if (response.data?.data?.id) {
          setValue("employeeId", response.data.data.id.toString());
        }
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

  const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  setSelectedFiles(prev => [...prev, ...files]);
  const urls = files.map((file) => URL.createObjectURL(file));
  setValue("images", [...images, ...urls]);
};

  const onSubmit = async (data) => {
    if (!currentUser) {
      toast.error('User information not available. Please try again.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("priceDuration", data.priceDuration);
    formData.append("type", data.type); // Add type to form data
    formData.append("beds", data.beds);
    formData.append("baths", data.baths);
    formData.append("areaSqm", data.areaSqm);
    formData.append("hasKitchen", data.hasKitchen);
    formData.append("hasBalcony", data.hasBalcony);
    formData.append("hasParking", data.hasParking);
    formData.append("description", data.description);
    formData.append("userId", currentUser.id);
    
    // Only append employeeId if one is selected
    if (data.employeeId && data.employeeId !== "") {
      formData.append("employeeId", data.employeeId);
    }

    selectedFiles.forEach((file) => {
    formData.append("images", file);
  });

    try {
      const response = await upload(formData); 
      onClose();
      reset();
      setSelectedFiles([]);
      // Call the callback to refresh properties list
      if (onPropertyAdded) {
        onPropertyAdded();
      }
      toast.success('Property sucessfully added', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    } catch (error) {
      console.error("Upload failed", error);
      toast.error('Cannot add property', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    }
  };

  if (!isOpen) return null;

  return (
    <>
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name", { required: true })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("location", { required: true })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("type", { required: true })}
            >
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Hotel">Hotel</option>
            <option value="Commercial">Commercial</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Employee</label>
            <div className="flex gap-2">
              <select
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("employeeId")}
              >
              <option value="">None (No employee assigned)</option>
              {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.email}
                  </option>
              ))}
              </select>
              <button
                type="button"
                onClick={() => setShowEmployeeModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-1"
              >
                <span className="text-lg">+</span> New
              </button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$"
                {...register("price", { required: true })}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Duration</label>
            <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("priceDuration", { required: true })}
            >
                <option value = 'one time'>One Time </option>
                <option value="per month">Per Month</option>
                <option value="per night">Per Night</option>
                <option value="per week">Per Week</option>
            </select>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("beds", { required: true })}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("baths", { required: true })}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm)</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 28"
                {...register("areaSqm", { required: true })}
            />
            </div>
        </div>
        <div className="flex gap-4">
            <label className="flex items-center">
            <input type="checkbox" {...register("hasKitchen")} />
            <span className="ml-2">Kitchen</span>
            </label>
            <label className="flex items-center">
            <input type="checkbox" {...register("hasBalcony")} />
            <span className="ml-2">Balcony</span>
            </label>
            <label className="flex items-center">
            <input type="checkbox" {...register("hasParking")} />
            <span className="ml-2">Parking</span>
            </label>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            {...register("description", { required: true })}
            />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <button
              type="button"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Add File
            </button>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {images && images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setValue("images", newImages);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Upload Property
            </button>
          </div>
        </form>
      </div>
    </div>
    
    {/* Employee Creation Modal */}
    {showEmployeeModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Employee</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={employeeFormData.name}
                onChange={(e) => setEmployeeFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={employeeFormData.email}
                onChange={(e) => setEmployeeFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={employeeFormData.phone}
                onChange={(e) => setEmployeeFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={employeeFormData.password}
                onChange={(e) => setEmployeeFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowEmployeeModal(false);
                setEmployeeFormData({
                  name: '',
                  email: '',
                  password: '',
                  phone: ''
                });
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateEmployee}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Create Employee
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AddPropertyModal;