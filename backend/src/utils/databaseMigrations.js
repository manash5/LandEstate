import { sequelize } from '../database/index.js';

/**
 * Database migration utilities
 * This replaces the functionality from update_maintenance_table.js and other migration scripts
 */

/**
 * Add a column to a table if it doesn't exist
 */
export const addColumnIfNotExists = async (tableName, columnName, columnDefinition) => {
  try {
    console.log(`Adding ${columnName} column to ${tableName} table...`);
    
    await sequelize.getQueryInterface().addColumn(tableName, columnName, columnDefinition);
    console.log(`Successfully added ${columnName} column to ${tableName} table`);
    
    return { success: true, message: `Column ${columnName} added successfully` };
  } catch (error) {
    if (error.original && (error.original.code === 'ER_DUP_FIELDNAME' || error.original.code === '42701')) {
      console.log(`${columnName} column already exists in ${tableName} table`);
      return { success: true, message: `Column ${columnName} already exists` };
    } else {
      console.error(`Error adding ${columnName} column:`, error);
      throw error;
    }
  }
};

/**
 * Add room_id column to maintenance_records table
 * This replaces the functionality from update_maintenance_table.js
 */
export const addRoomIdToMaintenanceRecords = async () => {
  try {
    const result = await addColumnIfNotExists('maintenance_records', 'room_id', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id'
      }
    });

    // Sync the model to ensure everything is up to date
    const { MaintenanceRecord } = await import('../models/properties/MaintenanceRecord.js');
    await MaintenanceRecord.sync({ alter: true });
    
    console.log('MaintenanceRecord model synchronized successfully');
    
    return result;
  } catch (error) {
    console.error('Error in addRoomIdToMaintenanceRecords:', error);
    throw error;
  }
};

/**
 * Reset database - drop and recreate all tables
 * This replaces the functionality from fix_db.js
 */
export const resetDatabase = async () => {
  try {
    console.log('Resetting database...');
    console.log('WARNING: This will drop all existing data!');
    
    // Drop all tables
    console.log('Dropping all tables...');
    await sequelize.drop();
    
    // Recreate tables
    console.log('Recreating tables...');
    await sequelize.sync({ force: true });
    
    console.log('Database reset successfully!');
    
    return { 
      success: true, 
      message: 'Database reset successfully. All data has been cleared.' 
    };
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

/**
 * Run database migrations
 */
export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    
    const results = [];
    
    // Add room_id to maintenance_records if needed
    try {
      const result = await addRoomIdToMaintenanceRecords();
      results.push({ migration: 'add_room_id_to_maintenance_records', ...result });
    } catch (error) {
      results.push({ 
        migration: 'add_room_id_to_maintenance_records', 
        success: false, 
        error: error.message 
      });
    }
    
    // You can add more migrations here as needed
    
    return {
      success: true,
      message: 'Migrations completed',
      results
    };
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

/**
 * Check database connection and basic health
 */
export const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    
    // Get table information
    const tables = await sequelize.getQueryInterface().showAllTables();
    
    return {
      success: true,
      message: 'Database connection successful',
      tables: tables,
      dialect: sequelize.getDialect(),
      version: await sequelize.databaseVersion()
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      success: false,
      message: 'Database connection failed',
      error: error.message
    };
  }
};
