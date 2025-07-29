import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [targetUserId, setTargetUserId] = useState(null);
  const [shouldOpenChat, setShouldOpenChat] = useState(false);

  const openChatWithUser = (userId) => {
    setTargetUserId(userId);
    setShouldOpenChat(true);
  };

  const clearChatTarget = () => {
    setTargetUserId(null);
    setShouldOpenChat(false);
  };

  const value = {
    targetUserId,
    shouldOpenChat,
    openChatWithUser,
    clearChatTarget
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
