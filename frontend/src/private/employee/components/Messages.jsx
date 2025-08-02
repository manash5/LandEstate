import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, ArrowLeft, User, Clock, MoreVertical, MessageCircle } from 'lucide-react';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStartConversation, setShowStartConversation] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current employee data
  useEffect(() => {
    const employeeData = localStorage.getItem('employeeData');
    if (employeeData) {
      setCurrentEmployee(JSON.parse(employeeData));
    }
  }, []);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('employeeToken');
      
      const response = await fetch('http://localhost:4000/api/employee-messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('employeeToken');
      
      const response = await fetch(`http://localhost:4000/api/employee-messages/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('employeeToken');
      
      // Find the manager ID from the conversation
      const managerId = selectedConversation.otherUser?.id;
      if (!managerId) return;

      const response = await fetch('http://localhost:4000/api/employee-messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId: managerId,
          content: newMessage.trim(),
          messageType: 'text',
          userType: 'user' // Send to regular user (manager)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
        // Refresh conversations to update last message
        fetchConversations();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const startConversationWithManager = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('employeeToken');
      
      // Get the manager ID from employee data  
      if (!currentEmployee?.managerId) {
        setError('No manager assigned to this employee');
        return;
      }

      const response = await fetch('http://localhost:4000/api/employee-messages/start-conversation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentEmployee.managerId,
          userType: 'user'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data.data);
        fetchConversations(); // Refresh conversations list
        setShowStartConversation(false);
        setMessages([]); // Clear messages for new conversation
      } else {
        throw new Error('Failed to start conversation');
      }
    } catch (err) {
      setError('Failed to start conversation with manager');
      console.error('Error starting conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
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

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                  <button 
                    onClick={() => setError('')}
                    className="ml-2 text-red-800 hover:text-red-900"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50/80 border border-gray-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                />
              </div>
            </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-lg font-medium mb-2">No conversations yet</p>
              <p className="text-xs mb-4">Start a conversation with your manager</p>
              <button
                onClick={startConversationWithManager}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Starting...' : 'Message Manager'}
              </button>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/60 relative ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mr-2.5 ring-2 ring-white/50 shadow-md relative">
                  <img 
                    src={getProfileImageUrl(conversation.otherUser)} 
                    alt={conversation.otherUser?.name || 'Manager'}
                    className="w-full h-full object-cover"
                  />
                  {/* Manager indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <h3 className={`font-medium text-sm ${
                        selectedConversation?.id === conversation.id 
                          ? 'text-white' 
                          : 'text-gray-900'
                      }`}>
                        {conversation.otherUser?.name || 'Manager'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {conversation.unreadCount > 0 && (
                        <div className={`min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-xs font-medium ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </div>
                      )}
                      {conversation.lastMessage && (
                        <span className={`text-xs ${
                          selectedConversation?.id === conversation.id 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}>
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs truncate ${
                    selectedConversation?.id === conversation.id 
                      ? 'text-blue-100' 
                      : conversation.unreadCount > 0 
                        ? 'text-gray-900 font-medium' 
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
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 text-gray-500 hover:text-gray-700 mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2.5 ring-2 ring-blue-200/50 shadow-md relative">
                  <img 
                    src={getProfileImageUrl(selectedConversation.otherUser)} 
                    alt={selectedConversation.otherUser?.name || 'Manager'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-medium text-sm text-gray-900">
                    {selectedConversation.otherUser?.name || 'Manager'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.otherUser?.email}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
              {loading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  // For employees, messages sent by them will have senderId as negative employee ID
                  const isCurrentUser = message.senderId === -currentEmployee?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl shadow-sm ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className={`text-sm leading-relaxed ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                          {message.content}
                        </p>
                        <div className={`flex items-center space-x-1 mt-1.5 ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className={`w-3 h-3 ${isCurrentUser ? 'text-white opacity-60' : 'text-gray-500 opacity-60'}`} />
                          <span className={`text-xs ${isCurrentUser ? 'text-white opacity-60' : 'text-gray-500 opacity-60'}`}>
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200/50 flex-shrink-0">
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 resize-none"
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 items-center justify-center bg-gray-50/30 hidden md:flex">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default Messages;
