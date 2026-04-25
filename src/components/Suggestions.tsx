"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useGetUsersQuery } from "../api/user";
import { useAddFollowingRelationShipMutation, useGetMyProfileQuery, useGetFollowingQuery } from "../api/userProfile";

const Suggestions = () => {
  const locale = useLocale();
  const { data: userData, isLoading } = useGetUsersQuery({ PageNumber: 1, PageSize: 10 });
  const { data: myProfileData } = useGetMyProfileQuery();
  const myId = myProfileData?.data?.id || myProfileData?.data?.userId;
  
  const { data: followingData, isLoading: followingLoading } = useGetFollowingQuery(
    { userId: myId || "" },
    { skip: !myId }
  );
  
  const [addFollow, { isLoading: isFollowMutationLoading }] = useAddFollowingRelationShipMutation();
  const FILE_URL = "https://instagram-api.softclub.tj/images/";

  const [localFollows, setLocalFollows] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("followed_users") || "{}");
      setLocalFollows(saved);
    }
  }, []);

  const saveFollowToLocal = (id: string, name: string, state: boolean) => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("followed_users") || "{}");
      saved[String(id)] = state;
      saved[String(name)] = state;
      localStorage.setItem("followed_users", JSON.stringify(saved));
      setLocalFollows(saved);
    }
  };

  const followedIds = new Set((followingData?.data || []).map((f: any) => String(f.id)));

  const filteredUsers = userData?.data
    ?.filter(u => String(u.id) !== String(myId)) // Don't suggest myself
    .slice(0, 5) || [];

  // Only show null on initial load. Don't hide the component during refetches.
  if ((isLoading && !userData) || (followingLoading && !followingData)) return null;

  return (
    <div className="w-[320px] hidden lg:block sticky top-24 ml-8 self-start">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Suggestions for you</span>
        <button className="text-xs font-bold text-foreground hover:text-gray-500">See All</button>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const userIdStr = String(user.id);
          const isFollowed = localFollows[userIdStr] || localFollows[user.userName] ||
                            followedIds.has(userIdStr) || 
                            (followingData?.data || []).some(f => f.userName === user.userName);
          
          return (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/${locale}/profile/${user.id}`} className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer">
                  {user.image ? (
                    <img src={`${FILE_URL}${user.image}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                      {user.userName[0]}
                    </div>
                  )}
                </Link>
                <div className="flex flex-col">
                  <Link href={`/${locale}/profile/${user.id}`} className="text-sm font-bold text-foreground hover:underline cursor-pointer">
                    {user.userName}
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Followed by many</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={isFollowed || isFollowMutationLoading}
                  onClick={async () => {
                    if (isFollowed || isFollowMutationLoading) return;
                    saveFollowToLocal(userIdStr, user.userName, true);
                    try {
                      await addFollow({ followingUserId: user.id }).unwrap();
                    } catch (err: any) {
                      if (err?.status === 400) {
                        saveFollowToLocal(userIdStr, user.userName, true);
                      } else {
                        saveFollowToLocal(userIdStr, user.userName, false);
                        console.error("Follow from suggestions failed", err);
                      }
                    }
                  }}
                  className={`text-xs font-bold transition-colors ${isFollowed ? 'text-foreground cursor-default' : isFollowMutationLoading ? 'text-gray-400 cursor-default' : 'text-[#0095f6] hover:text-[#00376b]'}`}
                >
                  {isFollowed ? "Following" : isFollowMutationLoading ? "..." : "Follow"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Press</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </nav>
        <p className="text-xs text-gray-400 uppercase">© 2026 INSTAGRAM CLONE BY ANTIGRAVITY</p>
      </div>
    </div>
  );
};

export default Suggestions;
