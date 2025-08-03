const propertyController = require("../src/controller/properties/PropertyController.js");
const { Property, User, Employee, Room } = require("../src/models/index.js");

// Mock Sequelize Models
jest.mock("../src/models/index.js", () => ({
  Property: {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  User: {},
  Employee: {},
  Room: {},
}));

describe("Property Controller", () => {
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

  describe("getAll", () => {
    it("should fetch all properties with associations", async () => {
      const req = {};
      const res = mockResponse();
      
      const mockProperties = [
        {
          id: 1,
          name: "Test Property",
          location: "Test Location",
          price: 1000,
          user: { id: 1, name: "Test User" },
          employee: { id: 1, name: "Test Employee" },
          rooms: [],
        },
      ];

      Property.findAll.mockResolvedValue(mockProperties);

      await propertyController.getAll(req, res);

      expect(Property.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "phone", "address"],
          },
          {
            model: Employee,
            as: "employee",
            attributes: ["id", "name", "email", "phone"],
            required: false,
          },
          {
            model: Room,
            as: "rooms",
            required: false,
          },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: mockProperties,
        message: "Successfully fetched properties",
      });
    });

    it("should handle errors when fetching properties", async () => {
      const req = {};
      const res = mockResponse();

      Property.findAll.mockRejectedValue(new Error("Database error"));

      await propertyController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch properties",
      });
    });
  });

  describe("create", () => {
    it("should create a new property", async () => {
      const req = {
        body: {
          name: "Test Property",
          location: "Test Location",
          price: 1000,
          userId: 1,
          images: ["image1.jpg", "image2.jpg"],
        },
        protocol: "http",
        get: jest.fn().mockReturnValue("localhost:4000"),
        files: [],
      };
      const res = mockResponse();

      const mockProperty = {
        id: 1,
        name: "Test Property",
        location: "Test Location",
        price: 1000,
        userId: 1,
      };

      Property.create.mockResolvedValue(mockProperty);

      await propertyController.create(req, res);

      expect(Property.create).toHaveBeenCalledWith({
        name: "Test Property",
        location: "Test Location",
        price: 1000,
        priceDuration: "One Day",
        type: "House",
        beds: 1,
        baths: 1,
        areaSqm: 0,
        mainImage: "image1.jpg",
        images: ["image1.jpg", "image2.jpg"],
        hasKitchen: false,
        hasBalcony: false,
        hasParking: false,
        description: "",
        userId: 1,
        employeeId: null,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        data: mockProperty,
        message: "Successfully created property",
      });
    });

    it("should return 400 if required fields are missing", async () => {
      const req = {
        body: {
          name: "Test Property",
          // Missing location, price, userId, images
        },
        files: [],
      };
      const res = mockResponse();

      await propertyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid payload: name, location, price, userId, and at least one image are required",
      });
    });

    it("should handle file uploads", async () => {
      const req = {
        body: {
          name: "Test Property",
          location: "Test Location",
          price: 1000,
          userId: 1,
        },
        protocol: "http",
        get: jest.fn().mockReturnValue("localhost:4000"),
        files: [
          { filename: "image1.jpg" },
          { filename: "image2.jpg" },
        ],
      };
      const res = mockResponse();

      const mockProperty = {
        id: 1,
        name: "Test Property",
        location: "Test Location",
        price: 1000,
        userId: 1,
      };

      Property.create.mockResolvedValue(mockProperty);

      await propertyController.create(req, res);

      expect(Property.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mainImage: "http://localhost:4000/uploads/image1.jpg",
          images: [
            "http://localhost:4000/uploads/image1.jpg",
            "http://localhost:4000/uploads/image2.jpg",
          ],
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle errors during property creation", async () => {
      const req = {
        body: {
          name: "Test Property",
          location: "Test Location",
          price: 1000,
          userId: 1,
          images: ["image1.jpg"],
        },
        files: [],
      };
      const res = mockResponse();

      Property.create.mockRejectedValue(new Error("Database error"));

      await propertyController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to create property",
      });
    });
  });

  describe("update", () => {
    it("should update an existing property", async () => {
      const req = {
        params: { id: 1 },
        body: {
          name: "Updated Property",
          price: 1500,
        },
      };
      const res = mockResponse();

      const mockProperty = {
        id: 1,
        name: "Test Property",
        update: jest.fn().mockResolvedValue(true),
      };

      Property.findOne.mockResolvedValue(mockProperty);

      await propertyController.update(req, res);

      expect(Property.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockProperty.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Property",
          price: 1500,
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if property not found", async () => {
      const req = {
        params: { id: 999 },
        body: { name: "Updated Property" },
      };
      const res = mockResponse();

      Property.findOne.mockResolvedValue(null);

      await propertyController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Property not found",
      });
    });
  });
});
