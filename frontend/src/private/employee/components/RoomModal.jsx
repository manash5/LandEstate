import React, { useState, useEffect } from 'react';
import { X, User, DollarSign, AlertTriangle, CheckCircle, Calendar, Plus, Edit, Trash2, Phone } from 'lucide-react';
import { createRoom, getRoomsByProperty, updateRoom, deleteRoom } from '../../../services/api';

const RoomsModal = ({ property, onClose, setSelectedRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    tenant: '',
    tenantContact: '',
    rent: '',
    rentDueDate: '',
    status: 'vacant'
  });

  useEffect(() => {
    fetchRooms();
  }, [property.id]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRoomsByProperty(property.id);
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
      } else {
        await createRoom(property.id, formData);
      }
      
      // Reset form and refresh data
      setFormData({
        number: '',
        tenant: '',
        tenantContact: '',
        rent: '',
        rentDueDate: '',
        status: 'vacant'
      });
      setShowAddForm(false);
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room. Please try again.');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      tenant: room.tenant || '',
      tenantContact: room.tenantContact || '',
      rent: room.rent || '',
      rentDueDate: room.rentDueDate ? room.rentDueDate.split('T')[0] : '',
      status: room.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Error deleting room. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'unpaid': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'unpaid': return AlertTriangle;
      default: return User;
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingRoom(null);
    setFormData({
      number: '',
      tenant: '',
      tenantContact: '',
      rent: '',
      rentDueDate: '',
      status: 'vacant'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Rooms in {property.name}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 101, A1, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setFormData({
                        ...formData, 
                        status: newStatus,
                        // Clear tenant fields when changing to vacant
                        ...(newStatus === 'vacant' && {
                          tenant: '',
                          tenantContact: '',
                          rent: '',
                          rentDueDate: ''
                        })
                      });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="vacant">Vacant</option>
                    <option value="paid">Occupied - Paid</option>
                    <option value="unpaid">Occupied - Unpaid</option>
                  </select>
                </div>

                {formData.status !== 'vacant' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tenant Name
                      </label>
                      <input
                        type="text"
                        value={formData.tenant}
                        onChange={(e) => setFormData({...formData, tenant: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter tenant name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tenant Contact
                      </label>
                      <input
                        type="tel"
                        value={formData.tenantContact}
                        onChange={(e) => setFormData({...formData, tenantContact: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Rent (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.rent}
                        onChange={(e) => setFormData({...formData, rent: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rent Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.rentDueDate}
                        onChange={(e) => setFormData({...formData, rentDueDate: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading rooms...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const StatusIcon = getStatusIcon(room.status);
                
                return (
                  <div key={room.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">Room {room.number}</h3>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {room.status === 'paid' ? 'Paid' : room.status === 'unpaid' ? 'Unpaid' : 'Vacant'}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {room.tenant && (
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span className="text-sm">{room.tenant}</span>
                        </div>
                      )}

                      {room.tenantContact && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="text-sm">{room.tenantContact}</span>
                        </div>
                      )}
                      
                      {room.rent > 0 && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="text-sm">₹ {Number(room.rent).toLocaleString()}</span>
                        </div>
                      )}

                      {room.rentDueDate && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">Due: {new Date(room.rentDueDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {room.issue && (
                        <div className="flex items-center text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          <span className="text-sm">{room.issue}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && rooms.length === 0 && !showAddForm && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No rooms added yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Room</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsModal;