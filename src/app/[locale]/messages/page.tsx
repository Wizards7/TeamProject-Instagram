"use client";

import React, { useState } from "react";
import ChatList from "@/src/components/messages/ChatList";
import ChatView from "@/src/components/messages/ChatView";
import EmptyChat from "@/src/components/messages/EmptyChat";
import UserSearchModal from "@/src/components/messages/UserSearchModal";
import { useGetChatsQuery, useCreateChatMutation } from "@/src/api/chat";
import { IChat, IUser } from "@/src/types/interface";

const MessagesPage = () => {
  const { data: apiData, isLoading, refetch } = useGetChatsQuery();
  const [createChat] = useCreateChatMutation();
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const chats = apiData?.data || [];

  const handleSelectUserFromSearch = async (user: IUser) => {
    try {
      await createChat(user.id).unwrap();
      setIsSearchOpen(false);
      refetch(); // Refresh list to show new chat
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0095f6]"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] border border-[#dbdbdb] rounded-sm overflow-hidden flex bg-white shadow-sm">
      {/* List Pane */}
      <div className="w-[350px] flex-shrink-0">
        <ChatList 
          chats={chats} 
          selectedChatId={selectedChat?.chatId} 
          onSelectChat={(chat) => setSelectedChat(chat)} 
          onOpenNewChat={() => setIsSearchOpen(true)}
        />
      </div>

      {/* Main View Pane */}
      <div className="flex-1 min-w-0">
        {selectedChat ? (
          <ChatView chat={selectedChat} />
        ) : (
          <EmptyChat />
        )}
      </div>

      {/* Modals */}
      {isSearchOpen && (
        <UserSearchModal 
          onClose={() => setIsSearchOpen(false)} 
          onSelectUser={handleSelectUserFromSearch}
        />
      )}
    </div>
  );
};

export default MessagesPage;