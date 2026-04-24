"use client";

import React, { useState } from "react";
import { useGetUsersQuery } from "../api/user";
import { useCreateChatMutation, useSendMessageMutation } from "../api/chat";
import { IUser } from "../types/interface";

interface ShareModalProps {
  postId: number;
  postUrl: string;
  onClose: () => void;
}

const FILE_URL = "https://instagram-api.softclub.tj/images/";

export const ShareModal: React.FC<ShareModalProps> = ({ postId, postUrl, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersData, isLoading } = useGetUsersQuery({ UserName: searchTerm, PageSize: 20 });
  const [createChat] = useCreateChatMutation();
  const [sendMessage] = useSendMessageMutation();
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [isSending, setIsSending] = useState(false);

  const toggleUser = (user: IUser) => {
    setSelectedUsers(prev => 
      prev.find(u => u.id === user.id) 
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleSend = async () => {
    if (selectedUsers.length === 0) return;
    setIsSending(true);
    try {
      // Loop through all selected users and send the post
      const sendPromises = selectedUsers.map(async (user) => {
        // 1. Create or get chat
        const chatResponse = await createChat(user.id).unwrap();
        
        // Fix: Safely get chatId from response
        // Sometimes it's in data.chatId, sometimes data is the ID itself, or it's a direct response
        const chatId = chatResponse.data?.chatId || chatResponse.data;

        if (!chatId) throw new Error("Could not get ChatId");

        // 2. Send message with post link
        const formData = new FormData();
        formData.append("ChatId", chatId.toString());
        formData.append("MessageText", `Check out this post: ${postUrl}`);
        
        return sendMessage(formData).unwrap();
      });

      await Promise.all(sendPromises);
      
      onClose();
    } catch (error) {
      console.error("Failed to share post:", error);
      alert("Failed to share with some users.");
    } finally {
      setIsSending(false);
    }
  };

  const users = usersData?.data || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#262626] w-full max-w-[400px] h-[600px] rounded-xl flex flex-col overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
          </button>
          <h2 className="text-[16px] font-bold text-black dark:text-white">Share</h2>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Search & Selected tags */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 max-h-[120px] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-black dark:text-white">To:</span>
            {selectedUsers.map(user => (
              <div key={user.id} className="bg-[#e0f1ff] dark:bg-[#00376b] text-[#0095f6] dark:text-[#e0f1ff] px-3 py-1 rounded-full flex items-center gap-2 text-sm animate-in zoom-in duration-200">
                <span>{user.userName}</span>
                <button onClick={() => toggleUser(user)} className="hover:opacity-70">
                   <svg fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                </button>
              </div>
            ))}
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-[14px] text-black dark:text-white placeholder:text-gray-400 py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0095f6] rounded-full animate-spin" />
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-1">
              {users.map((user) => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                return (
                  <div 
                    key={user.id}
                    onClick={() => toggleUser(user)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        {user.image ? (
                          <img src={`${FILE_URL}${user.image}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400 bg-gray-50 uppercase">
                            {user.userName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-black dark:text-white">{user.userName}</span>
                        <span className="text-[14px] text-gray-500">{user.fullName || user.userName}</span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-[#0095f6] border-[#0095f6]' : 'border-gray-300'}`}>
                      {isSelected && (
                        <svg fill="white" height="12" viewBox="0 0 24 24" width="12"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <p className="text-sm">No users found.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            disabled={selectedUsers.length === 0 || isSending}
            onClick={handleSend}
            className="w-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 text-white font-bold py-3 rounded-lg text-[14px] transition-all transform active:scale-95 shadow-lg"
          >
            {isSending ? "Sending..." : selectedUsers.length > 1 ? `Send to ${selectedUsers.length} people` : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
