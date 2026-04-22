"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { IChat } from "../../types/interface";

interface ChatListProps {
  chats: IChat[];
  selectedChatId?: number;
  onSelectChat: (chat: IChat) => void;
  onOpenNewChat: () => void;
  currentUser?: {
    userName: string;
  };
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onOpenNewChat,
  currentUser = { userName: "terrylucas" }
}) => {
  const t = useTranslations("Chat");
  const API_IMAGE_URL = `${process.env.NEXT_PUBLIC_VITE_API_URL}/images/`;

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#dbdbdb] select-none text-[#262626]">
      {/* Header Section */}
      <div className="p-5 pb-2 flex items-center justify-between">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 font-bold text-xl cursor-not-allowed group transition-all"
        >
          <span className="truncate max-w-[200px]">{currentUser.userName}</span>
          <ChevronDown size={20} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenNewChat}
          className="p-1.5 hover:bg-neutral-100 rounded-full transition-all text-[#262626]"
        >
          <Edit size={24} strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Categories / Tabs */}
      <div className="flex px-5 py-4 justify-between items-center bg-white border-b border-[#efefef]">
        <span className="font-bold text-base text-[#262626]">{t("messages")}</span>
        <button className="text-[#0095f6] font-bold text-sm hover:text-[#00376b] transition-colors">
          {t("requests")}
        </button>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
        <AnimatePresence mode="popLayout">
          {chats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 text-center text-[#737373] text-sm italic"
            >
              {t("noConversations")}
            </motion.div>
          ) : (
            chats.map((chat) => {
              const isActive = selectedChatId === chat.chatId;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileTap={{ scale: 0.98 }}
                  key={chat.chatId}
                  onClick={() => onSelectChat(chat)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-all relative
                    ${isActive ? "bg-[#fafafa]" : "hover:bg-[#fafafa]"}`}
                >
                  {/* Selected Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="active-selection-indicator"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#262626] z-10"
                    />
                  )}

                  {/* Avatar with IG Story Gradient border */}
                  <div className="relative flex-shrink-0">
                    <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-[2.5px] border-white bg-white flex items-center justify-center font-bold text-gray-300">
                        {chat.receiveUserImage ? (
                          <img
                            src={API_IMAGE_URL + chat.receiveUserImage}
                            alt={chat.receiveUserName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">{chat.receiveUserName[0]}</span>
                        )}
                      </div>
                    </div>
                    {/* Active Status Dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#78de45] border-[3px] border-white rounded-full shadow-sm"></div>
                  </div>

                  {/* Chat Metadata */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={`text-[15px] tracking-tight truncate ${isActive ? "font-bold text-black" : "text-[#262626]"}`}>
                      {chat.receiveUserName}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-sm truncate ${isActive ? "text-gray-900 font-medium" : "text-[#737373]"}`}>
                        {chat.lastMessage || t("sentMessage")}
                      </span>
                      <span className="text-[#737373] text-xs flex-shrink-0">· 1h</span>
                    </div>
                  </div>

                  {/* Activity Indicator (Blue dot if unread, or nothing) */}
                  {!isActive && (
                    <div className="w-2.5 h-2.5 bg-[#0095f6] rounded-full ml-auto shadow-sm" />
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatList;
