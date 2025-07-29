import { User } from './user/User.js'
import { Property } from './properties/properties.js'
import { Conversation } from './message/Conversation.js'
import { Message } from './message/Message.js'

// Define relationships
User.hasMany(Property, { foreignKey: 'userId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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

export { User, Property, Conversation, Message }