"use client";

import React from "react";
import { IUser } from "../../types/interface";
import { Link } from "@/src/i18n/navigation";

interface UserSearchItemProps {
  user: IUser;
  onClick?: () => void;
}

const UserSearchItem: React.FC<UserSearchItemProps> = ({ user, onClick }) => {
  return (
    <Link
      href={`/profile/${user.id}`}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50/50 dark:hover:bg-[#363636] cursor-pointer transition-colors w-full border-b border-gray-50 dark:border-gray-800 last:border-none"
    >
        {/* Avatar Container */}
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border border-orange-100 dark:border-gray-800 bg-white dark:bg-[#262626] flex-shrink-0 shadow-sm">
          {user.avatar || user.image ? (
            <img
            src={`${process.env.NEXT_PUBLIC_VITE_API_URL}/images/${user.avatar || user.image}`}
              alt={user.userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg";
              }}
            />
          ) : (
          <img 
            src="/istockphoto-2151669184-612x612.jpg" 
            alt="Default Avatar" 
            className="w-full h-full object-cover" 
          />
          )}
        </div>

        {/* User Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[14px] font-bold text-[#454444] dark:text-white truncate leading-tight">
            {user.userName || "unknown_user"}
          </span>
        <div className="flex items-center gap-1 text-[13px] text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {user.fullName || user.userName}
          </span>
          {user.subscribersCount !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-gray-300">•</span>
              <span className="text-gray-400">
                {user.subscribersCount} followers
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserSearchItem;
