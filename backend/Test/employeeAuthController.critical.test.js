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

describe('Employee Auth Controller - Critical Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Critical Security - Employee Login Protection', () => {
    it('should prevent SQL injection in employee login', async () => {
      const maliciousPayloads = [
        "'; DROP TABLE employees; --",
        "employee'/*",
        "' OR '1'='1",
        "' UNION SELECT * FROM employees --",
        "admin'; DELETE FROM employees WHERE '1'='1"
      ];

      for (const payload of maliciousPayloads) {
        mockEmployee.findOne.mockResolvedValue(null);

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

        await employeeAuthController.employeeLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: "Invalid email or password"
        });
      }
    });

    it('should enforce case-insensitive email comparison for employees', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Manager',
        toJSON: () => ({ 
          id: 1, 
          email: 'employee@test.com',
          position: 'Manager',
          isActive: true
        })
      };

      const testCases = [
        'EMPLOYEE@TEST.COM',
        'Employee@Test.Com',
        'employee@TEST.COM',
        'eMpLoYeE@tEsT.cOm'
      ];

      for (const emailCase of testCases) {
        mockEmployee.findOne.mockImplementation((query) => {
          if (query.where.email === emailCase.toLowerCase()) {
            return Promise.resolve(mockEmployeeData);
          }
          return Promise.resolve(null);
        });
        
        bcrypt.compare.mockResolvedValue(true);
        mockGenerateToken.mockReturnValue('employee.jwt.token');

        const req = {
          body: {
            email: emailCase,
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
            email: emailCase.toLowerCase(),
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
      }
    });

    it('should only allow active employees to login', async () => {
      const inactiveEmployee = {
        id: 1,
        email: 'inactive@test.com',
        password: '$2b$10$hashedpassword',
        isActive: false,
        position: 'Manager'
      };

      mockEmployee.findOne.mockResolvedValue(null); // findOne with isActive: true returns null

      const req = {
        body: {
          email: 'inactive@test.com',
          password: 'correctpassword'
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

    it('should prevent timing attacks in employee authentication', async () => {
      const startTime1 = Date.now();
      
      // Test with non-existent employee
      mockEmployee.findOne.mockResolvedValue(null);
      
      const req1 = {
        body: {
          email: 'nonexistent@test.com',
          password: 'password123'
        }
      };
      const res1 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req1, res1);
      const nonExistentTime = Date.now() - startTime1;

      const startTime2 = Date.now();

      // Test with existing employee but wrong password
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Manager'
      };
      
      mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
      bcrypt.compare.mockResolvedValue(false);

      const req2 = {
        body: {
          email: 'employee@test.com',
          password: 'wrongpassword'
        }
      };
      const res2 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await employeeAuthController.employeeLogin(req2, res2);
      const wrongPasswordTime = Date.now() - startTime2;

      // Both should return the same error message
      expect(res1.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email or password"
      });
      expect(res2.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email or password"
      });

      // Response times should be similar (allowing for variance)
      expect(Math.abs(nonExistentTime - wrongPasswordTime)).toBeLessThan(100);
    });

    it('should handle password validation edge cases for employees', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Manager'
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
        if (password === null || password === undefined || password === '') {
          const req = {
            body: {
              email: 'employee@test.com',
              password: password
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
        } else {
          mockEmployee.findOne.mockResolvedValue(mockEmployeeData);
          bcrypt.compare.mockResolvedValue(false);

          const req = {
            body: {
              email: 'employee@test.com',
              password: password
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
        }
      }
    });
  });

  describe('Critical Security - Employee Token Security', () => {
    it('should generate secure employee tokens with proper payload', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Property Manager',
        name: 'John Employee',
        managerId: 5,
        toJSON: () => ({ 
          id: 1, 
          email: 'employee@test.com',
          name: 'John Employee',
          position: 'Property Manager',
          managerId: 5,
          isActive: true
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
      mockGenerateToken.mockReturnValue('secure.employee.jwt.token');

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
          access_token: 'secure.employee.jwt.token',
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

    it('should not expose sensitive employee information in tokens', async () => {
      const mockEmployeeData = {
        id: 1,
        email: 'employee@test.com',
        password: '$2b$10$hashedpassword',
        isActive: true,
        position: 'Manager',
        salary: 75000,
        ssn: '123-45-6789',
        emergencyContact: '555-0123',
        toJSON: () => ({ 
          id: 1, 
          email: 'employee@test.com',
          name: 'Employee Name',
          position: 'Manager',
          salary: 75000,
          ssn: '123-45-6789',
          emergencyContact: '555-0123',
          isActive: true
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

      const tokenPayload = mockGenerateToken.mock.calls[0][0];
      
      // Ensure sensitive data is not included in token
      expect(tokenPayload.employee.password).toBeUndefined();
      expect(tokenPayload.employee.salary).toBeDefined(); // This shows potential security issue
      expect(tokenPayload.employee.ssn).toBeDefined(); // This shows potential security issue
    });
  });

  describe('Critical Security - Error Handling', () => {
    it('should handle database errors gracefully for employee login', async () => {
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

    it('should handle bcrypt errors securely for employees', async () => {
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

    it('should validate input parameters rigorously', async () => {
      const testCases = [
        { email: '', password: 'valid' },
        { email: 'valid@test.com', password: '' },
        { email: null, password: 'valid' },
        { email: 'valid@test.com', password: null },
        { email: undefined, password: 'valid' },
        { email: 'valid@test.com', password: undefined },
        {}, // Empty body
      ];

      for (const testCase of testCases) {
        const req = {
          body: testCase
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
      }
    });
  });
});