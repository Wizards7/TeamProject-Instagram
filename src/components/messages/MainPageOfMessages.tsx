"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatList from "@/src/components/messages/ChatList";
import ChatView from "@/src/components/messages/ChatView";
import EmptyChat from "@/src/components/messages/EmptyChat";
import UserSearchModal from "@/src/components/messages/UserSearchModal";
import { useGetChatsQuery, useCreateChatMutation } from "@/src/api/chat";
import { IChat, IUser } from "@/src/types/interface";

export const MessagesPage = () => {
  const { data: apiData, isLoading, refetch } = useGetChatsQuery();
  const [createChat] = useCreateChatMutation();
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const chats = apiData?.data || [];

  const handleSelectUserFromSearch = async (user: IUser) => {
    try {
      await createChat(user.id).unwrap();
      setIsSearchOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#0095f6]"
        />
        <span className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Wizzards7 UI Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] border border-[#dbdbdb] rounded-sm overflow-hidden flex bg-white shadow-2xl shadow-black/5 max-w-[1200px] mx-auto my-1">
      <div className="w-[350px] flex-shrink-0 border-r border-[#dbdbdb]">
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?.chatId}
          onSelectChat={(chat) => setSelectedChat(chat)}
          onOpenNewChat={() => setIsSearchOpen(true)}
        />
      </div>

      <div className="flex-1 min-w-0 bg-white relative">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key={`chat-${selectedChat.chatId}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <ChatView
                chat={selectedChat}
                onDeleteChat={() => {
                  setSelectedChat(null);
                  refetch();
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <EmptyChat onOpenNewChat={() => setIsSearchOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <UserSearchModal
            onClose={() => setIsSearchOpen(false)}
            onSelectUser={handleSelectUserFromSearch}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesPage;