import { Message, Conversation, User, Employee } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get all conversations for an employee
 */
const getConversations = async (req, res) => {
    try {
        // For employees, req.user.id contains the employee ID
        const employeeId = req.user.id;
        
        // Employee conversations use negative IDs to distinguish them from regular users
        const conversationEmployeeId = -employeeId;
        
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: [
                    { user1Id: conversationEmployeeId },
                    { user2Id: conversationEmployeeId }
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

        // Format conversations to show the manager (other user)
        const formattedConversations = await Promise.all(conversations.map(async (conv) => {
            let otherUser;
            
            // Since this is an employee, we need to find the manager (positive ID)
            if (conv.user1Id === conversationEmployeeId) {
                // Employee is user1, manager is user2
                otherUser = conv.user2 ? {
                    ...conv.user2.toJSON(),
                    userType: 'user'
                } : null;
            } else {
                // Employee is user2, manager is user1
                otherUser = conv.user1 ? {
                    ...conv.user1.toJSON(),
                    userType: 'user'
                } : null;
            }
            
            // Skip conversations where the other user doesn't exist (deleted users)
            if (!otherUser) {
                return null;
            }
            
            // Count unread messages for this conversation
            const unreadCount = await Message.count({
                where: {
                    conversationId: conv.id,
                    receiverId: conversationEmployeeId,
                    isRead: false
                }
            });
            
            return {
                id: conv.id,
                otherUser,
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                updatedAt: conv.updatedAt,
                unreadCount
            };
        }));

        // Filter out null conversations (where other user was deleted)
        const validConversations = formattedConversations.filter(conv => conv !== null);

        res.status(200).send({ 
            data: validConversations, 
            message: "Conversations fetched successfully" 
        });
    } catch (e) {
        console.error('Error fetching employee conversations:', e);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

/**
 * Get messages for a specific conversation
 */
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const employeeId = req.user.id;
        const conversationEmployeeId = -employeeId;
        const { page = 1, limit = 50 } = req.query;

        // Verify employee is part of this conversation
        const conversation = await Conversation.findOne({
            where: {
                id: conversationId,
                [Op.or]: [
                    { user1Id: conversationEmployeeId },
                    { user2Id: conversationEmployeeId }
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
                    attributes: ['id', 'name', 'profileImage'],
                    required: false
                }
            ],
            order: [['createdAt', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Mark messages as read for the current employee
        await Message.update(
            { isRead: true, readAt: new Date() },
            {
                where: {
                    conversationId,
                    receiverId: conversationEmployeeId,
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
 * Send a new message from employee to manager
 */
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, messageType = 'text', userType = 'user' } = req.body;
        const employeeId = req.user.id;
        const conversationEmployeeId = -employeeId;

        if (!receiverId || !content) {
            return res.status(400).send({ message: "Receiver ID and content are required" });
        }

        // Check if receiver exists (should be the manager - a regular user)
        const receiver = await User.findByPk(receiverId);
        if (!receiver) {
            return res.status(404).send({ message: 'Manager not found' });
        }

        // Ensure the employee exists as a user entry for foreign key constraints
        // We'll create a virtual user with negative ID if it doesn't exist
        let employeeUser = await User.findOne({ where: { id: conversationEmployeeId } });
        if (!employeeUser) {
            // Create a virtual user entry for the employee
            await User.create({
                id: conversationEmployeeId,
                name: `Employee ${employeeId}`,
                email: `employee${employeeId}@internal.com`,
                password: null // No password for virtual employee users
            });
        }

        // For employee-manager messaging, create a conversation between employee and manager
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: conversationEmployeeId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: conversationEmployeeId }
                ]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                user1Id: Math.min(conversationEmployeeId, receiverId),
                user2Id: Math.max(conversationEmployeeId, receiverId),
                lastMessageTime: new Date()
            });
        }

        // Create message
        const message = await Message.create({
            conversationId: conversation.id,
            senderId: conversationEmployeeId, // Negative employee ID
            receiverId: receiverId, // Manager ID
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
                    attributes: ['id', 'name', 'profileImage'],
                    required: false
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
 * Search managers for starting new conversations (employees can only message their managers)
 */
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const employeeId = req.user.id;

        if (!query || query.trim().length < 2) {
            return res.status(400).send({ message: "Search query must be at least 2 characters" });
        }

        // Get the employee data to find their manager
        const employee = await Employee.findByPk(employeeId);
        if (!employee || !employee.managerId) {
            return res.status(404).send({ message: "Manager not found for this employee" });
        }

        // Find the manager
        const manager = await User.findOne({
            where: {
                id: employee.managerId,
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'name', 'email', 'profileImage']
        });

        const results = manager ? [{
            id: manager.id,
            name: manager.name,
            email: manager.email,
            profileImage: manager.profileImage,
            userType: 'user'
        }] : [];

        res.status(200).send({ 
            data: results, 
            message: "Users found successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to search users' });
    }
};

/**
 * Start a new conversation with manager
 */
const startConversation = async (req, res) => {
    try {
        const { userId, userType = 'user' } = req.body;
        const employeeId = req.user.id;
        const conversationEmployeeId = -employeeId;

        console.log('EmployeeMessageController startConversation:', {
            userId,
            userType,
            employeeId,
            conversationEmployeeId
        });

        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }

        // Verify this is the employee's manager
        const employee = await Employee.findByPk(employeeId);
        console.log('Found employee:', employee ? {
            id: employee.id,
            managerId: employee.managerId,
            name: employee.name
        } : null);

        if (!employee || employee.managerId !== userId) {
            console.log('Manager check failed:', {
                employeeExists: !!employee,
                employeeManagerId: employee?.managerId,
                requestedUserId: userId,
                typesMatch: employee?.managerId === userId
            });
            return res.status(403).send({ message: "You can only message your assigned manager" });
        }

        // Check if manager exists
        const manager = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'profileImage']
        });

        console.log('Found manager:', manager ? {
            id: manager.id,
            name: manager.name,
            email: manager.email
        } : null);

        if (!manager) {
            return res.status(404).send({ message: 'Manager not found' });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: conversationEmployeeId, user2Id: userId },
                    { user1Id: userId, user2Id: conversationEmployeeId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'name', 'email', 'profileImage'],
                    required: false
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'name', 'email', 'profileImage'],
                    required: false
                }
            ]
        });

        if (!conversation) {
            // Create new conversation
            const smallerId = Math.min(conversationEmployeeId, userId);
            const largerId = Math.max(conversationEmployeeId, userId);
            
            conversation = await Conversation.create({
                user1Id: smallerId,
                user2Id: largerId,
                lastMessageTime: new Date()
            });

            console.log('Created new conversation:', {
                id: conversation.id,
                user1Id: conversation.user1Id,
                user2Id: conversation.user2Id
            });
        }

        // Format response to show manager info
        const otherUser = {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            profileImage: manager.profileImage,
            userType: 'user'
        };

        const formattedConversation = {
            id: conversation.id,
            otherUser,
            lastMessage: null,
            lastMessageTime: conversation.lastMessageTime,
            updatedAt: conversation.updatedAt,
            unreadCount: 0
        };

        res.status(200).send({ 
            data: formattedConversation, 
            message: "Conversation ready" 
        });
    } catch (e) {
        console.error('EmployeeMessageController startConversation error:', e);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
};

/**
 * Get total unread message count for current employee
 */
const getUnreadCount = async (req, res) => {
    try {
        const employeeId = req.user.id;
        const conversationEmployeeId = -employeeId;
        
        const unreadCount = await Message.count({
            where: {
                receiverId: conversationEmployeeId,
                isRead: false
            }
        });

        res.status(200).send({ 
            data: { unreadCount }, 
            message: "Unread count fetched successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
};

export const EmployeeMessageController = {
    getConversations,
    getMessages,
    sendMessage,
    searchUsers,
    startConversation,
    getUnreadCount
};
