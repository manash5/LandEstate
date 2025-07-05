import React from 'react';
import { X, User, DollarSign, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const RoomsModal = ({ property, onClose, setSelectedRoom }) => {
  const getStatusColor = (status) => {
    return status === 'paid' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status) => {
    return status === 'paid' ? CheckCircle : AlertTriangle;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Rooms in {property.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.rooms.map((room) => {
              const StatusIcon = getStatusIcon(room.status);
              
              return (
                <div key={room.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Room {room.number}</h3>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {room.status === 'paid' ? 'Paid' : 'Not Paid'}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">{room.tenant}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm">NPR {room.rent.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Due: {new Date(room.rentDueDate).toLocaleDateString()}</span>
                    </div>

                    {room.issue && (
                      <div className="flex items-center text-orange-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{room.issue}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRoom(room);
                      onClose();
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Update Info
                  </button>
                </div>
              );
            })}
          </div>

          {property.rooms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No rooms available in this property.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsModal;