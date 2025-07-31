import React, { useState, useEffect } from 'react';
import { Home, Building, Users, Star, Settings, Bell, Search, TrendingUp, TrendingDown, Eye, Heart, FileSpreadsheet } from 'lucide-react';
import Sidebar from './sidebar';
import { getCurrentUser, fetchUserProperties, getEmployees, fetchProperties } from '../../services/api';

const dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    propsSale: 0,
    propsRented: 0,
    noOfEmployees: 0,
    newListing: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [propertyTypeDistribution, setPropertyTypeDistribution] = useState([]);
  const [priceRangeData, setPriceRangeData] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get current user data
        const userResponse = await getCurrentUser();
        if (!userResponse.data.data) {
          setError('User not found. Please login again.');
          return;
        }

        const user = userResponse.data.data;
        setCurrentUser(user);

        // Fetch user's properties
        const userPropertiesResponse = await fetchUserProperties(user.id);
        const userProperties = userPropertiesResponse.data.data || [];

        // 1. Props Sale - Total number of properties the user has listed
        const propsSale = userProperties.length;

        // 2. Props Rented - Properties with monthly rent (priceDuration includes 'month')
        const propsRented = userProperties.filter(property => 
          property.priceDuration && property.priceDuration.toLowerCase().includes('month')
        ).length;

        // 3. No of Employees - Get all employees (assuming they belong to the current user)
        let noOfEmployees = 0;
        try {
          const employeesResponse = await getEmployees();
          noOfEmployees = employeesResponse.data.data ? employeesResponse.data.data.length : 0;
        } catch (empError) {
          console.log('Could not fetch employees:', empError);
          // If employees endpoint fails, set to 0
          noOfEmployees = 0;
        }

        // 4. New Listing - Total properties added this month by all users
        const allPropertiesResponse = await fetchProperties();
        const allProperties = allPropertiesResponse.data.data || [];
        
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        const newListing = allProperties.filter(property => {
          const createdDate = new Date(property.createdAt);
          return createdDate >= firstDayOfMonth;
        }).length;

        setDashboardStats({
          propsSale,
          propsRented,
          noOfEmployees,
          newListing
        });

        // Calculate property type distribution from all properties
        const propertyTypes = {};
        allProperties.forEach(property => {
          if (property.type) {
            propertyTypes[property.type] = (propertyTypes[property.type] || 0) + 1;
          }
        });

        const totalProperties = allProperties.length;
        const typeDistribution = Object.entries(propertyTypes).map(([type, count]) => ({
          type,
          count,
          percentage: totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0
        }));

        setPropertyTypeDistribution(typeDistribution);

        // Calculate price range distribution
        const priceRanges = {
          'Under $200K': 0,
          '$200K - $400K': 0,
          '$400K - $600K': 0,
          '$600K - $800K': 0,
          '$800K - $1M': 0,
          'Over $1M': 0
        };

        allProperties.forEach(property => {
          const price = parseFloat(property.price) || 0;
          if (price < 200000) {
            priceRanges['Under $200K']++;
          } else if (price < 400000) {
            priceRanges['$200K - $400K']++;
          } else if (price < 600000) {
            priceRanges['$400K - $600K']++;
          } else if (price < 800000) {
            priceRanges['$600K - $800K']++;
          } else if (price < 1000000) {
            priceRanges['$800K - $1M']++;
          } else {
            priceRanges['Over $1M']++;
          }
        });

        const priceRangeArray = Object.entries(priceRanges).map(([range, count]) => ({
          range,
          count,
          percentage: totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0
        }));

        setPriceRangeData(priceRangeArray);

        // Set featured properties (user's most recent properties)
        setFeaturedProperties(userProperties.slice(0, 2));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response && error.response.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to load dashboard statistics');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'mylisting', label: 'My Listing', icon: FileSpreadsheet },
    { id: 'rental', label: 'Rental Mng', icon: Building },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'msg', label: 'Msg', icon: Users },
    { id: 'notification', label: 'Notification', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const statsCards = [
    { 
      title: 'Props Sale', 
      value: loading ? '...' : dashboardStats.propsSale.toString(), 
      subtitle: 'Total', 
      color: 'from-blue-500 to-purple-600', 
      icon: Building 
    },
    { 
      title: 'Props Rented', 
      value: loading ? '...' : dashboardStats.propsRented.toString(), 
      subtitle: 'Monthly Rent', 
      color: 'from-orange-500 to-red-500', 
      icon: Home 
    },
    { 
      title: 'No of Employees', 
      value: loading ? '...' : dashboardStats.noOfEmployees.toString(), 
      subtitle: 'Active', 
      color: 'from-green-500 to-teal-500', 
      icon: Users 
    },
    { 
      title: 'New Listing', 
      value: loading ? '...' : dashboardStats.newListing.toString(), 
      subtitle: 'This month', 
      color: 'from-pink-500 to-rose-500', 
      icon: Star 
    },
  ];

  const referralData = [
    { source: 'Social Media', percentage: 64, color: 'bg-blue-500' },
    { source: 'Marketplaces', percentage: 40, color: 'bg-green-500' },
    { source: 'Websites', percentage: 50, color: 'bg-yellow-500' },
    { source: 'Digital Ads', percentage: 80, color: 'bg-purple-500' },
    { source: 'Others', percentage: 15, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-8 py-6 my-6 mx-8 rounded-xl ">
          <div className="flex items-center justify-between px-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome{currentUser ? `, ${currentUser.name}` : ''}
              </h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your properties</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mx-8 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="px-8 py-4 overflow-y-auto">
          {/* Stats Cards */}
          <div className="flex gap-6 mb-8 overflow-x-auto">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 min-w-64 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                      <p className="text-gray-400 text-xs mt-1">{card.subtitle}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recommendations Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recommend for you */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Market Analytics</h3>
                <p className="text-gray-500 mb-4">Property distribution and pricing insights</p>
                <div className="h-64">
                  {/* Property Type Distribution Chart */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Property Types</h4>
                      <div className="space-y-3">
                        {loading ? (
                          <div className="text-center text-gray-500 text-xs">Loading...</div>
                        ) : propertyTypeDistribution.length > 0 ? (
                          propertyTypeDistribution.map((item, index) => {
                            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500'];
                            const colorClass = colors[index % colors.length];
                            return (
                              <div key={item.type} className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">{item.type}</span>
                                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`${colorClass} h-2 rounded-full`} 
                                    style={{width: `${item.percentage}%`}}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold">{item.percentage}%</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-gray-500 text-xs">No properties found</div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range Distribution</h4>
                      <div className="h-32 flex items-end space-x-2">
                        {loading ? (
                          <div className="flex-1 text-center text-gray-500 text-xs">Loading...</div>
                        ) : priceRangeData.length > 0 ? (
                          priceRangeData.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-t from-teal-500 to-green-400 rounded-t-lg flex-1"
                              style={{ height: `${Math.max(item.percentage, 5)}%` }}
                              title={`${item.range}: ${item.count} properties (${item.percentage}%)`}
                            ></div>
                          ))
                        ) : (
                          <div className="flex-1 text-center text-gray-500 text-xs">No data</div>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>&lt;$200K</span>
                        <span>$400K</span>
                        <span>$600K</span>
                        <span>$800K</span>
                        <span>$1M+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Revenue</h3>
                  <div className="flex items-center space-x-2 text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-800">$236,535</p>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                </div>
                <div className="h-48 bg-gradient-to-t from-blue-50 to-transparent rounded-xl flex items-end justify-center p-4">
                  <div className="flex items-end space-x-2 w-full">
                    {[40, 60, 35, 80, 45, 90, 70, 85, 65].map((height, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg flex-1"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Maintenance & Room Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Maintenance</h3>
                  <div className="h-24 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center">
                    <p className="text-gray-400 text-sm">3 pending requests</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Room Availability</h3>
                  <div className="h-24 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl flex items-center justify-center">
                    <p className="text-gray-400 text-sm">85% occupied</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              

              {/* Featured Properties */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Recent Properties</h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center text-gray-500 text-sm">Loading properties...</div>
                  ) : featuredProperties.length > 0 ? (
                    featuredProperties.map((property) => (
                      <div key={property.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                        <img
                          src={property.mainImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'}
                          alt={property.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop';
                          }}
                        />
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{property.name}</h4>
                        <p className="text-gray-500 text-xs mb-2">{property.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-bold text-sm">
                            ${Number(property.price).toLocaleString()}{property.priceDuration ? `/${property.priceDuration}` : ''}
                          </span>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span className="text-xs">{property.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">{property.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <Building className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No properties found</p>
                      <p className="text-xs">Start by adding your first property!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboard;