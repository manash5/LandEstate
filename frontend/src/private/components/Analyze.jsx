import { useState } from 'react';
import { Search, Home, MapPin, Calendar, DollarSign } from 'lucide-react';
import AnalyzeClick from './AnalyzeClick';
import { useNavigate } from 'react-router-dom';

export default function PropertyDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample property data
  const properties = [
    {
      id: 1,
      name: 'Sunset Villa',
      address: '123 Ocean Drive, Miami Beach',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sq ft',
      rentPrice: '$3,500/month',
      purchaseDate: '2022-03-15',
      status: 'Rented'
    },
    {
      id: 2,
      name: 'Downtown Loft',
      address: '456 City Center, New York',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200 sq ft',
      rentPrice: '$4,200/month',
      purchaseDate: '2023-01-20',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Garden House',
      address: '789 Green Valley, Portland',
      type: 'House',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sq ft',
      rentPrice: '$2,800/month',
      purchaseDate: '2021-11-08',
      status: 'Rented'
    },
    {
      id: 4,
      name: 'Lakeside Cabin',
      address: '321 Lake Shore, Colorado',
      type: 'Cabin',
      bedrooms: 2,
      bathrooms: 1,
      area: '1,000 sq ft',
      rentPrice: '$2,200/month',
      purchaseDate: '2023-05-12',
      status: 'Maintenance'
    },
    {
      id: 5,
      name: 'Modern Penthouse',
      address: '654 High Rise, Los Angeles',
      type: 'Penthouse',
      bedrooms: 3,
      bathrooms: 3,
      area: '2,200 sq ft',
      rentPrice: '$5,500/month',
      purchaseDate: '2022-09-30',
      status: 'Available'
    },
    {
      id: 6,
      name: 'Cozy Studio',
      address: '987 Art District, San Francisco',
      type: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      area: '600 sq ft',
      rentPrice: '$2,900/month',
      purchaseDate: '2023-02-14',
      status: 'Rented'
    }
  ];

  // Filter properties based on search
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Rented':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Available':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalProperties = properties.length;
  const rentedProperties = properties.filter(p => p.status === 'Rented').length;
  const availableProperties = properties.filter(p => p.status === 'Available').length;
  const maintenanceProperties = properties.filter(p => p.status === 'Maintenance').length;
  const navigate = useNavigate();
  const [analyzeView, setAnalyzeView] = useState('main');


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                  Your Properties
                </h1>
                <p className="text-slate-600">Manage and overview your real estate portfolio</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-900 to-blue-900 text-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Total Properties: {totalProperties}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-slate-800">{totalProperties}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-3 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Rented</p>
                <p className="text-3xl font-bold text-green-600">{rentedProperties}</p>
              </div>
              <div className="bg-gradient-to-r from-green-700 to-green-800 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Available</p>
                <p className="text-3xl font-bold text-blue-600">{availableProperties}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Maintenance</p>
                <p className="text-3xl font-bold text-yellow-600">{maintenanceProperties}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 p-3 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 shadow-lg"
            />
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() =>navigate(`/property/${property.id}`) }
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20 group hover:scale-[1.02]"
            >
              {/* Property Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="flex items-center justify-center h-full">
                  <Home className="w-16 h-16 text-white/80" />
                </div>
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(property.status)}`}>
                  {property.status}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <p className="text-sm">{property.address}</p>
                  </div>
                  <span className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
                    {property.type}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bedrooms:</span>
                    <span className="font-semibold text-slate-800">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bathrooms:</span>
                    <span className="font-semibold text-slate-800">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Area:</span>
                    <span className="font-semibold text-slate-800">{property.area}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Rent Price</span>
                      <span className="font-bold text-lg text-slate-800">{property.rentPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <Home className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No properties found</h3>
              <p className="text-slate-600">Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}