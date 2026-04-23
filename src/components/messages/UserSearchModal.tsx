"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, CheckCircle2 } from "lucide-react";
import { useLazyGetUsersQuery } from "../../api/user";
import { IUser } from "../../types/interface";

interface UserSearchModalProps {
  onClose: () => void;
  onSelectUser: (user: IUser) => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ onClose, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [getUsers, { data, isFetching }] = useLazyGetUsersQuery();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      getUsers({ UserName: val, PageNumber: 1, PageSize: 10 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-[400px] rounded-2xl overflow-hidden flex flex-col max-h-[70vh] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center relative">
          <button onClick={onClose} className="text-[#262626] hover:opacity-50 transition-opacity">
            <X size={24} strokeWidth={2} />
          </button>
          <div className="flex-1 text-center font-bold text-base text-[#262626]">New message</div>
          <button
            disabled={!searchTerm}
            className="text-[#0095f6] font-bold text-sm hover:text-[#00376b] transition-colors disabled:opacity-30"
          >
            Next
          </button>
        </div>

        {/* Search Field */}
        <div className="px-5 py-3.5 flex items-center gap-4 border-b border-gray-50">
          <span className="font-bold text-base text-[#262626]">To:</span>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none text-[15px] font-medium placeholder:text-gray-400 pr-10"
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
          {isFetching && (
            <div className="absolute right-5">
              <div className="w-4 h-4 border-2 border-gray-100 border-t-[#0095f6] rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-gray-100 border-t-[#0095f6]"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Searching users...</span>
                <span className="text-[10px] text-gray-300 font-medium mt-1">Please wait while we connect</span>
              </div>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="py-2">
              <div className="px-5 py-3 text-xs font-bold text-[#262626] uppercase tracking-tighter">Suggested</div>
              <AnimatePresence>
                {data.data.map((user, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={user.id}
                    onClick={() => onSelectUser(user)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0 relative group-hover:scale-105 transition-transform">
                      {user.avatar ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_VITE_API_URL}/images/${user.avatar}`}
                          alt={user.userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/istockphoto-2151669184-612x612.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[#262626] truncate">{user.userName}</span>
                        {/* Optional Blue Check */}
                        {i === 0 && <CheckCircle2 size={12} fill="#0095f6" color="#fff" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#737373] font-medium truncate">
                        <span>{user.fullName || user.userName}</span>
                        {user.subscribersCount !== undefined && user.subscribersCount > 0 && (
                          <>
                            <span>•</span>
                            <span>{user.subscribersCount} followers</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : searchTerm.trim() ? (
            <div className="py-20 text-center">
              <span className="text-sm text-gray-400 font-medium tracking-tight">No accounts found.</span>
            </div>
          ) : (
            <div className="py-10 px-10 text-center flex flex-col items-center gap-2">
              <div className="p-4 bg-gray-50 rounded-full mb-2">
                <Search size={40} className="text-gray-300" strokeWidth={1.5} />
              </div>
              <span className="text-[17px] font-bold text-[#262626]">Find friends</span>
              <p className="text-sm text-[#737373] leading-relaxed">
                Search for people to start a new conversation.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserSearchModal;
