import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/propertyCard';
import { getEmployeeAssignedProperties } from '../../../services/api';
import { Building, Loader, AlertTriangle } from 'lucide-react';

const MyProperties = ({ setSelectedRoom }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignedProperties();
  }, []);

  const fetchAssignedProperties = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeAssignedProperties();
      
      if (response.data.success) {
        setProperties(response.data.data);
      } else {
        setError('Failed to fetch assigned properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAssignedProperties}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            My Properties
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Properties assigned to you for management
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Properties Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Assigned Properties</h2>
          <span className="text-sm text-gray-500">{properties.length} properties assigned</span>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                setSelectedRoom={setSelectedRoom}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Properties Assigned</h3>
            <p className="text-gray-500 mb-6">You haven't been assigned any properties yet. Contact your manager for assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;