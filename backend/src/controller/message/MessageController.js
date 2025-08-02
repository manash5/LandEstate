import { Message, Conversation, User, Employee } from '../../models/index.js';
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
        const formattedConversations = await Promise.all(conversations.map(async (conv) => {
            let otherUser;
            
            // Check if this is an employee conversation (negative ID)
            if (conv.user1Id < 0) {
                // user1 is employee, user2 is regular user
                if (conv.user2Id === userId) {
                    // Current user is user2, so other user is the employee (user1)
                    const employee = await Employee.findByPk(-conv.user1Id, {
                        attributes: ['id', 'name', 'email']
                    });
                    otherUser = employee ? {
                        id: employee.id,
                        name: employee.name,
                        email: employee.email,
                        profileImage: null,
                        userType: 'employee'
                    } : null;
                } else {
                    // Current user is user1 (employee), other user is user2
                    otherUser = conv.user2 ? {
                        ...conv.user2.toJSON(),
                        userType: 'user'
                    } : null;
                }
            } else if (conv.user2Id < 0) {
                // user2 is employee, user1 is regular user
                if (conv.user1Id === userId) {
                    // Current user is user1, so other user is the employee (user2)
                    const employee = await Employee.findByPk(-conv.user2Id, {
                        attributes: ['id', 'name', 'email']
                    });
                    otherUser = employee ? {
                        id: employee.id,
                        name: employee.name,
                        email: employee.email,
                        profileImage: null,
                        userType: 'employee'
                    } : null;
                } else {
                    // Current user is user2 (employee), other user is user1
                    otherUser = conv.user1 ? {
                        ...conv.user1.toJSON(),
                        userType: 'user'
                    } : null;
                }
            } else {
                // Regular user-to-user conversation
                const otherUserData = conv.user1Id === userId ? conv.user2 : conv.user1;
                otherUser = otherUserData ? {
                    ...otherUserData.toJSON(),
                    userType: 'user'
                } : null;
            }
            
            // Skip conversations where the other user doesn't exist (deleted users/employees)
            if (!otherUser) {
                return null;
            }
            
            // Count unread messages for this conversation
            const unreadCount = await Message.count({
                where: {
                    conversationId: conv.id,
                    receiverId: userId,
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

        // Filter out null conversations (where other user/employee was deleted)
        const validConversations = formattedConversations.filter(conv => conv !== null);

        res.status(200).send({ 
            data: validConversations, 
            message: "Conversations fetched successfully" 
        });
    } catch (e) {
        console.error('Error fetching admin conversations:', e);
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
        const { receiverId, content, messageType = 'text', userType = 'user' } = req.body;
        const senderId = req.user.user.id;

        if (!receiverId || !content) {
            return res.status(400).send({ message: "Receiver ID and content are required" });
        }

        if (senderId === receiverId && userType === 'user') {
            return res.status(400).send({ message: "Cannot send message to yourself" });
        }

        // Check if receiver exists based on userType
        let receiver;
        if (userType === 'employee') {
            receiver = await Employee.findOne({
                where: { 
                    id: receiverId,
                    managerId: senderId,
                    isActive: true
                }
            });
        } else {
            receiver = await User.findByPk(receiverId);
        }

        if (!receiver) {
            return res.status(404).send({ message: `${userType === 'employee' ? 'Employee' : 'User'} not found` });
        }

        // For conversations, use special ID format for employees
        const conversationReceiverId = userType === 'employee' ? -receiverId : receiverId;

        // Find or create conversation
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: senderId, user2Id: conversationReceiverId },
                    { user1Id: conversationReceiverId, user2Id: senderId }
                ]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                user1Id: Math.min(senderId, conversationReceiverId),
                user2Id: Math.max(senderId, conversationReceiverId),
                lastMessageTime: new Date()
            });
        }

        // Create message (store original receiverId for message delivery)
        const message = await Message.create({
            conversationId: conversation.id,
            senderId,
            receiverId: conversationReceiverId, // Use conversation receiver ID
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
 * Search users and employees for starting new conversations
 */
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user.user.id;

        if (!query || query.trim().length < 2) {
            return res.status(400).send({ message: "Search query must be at least 2 characters" });
        }

        // Search regular users
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: currentUserId }, // Exclude current user
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'name', 'email', 'profileImage'],
            limit: 8
        });

        // Search employees managed by current user
        const employees = await Employee.findAll({
            where: {
                managerId: currentUserId, // Only employees managed by current user
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ],
                isActive: true // Only active employees
            },
            attributes: ['id', 'name', 'email'],
            limit: 8
        });

        // Format employees to match user structure (add userType for identification)
        const formattedEmployees = employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            email: emp.email,
            profileImage: null, // Employees don't have profile images by default
            userType: 'employee'
        }));

        // Format users (add userType for identification)
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            userType: 'user'
        }));

        // Combine and return results
        const allResults = [...formattedUsers, ...formattedEmployees];

        res.status(200).send({ 
            data: allResults, 
            message: "Users and employees found successfully" 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to search users and employees' });
    }
};

