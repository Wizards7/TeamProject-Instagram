"use client";

import React, { useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { FollowModalProps, IFollower } from "../types/interface";
import {
  useAddFollowingRelationShipMutation,
  useDeleteFollowingRelationShipMutation,
  useIsFollowingUserQuery,
} from "../api/userProfile";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

export const FollowModal: React.FC<FollowModalProps> = ({ title, users, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#262626] rounded-xl w-full max-w-[400px] max-h-[480px] flex flex-col shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative">
          <div className="w-8" />
          <h3 className="font-bold text-[16px] text-black dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-black dark:text-white hover:opacity-70 transition-opacity">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-8">
               <div className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
                  <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="1.5"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
               </div>
               <p className="font-bold text-black dark:text-white">No {title.toLowerCase()} yet</p>
            </div>
          ) : (
            <div className="py-2">
              {users.map((user) => (
                <FollowUserItem
                  key={user.id}
                  user={user}
                  onClose={onClose}
                />
              ))
              }
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const FollowUserItem: React.FC<{
  user: IFollower;
  onClose: () => void;
}> = ({ user, onClose }) => {
  const [followUser] = useAddFollowingRelationShipMutation();
  const [unfollowUser] = useDeleteFollowingRelationShipMutation();
  const { data: isFollowingData, isLoading: checkingFollow } = useIsFollowingUserQuery(
    { followingUserId: user.id }
  );
  
  const isFollowing = isFollowingData?.data ?? false;
  const [localFollowing, setLocalFollowing] = useState<boolean | null>(null);
  
  const currentFollowing = localFollowing !== null ? localFollowing : isFollowing;

  const handleToggle = async () => {
    const nextState = !currentFollowing;
    setLocalFollowing(nextState);
    try {
      if (currentFollowing) {
        await unfollowUser({ followingUserId: user.id }).unwrap();
      } else {
        await followUser({ followingUserId: user.id }).unwrap();
      }
    } catch (error) {
      setLocalFollowing(currentFollowing);
      console.error("Failed to update follow status", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link 
            href={`/profile/${user.id}`} 
            onClick={onClose}
            className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-800 active:scale-95 transition-transform"
        >
          {user.image ? (
            <img 
                src={`${FILE_URL}${user.image}`} 
                className="w-full h-full object-cover" 
                alt={user.userName} 
                onError={(e) => (e.currentTarget.src = "/image.webp")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase font-bold text-lg bg-gray-50 dark:bg-gray-900">
              {user.userName?.[0]}
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link 
            href={`/profile/${user.id}`} 
            onClick={onClose}
            className="font-bold text-sm truncate text-black dark:text-white hover:opacity-60 block"
          >
            {user.userName}
          </Link>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.fullName || user.userName}</p>
        </div>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={checkingFollow}
        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all active:scale-95 ${
          currentFollowing
            ? "bg-[#efefef] dark:bg-[#363636] text-black dark:text-white hover:bg-[#dbdbdb] dark:hover:bg-[#4a4a4a]"
            : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
        } ${checkingFollow ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {currentFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};