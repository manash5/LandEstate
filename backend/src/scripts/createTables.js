import { sequelize } from '../database/index.js';
import { Room } from '../models/properties/Room.js';
import { MaintenanceRecord } from '../models/properties/MaintenanceRecord.js';

const createTables = async () => {
  try {
    // Create the tables
    await Room.sync({ force: false });
    await MaintenanceRecord.sync({ force: false });
    
    console.log('✅ Tables created successfully');
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
};

createTables();
