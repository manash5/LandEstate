import bcrypt from 'bcrypt';
import { User, Property, Employee, Conversation, Message } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Seed the database with initial data
 * This replaces the functionality from populate_db.js
 */
export const seedDatabase = async () => {
  try {
    console.log('Seeding database with initial data...');

    // Check if data already exists
    const existingUsers = await User.findAll();
    if (existingUsers.length > 0) {
      console.log('Database already contains data. Skipping seed...');
      return {
        success: true,
        message: 'Database already populated',
        users: existingUsers.map(u => ({ id: u.id, name: u.name, email: u.email }))
      };
    }

    // Create default admin users
    const hashedPassword = await bcrypt.hash('Hello@12', 10);
    
    const prashant = await User.create({
      name: 'Prashant',
      email: 'prashant@gmail.com',
      password: hashedPassword,
      phone: '9876543210',
      address: 'Kathmandu, Nepal'
    });

    const manash = await User.create({
      name: 'Manash',
      email: 'manash@gmail.com', 
      password: hashedPassword,
      phone: '9876543211',
      address: 'Pokhara, Nepal'
    });

    // Create sample properties
    const property1 = await Property.create({
      name: 'Modern Apartment Complex',
      location: 'Kathmandu',
      price: 50000,
      priceDuration: 'monthly',
      beds: 3,
      baths: 2,
      areaSqm: 120.50,
      mainImage: 'http://localhost:4000/uploads/sample1.jpg',
      images: ['http://localhost:4000/uploads/sample2.jpg'],
      hasKitchen: true,
      hasBalcony: true,
      hasParking: true,
      description: 'A modern apartment complex with all amenities',
      userId: prashant.id,
      type: 'Apartment'
    });

    const property2 = await Property.create({
      name: 'Luxury Villa',
      location: 'Pokhara',
      price: 100000,
      priceDuration: 'monthly',
      beds: 4,
      baths: 3,
      areaSqm: 250.75,
      mainImage: 'http://localhost:4000/uploads/sample3.jpg',
      images: ['http://localhost:4000/uploads/sample4.jpg'],
      hasKitchen: true,
      hasBalcony: true,
      hasParking: true,
      description: 'A luxury villa with mountain views',
      userId: manash.id,
      type: 'House'
    });

    // Create sample employee
    const dipesh = await Employee.create({
      name: 'Dipesh',
      email: 'dipesh@gmail.com',
      password: hashedPassword,
      phone: '9876543212',
      managerId: prashant.id,
      isActive: true
    });

    // Assign employee to property
    await property1.update({ employeeId: dipesh.id });

    console.log('Database seeded successfully!');
    return {
      success: true,
      message: 'Database seeded successfully',
      users: [
        { id: prashant.id, name: 'Prashant', email: 'prashant@gmail.com' },
        { id: manash.id, name: 'Manash', email: 'manash@gmail.com' }
      ],
      employees: [
        { id: dipesh.id, name: 'Dipesh', email: 'dipesh@gmail.com' }
      ],
      properties: [
        { id: property1.id, name: 'Modern Apartment Complex' },
        { id: property2.id, name: 'Luxury Villa' }
      ]
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

/**
 * Create initial conversations between employees and their managers
 * This replaces the functionality from create_initial_conversations.cjs
 */
export const createInitialConversations = async () => {
  try {
    console.log('Creating initial conversations...');
    
    // Get all employees with their managers
    const employees = await Employee.findAll({
      where: { managerId: { [Op.ne]: null } },
      include: [{
        model: User,
        as: 'manager',
        attributes: ['id', 'name', 'email']
      }]
    });

    let conversationsCreated = 0;
    let messagesCreated = 0;

    for (const employee of employees) {
      if (!employee.manager) continue;

      const employeeId = employee.id;
      const managerId = employee.manager.id;
      const conversationEmployeeId = -employeeId; // Negative ID for employee

      // Check if conversation already exists
      const existingConversation = await Conversation.findOne({
        where: {
          [Op.or]: [
            { user1Id: conversationEmployeeId, user2Id: managerId },
            { user1Id: managerId, user2Id: conversationEmployeeId }
          ]
        }
      });

      if (existingConversation) {
        console.log(`Conversation already exists between ${employee.name} and ${employee.manager.name}`);
        continue;
      }

      // Create conversation
      const conversation = await Conversation.create({
        user1Id: Math.min(conversationEmployeeId, managerId),
        user2Id: Math.max(conversationEmployeeId, managerId),
        lastMessageTime: new Date()
      });

      // Create initial welcome message from manager
      const welcomeMessage = await Message.create({
        conversationId: conversation.id,
        senderId: managerId,
        receiverId: conversationEmployeeId,
        content: `Hello ${employee.name}! This is ${employee.manager.name}, your manager. Feel free to reach out if you have any questions or need assistance.`,
        messageType: 'text'
      });

      // Update conversation with last message
      await conversation.update({
        lastMessageId: welcomeMessage.id,
        lastMessageTime: new Date()
      });

      conversationsCreated++;
      messagesCreated++;
      
      console.log(`✓ Created conversation between ${employee.name} and ${employee.manager.name}`);
    }

    return {
      success: true,
      message: 'Initial conversations created successfully',
      conversationsCreated,
      messagesCreated
    };
  } catch (error) {
    console.error('Error creating initial conversations:', error);
    throw error;
  }
};

/**
 * Database diagnostic functions
 * This replaces the functionality from debug scripts
 */
export const getDatabaseDiagnostics = async () => {
  try {
    const employees = await Employee.findAll({
      attributes: ['id', 'name', 'email', 'managerId'],
      include: [{
        model: User,
        as: 'manager',
        attributes: ['id', 'name', 'email'],
        required: false
      }]
    });

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });

    const properties = await Property.findAll({
      attributes: ['id', 'name', 'userId', 'employeeId'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
          required: false
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['name'],
          required: false
        }
      ]
    });

    return {
      employees: employees.map(e => ({
        id: e.id,
        name: e.name,
        email: e.email,
        managerId: e.managerId,
        managerName: e.manager?.name || null
      })),
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role
      })),
      properties: properties.map(p => ({
        id: p.id,
        name: p.name,
        userId: p.userId,
        userName: p.user?.name || null,
        employeeId: p.employeeId,
        employeeName: p.employee?.name || null
      }))
    };
  } catch (error) {
    console.error('Error getting database diagnostics:', error);
    throw error;
  }
};
