const bcrypt = require('bcrypt');

// Mock dependencies
const mockEmployee = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findByPk: jest.fn(),
};

const mockUser = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
};

const mockGenerateToken = jest.fn();

jest.mock('../../src/models/index.js', () => ({
  Employee: mockEmployee,
  User: mockUser,
}));

jest.mock('../../src/security/jwt-util.js', () => ({
  generateToken: mockGenerateToken,
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Import after mocking
const employeeAuthController = require('../../src/controller/auth/employeeAuthController.js');

describe('Employee Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('employeeLogin', () => {
    it('should successfully login employee with valid credentials', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        name: 'John Employee',
        position: 'Property Manager',
        phone: '1234567890',
        isActive: true,
        managerId: 5,
        toJSON: () => ({
          id: 1,
          email: 'employee@test.com',
          name: 'John Employee',
          position: 'Property Manager',
          phone: '1234567890',
          isActive: true,
          managerId: 5
        })
      };

      const mockManager = {
        id: 5,
        name: 'Manager Name',
        email: 'manager@test.com'
      };

      mockEmployeeData.manager = mockManager;

      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue('employee.jwt.token');

      const req = {
        body: {
          email: 'employee@test.com',
          password: 'correctpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(mockEmployee.findOne).toHaveBeenCalledWith({
        where: { 
          email: 'employee@test.com',
          isActive: true 
        },
        include: [{
          model: mockUser,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
          required: false
        }]
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', '$2b$10$hashedpassword');

      expect(mockGenerateToken).toHaveBeenCalledWith({
        employee: mockEmployeeData.toJSON(),
        id: 1,
        email: 'employee@test.com',
        type: 'employee',
        position: 'Property Manager',
        managerId: 5
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Employee login successful",
        data: {
          access_token: 'employee.jwt.token',
          employee: {
            id: 1,
            name: 'John Employee',
            email: 'employee@test.com',
            position: 'Property Manager',
            manager: mockManager
          }
        }
      });
    });

    it('should reject login with missing email', async () => {
      const req = {
        body: {
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email and password are required"
      });
    });

    it('should reject login with missing password', async () => {
      const req = {
        body: {
          email: 'employee@test.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email and password are required"
      });
    });

    it('should reject login with non-existent employee', async () => {
      mockEmployee.findOne.mockResolvedValue(null);

      const req = {
        body: {
          email: 'nonexistent@test.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email or password"
      });
    });

    it('should reject login with incorrect password', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Manager'
      };

      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockResolvedValue(false);

      const req = {
        body: {
          email: 'employee@test.com',
          password: 'wrongpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email or password"
      });
    });

    it('should reject login for inactive employee', async () => {
      // findOne with isActive: true should return null for inactive employees
      mockEmployee.findOne.mockResolvedValue(null);

      const req = {
        body: {
          email: 'inactive@test.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(mockEmployee.findOne).toHaveBeenCalledWith({
        where: { 
          email: 'inactive@test.com',
          isActive: true 
        },
        include: [{
          model: mockUser,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
          required: false
        }]
      });

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email or password"
      });
    });

    it('should handle employee without manager', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        name: 'John Employee',
        position: 'Property Manager',
        isActive: true,
        managerId: null,
        manager: null,
        toJSON: () => ({
          id: 1,
          email: 'employee@test.com',
          name: 'John Employee',
          position: 'Property Manager',
          isActive: true,
          managerId: null
        })
      };

      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue('employee.jwt.token');

      const req = {
        body: {
          email: 'employee@test.com',
          password: 'correctpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Employee login successful",
        data: {
          access_token: 'employee.jwt.token',
          employee: {
            id: 1,
            name: 'John Employee',
            email: 'employee@test.com',
            position: 'Property Manager',
            manager: null
          }
        }
      });
    });

    it('should convert email to lowercase for consistency', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        name: 'John Employee',
        position: 'Property Manager',
        isActive: true,
        toJSON: () => ({
          id: 1,
          email: 'employee@test.com',
          name: 'John Employee',
          position: 'Property Manager',
          isActive: true
        })
      };

      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue('employee.jwt.token');

      const req = {
        body: {
          email: 'EMPLOYEE@TEST.COM', // Uppercase email
          password: 'correctpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(mockEmployee.findOne).toHaveBeenCalledWith({
        where: { 
          email: 'employee@test.com', // Should be converted to lowercase
          isActive: true 
        },
        include: [{
          model: mockUser,
          as: 'manager',
          attributes: ['id', 'name', 'email'],
          required: false
        }]
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle database errors gracefully', async () => {
      mockEmployee.findOne.mockRejectedValue(new Error('Database connection failed'));

      const req = {
        body: {
          email: 'employee@test.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error. Please try again later."
      });
    });

    it('should handle bcrypt comparison errors', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Manager'
      };

      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      const req = {
        body: {
          email: 'employee@test.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error. Please try again later."
      });
    });

    it('should handle token generation errors', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        name: 'John Employee',
        position: 'Property Manager',
        isActive: true,
        toJSON: () => ({
          id: 1,
          email: 'employee@test.com',
          name: 'John Employee',
          position: 'Property Manager',
          isActive: true
        })
      };

      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockResolvedValue(true);
      mockGenerateToken.mockImplementation(() => {
        throw new Error('Token generation failed');
      });

      const req = {
        body: {
          email: 'employee@test.com',
          password: 'correctpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error. Please try again later."
      });
    });
  });
});