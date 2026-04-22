"use client";

import React, { useState } from "react";
import { useGetPostsQuery } from "../../api/post";
import LoadingUi from "../LoadingUi";
import SearchGridItem from "./SearchGridItem";
import PostModal from "./PostModal";
import { IPost } from "../../types/interface";

const SearchUi = () => {
  const { data: postData, isLoading } = useGetPostsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  if (isLoading) return <LoadingUi />;

  const posts = postData?.data || [];

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Find the live selected post from the cache to ensure real-time updates (like likes) are reflected
  const liveSelectedPost = posts.find(p => p.postId === selectedPostId);

  /**
   * Instagram Grid Class Logic:
   * Repeating logic for Big (2x2) vs Small items.
   */
  const getGridClass = (index: number) => {
    const mod = index % 10;
    if (mod === 2) return "col-span-2 row-span-2"; // Big item on the right
    if (mod === 7) return "col-span-2 row-span-2"; // Big item on the left
    return "col-span-1 row-span-1";
  };

  return (
    <div className="w-full max-w-[935px] mx-auto pb-12">
      {/* Search Bar - Instagram Style */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md py-4 mb-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#8e8e8e]">
            <svg aria-label="Search" color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
              <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#efefef] border-none rounded-lg py-2.5 pl-11 pr-4 text-[16px] focus:ring-0 placeholder:text-[#8e8e8e] transition-all"
          />
        </div>
      </div>

      {/* Explore Grid - Authentic Instagram Gaps */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-3 grid-flow-dense gap-[3px] md:gap-[28px] auto-rows-[minmax(123px,_1fr)] md:auto-rows-[300px]">
          {filteredPosts.map((post, index) => {
            const isBig = index % 10 === 2 || index % 10 === 7;
            return (
              <div 
                key={post.postId} 
                className={`${getGridClass(index)} h-full w-full`}
              >
                <SearchGridItem 
                  post={post} 
                  isBig={isBig} 
                  onClick={() => setSelectedPostId(post.postId)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-[#8e8e8e]">
          <svg aria-label="Search" className="mb-4" color="#8e8e8e" fill="#8e8e8e" height="62" role="img" viewBox="0 0 96 96" width="62">
            <path d="M89.3 84.1L64.2 59c4.2-5.4 6.7-12.1 6.7-19.4C70.9 22.4 55 6.5 35.5 6.5S0 22.4 0 41.9c0 19.5 15.9 35.4 35.4 35.4 7.3 0 14-2.5 19.4-6.7l25.1 25.1c.7.7 1.6 1.1 2.6 1.1s1.9-.4 2.6-1.1c1.6-1.4 1.6-3.8.2-5.2zM35.4 70.9C19.4 70.9 6.5 58 6.5 41.9S19.4 13 35.4 13s28.9 12.9 28.9 28.9-12.9 29-28.9 29z"></path>
          </svg>
          <p className="text-xl font-semibold">No results found.</p>
        </div>
      )}
      {/* Post Modal Overlay */}
      {liveSelectedPost && (
        <PostModal 
          post={liveSelectedPost} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}
    </div>
  );
};

export default SearchUi;
