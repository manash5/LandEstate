import { User } from './user/User.js'
import { Property } from './properties/properties.js'
import { Room } from './properties/Room.js'
import { MaintenanceRecord } from './properties/MaintenanceRecord.js'
import { Conversation } from './message/Conversation.js'
import { Message } from './message/Message.js'
import { Employee } from './employee/Employee.js'

// Define relationships
User.hasMany(Property, { foreignKey: 'userId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User-Employee relationships (User can manage multiple employees)
User.hasMany(Employee, { foreignKey: 'managerId', as: 'managedEmployees' });
Employee.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

// Employee-Property relationships
Employee.hasMany(Property, { foreignKey: 'employeeId', as: 'properties' });
Property.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Property-Room relationships
Property.hasMany(Room, { foreignKey: 'propertyId', as: 'rooms' });
Room.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Property-MaintenanceRecord relationships
Property.hasMany(MaintenanceRecord, { foreignKey: 'propertyId', as: 'maintenanceRecords' });
MaintenanceRecord.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Message relationships
User.hasMany(Conversation, { foreignKey: 'user1Id', as: 'conversationsAsUser1' });
User.hasMany(Conversation, { foreignKey: 'user2Id', as: 'conversationsAsUser2' });
Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

Conversation.belongsTo(Message, { foreignKey: 'lastMessageId', as: 'lastMessage' });

export { User, Property, Room, MaintenanceRecord, Conversation, Message, Employee }