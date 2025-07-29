import { Message, Conversation, User } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get all conversations for a user
 */
const getConversations = async (req, res) => {
    try {
        const userId = req.user.user.id;
        
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'name', 'email', 'profileImage']
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'name', 'email', 'profileImage']
                },
                {
                    model: Message,
                    as: 'lastMessage',
                    attributes: ['id', 'content', 'messageType', 'createdAt'],
                    required: false
                }
            ],
            order: [['lastMessageTime', 'DESC']]
        });

        // Format conversations to show the other user
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
            return {
                id: conv.id,
                otherUser,
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                updatedAt: conv.updatedAt
            };
        });

        res.status(200).send({ 
            data: formattedConversations, 
            message: "Conversations fetched successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

/**
 * Get messages for a specific conversation
 */
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.user.id;
        const { page = 1, limit = 50 } = req.query;

        // Verify user is part of this conversation
        const conversation = await Conversation.findOne({
            where: {
                id: conversationId,
                [Op.or]: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            }
        });

        if (!conversation) {
            return res.status(404).send({ message: "Conversation not found or access denied" });
        }

        const offset = (page - 1) * limit;
        
        const messages = await Message.findAll({
            where: { conversationId },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'name', 'profileImage']
                }
            ],
            order: [['createdAt', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Mark messages as read for the current user
        await Message.update(
            { isRead: true, readAt: new Date() },
            {
                where: {
                    conversationId,
                    receiverId: userId,
                    isRead: false
                }
            }
        );

        res.status(200).send({ 
            data: messages, 
            message: "Messages fetched successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

/**
 * Send a new message
 */
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, messageType = 'text' } = req.body;
        const senderId = req.user.user.id;

        if (!receiverId || !content) {
            return res.status(400).send({ message: "Receiver ID and content are required" });
        }

        if (senderId === receiverId) {
            return res.status(400).send({ message: "Cannot send message to yourself" });
        }

        // Check if receiver exists
        const receiver = await User.findByPk(receiverId);
        if (!receiver) {
            return res.status(404).send({ message: "Receiver not found" });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: senderId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: senderId }
                ]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                user1Id: Math.min(senderId, receiverId),
                user2Id: Math.max(senderId, receiverId),
                lastMessageTime: new Date()
            });
        }

        // Create message
        const message = await Message.create({
            conversationId: conversation.id,
            senderId,
            receiverId,
            content,
            messageType
        });

        // Update conversation's last message
        await conversation.update({
            lastMessageId: message.id,
            lastMessageTime: new Date()
        });

        // Fetch the complete message with sender info
        const completeMessage = await Message.findByPk(message.id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'name', 'profileImage']
                }
            ]
        });

        res.status(201).send({ 
            data: completeMessage, 
            message: "Message sent successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

/**
 * Search users for starting new conversations
 */
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user.user.id;

        if (!query || query.trim().length < 2) {
            return res.status(400).send({ message: "Search query must be at least 2 characters" });
        }

        const users = await User.findAll({
            where: {
                id: { [Op.ne]: currentUserId }, // Exclude current user
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'name', 'email', 'profileImage'],
            limit: 10
        });

        res.status(200).send({ 
            data: users, 
            message: "Users found successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to search users' });
    }
};

/**
 * Start a new conversation
 */
const startConversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.user.id;

        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }

        if (currentUserId === userId) {
            return res.status(400).send({ message: "Cannot start conversation with yourself" });
        }

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: currentUserId, user2Id: userId },
                    { user1Id: userId, user2Id: currentUserId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'name', 'email', 'profileImage']
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'name', 'email', 'profileImage']
                }
            ]
        });

        if (!conversation) {
            // Always store user IDs in consistent order (smaller ID as user1, larger as user2)
            const smallerId = Math.min(currentUserId, userId);
            const largerId = Math.max(currentUserId, userId);
            
            conversation = await Conversation.create({
                user1Id: smallerId,
                user2Id: largerId,
                lastMessageTime: new Date()
            });

            // Fetch the conversation with user details
            conversation = await Conversation.findByPk(conversation.id, {
                include: [
                    {
                        model: User,
                        as: 'user1',
                        attributes: ['id', 'name', 'email', 'profileImage']
                    },
                    {
                        model: User,
                        as: 'user2',
                        attributes: ['id', 'name', 'email', 'profileImage']
                    }
                ]
            });
        }

        // Format response
        const otherUser = conversation.user1Id === currentUserId ? conversation.user2 : conversation.user1;
        const formattedConversation = {
            id: conversation.id,
            otherUser,
            lastMessage: null,
            lastMessageTime: conversation.lastMessageTime,
            updatedAt: conversation.updatedAt
        };

        res.status(200).send({ 
            data: formattedConversation, 
            message: "Conversation ready" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
};

export const MessageController = {
    getConversations,
    getMessages,
    sendMessage,
    searchUsers,
    startConversation
};
