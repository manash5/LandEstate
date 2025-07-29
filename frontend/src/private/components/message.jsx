import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Paperclip, Smile, Send, ChevronDown, Plus, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { getConversations, getMessages, sendMessage, searchUsers, startConversation, getCurrentUser, getUsersById } from '../../services/api';
import { toast } from 'react-toastify';
import { useMessage } from '../../context/MessageContext';

const Message = () => {
  const { userId } = useParams(); // Get user ID from URL parameters (for backward compatibility)
  const navigate = useNavigate();
  const { targetUserId, shouldOpenChat, clearChatTarget } = useMessage();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data?.data) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        toast.error('Failed to load user information');
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle URL parameter for starting conversation with specific user (backward compatibility)
  useEffect(() => {
    if (userId && currentUser) {
      handleStartConversationWithUserId(userId);
    }
  }, [userId, currentUser]);

  // Handle context-triggered chat opening - wait for conversations to load
  useEffect(() => {
    if (shouldOpenChat && targetUserId && currentUser && conversations.length >= 0) {
      console.log('Context triggered chat opening for user:', targetUserId); // Debug log
      console.log('Available conversations:', conversations); // Debug log
      
      // Add a small delay to ensure conversations are fully loaded
      const timer = setTimeout(() => {
        handleStartConversationWithUserId(targetUserId);
        if (clearChatTarget) {
          clearChatTarget(); // Clear the target after handling
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [shouldOpenChat, targetUserId, currentUser, conversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      if (response.data?.data) {
        // Remove any duplicate conversations based on otherUser.id
        const uniqueConversations = response.data.data.reduce((acc, current) => {
          const existingIndex = acc.findIndex(conv => conv.otherUser.id === current.otherUser.id);
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            // Keep the conversation with the most recent lastMessageTime
            if (new Date(current.lastMessageTime || current.updatedAt) > new Date(acc[existingIndex].lastMessageTime || acc[existingIndex].updatedAt)) {
              acc[existingIndex] = current;
            }
          }
          return acc;
        }, []);
        
        // Sort by lastMessageTime (most recent first)
        const sortedConversations = uniqueConversations.sort((a, b) => {
          const aTime = new Date(a.lastMessageTime || a.updatedAt);
          const bTime = new Date(b.lastMessageTime || b.updatedAt);
          return bTime - aTime;
        });
        
        setConversations(sortedConversations);
        console.log('Fetched and deduplicated conversations:', sortedConversations); // Debug log
        // Don't auto-select first conversation to avoid confusion
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      console.log('Fetching messages for conversation:', conversationId); // Debug log
      const response = await getMessages(conversationId);
      if (response.data?.data) {
        console.log('Fetched messages:', response.data.data); // Debug log
        setMessages(response.data.data);
      } else {
        console.log('No messages found or empty response'); // Debug log
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    console.log('Selecting conversation:', conversation); // Debug log
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const content = messageInput.trim();
    setMessageInput('');

    try {
      const response = await sendMessage(selectedConversation.otherUser.id, content);
      if (response.data?.data) {
        // Add the new message to the current messages
        setMessages(prev => [...prev, response.data.data]);
        
        // Update the conversation's last message and refresh conversations
        setConversations(prev => {
          const updated = prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, lastMessage: response.data.data, lastMessageTime: response.data.data.createdAt }
              : conv
          );
          
          // Remove any duplicates by otherUser.id and sort by lastMessageTime
          const uniqueConversations = updated.reduce((acc, current) => {
            const existingIndex = acc.findIndex(conv => conv.otherUser.id === current.otherUser.id);
            if (existingIndex === -1) {
              acc.push(current);
            } else {
              // Keep the conversation with the most recent lastMessageTime
              if (new Date(current.lastMessageTime) > new Date(acc[existingIndex].lastMessageTime)) {
                acc[existingIndex] = current;
              }
            }
            return acc;
          }, []);
          
          return uniqueConversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        });
        
        // Update selected conversation
        setSelectedConversation(prev => ({
          ...prev,
          lastMessage: response.data.data,
          lastMessageTime: response.data.data.createdAt
        }));
        
        // Refresh conversations to get updated order
        setTimeout(() => {
          fetchConversations();
        }, 200);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setMessageInput(content); // Restore the message input
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await searchUsers(query);
      if (response.data?.data) {
        // Filter out current user from search results
        const filteredResults = response.data.data.filter(user => user.id !== currentUser?.id);
        setSearchResults(filteredResults);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartConversation = async (user) => {
    try {
      console.log('Starting conversation with user:', user); // Debug log
      
      // First check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.otherUser.id === user.id
      );
      
      if (existingConversation) {
        console.log('Found existing conversation with user:', existingConversation); // Debug log
        handleConversationSelect(existingConversation);
        setShowSearchResults(false);
        setSearchQuery('');
        return;
      }

      console.log('Creating new conversation with user'); // Debug log
      const response = await startConversation(user.id);
      if (response.data?.data) {
        console.log('Created conversation:', response.data.data); // Debug log
        
        // Check if this conversation already exists in our list (by other user ID)
        const duplicateCheck = conversations.find(conv => 
          conv.otherUser.id === response.data.data.otherUser.id
        );
        
        if (!duplicateCheck) {
          // Add conversation to the list only if it doesn't exist
          setConversations(prev => [response.data.data, ...prev]);
          console.log('Added new conversation to list'); // Debug log
        } else {
          console.log('Conversation already exists, not adding duplicate'); // Debug log
        }
        
        // Select the conversation
        handleConversationSelect(response.data.data);
        setShowSearchResults(false);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  // Function to handle starting conversation with user ID from URL or context
  const handleStartConversationWithUserId = async (targetUserId) => {
    try {
      console.log('Starting conversation with user ID:', targetUserId); // Debug log
      console.log('Current conversations:', conversations); // Debug log
      
      // First check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.otherUser.id === parseInt(targetUserId)
      );
      
      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation); // Debug log
        handleConversationSelect(existingConversation);
        return;
      }

      console.log('No existing conversation found, creating new one'); // Debug log
      // If no existing conversation, start a new one
      const response = await startConversation(parseInt(targetUserId));
      if (response.data?.data) {
        console.log('Created new conversation:', response.data.data); // Debug log
        
        // Check if this conversation already exists in our list (by other user ID)
        const duplicateCheck = conversations.find(conv => 
          conv.otherUser.id === response.data.data.otherUser.id
        );
        
        if (!duplicateCheck) {
          // Add conversation to the list only if it doesn't exist
          setConversations(prev => [response.data.data, ...prev]);
          console.log('Added new conversation to list'); // Debug log
        } else {
          console.log('Conversation already exists, not adding duplicate'); // Debug log
        }
        
        // Select the conversation
        handleConversationSelect(response.data.data);
      }
    } catch (error) {
      console.error('Failed to start conversation with user:', error);
      toast.error('Failed to start conversation');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getProfileImageUrl = (user) => {
    if (user?.profileImage) {
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      } else {
        return `http://localhost:4000${user.profileImage}`;
      }
    }
    return '/noimage.jpg';
  };

  return (
    <div className="flex-1 overflow-hidden transition-all duration-300 my-10">
      <header className="bg-white shadow-sm border-b border-gray-100 px-8 py-6 mb-6 mx-3 rounded-xl">
        <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
      </header>
      
      <div className="mx-3 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex h-[80vh] overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200/50 relative z-10 flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-gray-200/30 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-14 py-2 bg-gray-50/80 border border-gray-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                />
                <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                  <span className="text-xs text-gray-500">All</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contact List - Make only this section scrollable */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : showSearchResults ? (
                <>
                  <div className="p-2 bg-gray-50 border-b">
                    <button
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to conversations
                    </button>
                  </div>
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No users found</div>
                  ) : (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/60"
                        onClick={() => handleStartConversation(user)}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-2.5 ring-2 ring-white/50 shadow-md">
                          <img 
                            src={getProfileImageUrl(user)} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-900">{user.name}</h3>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400" />
                      </div>
                    ))
                  )}
                </>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Search for users to start chatting</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/60 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-2.5 ring-2 ring-white/50 shadow-md">
                      <img 
                        src={getProfileImageUrl(conversation.otherUser)} 
                        alt={conversation.otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium text-sm ${
                          selectedConversation?.id === conversation.id 
                            ? 'text-white' 
                            : 'text-gray-900'
                        }`}>
                          {conversation.otherUser.name}
                        </h3>
                        <span className={`text-xs ${
                          selectedConversation?.id === conversation.id 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}>
                          {conversation.lastMessageTime && formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${
                        selectedConversation?.id === conversation.id 
                          ? 'text-blue-100' 
                          : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage?.content || 'Start a conversation'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative z-10">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200/30 flex items-center justify-between shadow-sm flex-shrink-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2.5 ring-2 ring-blue-200/50 shadow-md">
                      <img 
                        src={getProfileImageUrl(selectedConversation.otherUser)} 
                        alt={selectedConversation.otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-medium text-sm text-gray-900">
                        {selectedConversation.otherUser.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.otherUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  <div className="text-center">
                    <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full shadow-sm border border-gray-200/30">
                      Today
                    </span>
                  </div>
                  
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-gray-500">Loading messages...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center text-gray-500">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-xs mt-1">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSent = msg.senderId === currentUser?.id;
                      return (
                        <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                          {!isSent && (
                            <div className="w-6 h-6 rounded-full overflow-hidden mr-1.5 mt-auto ring-2 ring-white/50 shadow-sm">
                              <img 
                                src={getProfileImageUrl(selectedConversation.otherUser)} 
                                alt={selectedConversation.otherUser.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`max-w-xs px-3 py-2 rounded-2xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                            isSent 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md' 
                              : 'bg-white/80 text-gray-800 border border-gray-200/30 shadow-md'
                          }`}>
                            <p className={`text-xs leading-relaxed ${isSent ? 'text-white' : 'text-gray-800'}`}>{msg.content}</p>
                            <div className={`text-xs mt-1.5 ${isSent ? 'text-white opacity-80' : 'text-gray-500'}`}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t border-gray-200/30 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100/80 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-12">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200/50 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 pr-10 transition-all duration-300 shadow-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 transform">
                        <Smile className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a conversation from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;