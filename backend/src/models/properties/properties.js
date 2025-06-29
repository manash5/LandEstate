import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const Property = sequelize.define("Property", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    priceDuration: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'price_duration' 
    },
    beds: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    baths: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    areaSqm: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        field: 'area_sqm'
    },
    hasKitchen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_kitchen'
    },
    hasBalcony: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_balcony'
    },
    hasWifi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_wifi'
    },
    hasSmokingArea: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_smoking_area'
    },
    hasParking: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_parking'
    },
    description: {
        type: DataTypes.TEXT,
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
    tableName: 'properties',
    timestamps: true, 
    underscored: true 
});