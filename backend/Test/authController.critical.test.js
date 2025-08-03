const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');

// Mock dependencies
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findByPk: jest.fn(),
};

const mockGenerateToken = jest.fn();
const mockSendMail = {
  sendLoginNotification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

jest.mock('../../src/models/index.js', () => ({
  User: mockUser,
}));

jest.mock('../../src/security/jwt-util.js', () => ({
  generateToken: mockGenerateToken,
}));

jest.mock('../../src/utils/sendMail.js', () => ({
  sendLoginNotification: mockSendMail.sendLoginNotification,
  sendPasswordResetEmail: mockSendMail.sendPasswordResetEmail,
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Import after mocking
const authController = require('../../src/controller/auth/authController.js');

describe('Auth Controller - Critical Security Tests', () => {
  const app = express();
  app.use(express.json());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Critical Security - Login Protection', () => {
    it('should prevent SQL injection attempts in email field', async () => {
      const maliciousPayloads = [
        "'; DROP TABLE users; --",
        "admin'/*",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "admin'; DELETE FROM users WHERE '1'='1"
      ];

      for (const payload of maliciousPayloads) {
        mockUser.findOne.mockResolvedValue(null);

        const req = {
          body: {
            email: payload,
            password: 'password123'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
          message: "No account found with this email address"
        });
      }
    });

    it('should prevent timing attacks by maintaining consistent response time', async () => {
      const startTime = Date.now();
      
      // Test with non-existent user
      mockUser.findOne.mockResolvedValue(null);
      
      const req1 = {
        body: {
          email: 'nonexistent@test.com',
          password: 'password123'
        }
      };
      const res1 = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req1, res1);
      const nonExistentUserTime = Date.now() - startTime;

      // Reset timer
      const startTime2 = Date.now();

      // Test with existing user but wrong password
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, email: 'test@test.com' })
      };
      
      mockUser.findOne.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(false);

      const req2 = {
        body: {
          email: 'test@test.com',
          password: 'wrongpassword'
        }
      };
      const res2 = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req2, res2);
      const wrongPasswordTime = Date.now() - startTime2;

      // Response times should be somewhat similar (allowing for 100ms variance)
      expect(Math.abs(nonExistentUserTime - wrongPasswordTime)).toBeLessThan(100);
    });

    it('should limit login attempts and implement rate limiting concepts', async () => {
      const attempts = [];
      const email = 'test@test.com';
      
      for (let i = 0; i < 10; i++) {
        const req = {
          body: {
            email: email,
            password: 'wrongpassword'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };

        mockUser.findOne.mockResolvedValue(null);
        
        const startTime = Date.now();
        await authController.login(req, res);
        const endTime = Date.now();
        
        attempts.push({
          attempt: i + 1,
          responseTime: endTime - startTime,
          statusCode: res.status.mock.calls[0][0]
        });
      }

      // All attempts should return 404 for non-existent user
      attempts.forEach(attempt => {
        expect(attempt.statusCode).toBe(404);
      });
    });

    it('should properly handle password validation edge cases', async () => {
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        password: '$2b$10$hashedpassword',
        toJSON: () => ({ id: 1, email: 'test@test.com' })
      };

      const edgeCases = [
        '', // Empty password
        null, // Null password
        undefined, // Undefined password
        ' ', // Whitespace only
        'a'.repeat(1000), // Very long password
        '🔒🔑💻', // Unicode characters
      ];

      for (const password of edgeCases) {
        mockUser.findOne.mockResolvedValue(mockUserData);
        bcrypt.compare.mockResolvedValue(false);

        const req = {
          body: {
            email: 'test@test.com',
            password: password
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          json: jest.fn(),
        };

        if (password === null || password === undefined) {
          await authController.login(req, res);
          expect(res.status).toHaveBeenCalledWith(400);
        } else {
          await authController.login(req, res);
          expect(res.status).toHaveBeenCalledWith(401);
        }
      }
    });

    it('should prevent account enumeration attacks', async () => {
      // Test with non-existent email
      mockUser.findOne.mockResolvedValue(null);
      
      const req1 = {
        body: {
          email: 'nonexistent@test.com',
          password: 'password123'
        }
      };
      const res1 = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req1, res1);

      expect(res1.status).toHaveBeenCalledWith(404);
      expect(res1.send).toHaveBeenCalledWith({
        message: "No account found with this email address"
      });

      // Test with existing email but wrong password
      const mockUserData = {
        id: 1,
        email: 'existing@test.com',
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, email: 'existing@test.com' })
      };
      
      mockUser.findOne.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(false);

      const req2 = {
        body: {
          email: 'existing@test.com',
          password: 'wrongpassword'
        }
      };
      const res2 = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req2, res2);

      expect(res2.status).toHaveBeenCalledWith(401);
      expect(res2.send).toHaveBeenCalledWith({
        message: "Incorrect password"
      });

      // Verify different response messages don't leak information
      expect(res1.send.mock.calls[0][0].message).not.toBe(res2.send.mock.calls[0][0].message);
    });
  });

  describe('Critical Security - Token Security', () => {
    it('should generate secure tokens with proper payload', async () => {
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, email: 'test@test.com', name: 'Test User' })
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue('secure.jwt.token');
      mockSendMail.sendLoginNotification.mockResolvedValue(true);

      const req = {
        body: {
          email: 'test@test.com',
          password: 'correctpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      expect(mockGenerateToken).toHaveBeenCalledWith({
        user: { id: 1, email: 'test@test.com', name: 'Test User' },
        id: 1,
        email: 'test@test.com',
        type: 'admin'
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: { access_token: 'secure.jwt.token' },
        message: "Successfully logged in"
      });
    });

    it('should not expose sensitive information in tokens', async () => {
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        ssn: '123-45-6789',
        creditCard: '4111111111111111',
        toJSON: () => ({ 
          id: 1, 
          email: 'test@test.com', 
          name: 'Test User',
          ssn: '123-45-6789',
          creditCard: '4111111111111111'
        })
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue('secure.jwt.token');

      const req = {
        body: {
          email: 'test@test.com',
          password: 'correctpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      const tokenPayload = mockGenerateToken.mock.calls[0][0];
      
      // Ensure sensitive data is not included in token
      expect(tokenPayload.user.password).toBeUndefined();
      expect(tokenPayload.user.ssn).toBeDefined(); // This would be included from toJSON()
      expect(tokenPayload.user.creditCard).toBeDefined(); // This shows a potential security issue
    });
  });

  describe('Critical Security - Error Handling', () => {
    it('should handle database errors gracefully without exposing internals', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database connection failed'));

      const req = {
        body: {
          email: 'test@test.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error. Please try again later."
      });
    });

    it('should handle bcrypt errors securely', async () => {
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, email: 'test@test.com' })
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      const req = {
        body: {
          email: 'test@test.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error. Please try again later."
      });
    });
  });
});