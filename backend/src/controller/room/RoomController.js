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

        // Prepare room data - handle vacant status properly
        const roomData = {
            number,
            rent: rent || 0,
            status: status || 'vacant',
            propertyId
        };

        // For vacant rooms, don't set tenant information
        if (status !== 'vacant') {
            roomData.tenant = tenant;
            roomData.tenantContact = tenantContact;
            roomData.rentDueDate = rentDueDate;
        }

        // Create the room
        const room = await Room.create(roomData);

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

        // Handle vacant status properly - clear tenant fields when vacant
        const updateData = {
            number: number !== undefined ? number : room.number,
            rent: rent !== undefined ? rent : room.rent,
            status: status !== undefined ? status : room.status,
            issue: issue !== undefined ? issue : room.issue
        };

        // For vacant rooms, clear tenant information
        if (status === 'vacant') {
            updateData.tenant = null;
            updateData.tenantContact = null;
            updateData.rentDueDate = null;
        } else {
            // For non-vacant rooms, update tenant fields if provided
            updateData.tenant = tenant !== undefined ? tenant : room.tenant;
            updateData.tenantContact = tenantContact !== undefined ? tenantContact : room.tenantContact;
            updateData.rentDueDate = rentDueDate !== undefined ? rentDueDate : room.rentDueDate;
        }

        await room.update(updateData);

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