/**
 * Start a new conversation
 */
const startConversation = async (req, res) => {
    try {
        const { userId, userType = 'user' } = req.body;
        const currentUserId = req.user.user.id;

        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }

        if (currentUserId === userId && userType === 'user') {
            return res.status(400).send({ message: "Cannot start conversation with yourself" });
        }

        // Check if user/employee exists based on userType
        let targetUser;
        if (userType === 'employee') {
            targetUser = await Employee.findOne({
                where: { 
                    id: userId,
                    managerId: currentUserId, // Ensure employee belongs to current user
                    isActive: true
                },
                attributes: ['id', 'name', 'email']
            });
        } else {
            targetUser = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'profileImage']
            });
        }

        if (!targetUser) {
            return res.status(404).send({ message: `${userType === 'employee' ? 'Employee' : 'User'} not found` });
        }

        // For conversations, we'll use a special ID format for employees to distinguish them
        // Employee conversations will use negative IDs to avoid conflicts with user IDs
        const conversationUserId = userType === 'employee' ? -userId : userId;

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: currentUserId, user2Id: conversationUserId },
                    { user1Id: conversationUserId, user2Id: currentUserId }
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
            // Always store user IDs in consistent order (smaller ID as user1, larger as user2)
            const smallerId = Math.min(currentUserId, conversationUserId);
            const largerId = Math.max(currentUserId, conversationUserId);
            
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
        }

        // Format response - need to handle employee data differently
        let otherUser;
        if (conversationUserId < 0) {
            // This is an employee conversation
            otherUser = {
                id: userId, // Use original positive ID
                name: targetUser.name,
                email: targetUser.email,
                profileImage: null,
                userType: 'employee'
            };
        } else {
            // Regular user conversation
            otherUser = conversation.user1Id === currentUserId ? conversation.user2 : conversation.user1;
            if (otherUser) {
                otherUser.userType = 'user';
            }
        }

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
        console.error(e);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
};

