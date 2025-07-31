import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";
import bcrypt from "bcrypt";

export const Employee = sequelize.define("Employee", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    hireDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'manager_id',
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    tableName: 'Employees',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (employee) => {
            if (employee.password) {
                const saltRounds = 10;
                employee.password = await bcrypt.hash(employee.password, saltRounds);
            }
        },
        beforeUpdate: async (employee) => {
            if (employee.changed('password')) {
                const saltRounds = 10;
                employee.password = await bcrypt.hash(employee.password, saltRounds);
            }
        }
    }
});
