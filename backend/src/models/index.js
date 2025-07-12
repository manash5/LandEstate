import { User } from './user/User.js'
import { Property } from './properties/properties.js'

// Define relationships
User.hasMany(Property, { foreignKey: 'userId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Property }