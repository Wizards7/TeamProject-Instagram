"use client";

import React from "react";
import { useGetPostsQuery } from "@/src/api/post";
import { useGetStoriesQuery } from "@/src/api/story";
import PostCard from "@/src/components/PostCard";
import LoadingUi from "@/src/components/LoadingUi";
import Suggestions from "@/src/components/Suggestions";

export default function Home() {
  const { data: postData, isLoading: postLoading } = useGetPostsQuery();
  const { data: storyData } = useGetStoriesQuery();

  if (postLoading) return <LoadingUi />;

  const posts = postData?.data || [];
  const FILE_URL = "https://instagram-api.softclub.tj/images/";

  return (
    <div className="flex justify-start max-w-full pl-[20px] pt-4">
      {/* Container that groups feed and suggestions, shifted left */}
      <div className="flex w-full max-w-[1015px]">
        {/* Main Feed Section */}
        <div className="w-full lg:w-[630px]">
          
          {/* Stories - No BG, only border bottom */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 mb-2 border-b border-gray-200">
            {storyData?.map((story) => (
              <div key={story.storyId} className="flex flex-col items-center gap-2 min-w-[66px] cursor-pointer group">
                <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 transition-transform active:scale-95">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
                    <img 
                      src={story.userImage ? `${FILE_URL}${story.userImage}` : "/image.webp"} 
                      alt="Story" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[12px] text-black truncate w-[66px] text-center font-medium">
                  {story.userName}
                </span>
              </div>
            ))}
          </div>

          {/* Posts list */}
          <div className="flex flex-col w-full">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar - Positioned closer to the feed */}
        <div className="ml-8 xl:ml-12">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
