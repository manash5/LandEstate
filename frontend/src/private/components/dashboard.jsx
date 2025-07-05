import React, { useState } from 'react';
import { Home, Building, Users, Star, Settings, Bell, Search, TrendingUp, TrendingDown, Eye, Heart, FileSpreadsheet } from 'lucide-react';
import Sidebar from './sidebar';

const dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

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
    { title: 'Props Sale', value: '684', subtitle: 'Total', color: 'from-blue-500 to-purple-600', icon: Building },
    { title: 'Props Rented', value: '546', subtitle: 'Total', color: 'from-orange-500 to-red-500', icon: Home },
    { title: 'New Listing', value: '12', subtitle: 'This month', color: 'from-green-500 to-teal-500', icon: Star },
    { title: 'Price Drops', value: '9', subtitle: 'This month', color: 'from-pink-500 to-rose-500', icon: TrendingDown },
  ];

  const properties = [
    {
      id: 1,
      title: 'Star Sun Hotel & Apartment',
      location: 'North Carolina, USA',
      price: '$500',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop',
      views: 142,
      likes: 23
    },
    {
      id: 2,
      title: 'Letdo JI Hotel & Apartment',
      location: 'New York City, USA',
      price: '$650',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
      views: 98,
      likes: 31
    },
    {
      id: 3,
      title: 'Metro Jayakar Apartment',
      location: 'North Carolina, USA',
      price: '$450',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
      views: 167,
      likes: 45
    }
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
              <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your properties</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">HM</span>
              </div>
            </div>
          </div>
        </header>

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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommend for you</h3>
                <p className="text-gray-500 mb-4">Based on search history</p>
                <div className="h-64">
                  {/* Property Type Distribution Chart */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Property Types</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Apartments</span>
                          <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-xs font-semibold">75%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Houses</span>
                          <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '45%'}}></div>
                          </div>
                          <span className="text-xs font-semibold">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Commercial</span>
                          <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <span className="text-xs font-semibold">60%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range Interest</h4>
                      <div className="h-32 flex items-end space-x-2">
                        {[60, 80, 45, 90, 70, 55].map((height, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-t from-teal-500 to-green-400 rounded-t-lg flex-1"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>$200K</span>
                        <span>$500K</span>
                        <span>$800K+</span>
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
              {/* Property Referrals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Property Referrals</h3>
                <div className="space-y-4">
                  {referralData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.source}</span>
                        <span className="text-sm font-semibold text-gray-800">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Properties */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Featured Properties</h3>
                <div className="space-y-4">
                  {properties.slice(0, 2).map((property) => (
                    <div key={property.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{property.title}</h4>
                      <p className="text-gray-500 text-xs mb-2">{property.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-bold text-sm">{property.price}</span>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span className="text-xs">{property.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span className="text-xs">{property.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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