/**
 * Get total unread message count for current user
 */
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.user.id;
        
        const unreadCount = await Message.count({
            where: {
                receiverId: userId,
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

/**
 * Initialize conversations with all employees for the current admin
 */
const initializeEmployeeConversations = async (req, res) => {
    try {
        const adminId = req.user.user.id;
        
        // Get all employees for this admin
        const employees = await Employee.findAll({
            where: { managerId: adminId },
            attributes: ['id', 'name', 'email']
        });

        const results = [];
        
        for (const employee of employees) {
            try {
                const conversationEmployeeId = -employee.id;
                
                // Check if conversation already exists
                const existingConversation = await Conversation.findOne({
                    where: {
                        [Op.or]: [
                            { user1Id: adminId, user2Id: conversationEmployeeId },
                            { user1Id: conversationEmployeeId, user2Id: adminId }
                        ]
                    }
                });

                if (!existingConversation) {
                    // Create virtual user for employee if it doesn't exist
                    let virtualUser = await User.findOne({ where: { id: conversationEmployeeId } });
                    if (!virtualUser) {
                        try {
                            virtualUser = await User.create({
                                id: conversationEmployeeId,
                                name: employee.name,
                                email: `employee${employee.id}@internal.com`,
                                password: null
                            });
                        } catch (userCreateError) {
                            console.error(`Failed to create virtual user for employee ${employee.id}:`, userCreateError);
                            // Skip this employee if virtual user creation fails
                            results.push({
                                employeeId: employee.id,
                                employeeName: employee.name,
                                error: 'Failed to create virtual user',
                                created: false
                            });
                            continue;
                        }
                    }

                    // Create conversation
                    try {
                        const conversation = await Conversation.create({
                            user1Id: Math.min(adminId, conversationEmployeeId),
                            user2Id: Math.max(adminId, conversationEmployeeId),
                            lastMessageTime: new Date()
                        });

                        results.push({
                            employeeId: employee.id,
                            employeeName: employee.name,
                            conversationId: conversation.id,
                            created: true
                        });
                    } catch (conversationError) {
                        console.error(`Failed to create conversation for employee ${employee.id}:`, conversationError);
                        results.push({
                            employeeId: employee.id,
                            employeeName: employee.name,
                            error: 'Failed to create conversation',
                            created: false
                        });
                    }
                } else {
                    results.push({
                        employeeId: employee.id,
                        employeeName: employee.name,
                        conversationId: existingConversation.id,
                        created: false
                    });
                }
            } catch (employeeError) {
                console.error(`Error processing employee ${employee.id}:`, employeeError);
                results.push({
                    employeeId: employee.id,
                    employeeName: employee.name,
                    error: employeeError.message,
                    created: false
                });
            }
        }

        res.status(200).send({
            data: results,
            message: `Initialized conversations for ${results.length} employees`
        });
    } catch (e) {
        console.error('Error initializing employee conversations:', e);
        res.status(500).json({ error: 'Failed to initialize employee conversations' });
    }
};

/**
 * Clean up orphaned conversations (conversations with deleted users/employees)
 */
const cleanupOrphanedConversations = async (req, res) => {
    try {
        // Find conversations with non-existent users
        const conversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    as: 'user1',
                    required: false
                },
                {
                    model: User,
                    as: 'user2',
                    required: false
                }
            ]
        });

        const orphanedConversations = [];
        
        for (const conv of conversations) {
            let shouldDelete = false;
            
            // Check if user1 exists
            if (!conv.user1) {
                // Check if it's a negative ID (employee)
                if (conv.user1Id < 0) {
                    const employeeId = -conv.user1Id;
                    const employee = await Employee.findByPk(employeeId);
                    if (!employee) {
                        shouldDelete = true;
                    }
                } else {
                    shouldDelete = true;
                }
            }
            
            // Check if user2 exists
            if (!conv.user2) {
                // Check if it's a negative ID (employee)
                if (conv.user2Id < 0) {
                    const employeeId = -conv.user2Id;
                    const employee = await Employee.findByPk(employeeId);
                    if (!employee) {
                        shouldDelete = true;
                    }
                } else {
                    shouldDelete = true;
                }
            }
            
            if (shouldDelete) {
                orphanedConversations.push(conv.id);
            }
        }

        // Delete orphaned conversations and their messages
        if (orphanedConversations.length > 0) {
            await Message.destroy({
                where: {
                    conversationId: orphanedConversations
                }
            });
            
            await Conversation.destroy({
                where: {
                    id: orphanedConversations
                }
            });
        }

        res.status(200).send({
            data: {
                cleanedUp: orphanedConversations.length,
                conversationIds: orphanedConversations
            },
            message: `Cleaned up ${orphanedConversations.length} orphaned conversations`
        });
    } catch (e) {
        console.error('Error cleaning up orphaned conversations:', e);
        res.status(500).json({ error: 'Failed to cleanup orphaned conversations' });
    }
};

export const MessageController = {
    getConversations,
    getMessages,
    sendMessage,
    searchUsers,
    startConversation,
    getUnreadCount,
    initializeEmployeeConversations,
    cleanupOrphanedConversations
};
