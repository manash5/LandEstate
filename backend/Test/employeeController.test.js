const employeeController = require("../src/controller/employee/EmployeeController.js");
const { Employee, User, Property } = require("../src/models/index.js");
const bcrypt = require("bcrypt");

// Mock dependencies
jest.mock("../src/models/index.js", () => ({
  Employee: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  User: {},
  Property: {},
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../src/utils/validation.js", () => ({
  isValidEmail: jest.fn(),
  validatePasswordStrength: jest.fn(),
  isValidPhone: jest.fn(),
  validateName: jest.fn(),
  sanitizeInput: jest.fn(),
}));

const { isValidEmail, validatePasswordStrength } = require("../src/utils/validation.js");

describe("Employee Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEmployee", () => {
    it("should create a new employee with valid data", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "StrongPassword123!",
          phone: "1234567890",
        },
      };
      const res = mockResponse();

      const mockEmployee = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
      };

      isValidEmail.mockReturnValue(true);
      validatePasswordStrength.mockReturnValue({ isValid: true, errors: [] });
      bcrypt.hash.mockResolvedValue("hashedPassword");
      Employee.create.mockResolvedValue(mockEmployee);

      await employeeController.createEmployee(req, res);

      expect(isValidEmail).toHaveBeenCalledWith("john@example.com");
      expect(validatePasswordStrength).toHaveBeenCalledWith("StrongPassword123!");
      expect(bcrypt.hash).toHaveBeenCalledWith("StrongPassword123!", 10);
      expect(Employee.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
        phone: "1234567890",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Employee created successfully",
        data: mockEmployee,
      });
    });

    it("should return 400 if required fields are missing", async () => {
      const req = {
        body: {
          name: "John Doe",
          // Missing email and password
        },
      };
      const res = mockResponse();

      await employeeController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Name, email, and password are required",
      });
    });

    it("should return 400 if email format is invalid", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "invalid-email",
          password: "StrongPassword123!",
        },
      };
      const res = mockResponse();

      isValidEmail.mockReturnValue(false);

      await employeeController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid email format",
      });
    });

    it("should return 400 if password is weak", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "weak",
        },
      };
      const res = mockResponse();

      isValidEmail.mockReturnValue(true);
      validatePasswordStrength.mockReturnValue({
        isValid: false,
        errors: ["Password too short", "Missing uppercase letter"],
      });

      await employeeController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Password validation failed: Password too short, Missing uppercase letter",
      });
    });

    it("should handle database errors", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "StrongPassword123!",
        },
      };
      const res = mockResponse();

      isValidEmail.mockReturnValue(true);
      validatePasswordStrength.mockReturnValue({ isValid: true, errors: [] });
      bcrypt.hash.mockResolvedValue("hashedPassword");
      Employee.create.mockRejectedValue(new Error("Database error"));

      await employeeController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to create employee",
        error: "Database error",
      });
    });
  });

  describe("getAllEmployees", () => {
    it("should fetch all employees", async () => {
      const req = {};
      const res = mockResponse();

      const mockEmployees = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ];

      Employee.findAll.mockResolvedValue(mockEmployees);

      await employeeController.getAllEmployees(req, res);

      expect(Employee.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ["password"] },
        include: expect.any(Array),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockEmployees,
      });
    });

    it("should handle errors when fetching employees", async () => {
      const req = {};
      const res = mockResponse();

      Employee.findAll.mockRejectedValue(new Error("Database error"));

      await employeeController.getAllEmployees(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to fetch employees",
        error: "Database error",
      });
    });
  });

  describe("getEmployeeById", () => {
    it("should fetch employee by ID", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();

      const mockEmployee = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      Employee.findByPk.mockResolvedValue(mockEmployee);

      await employeeController.getEmployeeById(req, res);

      expect(Employee.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ["password"] },
        include: expect.any(Array),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockEmployee,
      });
    });

    it("should return 404 if employee not found", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();

      Employee.findByPk.mockResolvedValue(null);

      await employeeController.getEmployeeById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Employee not found",
      });
    });
  });

  describe("deleteEmployee", () => {
    it("should delete an employee", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();

      const mockEmployee = {
        id: 1,
        name: "John Doe",
        destroy: jest.fn().mockResolvedValue(true),
      };

      Employee.findByPk.mockResolvedValue(mockEmployee);

      await employeeController.deleteEmployee(req, res);

      expect(Employee.findByPk).toHaveBeenCalledWith(1);
      expect(mockEmployee.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Employee deleted successfully",
      });
    });

    it("should return 404 if employee not found for deletion", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();

      Employee.findByPk.mockResolvedValue(null);

      await employeeController.deleteEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Employee not found",
      });
    });
  });
});
