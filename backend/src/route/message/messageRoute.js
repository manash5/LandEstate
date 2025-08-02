import express from 'express'
import { MessageController } from '../../controller/index.js';

const router = express.Router();

// Get all conversations for the current user
router.get("/conversations", MessageController.getConversations);

// Get messages for a specific conversation
router.get("/conversations/:conversationId/messages", MessageController.getMessages);

// Send a new message
router.post("/send", MessageController.sendMessage);

// Search users for starting new conversations
router.get("/search-users", MessageController.searchUsers);

// Start a new conversation
router.post("/start-conversation", MessageController.startConversation);

// Get total unread message count
router.get("/unread-count", MessageController.getUnreadCount);

// Initialize conversations with all employees
router.post("/initialize-employee-conversations", MessageController.initializeEmployeeConversations);

// Clean up orphaned conversations
router.post("/cleanup-orphaned-conversations", MessageController.cleanupOrphanedConversations);

export { router as messageRouter };
