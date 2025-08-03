const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

// Mock User Model
const UserMock = dbMock.define('User', {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  phone: '1234567890',
  address: 'Test Address'
});

// Mock Property Model
const PropertyMock = dbMock.define('Property', {
  id: 1,
  name: 'Test Property',
  location: 'Test Location',
  price: 1000,
  priceDuration: 'One Day',
  type: 'House',
  beds: 2,
  baths: 1,
  areaSqm: 100,
  mainImage: 'test.jpg',
  images: ['test1.jpg', 'test2.jpg'],
  hasKitchen: true,
  hasBalcony: false,
  hasParking: true,
  description: 'Test property description',
  userId: 1
});

// Mock Employee Model
const EmployeeMock = dbMock.define('Employee', {
  id: 1,
  name: 'Test Employee',
  email: 'employee@example.com',
  password: 'hashedPassword',
  phone: '0987654321',
  position: 'Property Manager'
});

// Mock Room Model
const RoomMock = dbMock.define('Room', {
  id: 1,
  name: 'Test Room',
  type: 'Bedroom',
  area: 15,
  propertyId: 1
});

// Mock Message Model
const MessageMock = dbMock.define('Message', {
  id: 1,
  content: 'Test message',
  senderId: 1,
  receiverId: 2,
  conversationId: 1,
  timestamp: new Date()
});

describe('User Model', () => {
  it('should create a user', async () => {
    const user = await UserMock.create({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'hashedPassword',
      phone: '1111111111',
      address: 'New Address'
    });

    expect(user.name).toBe('New User');
    expect(user.email).toBe('newuser@example.com');
    expect(user.phone).toBe('1111111111');
    expect(user.address).toBe('New Address');
  });

  it('should require name and email', async () => {
    await expect(UserMock.create({})).rejects.toThrow();
  });

  it('should find user by email', async () => {
    const user = await UserMock.findOne({
      where: { email: 'test@example.com' }
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});

describe('Property Model', () => {
  it('should create a property', async () => {
    const property = await PropertyMock.create({
      name: 'New Property',
      location: 'New Location',
      price: 1500,
      type: 'Apartment',
      beds: 3,
      baths: 2,
      userId: 1
    });

    expect(property.name).toBe('New Property');
    expect(property.location).toBe('New Location');
    expect(property.price).toBe(1500);
    expect(property.type).toBe('Apartment');
    expect(property.beds).toBe(3);
    expect(property.baths).toBe(2);
  });

  it('should require name, location, and price', async () => {
    await expect(PropertyMock.create({
      name: 'Incomplete Property'
      // Missing location and price
    })).rejects.toThrow();
  });

  it('should have default values', async () => {
    const property = await PropertyMock.create({
      name: 'Basic Property',
      location: 'Basic Location',
      price: 800,
      userId: 1
    });

    expect(property.priceDuration).toBe('One Day');
    expect(property.type).toBe('House');
    expect(property.beds).toBe(2);
    expect(property.baths).toBe(1);
  });
});

describe('Employee Model', () => {
  it('should create an employee', async () => {
    const employee = await EmployeeMock.create({
      name: 'New Employee',
      email: 'newemp@example.com',
      password: 'hashedPassword',
      phone: '2222222222',
      position: 'Maintenance'
    });

    expect(employee.name).toBe('New Employee');
    expect(employee.email).toBe('newemp@example.com');
    expect(employee.position).toBe('Maintenance');
  });

  it('should require name, email, and password', async () => {
    await expect(EmployeeMock.create({
      name: 'Incomplete Employee'
      // Missing email and password
    })).rejects.toThrow();
  });
});

describe('Room Model', () => {
  it('should create a room', async () => {
    const room = await RoomMock.create({
      name: 'Master Bedroom',
      type: 'Bedroom',
      area: 20,
      propertyId: 1
    });

    expect(room.name).toBe('Master Bedroom');
    expect(room.type).toBe('Bedroom');
    expect(room.area).toBe(20);
    expect(room.propertyId).toBe(1);
  });

  it('should require name and propertyId', async () => {
    await expect(RoomMock.create({
      type: 'Bathroom'
      // Missing name and propertyId
    })).rejects.toThrow();
  });
});

describe('Message Model', () => {
  it('should create a message', async () => {
    const message = await MessageMock.create({
      content: 'Hello there!',
      senderId: 1,
      receiverId: 2,
      conversationId: 1
    });

    expect(message.content).toBe('Hello there!');
    expect(message.senderId).toBe(1);
    expect(message.receiverId).toBe(2);
    expect(message.conversationId).toBe(1);
  });

  it('should require content, senderId, and receiverId', async () => {
    await expect(MessageMock.create({
      content: 'Incomplete message'
      // Missing senderId and receiverId
    })).rejects.toThrow();
  });

  it('should have timestamp', async () => {
    const message = await MessageMock.create({
      content: 'Timestamped message',
      senderId: 1,
      receiverId: 2,
      conversationId: 1
    });

    expect(message.timestamp).toBeDefined();
    expect(message.timestamp).toBeInstanceOf(Date);
  });
});
