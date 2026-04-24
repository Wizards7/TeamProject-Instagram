"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { IPost } from "../types/interface";
import { useLikePostMutation, useAddCommentMutation, useAddPostFavoriteMutation, useDeleteCommentMutation } from "../api/post";
import { ShareModal } from "./ShareModal";

interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const locale = useLocale();
  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [addFavorite] = useAddPostFavoriteMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [commentText, setCommentText] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ postId: post.postId, comment: commentText }).unwrap();
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await deleteComment(commentId).unwrap();
      } catch (err) {
        console.error("Failed to delete comment:", err);
      }
    }
  };

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
              <img src="/mute.svg" className="w-[12px] h-[12px] brightness-0 invert" alt="Mute" />
            ) : (
              <img src="/sound.svg" className="w-[12px] h-[12px] brightness-0 invert" alt="Sound" />
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
          <Link href={`/${locale}/profile/${post.userId}`} className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 cursor-pointer">
            <div className="w-full h-full rounded-full border border-white overflow-hidden bg-gray-100">
              {post.userImage ? (
                <img src={`${FILE_URL}${post.userImage}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                  {post.userName?.[0]}
                </div>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-1.5 font-medium">
            <Link href={`/${locale}/profile/${post.userId}`} className="text-[13px] font-semibold text-black hover:opacity-60 cursor-pointer">
              {post.userName}
            </Link>
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
            <button onClick={() => setShowShareModal(true)} className="hover:opacity-60 transition-opacity">
              <svg color="black" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="3" x2="9.218" y2="10.083"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.083 11.698 20.334"></polygon></svg>
            </button>
          </div>
          <button onClick={() => addFavorite(post.postId)} className="hover:opacity-60 transform active:scale-125 transition-all">
            {post.postFavorite ? (
              <svg color="black" fill="black" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
            ) : (
              <svg color="black" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
            )}
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold">{post.postLikeCount.toLocaleString()} likes</p>
          <div className="text-[14px]">
            <Link href={`/${locale}/profile/${post.userId}`} className="font-bold mr-2 text-black hover:opacity-60">
              {post.userName}
            </Link>
            <span className="text-gray-900 leading-relaxed">{post.content || post.title}</span>
          </div>
          
          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="mt-3 space-y-2">
              {(showAllComments ? post.comments : post.comments.slice(-3)).map((c) => (
                <div key={c.postCommentId} className="group flex items-start justify-between text-[14px]">
                  <div className="flex items-start gap-2 flex-1">
                    <Link href={`/${locale}/profile/${c.userId}`} className="shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                        {c.userImage ? (
                          <img src={`${FILE_URL}${c.userImage}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400 bg-gray-50 uppercase">
                            {c.userName?.[0]}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/${locale}/profile/${c.userId}`} className="font-bold mr-2 text-black hover:opacity-60 inline">
                        {c.userName}
                      </Link>
                      <span className="text-gray-800 break-words leading-tight">{c.comment}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteComment(c.postCommentId)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all ml-2 p-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {post.commentCount > 3 && (
            <button 
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-sm text-gray-500 mt-2 hover:opacity-60 transition-opacity font-medium"
            >
              {showAllComments ? "Hide comments" : `View all ${post.commentCount} comments`}
            </button>
          )}
          
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="mt-3 flex items-center border-t border-gray-100 pt-3">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="text-[#0095f6] font-semibold text-sm disabled:opacity-30 hover:text-[#00376b] transition-colors ml-2"
            >
              Post
            </button>
          </form>
        </div>
      </div>
      {showShareModal && (
        <ShareModal 
          postId={post.postId} 
          postUrl={typeof window !== 'undefined' ? `${window.location.origin}/${locale}/post/${post.postId}` : ""} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default PostCard;
