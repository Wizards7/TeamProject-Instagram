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
      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50/50 cursor-pointer transition-colors w-full border-b border-gray-50 last:border-none"
    >
      {/* Avatar Container */}
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border border-orange-100 bg-white flex-shrink-0 shadow-sm">
        {user.avatar || user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_VITE_API_URL}/images/${user.avatar || user.image}`}
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

      {/* User Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[14px] font-bold text-[#454444] truncate leading-tight">
          {user.userName || "unknown_user"}
        </span>
        <div className="flex items-center gap-1 text-[13px] text-gray-500 truncate leading-tight mt-0.5">
          <span className="font-medium text-gray-700">
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
