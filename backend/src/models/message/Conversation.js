import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const Conversation = sequelize.define("Conversation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user1_id',
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user2_id',
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    lastMessageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'last_message_id',
        references: {
            model: 'Messages',
            key: 'id'
        }
    },
    lastMessageTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_message_time'
    }
}, {
    tableName: 'Conversations',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user1_id', 'user2_id']
        }
    ]
});
