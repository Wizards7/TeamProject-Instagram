"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useGetPostsQuery } from "@/src/api/post";
import PostCard from "@/src/components/PostCard";
import LoadingUi from "@/src/components/LoadingUi";
import Suggestions from "@/src/components/Suggestions";
import StoryBar from "@/src/components/StoryBar";
import {
  useGetFollowingQuery,
  useGetMyProfileQuery,
} from "@/src/api/userProfile";
import { IFollower } from "@/src/types/interface";

export default function Home() {
  const locale = useLocale();
  const { data: myProfile, isLoading: myProfileLoading } =
    useGetMyProfileQuery();
  const { data: postData, isLoading: postLoading } = useGetPostsQuery();

  const posts = postData?.data || [];
  const myUserName = myProfile?.data?.userName;

  // Intelligent ID discovery
  const myId =
    myProfile?.data?.id ||
    myProfile?.data?.userId ||
    posts.find((p) => p.userName === myUserName)?.userId;

  const { data: followingData, isLoading: followingLoading } =
    useGetFollowingQuery({ userId: myId || "" }, { skip: !myId });

  if (postLoading || myProfileLoading || (followingLoading && myId)) {
    return <LoadingUi />;
  }

  const followingList = followingData?.data || [];
  const followedIds = new Set(
    followingList.map((f: IFollower) => String(f.id)),
  );

  const filteredPosts = posts.filter((post) => {
    const pUserId = String(post.userId);
    return followedIds.has(pUserId) || (myId && String(myId) === pUserId);
  });

  return (
    <div className="w-full min-h-screen bg-background text-foreground pl-0 pt-8">
      <div className="flex w-full max-w-[1015px]">
        {/* Main Feed Section */}
        <div className="w-full lg:w-[630px] shrink-0">
          <div className="mb-6">
            <StoryBar />
          </div>

          {/* Posts list */}
          <div className="flex flex-col w-full gap-4 pb-20">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 mb-4 rounded-full border-2 border-gray-300 dark:border-gray-800 flex items-center justify-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  No Posts Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Follow some users to see their posts here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Suggestions */}
        <div className="hidden lg:block ml-[64px] w-[319px]">
          <div className="sticky top-20">
            <Suggestions />
          </div>
        </div>
      </div>
    </div>
  );
}
