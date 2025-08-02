import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPropertyModal from "./AddPropertyModel";
import { useForm } from "react-hook-form";
import { Home, Building, Users, Star, Settings, Bell, Search, MapPin, Bed, Bath, Square, Wifi, Car, Utensils, Wind, Phone, MessageCircle, ArrowLeft, ChevronDown, Filter, Plus, X } from 'lucide-react';
import { fetchProperties, getUsersById } from '../../services/api';
import { useMessage } from '../../context/MessageContext';

const Properties = () => {
  const navigate = useNavigate();
  const { openChatWithUser } = useMessage();
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('property');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dbProperties, setDbProperties] = useState([]);
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
    type: 'Any Type'
  });

  const properties = [
    {
      id: 1,
      title: 'Metro Jayakarta Hotel & Spa',
      location: 'North Carolina, USA',
      price: '₹7400',
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
      agent: {
        name: 'David Thompson',
        location: 'North Carolina, USA',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        phone: '+1 (555) 567-8901',
        email: 'david.thompson@example.com',
      }
    },
    {
      id: 2,
      title: 'Star Sun Hotel & Apartment',
      location: 'Cundong City, USA',
      price: '₹8500',
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
        name: 'David Thompson',
        location: 'North Carolina, USA',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        phone: '+1 (555) 567-8901',
        email: 'david.thompson@example.com',
      }
    },
    {
      id: 3,
      title: 'Lotus Apy Hotel & Apartment',
      location: 'Margoluwin Catonya, USA',
      price: '₹7900',
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
        name: 'David Thompson',
        location: 'North Carolina, USA',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        phone: '+1 (555) 567-8901',
        email: 'david.thompson@example.com',
      }
    },
    {
      id: 4,
      title: 'Lavender Apartment',
      location: 'North Carolina, USA',
      price: '₹9000',
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
        name: 'David Thompson',
        location: 'North Carolina, USA',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        phone: '+1 (555) 567-8901',
        email: 'david.thompson@example.com',
      }
    },
    {
      id: 5,
      title: 'Almander Hotel & Apartment',
      location: 'Suryodiningratan, UK',
      price: '₹7600',
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
       name: 'David Thompson',
        location: 'North Carolina, USA',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        phone: '+1 (555) 567-8901',
        email: 'david.thompson@example.com',
      }
    },
    {
      id: 6,
      title: 'Metro Jayakarta Hotel & Spa',
      location: 'North Carolina, USA',
      price: '₹8100',
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
        name: 'David Thompson',
        location: 'North Carolina, USA',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        phone: '+1 (555) 567-8901',
        email: 'david.thompson@example.com',
      }
    }
  ];

  useEffect(() => {
    // Fetch properties from backend
    fetchProperties()
      .then(res => {
        if (res.data?.data) {
          console.log('Fetched properties with user data:', res.data.data);
          setDbProperties(res.data.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch properties:', err);
      });
  }, []);

  const filterOptions = {
    status: ['Any Status', 'For Sale', 'For Rent'],
    type: ['Any Type', 'Apartment', 'Hotel', 'House', 'Commercial']
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProperty(null);
  };

  const handlePropertyAdded = () => {
    // Refresh the properties list from the database
    fetchProperties()
      .then(res => {
        if (res.data?.data) {
          setDbProperties(res.data.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch properties:', err);
      });
  };

  const handleChatClick = async (agent) => {
    try {
      // Get the agent's user ID
      let userId = null;
      
      // For database properties, we have the user info in the agent object
      if (agent.id) {
        userId = agent.id;
      } else if (agent.email && agent.email !== 'No email available') {
        // For mock properties, we need to find the user by email
        // This is a fallback - in a real app, you'd have the user ID directly
        console.log('Agent info:', agent);
        // Navigate to layout with message state
        navigate('/layout', { state: { showMessage: true } });
        return;
      }
      
      if (userId) {
        // Open chat with specific user using context
        openChatWithUser(userId);
        // Navigate to layout and show message section
        navigate('/layout', { state: { showMessage: true } });
      } else {
        // Navigate to layout with message state
        navigate('/layout', { state: { showMessage: true } });
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      // Still navigate to layout with message state as fallback
      navigate('/layout', { state: { showMessage: true } });
    }
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

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (img.startsWith('http')) return img;
    return `http://localhost:4000/photos/upload/${img}`;
  };

  const mapDbPropertyToCard = (property) => ({
    id: property.id,
    title: property.name,
    location: property.location,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    area: property.areaSqm ? `${property.areaSqm}M` : '',
    image: getImageUrl(property.mainImage), // Apply URL transformation here
    images: (property.images || []).map(getImageUrl),
    type: property.type || 'House', // Use the type from database or default to House
    rating: 5,
    facilities: [
      property.hasKitchen ? 'Kitchen' : null,
      property.hasBalcony ? 'Balcony' : null,
      property.hasParking ? 'Parking Area' : null,
      'Wifi'
    ].filter(Boolean),
    description: property.description || '',
    priceDuration: property.priceDuration, // Add priceDuration for filtering
    agent: {
      id: property.user?.id, // Add user ID for chat navigation
      name: property.user?.name || 'Unknown Agent',
      role: 'Property Agent',
      location: property.location,
      properties: 1, // This could be calculated from user's properties count
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', // Default avatar
      phone: property.user?.phone || 'No phone available',
      email: property.user?.email || 'No email available',
      experience: 'New Agent', // This could be calculated based on user's join date
      rating: 5.0, // Default rating for new agents
      responseTime: 'Usually responds within 24 hours'
    }
  });

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        {/* Agent Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
                />
                
              </div>
              <h3 className="text-xl font-bold text-gray-800">{property.agent.name}</h3>
              <p className="text-gray-500 text-sm">{property.agent.role}</p>
            </div>

            

            {/* Agent Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{property.agent.location}</span>
              </div>
              {property.agent.phone && property.agent.phone !== 'No phone available' && (
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{property.agent.phone}</span>
                </div>
              )}
              {property.agent.email && property.agent.email !== 'No email available' && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">{property.agent.email}</span>
                </div>
              )}
            </div>

            {/* Chat Button */}
            <button
              onClick={() => handleChatClick(property.agent)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Filter properties based on search and filters
  const filteredProperties = () => {
    let filtered = [...properties, ...dbProperties.map(mapDbPropertyToCard)];
    
    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.type.toLowerCase().includes(searchTerm)
      );
    }
    
    // Status filter
    if (filters.status !== 'Any Status') {
      filtered = filtered.filter(property => {
        // For database properties, check priceDuration
        if (property.priceDuration) {
          if (filters.status === 'For Sale') {
            return property.priceDuration === 'one time';
          } else if (filters.status === 'For Rent') {
            return property.priceDuration !== 'one time';
          }
        }
        // For static properties, assume they are "For Rent" (you can modify this based on your data)
        return filters.status === 'For Rent';
      });
    }
    
    // Type filter
    if (filters.type !== 'Any Type') {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    return filtered;
  };

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  
                  {['status', 'type'].map((filterType) => (
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
                {filteredProperties().map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Showing 1 to {filteredProperties().length} Properties</p>
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
          onPropertyAdded={handlePropertyAdded}
        />
      )}
    </div>
    </div>
  );
};

export default Properties;