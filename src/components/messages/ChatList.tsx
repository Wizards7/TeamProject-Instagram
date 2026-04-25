"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { IChat } from "../../types/interface";
import { useGetMyProfileQuery } from "../../api/userProfile";
import { useGetUsersQuery } from "../../api/user";

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
  const { data: profileData } = useGetMyProfileQuery();
  const profile = profileData?.data;

  const { data: usersData } = useGetUsersQuery({ PageSize: 10 });
  const serverUsers = usersData?.data || [];

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden font-sans border-r border-border">
      <header className="px-5 py-3.5 border-b border-border flex items-center justify-between z-50 bg-background/80 backdrop-blur-md sticky top-0">
        <motion.div
          className="flex items-center gap-4 text-foreground"
        >
          <span className="truncate max-w-[200px] font-bold text-xl">{currentUser.userName}</span>
          <ChevronDown size={20} strokeWidth={2.5} />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenNewChat}
          className="p-1.5 hover:bg-secondary rounded-full transition-all text-foreground"
        >
          <Edit size={24} strokeWidth={1.5} />
        </motion.button>
      </header>

      {/* Notes Section */}
      <div className="flex gap-5 px-5 py-5 overflow-x-auto hidden-scrollbar border-b border-border">
        {/* Your Note */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover px-3 py-1.5 rounded-2xl shadow-sm border border-border z-10 min-w-[85px] max-w-[120px]">
              <p className="text-[10px] text-[#737373] dark:text-gray-400 leading-tight text-center line-clamp-2">
                Создайте первую заметку...
              </p>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-r border-b border-border"></div>
            </div>

            <div className="w-16 h-16 rounded-full bg-[#fafafa] dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
              {profile?.image ? (
                <img src={API_IMAGE_URL + profile.image} className="w-full h-full object-cover" alt="Me" />
              ) : (
                <svg viewBox="0 0 24 24" fill="#dbdbdb" className="w-10 h-10">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-white dark:bg-black rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                <span className="text-[#0095f6] text-xl font-bold leading-none">+</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#737373] dark:text-gray-400 font-medium">Ваша заметка</span>
        </div>

        {/* Users from Server */}
        {serverUsers.map((user, idx) => (
          <div key={user.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div className="relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-[#262626] px-3 py-1.5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 z-10 min-w-[85px] max-w-[120px] group-hover:scale-105 transition-transform duration-200">
                <p className="text-[10px] text-[#262626] dark:text-gray-200 leading-tight text-center line-clamp-2 font-medium">
                  {idx === 0 ? "Focus mode 💻" : idx === 1 ? "At gym 💪" : "Hello! ✨"}
                </p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#262626] rotate-45 border-r border-b border-gray-100 dark:border-gray-700"></div>
              </div>

              <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                <div className="w-16 h-16 rounded-full border-2 border-white dark:border-[#121212] overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={API_IMAGE_URL + user.avatar} className="w-full h-full object-cover" alt={user.userName} />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 font-bold uppercase">
                      {user.userName[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-[#737373] dark:text-gray-400 font-medium truncate max-w-[70px]">{user.userName}</span>
          </div>
        ))}
      </div>

      {/* Categories / Tabs */}
      <div className="flex px-5 py-4 justify-between items-center bg-background border-b border-border">
        <span className="font-bold text-base text-foreground">{t("messages")}</span>
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
                    ${isActive ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-selection-indicator"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground z-10"
                    />
                  )}

                  <div className="relative flex-shrink-0">
                    <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-[2.5px] border-background bg-background flex items-center justify-center font-bold text-muted-foreground">
                        {chat.receiveUserImage ? (
                          <img
                            src={API_IMAGE_URL + chat.receiveUserImage}
                            alt={chat.receiveUserName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl text-foreground">{chat.receiveUserName[0]}</span>
                        )}
                      </div>
                    </div>
                    {/* Active Status Dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#78de45] border-[3px] border-white rounded-full shadow-sm"></div>
                  </div>

                  {/* Chat Metadata */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={`text-[15px] tracking-tight truncate ${isActive ? "font-bold text-foreground" : "text-foreground"}`}>
                      {chat.receiveUserName}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-sm truncate ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
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
