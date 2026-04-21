"use client";

import React, { useState, useRef, useEffect } from "react";
import { IPost } from "../types/interface";
import { useLikePostMutation } from "../api/post";

interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [likePost] = useLikePostMutation();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const FILE_URL = "https://instagram-api.softclub.tj/images/";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.7 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      // Briefly show the center icon
      setShowCenterIcon(true);
      setTimeout(() => setShowCenterIcon(false), 500);
    }
  };

  const renderMedia = (filename: string) => {
    const isVideo = filename.toLowerCase().endsWith(".mp4") || filename.toLowerCase().endsWith(".mov");
    
    if (isVideo) {
      return (
        <div className="relative group cursor-pointer overflow-hidden rounded-lg bg-black aspect-square flex items-center justify-center" onClick={togglePlay}>
          <video 
            ref={videoRef}
            src={`${FILE_URL}${filename}`} 
            className="w-full h-full object-cover" 
            muted={isMuted}
            loop 
            playsInline
          />
          
          {/* Mute Button Overlay (Bottom Right) */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full text-white hover:bg-black transition-all z-10 shadow-lg"
          >
            {isMuted ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1.39 3.42a.999.999 0 0 0 0 1.41l3.59 3.59c-.4.44-.67 1-.78 1.58H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.21l6.09 6.09A1.5 1.5 0 0 0 13 23.06v-5.24l5.29 5.29a.999.999 0 1 0 1.41-1.41L2.8 3.42a.999.999 0 0 0-1.41 0zM11 19.41l-4.66-4.66H2v-4h2.21l1.45-1.45L11 14.65v4.76zm2-10.76l-2-2V.94A1.5 1.5 0 0 1 13.79.06l6.09 6.09c.4.4.62.94.62 1.5v2.85l-2-2V7.65l-4.66-4.66v5.66zm6.8 6.8l-1.44-1.44c.4-.95.64-2.01.64-3.12 0-3.12-1.86-5.8-4.5-6.97v-2.1c3.76 1.28 6.5 4.85 6.5 9.07 0 1.63-.49 3.12-1.2 4.56z"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13.79.06A1.5 1.5 0 0 0 11 .94v22.12a1.5 1.5 0 0 0 2.79.88l6.09-6.09c.4-.4.62-.94.62-1.5V7.65c0-.56-.22-1.1-.62-1.5L13.79.06zM13 2.35l4.66 4.66v7.98L13 19.65V2.35zM1 9v6a1 1 0 0 0 1 1h3.21l6.09 6.09A1.5 1.5 0 0 0 13 21.06V2.94A1.5 1.5 0 0 0 10.3.06L4.21 6.15H2a1 1 0 0 0-1 1zM11 19.41l-4.66-4.66H2v-4h4.34L11 6.09v13.32z"/></svg>
            )}
          </button>

          {/* Center Feedback Animation */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showCenterIcon ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white/90 p-4 rounded-full shadow-2xl scale-110">
               {isPlaying ? 
                <svg fill="#262626" width="30" height="30" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> : 
                <svg fill="#262626" width="30" height="30" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
               }
            </div>
          </div>

          {/* Static Play button when paused */}
          {!isPlaying && !showCenterIcon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
               <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
                <svg fill="white" width="40" height="40" viewBox="0 0 24 24" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
               </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <img 
        src={`${FILE_URL}${filename}`} 
        className="w-full aspect-square object-cover rounded-lg border border-gray-100"
        onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop")}
      />
    );
  };

  return (
    <div className="bg-transparent mb-16 w-full">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
            <div className="w-full h-full rounded-full border border-white overflow-hidden bg-gray-100">
              {post.userImage ? (
                <img src={`${FILE_URL}${post.userImage}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                  {post.userName?.[0]}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-[13px] font-semibold text-black hover:opacity-60 cursor-pointer">{post.userName}</span>
            <span className="text-gray-400 text-xs">• 1w</span>
          </div>
        </div>
        <button className="text-[#262626] hover:opacity-50">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
        </button>
      </div>

      {/* Media Content */}
      {post.images?.[0] ? renderMedia(post.images[0]) : <div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-300">No Content</div>}

      {/* Footer Info */}
      <div className="py-3 px-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-[#262626]">
            <button onClick={() => likePost(post.postId)} className="hover:opacity-60 transform active:scale-125 transition-all">
              {post.postLike ? (
                <svg color="#ff3040" fill="#ff3040" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
              ) : (
                <svg color="black" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
              )}
            </button>
            <svg color="black" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22l-1.344-4.992z"></path></svg>
            <svg color="black" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="3" x2="9.218" y2="10.083"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.083 11.698 20.334"></polygon></svg>
          </div>
          <svg color="black" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold">{post.postLikeCount.toLocaleString()} likes</p>
          <div className="text-[14px]">
            <span className="font-bold mr-2 text-black">{post.userName}</span>
            <span className="text-gray-900 leading-relaxed">{post.content || post.title}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2 hover:underline cursor-pointer">View all comments</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;