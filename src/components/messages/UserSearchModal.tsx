"use client";

import React, { useState } from "react";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[400px] rounded-xl overflow-hidden flex flex-col max-h-[70vh] shadow-2xl">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center relative">
          <div className="flex-1 text-center font-bold text-base">New message</div>
          <button onClick={onClose} className="absolute right-4 text-gray-800 hover:opacity-50 transition-opacity">
            <svg aria-label="Close" height="18" viewBox="0 0 24 24" width="18">
              <polyline fill="none" points="20.643 3.357 12 12 3.357 20.643" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.643" x2="3.357" y1="20.643" y2="3.357"></line>
            </svg>
          </button>
        </div>
        
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <span className="font-semibold text-sm">To:</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-1 outline-none text-sm placeholder:text-gray-400"
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isFetching ? (
            <div className="p-8 text-center">
               <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Suggested</div>
              {data.data.map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-sm font-bold text-gray-400 capitalize">{user.userName[0]}</div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">{user.userName}</span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                      <span>{user.fullName}</span>
                      {user.subscribersCount > 0 && (
                          <>
                            <span>•</span>
                            <span>{user.subscribersCount} followers</span>
                          </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            <div className="p-8 text-center text-sm text-gray-400 font-normal">No account found.</div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-400 font-normal">No recent searches.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
