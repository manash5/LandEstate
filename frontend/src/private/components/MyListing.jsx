import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Phone, Mail, MoreHorizontal, ChevronRight } from 'lucide-react';
import { getCurrentUser, fetchProperties } from '../../services/api';

const MyListing = () => {
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const filters = ['Popular', 'Recommended', 'Newest', 'Most Recent'];

  // Fetch user information and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user information
        const userResponse = await getCurrentUser();

        // Fetch properties
        const propertiesResponse = await fetchProperties();

        if (userResponse.data?.data) {
          setUser(userResponse.data.data);
        }

        if (propertiesResponse.data?.data) {
          setProperties(propertiesResponse.data.data);
        }

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load listing data');
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
    price: `$${property.price}/${property.priceDuration}`,
    image: property.mainImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'
  });

  const mappedProperties = properties.map(mapPropertyToUI);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-red-500 text-center">
            <h3 className="text-xl font-semibold mb-2">Error Loading Listings</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Image with Gradient Background */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-pink-200/50"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user ? user.name : 'Loading...'}
                </h2>
                <p className="text-gray-500 mb-6">User</p>
                
                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Address</p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Address not available</span>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Phone Number</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Phone not available</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user ? user.email : 'Loading...'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Property List Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Property List</h3>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedProperties.map((property) => (
              <div key={property.id} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h4>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{property.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* No Properties Message */}
          {mappedProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                <p className="text-gray-600">You haven't added any properties yet.</p>
              </div>
            </div>
          )}
          
          {/* View More Button */}
          {mappedProperties.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <span>View More Properties</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListing;