import { Conversation, Message, User } from '../models/index.js';
import { Op } from 'sequelize';
import { sequelize } from '../database/index.js';

/**
 * Clean up duplicate conversations in the database
 */
export const cleanupDuplicateConversations = async () => {
    try {
        console.log('Starting cleanup of duplicate conversations...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection successful');
        
        // Find all conversations
        const allConversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'user2', 
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        console.log(`Found ${allConversations.length} total conversations`);

        // Group conversations by user pair (regardless of order)
        const conversationGroups = {};
        
        allConversations.forEach(conv => {
            const userIds = [conv.user1Id, conv.user2Id].sort((a, b) => a - b);
            const key = `${userIds[0]}-${userIds[1]}`;
            
            if (!conversationGroups[key]) {
                conversationGroups[key] = [];
            }
            conversationGroups[key].push(conv);
        });

        console.log(`Found ${Object.keys(conversationGroups).length} unique user pairs`);

        // Find and remove duplicates
        let duplicatesRemoved = 0;
        
        for (const [key, conversations] of Object.entries(conversationGroups)) {
            if (conversations.length > 1) {
                console.log(`Found ${conversations.length} duplicate conversations for users: ${key}`);
                
                // Keep the conversation with the most recent lastMessageTime or the oldest one if no messages
                const conversationToKeep = conversations.reduce((best, current) => {
                    if (!best.lastMessageTime && !current.lastMessageTime) {
                        // Both have no messages, keep the older one
                        return new Date(best.createdAt) < new Date(current.createdAt) ? best : current;
                    }
                    if (!best.lastMessageTime) return current;
                    if (!current.lastMessageTime) return best;
                    
                    // Keep the one with more recent messages
                    return new Date(best.lastMessageTime) > new Date(current.lastMessageTime) ? best : current;
                });

                console.log(`Keeping conversation ${conversationToKeep.id}, removing ${conversations.length - 1} duplicates`);

                // Remove the duplicates
                const duplicatesToRemove = conversations.filter(conv => conv.id !== conversationToKeep.id);
                
                for (const duplicate of duplicatesToRemove) {
                    // First, move any messages from duplicate conversation to the one we're keeping
                    const messagesMoved = await Message.update(
                        { conversationId: conversationToKeep.id },
                        { where: { conversationId: duplicate.id } }
                    );
                    
                    console.log(`Moved ${messagesMoved[0]} messages from conversation ${duplicate.id} to ${conversationToKeep.id}`);
                    
                    // Then delete the duplicate conversation
                    await Conversation.destroy({ where: { id: duplicate.id } });
                    duplicatesRemoved++;
                    
                    console.log(`Removed duplicate conversation ${duplicate.id}`);
                }
            }
        }

        console.log(`Cleanup complete. Removed ${duplicatesRemoved} duplicate conversations.`);
        
        return {
            success: true,
            duplicatesRemoved,
            message: `Successfully removed ${duplicatesRemoved} duplicate conversations`
        };

    } catch (error) {
        console.error('Error during conversation cleanup:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Export for manual execution
console.log('Script starting...');
cleanupDuplicateConversations()
    .then(result => {
        console.log('Cleanup result:', result);
        process.exit(0);
    })
    .catch(error => {
        console.error('Cleanup failed:', error);
        process.exit(1);
    });
