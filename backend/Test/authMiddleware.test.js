const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../src/middleware/token-middleware.js");
const { authorizeUser } = require("../src/middleware/auth-middleware.js");
const { generateToken } = require("../src/security/jwt-util.js");

// Mock jwt
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

// Mock environment variables
process.env.JWT_SECRET = "test-secret-key";
process.env.secretkey = "test-secret-key";
process.env.expiresIn = "1h";

describe("Authentication Middleware", () => {
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

  describe("authenticateToken", () => {
    it("should authenticate valid token", () => {
      const req = {
        header: jest.fn().mockReturnValue("Bearer valid-token"),
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: "test@example.com" };

      jwt.verify.mockReturnValue(mockUser);

      authenticateToken(req, res, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret-key");
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 401 if no token provided", () => {
      const req = {
        header: jest.fn().mockReturnValue(null),
      };
      const res = mockResponse();

      authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. No token provided.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if token is invalid", () => {
      const req = {
        header: jest.fn().mockReturnValue("Bearer invalid-token"),
      };
      const res = mockResponse();

      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid token.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle token without Bearer prefix", () => {
      const req = {
        header: jest.fn().mockReturnValue("just-token"),
      };
      const res = mockResponse();

      authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. No token provided.",
      });
    });
  });

  describe("authorizeUser", () => {
    it("should authorize user accessing their own data", () => {
      const req = {
        params: { id: "1" },
        header: jest.fn().mockReturnValue("Bearer valid-token"),
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: "test@example.com" };

      jwt.verify.mockReturnValue(mockUser);

      authorizeUser(req, res, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret-key");
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access when user tries to access other user's data", () => {
      const req = {
        params: { id: "2" },
        header: jest.fn().mockReturnValue("Bearer valid-token"),
      };
      const res = mockResponse();
      const mockUser = { id: 1, email: "test@example.com" };

      jwt.verify.mockReturnValue(mockUser);

      authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. You can only access your own account.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if no token provided", () => {
      const req = {
        params: { id: "1" },
        header: jest.fn().mockReturnValue(null),
      };
      const res = mockResponse();

      authorizeUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. No token provided.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

describe("JWT Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateToken", () => {
    it("should generate token with payload", () => {
      const payload = { id: 1, email: "test@example.com" };
      const expectedToken = "generated-token";

      jwt.sign.mockReturnValue(expectedToken);

      const token = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        "test-secret-key",
        { expiresIn: "1h" }
      );
      expect(token).toBe(expectedToken);
    });

    it("should use environment variables for secret and expiration", () => {
      const payload = { id: 1, email: "test@example.com" };
      
      generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        process.env.secretkey,
        { expiresIn: process.env.expiresIn }
      );
    });
  });
});
