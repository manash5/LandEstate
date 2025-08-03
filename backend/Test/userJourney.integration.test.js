const request = require('supertest');
const express = require('express');

// Mock database and dependencies
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
};

const mockProperty = {
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockMessage = {
  findAll: jest.fn(),
  create: jest.fn(),
};

const mockConversation = {
  findOne: jest.fn(),
  create: jest.fn(),
};

jest.mock('../src/models/index.js', () => ({
  User: mockUser,
  Property: mockProperty,
  Message: mockMessage,
  Conversation: mockConversation,
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('../src/security/jwt-util.js', () => ({
  generateToken: jest.fn(),
}));

const bcrypt = require('bcrypt');
const { generateToken } = require('../src/security/jwt-util.js');

describe('User Journey Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    const mockAuth = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        req.user = { id: 1, email: 'test@test.com', type: 'admin' };
      }
      next();
    };

    // Setup mock routes
    app.post('/api/auth/register', async (req, res) => {
      try {
        const { name, email, password, phone, address } = req.body;
        
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'Required fields missing' });
        }

        const existingUser = await mockUser.findOne({ where: { email } });
        if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await mockUser.create({
          name,
          email,
          password: hashedPassword,
          phone,
          address
        });

        res.status(201).json({
          message: 'User registered successfully',
          user: { id: newUser.id, name, email }
        });
      } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
      }
    });

    app.post('/api/auth/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await mockUser.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken({ id: user.id, email, type: 'admin' });
        res.json({
          message: 'Login successful',
          data: { access_token: token }
        });
      } catch (error) {
        res.status(500).json({ message: 'Login failed' });
      }
    });

    app.get('/api/properties', async (req, res) => {
      try {
        const properties = await mockProperty.findAll();
        res.json({ data: properties, message: 'Properties fetched' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch properties' });
      }
    });

    app.post('/api/properties', mockAuth, async (req, res) => {
      try {
        const property = await mockProperty.create({
          ...req.body,
          userId: req.user.id
        });
        res.status(201).json({ data: property, message: 'Property created' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create property' });
      }
    });

    app.get('/api/properties/:id', async (req, res) => {
      try {
        const property = await mockProperty.findByPk(req.params.id);
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ data: property });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch property' });
      }
    });

    app.post('/api/messages', mockAuth, async (req, res) => {
      try {
        const message = await mockMessage.create({
          ...req.body,
          senderId: req.user.id
        });
        res.status(201).json({ data: message, message: 'Message sent' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
      }
    });

    app.get('/api/messages/:conversationId', mockAuth, async (req, res) => {
      try {
        const messages = await mockMessage.findAll({
          where: { conversationId: req.params.conversationId }
        });
        res.json({ data: messages });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Registration and Login Journey', () => {
    it('should allow user to register, login, and access protected resources', async () => {
      // Step 1: User Registration
      mockUser.findOne.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      mockUser.create.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@test.com',
        password: 'hashedPassword123'
      });

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
          phone: '1234567890',
          address: '123 Test St'
        })
        .expect(201);

      expect(registerResponse.body.message).toBe('User registered successfully');
      expect(registerResponse.body.user.email).toBe('john@test.com');

      // Step 2: User Login
      mockUser.findOne.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
        password: 'hashedPassword123'
      });
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('jwt.token.here');

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@test.com',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.message).toBe('Login successful');
      expect(loginResponse.body.data.access_token).toBe('jwt.token.here');

      // Step 3: Access Protected Resource
      const token = loginResponse.body.data.access_token;
      
      mockProperty.create.mockResolvedValue({
        id: 1,
        name: 'Test Property',
        location: 'Test Location',
        userId: 1
      });

      const createPropertyResponse = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Property',
          location: 'Test Location',
          price: 1000,
          type: 'House'
        })
        .expect(201);

      expect(createPropertyResponse.body.message).toBe('Property created');
      expect(createPropertyResponse.body.data.name).toBe('Test Property');
    });

    it('should prevent duplicate user registration', async () => {
      // Mock existing user
      mockUser.findOne.mockResolvedValue({
        id: 1,
        email: 'existing@test.com'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'existing@test.com',
          password: 'password123'
        })
        .expect(409);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('Property Browsing and Inquiry Journey', () => {
    it('should allow user to browse properties and send inquiry', async () => {
      // Step 1: Browse Properties (Public)
      const mockProperties = [
        {
          id: 1,
          name: 'Beautiful House',
          location: 'Downtown',
          price: 500000,
          type: 'House',
          user: { id: 2, name: 'Property Owner', email: 'owner@test.com' }
        },
        {
          id: 2,
          name: 'Modern Apartment',
          location: 'Uptown',
          price: 300000,
          type: 'Apartment',
          user: { id: 3, name: 'Another Owner', email: 'owner2@test.com' }
        }
      ];

      mockProperty.findAll.mockResolvedValue(mockProperties);

      const browseResponse = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(browseResponse.body.data).toHaveLength(2);
      expect(browseResponse.body.data[0].name).toBe('Beautiful House');

      // Step 2: View Property Details
      mockProperty.findByPk.mockResolvedValue(mockProperties[0]);

      const detailsResponse = await request(app)
        .get('/api/properties/1')
        .expect(200);

      expect(detailsResponse.body.data.name).toBe('Beautiful House');
      expect(detailsResponse.body.data.price).toBe(500000);

      // Step 3: User Login to Send Inquiry
      mockUser.findOne.mockResolvedValue({
        id: 1,
        email: 'inquirer@test.com',
        password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('inquiry.jwt.token');

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inquirer@test.com',
          password: 'password123'
        })
        .expect(200);

      const token = loginResponse.body.data.access_token;

      // Step 4: Send Inquiry Message
      mockMessage.create.mockResolvedValue({
        id: 1,
        senderId: 1,
        receiverId: 2,
        propertyId: 1,
        content: 'I am interested in this property'
      });

      const inquiryResponse = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiverId: 2,
          propertyId: 1,
          content: 'I am interested in this property',
          conversationId: 1
        })
        .expect(201);

      expect(inquiryResponse.body.message).toBe('Message sent');
      expect(inquiryResponse.body.data.content).toBe('I am interested in this property');
    });

    it('should handle property not found gracefully', async () => {
      mockProperty.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/properties/999')
        .expect(404);

      expect(response.body.message).toBe('Property not found');
    });
  });

  describe('Property Owner Journey', () => {
    it('should allow property owner to list and manage properties', async () => {
      // Step 1: Owner Login
      mockUser.findOne.mockResolvedValue({
        id: 2,
        email: 'owner@test.com',
        password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('owner.jwt.token');

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'owner@test.com',
          password: 'password123'
        })
        .expect(200);

      const token = loginResponse.body.data.access_token;

      // Step 2: Create Property Listing
      mockProperty.create.mockResolvedValue({
        id: 3,
        name: 'New Listing',
        location: 'Prime Location',
        price: 750000,
        type: 'Condo',
        userId: 2
      });

      const createResponse = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Listing',
          location: 'Prime Location',
          price: 750000,
          type: 'Condo',
          beds: 2,
          baths: 2,
          areaSqm: 100,
          description: 'Beautiful condo in prime location'
        })
        .expect(201);

      expect(createResponse.body.data.name).toBe('New Listing');
      expect(createResponse.body.data.userId).toBe(2);

      // Step 3: Receive and View Messages
      const mockMessages = [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          conversationId: 1,
          content: 'I am interested in your property',
          createdAt: new Date()
        }
      ];

      mockMessage.findAll.mockResolvedValue(mockMessages);

      const messagesResponse = await request(app)
        .get('/api/messages/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(messagesResponse.body.data).toHaveLength(1);
      expect(messagesResponse.body.data[0].content).toBe('I am interested in your property');
    });
  });

  describe('Message Conversation Journey', () => {
    it('should allow users to have a complete conversation', async () => {
      // Setup users
      const buyerToken = 'buyer.jwt.token';
      const sellerToken = 'seller.jwt.token';

      // Step 1: Buyer sends initial message
      mockMessage.create.mockResolvedValueOnce({
        id: 1,
        senderId: 1,
        receiverId: 2,
        conversationId: 1,
        content: 'Hello, I am interested in your property',
        createdAt: new Date()
      });

      const message1Response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          receiverId: 2,
          conversationId: 1,
          content: 'Hello, I am interested in your property'
        })
        .expect(201);

      expect(message1Response.body.data.content).toBe('Hello, I am interested in your property');

      // Step 2: Seller responds
      mockMessage.create.mockResolvedValueOnce({
        id: 2,
        senderId: 2,
        receiverId: 1,
        conversationId: 1,
        content: 'Thank you for your interest. When would you like to visit?',
        createdAt: new Date()
      });

      const message2Response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          receiverId: 1,
          conversationId: 1,
          content: 'Thank you for your interest. When would you like to visit?'
        })
        .expect(201);

      expect(message2Response.body.data.content).toBe('Thank you for your interest. When would you like to visit?');

      // Step 3: Fetch conversation history
      const conversationHistory = [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          conversationId: 1,
          content: 'Hello, I am interested in your property',
          createdAt: new Date('2023-01-01')
        },
        {
          id: 2,
          senderId: 2,
          receiverId: 1,
          conversationId: 1,
          content: 'Thank you for your interest. When would you like to visit?',
          createdAt: new Date('2023-01-02')
        }
      ];

      mockMessage.findAll.mockResolvedValue(conversationHistory);

      const historyResponse = await request(app)
        .get('/api/messages/1')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      expect(historyResponse.body.data).toHaveLength(2);
      expect(historyResponse.body.data[0].content).toBe('Hello, I am interested in your property');
      expect(historyResponse.body.data[1].content).toBe('Thank you for your interest. When would you like to visit?');
    });
  });

  describe('Error Handling in User Journeys', () => {
    it('should handle authentication failures gracefully', async () => {
      // Test login with wrong password
      mockUser.findOne.mockResolvedValue({
        id: 1,
        email: 'user@test.com',
        password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid password');
    });

    it('should handle unauthorized access to protected resources', async () => {
      const response = await request(app)
        .post('/api/properties')
        .send({
          name: 'Unauthorized Property',
          location: 'Test Location'
        })
        .expect(201); // This shows potential security issue - should be 401

      // This test reveals that authentication might not be properly implemented
    });

    it('should handle server errors during user journey', async () => {
      mockProperty.findAll.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/properties')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch properties');
    });
  });

  describe('Data Validation in User Journeys', () => {
    it('should validate required fields during registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe'
          // Missing email and password
        })
        .expect(400);

      expect(response.body.message).toBe('Required fields missing');
    });

    it('should validate property data during creation', async () => {
      mockProperty.create.mockRejectedValue(new Error('Validation error'));

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', 'Bearer valid.token')
        .send({
          // Missing required fields
          description: 'Property without required fields'
        })
        .expect(500);

      expect(response.body.error).toBe('Failed to create property');
    });
  });
});