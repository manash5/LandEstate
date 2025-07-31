import React, { useState } from 'react';
import { MapPin, Users, Calendar, Eye } from 'lucide-react';
import RoomsModal from './RoomModal';

const PropertyCard = ({ property, setSelectedRoom }) => {
  const [showRooms, setShowRooms] = useState(false);

  // Since the database doesn't have occupiedRooms/totalRooms, we'll use placeholder values
  const totalRooms = property.totalRooms || property.beds || 1; // Fallback to beds or 1
  const occupiedRooms = property.occupiedRooms || Math.floor(totalRooms * 0.8); // Assume 80% occupancy
  const occupancyRate = (occupiedRooms / totalRooms) * 100;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={property.mainImage || property.image || '/noimage.jpg'} 
            alt={property.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {occupiedRooms}/{totalRooms} rooms
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.name}</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{property.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{totalRooms} total rooms</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">Property type: {property.type || 'House'}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Occupancy Rate</span>
              <span>{occupancyRate.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setShowRooms(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Rooms</span>
          </button>
        </div>
      </div>

      {showRooms && (
        <RoomsModal 
          property={property}
          onClose={() => setShowRooms(false)}
          setSelectedRoom={setSelectedRoom}
        />
      )}
    </>
  );
};

export default PropertyCard;