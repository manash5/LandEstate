const messageController = require("../src/controller/message/MessageController.js");
const { Message, Conversation, User } = require("../src/models/index.js");

// Mock Sequelize Models
jest.mock("../src/models/index.js", () => ({
  Message: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Conversation: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  User: {},
}));

describe("Message Controller", () => {
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

  describe("sendMessage", () => {
    it("should send a new message", async () => {
      const req = {
        body: {
          senderId: 1,
          receiverId: 2,
          content: "Hello there!",
          conversationId: 1,
        },
      };
      const res = mockResponse();

      const mockMessage = {
        id: 1,
        senderId: 1,
        receiverId: 2,
        content: "Hello there!",
        conversationId: 1,
        timestamp: new Date(),
      };

      Message.create.mockResolvedValue(mockMessage);

      await messageController.sendMessage(req, res);

      expect(Message.create).toHaveBeenCalledWith({
        senderId: 1,
        receiverId: 2,
        content: "Hello there!",
        conversationId: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMessage,
        message: "Message sent successfully",
      });
    });

    it("should return 400 if required fields are missing", async () => {
      const req = {
        body: {
          senderId: 1,
          // Missing receiverId, content, conversationId
        },
      };
      const res = mockResponse();

      await messageController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "SenderId, receiverId, content, and conversationId are required",
      });
    });

    it("should handle errors during message creation", async () => {
      const req = {
        body: {
          senderId: 1,
          receiverId: 2,
          content: "Hello there!",
          conversationId: 1,
        },
      };
      const res = mockResponse();

      Message.create.mockRejectedValue(new Error("Database error"));

      await messageController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to send message",
        error: "Database error",
      });
    });
  });

  describe("getMessages", () => {
    it("should fetch messages for a conversation", async () => {
      const req = {
        params: { conversationId: 1 },
        query: { page: 1, limit: 10 },
      };
      const res = mockResponse();

      const mockMessages = [
        {
          id: 1,
          content: "Hello!",
          senderId: 1,
          receiverId: 2,
          timestamp: new Date(),
        },
        {
          id: 2,
          content: "Hi there!",
          senderId: 2,
          receiverId: 1,
          timestamp: new Date(),
        },
      ];

      Message.findAll.mockResolvedValue(mockMessages);

      await messageController.getMessages(req, res);

      expect(Message.findAll).toHaveBeenCalledWith({
        where: { conversationId: 1 },
        include: expect.any(Array),
        order: [["timestamp", "DESC"]],
        limit: 10,
        offset: 0,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMessages,
        pagination: {
          page: 1,
          limit: 10,
          total: mockMessages.length,
        },
      });
    });

    it("should handle pagination correctly", async () => {
      const req = {
        params: { conversationId: 1 },
        query: { page: 2, limit: 5 },
      };
      const res = mockResponse();

      Message.findAll.mockResolvedValue([]);

      await messageController.getMessages(req, res);

      expect(Message.findAll).toHaveBeenCalledWith({
        where: { conversationId: 1 },
        include: expect.any(Array),
        order: [["timestamp", "DESC"]],
        limit: 5,
        offset: 5, // (page - 1) * limit = (2 - 1) * 5 = 5
      });
    });

    it("should handle errors when fetching messages", async () => {
      const req = {
        params: { conversationId: 1 },
        query: {},
      };
      const res = mockResponse();

      Message.findAll.mockRejectedValue(new Error("Database error"));

      await messageController.getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to fetch messages",
        error: "Database error",
      });
    });
  });

  describe("createConversation", () => {
    it("should create a new conversation", async () => {
      const req = {
        body: {
          user1Id: 1,
          user2Id: 2,
        },
      };
      const res = mockResponse();

      const mockConversation = {
        id: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: new Date(),
      };

      // Check if conversation already exists
      Conversation.findOne.mockResolvedValue(null);
      Conversation.create.mockResolvedValue(mockConversation);

      await messageController.createConversation(req, res);

      expect(Conversation.findOne).toHaveBeenCalledWith({
        where: {
          [expect.any(Symbol)]: [
            {
              user1Id: 1,
              user2Id: 2,
            },
            {
              user1Id: 2,
              user2Id: 1,
            },
          ],
        },
      });
      expect(Conversation.create).toHaveBeenCalledWith({
        user1Id: 1,
        user2Id: 2,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockConversation,
        message: "Conversation created successfully",
      });
    });

    it("should return existing conversation if it already exists", async () => {
      const req = {
        body: {
          user1Id: 1,
          user2Id: 2,
        },
      };
      const res = mockResponse();

      const existingConversation = {
        id: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: new Date(),
      };

      Conversation.findOne.mockResolvedValue(existingConversation);

      await messageController.createConversation(req, res);

      expect(Conversation.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: existingConversation,
        message: "Conversation already exists",
      });
    });

    it("should return 400 if user IDs are missing", async () => {
      const req = {
        body: {
          user1Id: 1,
          // Missing user2Id
        },
      };
      const res = mockResponse();

      await messageController.createConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Both user1Id and user2Id are required",
      });
    });

    it("should return 400 if trying to create conversation with same user", async () => {
      const req = {
        body: {
          user1Id: 1,
          user2Id: 1,
        },
      };
      const res = mockResponse();

      await messageController.createConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Cannot create conversation with yourself",
      });
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read", async () => {
      const req = {
        params: { messageId: 1 },
        body: { userId: 2 },
      };
      const res = mockResponse();

      const mockMessage = {
        id: 1,
        receiverId: 2,
        isRead: false,
        update: jest.fn().mockResolvedValue(true),
      };

      Message.findOne.mockResolvedValue(mockMessage);

      await messageController.markMessageAsRead(req, res);

      expect(Message.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockMessage.update).toHaveBeenCalledWith({ isRead: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Message marked as read",
      });
    });

    it("should return 404 if message not found", async () => {
      const req = {
        params: { messageId: 999 },
        body: { userId: 2 },
      };
      const res = mockResponse();

      Message.findOne.mockResolvedValue(null);

      await messageController.markMessageAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Message not found",
      });
    });

    it("should return 403 if user is not the receiver", async () => {
      const req = {
        params: { messageId: 1 },
        body: { userId: 3 }, // Different user
      };
      const res = mockResponse();

      const mockMessage = {
        id: 1,
        receiverId: 2, // Different receiver
        isRead: false,
      };

      Message.findOne.mockResolvedValue(mockMessage);

      await messageController.markMessageAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "You can only mark your own messages as read",
      });
    });
  });
});
