import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const MaintenanceRecord = sequelize.define("MaintenanceRecord", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    serviceName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'service_name'
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    technician: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    serviceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'service_date'
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'property_id',
        references: {
            model: 'properties',
            key: 'id'
        }
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'room_id',
        references: {
            model: 'rooms',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'maintenance_records',
    timestamps: true,
    underscored: true
});
