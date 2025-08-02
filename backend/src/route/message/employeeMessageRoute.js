import express from 'express';
import { EmployeeMessageController } from '../../controller/message/EmployeeMessageController.js';
import { authenticateEmployee } from '../../middleware/employee-auth-middleware.js';

const router = express.Router();

// Apply employee authentication middleware to all routes
router.use(authenticateEmployee);

// Get all conversations for the current employee
router.get("/conversations", EmployeeMessageController.getConversations);

// Get messages for a specific conversation
router.get("/conversations/:conversationId/messages", EmployeeMessageController.getMessages);

// Send a new message
router.post("/send", EmployeeMessageController.sendMessage);

// Search users for starting new conversations
router.get("/search-users", EmployeeMessageController.searchUsers);

// Start a new conversation
router.post("/start-conversation", EmployeeMessageController.startConversation);

// Get total unread message count
router.get("/unread-count", EmployeeMessageController.getUnreadCount);

export { router as employeeMessageRouter };
