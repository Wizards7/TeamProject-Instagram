"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useGetStoriesQuery, useGetMyStoriesQuery } from "../api/story";
import { useGetMyProfileQuery, useGetFollowingQuery } from "../api/userProfile";
import { useGetPostsQuery } from "../api/post";
import { IFollower, IStory } from "../types/interface";
import { Link } from "../i18n/navigation";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const isExpired = (dateStr: string) => {
  const storyDate = new Date(dateStr);
  const now = new Date();
  const diffInHours = (now.getTime() - storyDate.getTime()) / (1000 * 60 * 60);
  return diffInHours >= 24;
};

import StoryViewer from "./StoryViewer";

const StoryBar = () => {
  const locale = useLocale();
  const { data: storyData, isLoading: storiesLoading } = useGetStoriesQuery();
  const { data: myStoriesData } = useGetMyStoriesQuery();
  const { data: myProfileData } = useGetMyProfileQuery();
  const { data: postData } = useGetPostsQuery();

  const posts = postData?.data || [];
  const myProfile = myProfileData?.data;
  const myUserName = typeof window !== 'undefined' ? localStorage.getItem("userName") : "";

  // Same Intelligent ID discovery as page.tsx
  const myId = myProfile?.id || 
               myProfile?.userId || 
               posts.find(p => p.userName === myUserName)?.userId;

  const { data: followingData, isLoading: followingLoading } = useGetFollowingQuery(
    { userId: myId || "" },
    { skip: !myId }
  );

  const followingList = followingData?.data || [];
  const followedIds = new Set(followingList.map((f: IFollower) => String(f.id)));

  const [activeUserStories, setActiveUserStories] = useState<IStory[] | null>(null);
  const [viewedUsers, setViewedUsers] = useState<Set<string>>(new Set());

  const processStoriesData = (data: any): IStory[] => {
    if (!data) return [];
    const actualData = data.data || data;
    if (!actualData) return [];

    if (actualData.userId && Array.isArray(actualData.stories)) {
      return actualData.stories.map((s: any) => ({
        ...s,
        userId: String(actualData.userId || s.userId || ""),
        userName: actualData.userName || s.userName,
        userAvatar: actualData.userImage || s.userAvatar
      }));
    }

    if (Array.isArray(actualData)) {
      if (actualData.length > 0 && actualData[0].fileName) {
        return actualData.map((s: any) => ({ 
          ...s, 
          userId: String(s.userId || s.userName || ""),
          userName: s.userName || "user"
        }));
      }

      return actualData.flatMap((userObj: any) => {
        if (userObj.stories && Array.isArray(userObj.stories)) {
          return userObj.stories.map((s: any) => ({
            ...s,
            userId: String(userObj.userId || s.userId || ""),
            userName: userObj.userName || s.userName,
            userAvatar: userObj.userImage || s.userAvatar
          }));
        }
        return [];
      });
    }
    return [];
  };

  const stories = processStoriesData(storyData?.data);
  const myStories = processStoriesData(myStoriesData?.data);

  const handleOpenStories = (userId: string, userStories: IStory[]) => {
    setActiveUserStories(userStories);
    setViewedUsers(prev => new Set(prev).add(userId));
  };

  // Group stories by userId
  const groupedStories = stories.reduce((acc: Record<string, IStory[]>, story) => {
    const key = String(story.userId || story.userName || "");
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(story);
    return acc;
  }, {});

  const usersWithStories = Object.keys(groupedStories).map(userId => ({
    userId,
    stories: groupedStories[userId],
    user: groupedStories[userId][0]
  }));

  if (storiesLoading || (followingLoading && myId)) {
    return (
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 mb-2 border-b border-gray-200">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 min-w-[66px] animate-pulse">
            <div className="w-[66px] h-[66px] rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="w-12 h-2 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 mb-2 border-b border-gray-200">
        {/* My Story */}
        <div 
          onClick={() => myStories.length > 0 && handleOpenStories(myProfile?.id || "me", myStories)}
          className="flex flex-col items-center gap-2 min-w-[66px] cursor-pointer group"
        >
          <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${
            myStories.length > 0 
              ? viewedUsers.has(myProfile?.id || "me") 
                ? 'border border-gray-300' 
                : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' 
              : 'border border-gray-200'
          } transition-transform active:scale-95 relative`}>
            <div className="w-full h-full rounded-full border-2 border-white dark:border-[#121212] overflow-hidden bg-gray-100 dark:bg-gray-800">
              {myProfile?.image ? (
                <img src={`${FILE_URL}${myProfile.image}`} alt="My Story" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400 font-bold uppercase">
                  {myProfile?.userName?.[0]}
                </div>
              )}
            </div>
            {myStories.length === 0 && (
              <div className="absolute bottom-0 right-0 bg-[#0095f6] rounded-full border-2 border-white dark:border-[#121212] p-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-[12px] text-black dark:text-white truncate w-[66px] text-center font-medium">
            Ваша история
          </span>
        </div>

        {/* Others' Stories */}
        {usersWithStories.map(({ userId, stories, user }) => (
          <div 
            key={userId} 
            onClick={() => handleOpenStories(userId, stories)}
            className="flex flex-col items-center gap-2 min-w-[66px] cursor-pointer group"
          >
            <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${
              viewedUsers.has(userId) 
                ? 'border border-gray-300 dark:border-gray-700' 
                : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
            } transition-transform active:scale-95`}>
              <div className="w-full h-full rounded-full border-2 border-white dark:border-[#121212] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={user.userAvatar ? `${FILE_URL}${user.userAvatar}` : "/image.webp"} 
                  alt={user.userName || "User"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg";
                  }}
                />
              </div>
            </div>
            <span className="text-[12px] text-black dark:text-white truncate w-[66px] text-center font-medium">
              {user.userName || "user"}
            </span>
          </div>
        ))}
      </div>

      {activeUserStories && (
        <StoryViewer 
          stories={activeUserStories} 
          onClose={() => setActiveUserStories(null)} 
        />
      )}
    </>
  );
};

export default StoryBar;
