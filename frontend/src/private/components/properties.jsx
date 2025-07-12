import React, { useState } from 'react';
import AddPropertyModal from "./AddPropertyModel";
import { useForm } from "react-hook-form";
import { Home, Building, Users, Star, Settings, Bell, Search, MapPin, Bed, Bath, Square, Wifi, Car, Utensils, Wind, Phone, MessageCircle, ArrowLeft, ChevronDown, Filter, Plus, X } from 'lucide-react';

const Properties = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('property');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: '',
    beds: '',
    baths: '',
    area: '',
    type: 'Apartment',
    description: '',
    images: [],
    facilities: []
  });

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const [filters, setFilters] = useState({
    search: '',
    status: 'Any Status',
    type: 'Any Type',
    country: 'All Countries',
    state: 'All States'
  });

  const properties = [
    {
      id: 1,
      title: 'Metro Jayakarta Hotel & Spa',
      location: 'North Carolina, USA',
      price: '$7400',
      beds: 4,
      baths: 2,
      area: '28M',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop'
      ],
      type: 'Apartment',
      rating: 5,
      facilities: ['Kitchen', 'Balcony', 'Wifi', 'Smoking Area', 'Parking Area'],
      description: 'Beautiful modern apartment with stunning city views. This luxurious property features spacious rooms, contemporary design, and premium amenities. Perfect for those seeking comfort and style in the heart of the city.',
      
    },
    {
      id: 2,
      title: 'Star Sun Hotel & Apartment',
      location: 'Cundong City, USA',
      price: '$8500',
      beds: 6,
      baths: 3,
      area: '29M',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop'
      ],
      type: 'Hotel',
      rating: 4,
      facilities: ['Kitchen', 'Balcony', 'Wifi', 'Pool', 'Parking Area'],
      description: 'Elegant hotel apartment with premium facilities and exceptional service. Features modern architecture and world-class amenities for the discerning guest.',
      agent: {
        name: 'Sarah Johnson',
        role: 'Agent',
        location: 'Cundong City, USA',
        properties: 15,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 3,
      title: 'Lotus Apy Hotel & Apartment',
      location: 'Margoluwin Catonya, USA',
      price: '$7900',
      beds: 3,
      baths: 2,
      area: '25M',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop'
      ],
      type: 'Apartment',
      rating: 5,
      facilities: ['Kitchen', 'Balcony', 'Wifi', 'Gym', 'Parking Area'],
      description: 'Contemporary apartment with breathtaking views and modern amenities. Perfect blend of luxury and comfort in a prime location.',
      agent: {
        name: 'Michael Chen',
        role: 'Agent',
        location: 'Margoluwin Catonya, USA',
        properties: 8,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 4,
      title: 'Lavender Apartment',
      location: 'North Carolina, USA',
      price: '$9000',
      beds: 3,
      baths: 2,
      area: '26M',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'
      ],
      type: 'Apartment',
      rating: 4,
      facilities: ['Kitchen', 'Garden', 'Wifi', 'Parking Area'],
      description: 'Charming apartment with beautiful garden views and peaceful surroundings. Ideal for those seeking tranquility without compromising on modern conveniences.',
      agent: {
        name: 'Emily Davis',
        role: 'Agent',
        location: 'North Carolina, USA',
        properties: 12,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 5,
      title: 'Almander Hotel & Apartment',
      location: 'Suryodiningratan, UK',
      price: '$7600',
      beds: 2,
      baths: 1,
      area: '22M',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448204-444030e693cc?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=300&h=200&fit=crop'
      ],
      type: 'Hotel',
      rating: 5,
      facilities: ['Kitchen', 'Balcony', 'Wifi', 'Concierge', 'Parking Area'],
      description: 'Sophisticated hotel apartment with exceptional service and prime location. Features elegant interiors and comprehensive amenities for a luxurious stay.',
      agent: {
        name: 'James Wilson',
        role: 'Agent',
        location: 'Suryodiningratan, UK',
        properties: 18,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 6,
      title: 'Metro Jayakarta Hotel & Spa',
      location: 'North Carolina, USA',
      price: '$8100',
      beds: 4,
      baths: 3,
      area: '28M',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=300&h=200&fit=crop'
      ],
      type: 'Hotel',
      rating: 5,
      facilities: ['Kitchen', 'Spa', 'Wifi', 'Pool', 'Parking Area'],
      description: 'Luxury hotel with spa facilities and premium amenities. Perfect for relaxation and comfort with world-class service and stunning architectural design.',
      agent: {
        name: 'Lisa Rodriguez',
        role: 'Agent',
        location: 'North Carolina, USA',
        properties: 14,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
      }
    }
  ];

  const filterOptions = {
    status: ['Any Status', 'For Sale', 'For Rent'],
    type: ['Any Type', 'Apartments', 'Houses', 'Commercial', 'Hotels'],
    country: ['All Countries', 'USA', 'UK', 'Canada'],
    state: ['All States', 'North Carolina', 'New York', 'California']
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProperty(null);
  };

  const handleAddProperty = () => {
    const propertyToAdd = {
      id: properties.length + 1,
      ...newProperty,
      rating: 5,
      agent: {
        name: 'John Doe',
        role: 'Agent',
        location: newProperty.location,
        properties: 1,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    };
    
    properties.push(propertyToAdd);
    setIsAddModalOpen(false);
    setNewProperty({
      title: '',
      location: '',
      price: '',
      beds: '',
      baths: '',
      area: '',
      type: 'Apartment',
      description: '',
      images: [],
      facilities: []
    });
  };

  const PropertyCard = ({ property }) => (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group"
      onClick={() => handlePropertyClick(property)}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {property.price}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.beds} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.baths} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.area}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PropertyDetails = ({ property }) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackToList}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <img
                src={property.images[1]}
                alt=""
                className="w-full h-36 object-cover rounded-2xl"
              />
              <div className="relative">
                <img
                  src={property.images[2]}
                  alt=""
                  className="w-full h-36 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-semibold">+10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-4">
              <span className="text-gray-500 text-sm">{property.type}</span>
              <h1 className="text-2xl font-bold text-gray-800 mt-1">{property.title}</h1>
              <div className="flex items-center text-gray-500 mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < property.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-gray-500">Price</span>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-600">{property.price}</span>
                <span className="text-gray-500 ml-2">For One Day</span>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Facility</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">{property.beds} Beds</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">{property.baths} Baths</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">{property.area} Area</span>
                </div>
                <div className="flex items-center">
                  <Utensils className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Kitchen</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Balcony</span>
                </div>
                <div className="flex items-center">
                  <Wifi className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Wifi</span>
                </div>
                <div className="flex items-center">
                  <Wind className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Smoking Area</span>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Parking Area</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Main Content */}
      <div className={`flex-1 overflow-hidden transition-all duration-300 my-10 bg-slate-100`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-8 py-6 rounded-xl mx-10">
          <div className="flex items-center justify-between">
            <div className='px-5'>
              <h1 className="text-3xl font-bold text-gray-800">Property List</h1>
              <p className="text-gray-500 mt-1">Discover your perfect property</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">HM</span>
              </div>
              {currentView === 'list' && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          {currentView === 'list' ? (
            <>
              {/* Filters */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter an address, city or Zip code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                  </div>
                  
                  {['status', 'type', 'country', 'state'].map((filterType) => (
                    <div key={filterType} className="relative">
                      <select
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        value={filters[filterType]}
                        onChange={(e) => setFilters({...filters, [filterType]: e.target.value})}
                      >
                        {filterOptions[filterType].map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Showing 1 to 10 Properties</p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-gray-400 hover:text-gray-600">‹</button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">2</button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">3</button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">4</button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">5</button>
                  <button className="px-3 py-2 text-gray-400 hover:text-gray-600">›</button>
                </div>
              </div>
            </>
          ) : (
            <PropertyDetails property={selectedProperty} />
          )}
        </div>
      {/* Place this just before the closing div */}
      {isAddModalOpen && (
        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddProperty={handleAddProperty}
        />
      )}
    </div>
    </div>
  );
};

export default Properties;