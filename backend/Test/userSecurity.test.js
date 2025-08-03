const userSecurity = require('../src/middleware/auth-middleware.js');
const jwt = require('jsonwebtoken');

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn()
}));

// Mock environment
process.env.JWT_SECRET = 'test-secret-key';

describe('User Security Tests', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Validation', () => {
    it('should accept valid JWT tokens', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid-token'),
        params: { id: '1' }
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: 'test@example.com', type: 'admin' };

      jwt.verify.mockReturnValue(mockUser);

      userSecurity.authorizeUser(req, res, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret-key');
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject expired tokens', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer expired-token'),
        params: { id: '1' }
      };
      const res = mockResponse();

      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject malformed tokens', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer malformed-token'),
        params: { id: '1' }
      };
      const res = mockResponse();

      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Authorization Checks', () => {
    it('should allow users to access their own data', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid-token'),
        params: { id: '1' }
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(mockUser);

      userSecurity.authorizeUser(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(403);
    });

    it('should prevent users from accessing other users data', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid-token'),
        params: { id: '2' }
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(mockUser);

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. You can only access your own account.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle string vs number ID comparison', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid-token'),
        params: { id: '1' }
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: 'test@example.com' }; // number ID

      jwt.verify.mockReturnValue(mockUser);

      userSecurity.authorizeUser(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(403);
    });
  });

  describe('Input Sanitization', () => {
    it('should handle missing authorization header', () => {
      const req = {
        header: jest.fn().mockReturnValue(null),
        params: { id: '1' }
      };
      const res = mockResponse();

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. No token provided.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', () => {
      const req = {
        header: jest.fn().mockReturnValue('InvalidFormat token'),
        params: { id: '1' }
      };
      const res = mockResponse();

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. No token provided.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should properly extract token from Bearer format', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer actual-token-here'),
        params: { id: '1' }
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(mockUser);

      userSecurity.authorizeUser(req, res, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('actual-token-here', 'test-secret-key');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Security Edge Cases', () => {
    it('should handle undefined user ID in token', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid-token'),
        params: { id: '1' }
      };
      const res = mockResponse();
      const mockUser = { email: 'test@example.com' }; // no ID

      jwt.verify.mockReturnValue(mockUser);

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. You can only access your own account.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle empty token after Bearer', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer '),
        params: { id: '1' }
      };
      const res = mockResponse();

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. No token provided.'
      });
    });

    it('should handle token verification network errors', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid-token'),
        params: { id: '1' }
      };
      const res = mockResponse();

      jwt.verify.mockImplementation(() => {
        throw new Error('Network error');
      });

      userSecurity.authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
