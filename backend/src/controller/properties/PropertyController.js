import { Property } from '../../models/index.js';

/**
 * Fetch all properties
 */
const getAll = async (req, res) => {
    try {
        const properties = await Property.findAll();
        res.status(200).send({ data: properties, message: "Successfully fetched properties" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
}

/** 
 * Create new property
 */
const create = async (req, res) => {
    try {
        const body = req.body;
        
        // Basic validation
        if (!body?.name || !body?.location || !body?.price) {
            return res.status(400).send({ message: "Invalid payload: name, location and price are required" });
        }

        const property = await Property.create({
            name: body.name,
            location: body.location,
            price: body.price,
            priceDuration: body.priceDuration || 'One Day',
            beds: body.beds || 1,
            baths: body.baths || 1,
            areaSqm: body.areaSqm || 0,
            hasKitchen: body.hasKitchen || false,
            hasBalcony: body.hasBalcony || false,
            hasWifi: body.hasWifi || false,
            hasSmokingArea: body.hasSmokingArea || false,
            hasParking: body.hasParking || false,
            description: body.description || ''
        });

        res.status(201).send({ data: property, message: "Successfully created property" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create property' });
    }
}

/**
 * Update existing property
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        // Check if property exists
        const property = await Property.findOne({ where: { id } });
        if (!property) {
            return res.status(404).send({ message: "Property not found" });
        }

        // Update only provided fields
        const updatableFields = [
            'name', 'location', 'price', 'priceDuration', 'beds', 'baths',
            'areaSqm', 'hasKitchen', 'hasBalcony', 'hasWifi', 
            'hasSmokingArea', 'hasParking', 'description'
        ];

        updatableFields.forEach(field => {
            if (body[field] !== undefined) {
                property[field] = body[field];
            }
        });

        await property.save();
        res.status(200).send({ data: property, message: "Property updated successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update property' });
    }
}

/**
 * Delete property by id
 */
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findOne({ where: { id } });

        if (!property) {
            return res.status(404).send({ message: "Property not found" });
        }

        await property.destroy();
        res.status(200).send({ message: "Property deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to delete property' });
    }
}

/**
 * Fetch property by id
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findOne({ where: { id } });

        if (!property) {
            return res.status(404).send({ message: "Property not found" });
        }

        res.status(200).send({ data: property, message: "Property fetched successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
}

export const PropertyController = {
    getAll,
    create,
    getById,
    deleteById,
    update
};