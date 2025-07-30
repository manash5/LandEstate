import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const Room = sequelize.define("Room", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    number: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    tenant: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    tenantContact: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'tenant_contact'
    },
    rent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    rentDueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'rent_due_date'
    },
    status: {
        type: DataTypes.ENUM('paid', 'unpaid', 'vacant'),
        defaultValue: 'vacant'
    },
    issue: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'rooms',
    timestamps: true,
    underscored: true
});
