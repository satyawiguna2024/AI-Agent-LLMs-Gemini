/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("chats");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem("activeChatId");
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("activeChatId", activeChatId);
    }
  }, [activeChatId]);

  const createNewChat = (title = "New Chat") => {
    const newChat = {
      thread_id: crypto.randomUUID(),
      title,
      messages: []
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.thread_id);

    return newChat.thread_id;
  };

  const clearAllChats = () => {
    const isConfirm = window.confirm("Are you sure you want to delete all chats?");

    if (!isConfirm) return;

    setChats([]);
    setActiveChatId(null);

    localStorage.removeItem("chats");
    localStorage.removeItem("activeChatId");
  };

  return (
    <ChatContext.Provider value={{
      chats,
      setChats,
      activeChatId,
      setActiveChatId,
      createNewChat,
      clearAllChats
    }}>
      {children}
    </ChatContext.Provider>
  );
}