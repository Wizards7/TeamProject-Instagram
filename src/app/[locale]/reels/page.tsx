"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGetPostsQuery } from "@/src/api/post";
import ReelItem from "@/src/components/ReelItem";
import LoadingUi from "@/src/components/LoadingUi";

const ReelsPage = () => {
  const { data: postData, isLoading } = useGetPostsQuery();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPosition = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollPosition / height);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  if (isLoading) return <LoadingUi />;

  // Filter posts that are videos
  const isVideo = (filename: string) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm");
  };

  const posts = postData?.data || [];
  const reels = posts.filter(post => post.images?.some(img => isVideo(img)));

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] lg:h-[calc(100vh-32px)] overflow-hidden">
      <div 
        ref={containerRef}
        className="h-full w-full max-w-[470px] lg:max-w-none lg:w-auto overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black lg:bg-transparent rounded-lg relative"
      >
        {reels.length > 0 ? (
          reels.map((reel, index) => (
            <ReelItem 
              key={reel.postId} 
              reel={reel} 
              isActive={index === activeIndex} 
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
            <svg aria-label="Reels" color="white" fill="white" height="64" role="img" viewBox="0 0 24 24" width="64" className="mb-4 opacity-20">
              <rect fill="none" height="18" rx="3" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9" x2="9" y1="3" y2="21"></line>
              <path d="M9 12l5.5-3.5v7z" fill="currentColor"></path>
            </svg>
            <p className="text-lg font-bold">No Reels found.</p>
            <p className="text-gray-400 text-sm mt-2">Try checking back later or explore other posts.</p>
          </div>
        )}
      </div>
      
      {/* Navigation Instruction for Desktop */}
      <div className="hidden xl:flex fixed right-12 bottom-12 flex-col items-center gap-2 text-[#8e8e8e] text-[10px] uppercase font-bold tracking-widest">
          <div className="flex flex-col items-center animate-bounce mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 13l5 5 5-5m-10-7l5 5 5-5"/>
            </svg>
          </div>
          <span>Scroll to explore</span>
      </div>
    </div>
  );
};

export default ReelsPage;
