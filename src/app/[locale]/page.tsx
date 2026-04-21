"use client";

import React from "react";
import { useGetPostsQuery } from "@/src/api/post";
import { useGetStoriesQuery } from "@/src/api/story";
import PostCard from "@/src/components/PostCard";
import LoadingUi from "@/src/components/LoadingUi";

export default function Home() {
  const { data: postData, isLoading: postLoading } = useGetPostsQuery();
  const { data: storyData } = useGetStoriesQuery();

  if (postLoading) return <LoadingUi />;

  const posts = postData?.data || [];
  const FILE_URL = "https://instagram-api.softclub.tj/images/";

  return (
    <div className="w-full max-w-[800px] mx-auto pb-20 pt-4">
      {/* Stories */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 flex gap-6 overflow-x-auto no-scrollbar shadow-sm">
        {storyData?.map((story) => (
          <div key={story.storyId} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
            <div className="w-[72px] h-[72px] rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-active:scale-95 transition-transform duration-200">
              <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-gray-100 shadow-inner">
                <img 
                  src={story.userImage ? `${FILE_URL}${story.userImage}` : "/image.webp"} 
                  alt="Story" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-[#262626] font-medium truncate w-[72px] text-center">
              {story.userName}
            </span>
          </div>
        ))}
      </div>

      {/* Feed Area */}
      <div className="flex flex-col items-center">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
