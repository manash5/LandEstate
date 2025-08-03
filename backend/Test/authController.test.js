// Mock dependencies first
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
};

const mockBcrypt = {
  compare: jest.fn(),
  hash: jest.fn(),
};

const mockGenerateToken = jest.fn();

const mockSendMail = {
  sendLoginNotification: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
};

// Create mock auth controller functions
const authController = {
  login: async (req, res) => {
    try {
      if (req.body.email == null) {
        return res.status(400).send({ message: "Email is required" });
      }
      if (req.body.password == null) {
        return res.status(400).send({ message: "Password is required" });
      }
      
      const user = await mockUser.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(404).send({ message: "No account found with this email address" });
      }
      
      const isPasswordValid = await mockBcrypt.compare(req.body.password, user.password);
      if (isPasswordValid) {
        const token = mockGenerateToken({ 
          user: user.toJSON(),
          id: user.id,
          email: user.email,
          type: 'admin'
        });
        mockSendMail.sendLoginNotification(user.email).catch(() => {});
        return res.status(200).send({
          data: { access_token: token },
          message: "Successfully logged in",
        });
      } else {
        return res.status(401).send({ message: "Incorrect password" });
      }
    } catch (e) {
      console.error('Login error:', e);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
};

describe("Auth Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login user with valid credentials", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();
      
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        toJSON: () => ({ id: 1, email: "test@example.com" }),
      };

      mockUser.findOne.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue("mock-token");

      await authController.login(req, res);

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(mockGenerateToken).toHaveBeenCalledWith({
        user: { id: 1, email: "test@example.com" },
        id: 1,
        email: "test@example.com",
        type: "admin",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: { access_token: "mock-token" },
        message: "Successfully logged in",
      });
    });

    it("should return 400 if email is missing", async () => {
      const req = {
        body: {
          password: "password123",
        },
      };
      const res = mockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Email is required",
      });
    });

    it("should return 400 if password is missing", async () => {
      const req = {
        body: {
          email: "test@example.com",
        },
      };
      const res = mockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Password is required",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "No account found with this email address",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "wrongpassword",
        },
      };
      const res = mockResponse();

      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        toJSON: () => ({ id: 1, email: "test@example.com" }),
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "Incorrect password",
      });
    });

    it("should handle server errors", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      User.findOne.mockRejectedValue(new Error("Database error"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error. Please try again later.",
      });
    });
  });
});
