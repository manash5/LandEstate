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

export { router as messageRouter };
