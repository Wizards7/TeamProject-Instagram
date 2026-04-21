"use client";

import React from "react";
import { IChat } from "../../types/interface";

interface ChatListProps {
  chats: IChat[];
  selectedChatId?: number;
  onSelectChat: (chat: IChat) => void;
  onOpenNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat, onOpenNewChat }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-[#dbdbdb]">
      <div className="p-5 flex items-center justify-between border-b border-[#efefef]">
        <div className="flex items-center gap-2 font-bold text-xl">
          terrylucas
          <svg aria-label="Down Chevron" color="#262626" fill="#262626" height="12" role="img" viewBox="0 0 24 24" width="12">
            <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
          </svg>
        </div>
        <button onClick={onOpenNewChat} className="hover:opacity-60 transition-opacity">
          <svg aria-label="New Message" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
            <path d="M12.202 3.203H5.202C3.548 3.203 2.203 4.548 2.203 6.202V21.196a1 1 0 001.657.759l3.328-2.754h5.014c1.654 0 2.999-1.345 2.999-3V6.202c0-1.654-1.345-2.999-2.999-2.999z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <path d="M17.377 11.334l2.062-.303a1 1 0 00.844-1.127l-1.012-6.866a1 1 0 00-1.127-.844L11.278 4.206" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </button>
      </div>

      <div className="flex px-5 py-3 justify-between items-center bg-white border-b border-[#efefef]">
        <span className="font-semibold text-base">Messages</span>
        <span className="text-[#0095f6] font-semibold text-sm cursor-pointer hover:text-black transition-colors">Requests</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-[#737373] text-sm italic">
            No chats available.
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 px-5 py-2 cursor-pointer transition-colors hover:bg-[#fafafa] relative
                ${selectedChatId === chat.chatId ? "bg-[#efefef]" : ""}`}
            >
              {selectedChatId === chat.chatId && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0095f6]" />
              )}
              
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#dbdbdb]">
                  <img
                    src={chat.chatPhoto || "/image.webp"}
                    alt={chat.chatName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-sm tracking-tight truncate ${selectedChatId === chat.chatId ? "font-semibold" : "font-medium"}`}>
                  {chat.chatName || chat.receiverUserId}
                </span>
                <span className="text-xs text-[#737373] truncate">
                  {chat.lastMessage || "Active 8h ago"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
