import { sequelize } from '../database/index.js';

/**
 * Migration script to add 'type' column to properties table
 * Run this script to update existing database schema
 */

const addPropertyTypeColumn = async () => {
    try {
        // Check if the column already exists
        const tableDescription = await sequelize.getQueryInterface().describeTable('properties');
        
        if (tableDescription.type) {
            console.log('Type column already exists in properties table');
            return;
        }

        // Add the type column
        await sequelize.getQueryInterface().addColumn('properties', 'type', {
            type: sequelize.Sequelize.ENUM('Apartment', 'Hotel', 'House', 'Commercial'),
            allowNull: false,
            defaultValue: 'House'
        });

        console.log('Successfully added type column to properties table');

        // Update existing rows to have default type 'House'
        await sequelize.query(`
            UPDATE properties 
            SET type = 'House' 
            WHERE type IS NULL;
        `);

        console.log('Updated existing properties with default type "House"');

    } catch (error) {
        console.error('Error adding type column:', error);
        
        // If the error is about enum type already existing, try to add the column differently
        if (error.message.includes('already exists')) {
            try {
                await sequelize.getQueryInterface().addColumn('properties', 'type', {
                    type: sequelize.Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'House'
                });
                
                // Add check constraint
                await sequelize.query(`
                    ALTER TABLE properties 
                    ADD CONSTRAINT properties_type_check 
                    CHECK (type IN ('Apartment', 'Hotel', 'House', 'Commercial'));
                `);
                
                console.log('Successfully added type column with check constraint');
            } catch (fallbackError) {
                console.error('Fallback migration also failed:', fallbackError);
            }
        }
    } finally {
        await sequelize.close();
    }
};

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    addPropertyTypeColumn();
}

export { addPropertyTypeColumn };
