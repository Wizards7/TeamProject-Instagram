"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useGetPostsQuery } from "@/src/api/post";
import PostCard from "@/src/components/PostCard";
import LoadingUi from "@/src/components/LoadingUi";
import Suggestions from "@/src/components/Suggestions";
import StoryBar from "@/src/components/StoryBar";

export default function Home() {
  const locale = useLocale();
  const { data: postData, isLoading: postLoading } = useGetPostsQuery();

  if (postLoading) return <LoadingUi />;

  const posts = postData?.data || [];

  return (
    <div className="flex justify-start max-w-full pl-[20px] pt-4">
      {/* Container that groups feed and suggestions, shifted left */}
      <div className="flex w-full max-w-[1015px]">
        {/* Main Feed Section */}
        <div className="w-full lg:w-[630px]">
          
          <StoryBar />

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
