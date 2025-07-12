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
    mainImage: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'main_image',
        
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING(500)), // Array of image URLs
        allowNull: true,
        validate: {
            minImages(value) {
                if (value.length < 1) {
                    throw new Error('At least one image is required');
                }
            },
            maxImages(value) {
                if (value.length > 10) {
                    throw new Error('Maximum 10 images allowed');
                }
            },
            isUrlsArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Images must be an array');
                }
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                for (const url of value) {
                    if (!urlRegex.test(url)) {
                        throw new Error(`Invalid URL format: ${url}`);
                    }
                }
            }
        }
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