"use client";
import React, { useState } from "react";
import { FollowModalProps, IFollower } from "../types/interface";
import {
  useAddFollowingRelationShipMutation,
  useDeleteFollowingRelationShipMutation,
  useIsFollowingUserQuery,
} from "../api/userProfile";

const FILE_URL = "https://instagram-api.softclub.tj/images/";



export const FollowModal: React.FC<FollowModalProps> = ({ title, users, onClose }) => {
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});
  const [followUser] = useAddFollowingRelationShipMutation();
  const [unfollowUser] = useDeleteFollowingRelationShipMutation();

  const handleFollowToggle = async (userId: string, currentlyFollowing: boolean) => {
    setFollowingState((prev) => ({ ...prev, [userId]: !currentlyFollowing }));
    try {
      if (currentlyFollowing) {
        await unfollowUser({ followingUserId: userId }).unwrap();
      } else {
        await followUser({ followingUserId: userId }).unwrap();
      }
    } catch (error) {
      setFollowingState((prev) => ({ ...prev, [userId]: currentlyFollowing }));
      console.error("Failed to update follow status", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {users.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No {title.toLowerCase()} yet</p>
          ) : (
            users.map((user) => (
              <FollowUserItem
                key={user.id}
                user={user}
                followingState={followingState}
                onToggle={handleFollowToggle}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const FollowUserItem: React.FC<{
  user: IFollower;
  followingState: Record<string, boolean>;
  onToggle: (userId: string, currentlyFollowing: boolean) => void;
}> = ({ user, followingState, onToggle }) => {
  const { data: isFollowingData, isLoading: checkingFollow } = useIsFollowingUserQuery(
    { followingUserId: user.id },
    { skip: followingState[user.id] !== undefined }
  );
  const isFollowing = followingState[user.id] ?? isFollowingData?.data ?? false;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {user.image ? (
          <img src={`${FILE_URL}${user.image}`} className="w-full h-full object-cover" alt={user.userName} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase font-bold text-lg">
            {user.userName?.[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{user.userName}</p>
        <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
      </div>
      <button
        onClick={() => onToggle(user.id, isFollowing)}
        disabled={checkingFollow}
        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
          isFollowing
            ? "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
            : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
        } ${checkingFollow ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {checkingFollow ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </button>
    </div>
  );
};