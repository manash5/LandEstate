import { Room, Property } from '../../models/index.js';

/**
 * Create a new room for a property
 */
const createRoom = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { number, tenant, tenantContact, rent, rentDueDate, status = 'vacant' } = req.body;

        // Check if property exists and belongs to the user or assigned employee
        const property = await Property.findOne({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Create the room
        const room = await Room.create({
            number,
            tenant,
            tenantContact,
            rent: rent || 0,
            rentDueDate,
            status,
            propertyId
        });

        res.status(201).json({
            data: room,
            message: "Room created successfully"
        });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

/**
 * Get all rooms for a property
 */
const getRoomsByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const rooms = await Room.findAll({
            where: { propertyId },
            order: [['number', 'ASC']]
        });

        res.status(200).json({
            data: rooms,
            message: "Rooms fetched successfully"
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

/**
 * Update room information
 */
const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { number, tenant, tenantContact, rent, rentDueDate, status, issue } = req.body;

        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.update({
            number: number || room.number,
            tenant: tenant || room.tenant,
            tenantContact: tenantContact || room.tenantContact,
            rent: rent !== undefined ? rent : room.rent,
            rentDueDate: rentDueDate || room.rentDueDate,
            status: status || room.status,
            issue: issue !== undefined ? issue : room.issue
        });

        res.status(200).json({
            data: room,
            message: "Room updated successfully"
        });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: 'Failed to update room' });
    }
};

/**
 * Delete a room
 */
const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.destroy();

        res.status(200).json({
            message: "Room deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Failed to delete room' });
    }
};

export const roomController = {
    createRoom,
    getRoomsByProperty,
    updateRoom,
    deleteRoom
};
