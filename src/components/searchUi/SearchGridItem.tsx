"use client";

import React from "react";
import { IPost } from "../../types/interface";

interface SearchGridItemProps {
  post: IPost;
  isBig?: boolean;
  onClick?: () => void;
}

const SearchGridItem: React.FC<SearchGridItemProps> = ({ post, isBig, onClick }) => {
  const FILE_URL = "https://instagram-api.softclub.tj/images/";
  
  const isVideo = post.images?.[0]?.toLowerCase().endsWith(".mp4") || post.images?.[0]?.toLowerCase().endsWith(".mov");
  const isCarousel = post.images && post.images.length > 1;

  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer overflow-hidden bg-gray-100 ${isBig ? "aspect-auto h-full" : "aspect-square"} rounded-[20px] transition-all duration-300`}
    >
      {/* Media Content */}
      <div className="w-full h-full">
        {post.images?.[0] ? (
          isVideo ? (
            <video 
              src={`${FILE_URL}${post.images[0]}`} 
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
              loop
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.style.display = 'none';
              }}
            />
          ) : (
            <img 
              src={`${FILE_URL}${post.images[0]}`} 
              alt={post.title || ""} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg";
              }}
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-[#fafafa] gap-2">
            <svg color="#dbdbdb" fill="#dbdbdb" height="32" role="img" viewBox="0 0 48 48" width="32">
              <path d="M41 10c-2.2-2.1-4.8-3.5-7.7-4.2s-5.9-.5-8.7.6c-2.8 1.1-5.2 2.9-7.1 5.3s-3.1 5.3-3.5 8.3c-.4 3 .1 6 .1 6s-.5-3-.1-6c.4-3 1.6-5.9 3.5-8.3s4.3-4.2 7.1-5.3c2.8-1.1 5.8-1.3 8.7-.6s5.5 2.1 7.7 4.2c2.2 2.1 3.5 4.8 4.2 7.7s.5 5.9-.6 8.7c-1.1 2.8-2.9 5.2-5.3 7.1s-5.3 3.1-8.3 3.5c-3 .4-6-.1-6-.1s3 .5 6 .1c3-.4 5.9-1.6 8.3-3.5s4.2-4.3 5.3-7.1c1.1-2.8 1.3-5.8.6-8.7s-2.1-5.5-4.2-7.7z"></path>
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-tight">No Preview</span>
          </div>
        )}
      </div>

      {/* Media Type Icons (Top Right) */}
      <div className="absolute top-4 right-4 text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.5)] z-10 pointer-events-none">
        {!isVideo && (
          <img src="/photo.svg" className="w-[18px] h-[18px] brightness-0 invert" alt="Image" />
        )}
        {isVideo && (
          <img src="/video.svg" className="w-[18px] h-[18px] brightness-0 invert" alt="Video" />
        )}
      </div>

      {/* Hover Overlay - Centered Like/Comment counts */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-7 text-white font-bold z-20 pointer-events-none">
        <div className="flex items-center gap-2 drop-shadow-md">
          <svg fill="currentColor" height="20" viewBox="0 0 48 48" width="20">
            <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
          </svg>
          <span className="text-lg">{post.postLikeCount >= 1000 ? `${(post.postLikeCount / 1000).toFixed(1)}K` : post.postLikeCount}</span>
        </div>
        <div className="flex items-center gap-2 drop-shadow-md">
          <svg fill="currentColor" height="20" viewBox="0 0 48 48" width="20">
            <path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7.8-2.8 11l1.4 5.7-5.7-1.4c-3.2 1.8-7 2.8-11 2.8-13 0-23.5-10.5-23.5-23.5S11 .5 24 .5s23.5 10.5 23.5 23.5z" fillRule="evenodd"></path>
          </svg>
          <span className="text-lg">{post.commentCount >= 1000 ? `${(post.commentCount / 1000).toFixed(1)}K` : post.commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchGridItem;
