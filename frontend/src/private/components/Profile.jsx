import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Phone, Mail, MoreHorizontal, ChevronRight, Edit3, Shield, Calendar } from 'lucide-react';
import { getCurrentUser, fetchUserProperties, updateProfileImage } from '../../services/api';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Function to format date to "YYYY-MM-DD" format
  const formatMemberSince = (dateString) => {
    console.log('formatMemberSince called with:', dateString);
    
    if (!dateString) {
      console.log('Date string is null/undefined');
      return 'Not available';
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log('Invalid date:', dateString);
      return 'Not available';
    }
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    console.log('Formatted date:', formattedDate);
    return formattedDate;
  };

  // Handle camera button click
  const handleCameraClick = () => {
    if (imageLoading) return; // Prevent clicks during upload
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!user || !user.id) {
      toast.error('User not found. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      setImageLoading(true);
      
      console.log('Uploading profile image for user ID:', user.id);
      
      // Upload image to backend
      const response = await updateProfileImage(user.id, file);
      
      if (response.data && response.data.imagePath) {
        // Update user state with new profile image
        const updatedUser = { ...user, profileImage: response.data.imagePath };
        setUser(updatedUser);
        
        // Create preview URL for immediate display
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
        
        toast.success('Profile image updated successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Check if it's an authentication/authorization error
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to update this profile image.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.error('Failed to update profile image. Please try again.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
        });
      }
    } finally {
      setImageLoading(false);
    }
  };

  // Get profile image source
  const getProfileImageSrc = () => {
    if (profileImage) {
      return profileImage; // User uploaded image preview
    }
    if (user?.profileImage) {
      // Check if it's a full URL or relative path
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      } else {
        // Relative path from backend, prepend server URL
        return `http://localhost:4000${user.profileImage}`;
      }
    }
    return '/noimage.jpg'; // Default no image
  };

  // Fetch user information and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user information
        const userResponse = await getCurrentUser();
        const currentUser = userResponse.data?.data;

        if (!currentUser || !currentUser.id) {
          throw new Error('User not authenticated');
        }

        // Debug: Log the user data to see what fields are available
        console.log('Full user data:', currentUser);
        console.log('User ID:', currentUser.id);
        console.log('User ID type:', typeof currentUser.id);
        console.log('Created at field:', currentUser.created_at);
        console.log('Created at type:', typeof currentUser.created_at);
        console.log('All user keys:', Object.keys(currentUser));

        // Set user data
        setUser(currentUser);

        // Fetch only the user's properties
        const propertiesResponse = await fetchUserProperties(currentUser.id);

        if (propertiesResponse.data?.data) {
          setProperties(propertiesResponse.data.data);
        }

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map backend property data to UI format
  const mapPropertyToUI = (property) => ({
    id: property.id,
    name: property.name,
    location: property.location,
    price: `₹${property.price}/${property.priceDuration}`,
    image: property.mainImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
  });

  const mappedProperties = properties.map(mapPropertyToUI);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 my-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 my-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-red-500 text-center">
            <h3 className="text-xl font-semibold mb-2">Error Loading Profile</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 my-10">
      <div className="max-w-7xl mx-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your properties</p>
        </div>
        
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={getProfileImageSrc()}
                      alt="Profile"
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/noimage.jpg';
                      }}
                    />
                  </div>
                </div>
                <button 
                  onClick={handleCameraClick}
                  disabled={imageLoading}
                  className={`absolute -bottom-1 -right-1 bg-white rounded-lg p-2 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                    imageLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={imageLoading ? "Uploading..." : "Change profile picture"}
                >
                  {imageLoading ? (
                    <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-3 h-3 text-gray-600" />
                  )}
                </button>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={imageLoading}
                  className="hidden"
                />
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user ? user.name : 'Loading...'}
                  </h2>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Verified</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <Mail className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm">{user ? user.email : 'Loading...'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <Phone className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm">{user ? user.phone : 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</p>
                        <p className="text-sm">{user ? user.address : 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <Calendar className="w-3 h-3" />
                      </div>
                                              <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Member Since</p>
                          <p className="text-sm">
                            {user ? formatMemberSince(user.created_at || user.createdAt) : 'Loading...'}
                          </p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
        
        {/* Property List Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">My Properties</h3>
              <p className="text-gray-600">Manage and view your property listings</p>
            </div>
          </div>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedProperties.map((property) => (
              <div key={property.id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs font-medium text-gray-700">Active</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-600">{property.price}</p>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* No Properties Message */}
          {mappedProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first property listing.</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Add Property
                </button>
              </div>
            </div>
          )}
          
          {/* View More Button */}
          {mappedProperties.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                <span>View All Properties</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Profile;