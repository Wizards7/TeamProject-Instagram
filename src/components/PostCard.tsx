"use client";

import React from "react";
import { IPost } from "../types/interface";
import { useLikePostMutation } from "../api/post";

interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [likePost] = useLikePostMutation();
  const FILE_URL = "https://instagram-api.softclub.tj/images/";

  const renderMedia = (filename: string) => {
    const isVideo = filename.toLowerCase().endsWith(".mp4") || filename.toLowerCase().endsWith(".mov");
    if (isVideo) {
      return (
        <video 
          src={`${FILE_URL}${filename}`} 
          className="w-full aspect-square object-cover" 
          controls muted loop playsInline
        />
      );
    }
    return (
      <img 
        src={`${FILE_URL}${filename}`} 
        alt="" 
        className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop")}
      />
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl mb-8 overflow-hidden w-full mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100">
              {post.userImage ? (
                <img src={`${FILE_URL}${post.userImage}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                  {post.userName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#262626] leading-none">{post.userName}</span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">Original Audio</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-black">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
        </button>
      </div>

      <div className="bg-black relative overflow-hidden">
        {post.images?.[0] ? renderMedia(post.images[0]) : <div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-300">No Content</div>}
      </div>

      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => likePost(post.postId)}
              className="transform active:scale-125 transition-transform duration-200"
            >
              {post.postLike ? (
                <svg color="#FF3040" fill="#FF3040" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path>
                </svg>
              ) : (
                <svg color="#262626" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2">
                  <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path>
                </svg>
              )}
            </button>
            <button className="hover:text-gray-500 transition-colors">
              <svg color="#262626" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22l-1.344-4.992z"></path></svg>
            </button>
            <button className="hover:text-gray-500 transition-colors">
              <svg color="#262626" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="3" x2="9.218" y2="10.083"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.083 11.698 20.334"></polygon></svg>
            </button>
          </div>
          <button className="hover:text-gray-500 transition-colors">
            <svg color="#262626" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
          </button>
        </div>
        <p className="text-sm font-bold text-[#262626] mb-2">{post.postLikeCount.toLocaleString()} likes</p>
        <div className="text-sm leading-relaxed">
          <span className="font-bold mr-2 text-[#262626]">{post.userName}</span>
          <span className="text-[#333]">{post.content || post.title}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide uppercase">
          {new Date(post.datePublished).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;