import request from 'supertest';
import app from '../src/index.js'; // Adjust path as needed

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '+1234567890',
  address: '123 Test Street'
};

let authToken = '';
let userId = '';

describe('User Account & Security API Tests', () => {
  
  // Setup - Create a test user and login
  beforeAll(async () => {
    // Create test user
    const createResponse = await request(app)
      .post('/api/user')
      .send(testUser);
    
    expect(createResponse.status).toBe(201);
    userId = createResponse.body.data.id;
    
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token;
  });

  describe('GET /api/user/:id/profile', () => {
    test('should return user profile without sensitive data', async () => {
      const response = await request(app)
        .get(`/api/user/${userId}/profile`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data).not.toHaveProperty('resetPasswordToken');
    });

    test('should return 401 without auth token', async () => {
      const response = await request(app)
        .get(`/api/user/${userId}/profile`);

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/user/:id/account-info', () => {
    test('should update account information successfully', async () => {
      const updateData = {
        name: 'Updated Test User',
        email: 'updated@example.com',
        phone: '+9876543210',
        address: '456 Updated Street'
      };

      const response = await request(app)
        .patch(`/api/user/${userId}/account-info`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
      expect(response.body.message).toBe('Account information updated successfully');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .patch(`/api/user/${userId}/account-info`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: '+1234567890' }); // Missing name and email

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Name and email are required');
    });

    test('should validate email format', async () => {
      const response = await request(app)
        .patch(`/api/user/${userId}/account-info`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test User',
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('valid email address');
    });
  });

  describe('PATCH /api/user/:id/change-password', () => {
    test('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newPassword456',
        confirmPassword: 'newPassword456'
      };

      const response = await request(app)
        .patch(`/api/user/${userId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password changed successfully');
    });

    test('should validate current password', async () => {
      const passwordData = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword789',
        confirmPassword: 'newPassword789'
      };

      const response = await request(app)
        .patch(`/api/user/${userId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Current password is incorrect');
    });

    test('should validate password confirmation', async () => {
      const passwordData = {
        currentPassword: 'newPassword456', // Updated password from previous test
        newPassword: 'anotherPassword123',
        confirmPassword: 'differentPassword123'
      };

      const response = await request(app)
        .patch(`/api/user/${userId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('do not match');
    });

    test('should validate password strength', async () => {
      const passwordData = {
        currentPassword: 'newPassword456',
        newPassword: '123', // Too short
        confirmPassword: '123'
      };

      const response = await request(app)
        .patch(`/api/user/${userId}/change-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('at least');
    });
  });

  describe('POST /api/user/:id/validate-password', () => {
    test('should validate correct password', async () => {
      const response = await request(app)
        .post(`/api/user/${userId}/validate-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'newPassword456' });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const response = await request(app)
        .post(`/api/user/${userId}/validate-password`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'wrongPassword' });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(false);
    });
  });

  // Cleanup
  afterAll(async () => {
    // Delete test user
    await request(app)
      .delete(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
  });
});

export default describe;
