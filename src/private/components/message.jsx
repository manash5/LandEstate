import React, { useState } from 'react';
import { Search, Paperclip, Smile, Send, ChevronDown } from 'lucide-react';

const Message = () => {
  const [selectedContact, setSelectedContact] = useState('Durgesh Thapa');
  const [messageInput, setMessageInput] = useState('');

  const contacts = [
    { name: 'Durgesh Thapa', lastMessage: 'Hello, How are you...?', time: '3:30 PM', active: true, avatar: 'https://english.makalukhabar.com/wp-content/uploads/2025/04/DT-MK.webp' },
    { name: 'Hari bahadur ', lastMessage: 'I need a photo for see...', time: '3:25 AM', active: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Roshit sir', lastMessage: 'Hello, How are you...', time: '1:30 PM', active: false, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { name: 'Niti Shah', lastMessage: 'Hello, How are you', time: '6:30 AM', active: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    { name: 'Keshav Jha', lastMessage: 'I need a photo for see...', time: '4:30 PM', active: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    { name: 'Kumar Pant', lastMessage: 'How can I help you...?', time: '3:30 PM', active: false, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face' },
    { name: 'Digvesh Niraula', lastMessage: 'Hello, How are you', time: '2:10 AM', active: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Virat Nepal', lastMessage: 'I need a photo for see...', time: '3:30 PM', active: false, avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face' },
    { name: 'Krisha Luitel', lastMessage: 'Hello, How are you', time: '3:30 PM', active: false, avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face' },
    { name: 'Harke Singh', lastMessage: 'How can I help you...?', time: '5:30 AM', active: false, avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face' }
  ];

  const messages = [
    { id: 1, sender: 'Durgesh Thapa', message: 'Hello! How are you?😊', time: '12:30 AM', isSent: false },
    { id: 2, sender: 'You', message: 'Im good 👍 and you...? How can he help you...?', time: '12:31 AM', isSent: true },
    { id: 3, sender: 'Jane Cooper', message: 'I need a photo of your house billing front view, because is not in the description.', time: '12:32 AM', isSent: false },
    { id: 4, sender: 'You', message: 'Okay wait...', time: '12:33 AM', isSent: true },
    { id: 5, sender: 'Jane Cooper', message: 'Thank you😊', time: '12:33 AM', isSent: false, hasImages: true }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
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
                  placeholder="Search"
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
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/60 ${
                    contact.name === selectedContact && contact.active 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedContact(contact.name)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-2.5 ring-2 ring-white/50 shadow-md">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-medium text-sm ${contact.name === selectedContact && contact.active ? 'text-white' : 'text-gray-900'}`}>
                        {contact.name}
                      </h3>
                      <span className={`text-xs ${contact.name === selectedContact && contact.active ? 'text-blue-100' : 'text-gray-500'}`}>
                        {contact.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${contact.name === selectedContact && contact.active ? 'text-blue-100' : 'text-gray-600'}`}>
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative z-10">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-200/30 flex items-center justify-between shadow-sm flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2.5 ring-2 ring-blue-200/50 shadow-md">
                  <img 
                    src="https://english.makalukhabar.com/wp-content/uploads/2025/04/DT-MK.webp" 
                    alt="Durgesh Thapa"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-medium text-sm text-gray-900">Durgesh Thapa</h2>
                  <p className="text-xs text-gray-500">Active Now</p>
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
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isSent && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-1.5 mt-auto ring-2 ring-white/50 shadow-sm">
                      <img 
                        src="https://english.makalukhabar.com/wp-content/uploads/2025/04/DT-MK.webp" 
                        alt="Durgesh Thapa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`max-w-xs px-3 py-2 rounded-2xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                    msg.isSent 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'bg-white/80 text-gray-800 border border-gray-200/30 shadow-md'
                  }`}>
                    <p className="text-xs leading-relaxed">{msg.message}</p>
                    {msg.hasImages && (
                      <div className="flex space-x-1.5 mt-2">
                        <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer">
                          <img 
                            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=150&fit=crop" 
                            alt="House"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer">
                          <img 
                            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop" 
                            alt="Interior"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`text-xs mt-1.5 ${msg.isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
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
                    placeholder="Write a message down here..."
                    className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200/50 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 pr-10 transition-all duration-300 shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110 transform">
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;