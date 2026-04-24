"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { IPost } from "../types/interface";
import { useAddCommentMutation, useLikePostMutation, useAddPostFavoriteMutation, useDeleteCommentMutation } from "../api/post";
import { ShareModal } from "./ShareModal";
import { addNotification } from "../utils/notifications";

interface ReelItemProps {
  reel: IPost;
  isActive: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ reel, isActive }) => {
  const locale = useLocale();
  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [addFavorite] = useAddPostFavoriteMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const FILE_URL = "https://instagram-api.softclub.tj/images/";
  const fileName = reel.images?.[0] || "";
  const mediaSrc = `${FILE_URL}${fileName}`;
  
  const isVideo = fileName.toLowerCase().endsWith(".mp4") || fileName.toLowerCase().endsWith(".mov") || fileName.toLowerCase().endsWith(".webm");
  const userImg = reel.userImage ? `${FILE_URL}${reel.userImage}` : "/image.webp";

  // Auto-play/pause based on isActive prop
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !isPaused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPaused]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
      setShowCenterIcon(true);
      setTimeout(() => setShowCenterIcon(false), 500);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await likePost(reel.postId).unwrap();
      if (!reel.postLike) {
        addNotification({
          type: "like",
          userId: reel.userId,
          userName: reel.userName,
          userImage: reel.userImage,
          postId: reel.postId,
          postImage: reel.images?.[0],
          content: "liked your reel.",
        });
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    addFavorite(reel.postId);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ postId: reel.postId, comment: commentText }).unwrap();
      addNotification({
        type: "comment",
        userId: reel.userId,
        userName: reel.userName,
        userImage: reel.userImage,
        postId: reel.postId,
        postImage: reel.images?.[0],
        content: `commented on your reel: ${commentText}`,
      });
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await deleteComment(commentId).unwrap();
      } catch (err) {
        console.error("Failed to delete comment", err);
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-black snap-center flex items-center justify-center overflow-hidden" onClick={togglePlay}>
      
      {/* Container for Video + Comments side-by-side on PC */}
      <div className="relative h-full flex items-center justify-center transition-all duration-500 ease-in-out">
        
        {/* Main Video Area */}
        <div className="relative h-full aspect-[9/16] min-w-[300px] max-w-[470px] flex items-center justify-center bg-black">
           {/* Media Content */}
          {fileName ? (
            isVideo ? (
              <video
                ref={videoRef}
                key={reel.postId}
                src={mediaSrc}
                className="h-full w-full object-cover rounded-sm"
                loop
                muted={isMuted}
                playsInline
              />
            ) : (
              <img 
                src={mediaSrc} 
                className="h-full w-full object-cover rounded-sm" 
                alt="Reel content"
              />
            )
          ) : (
            <div className="text-white text-xs opacity-50">Content not available</div>
          )}

          {/* Sound Toggle (Top Right) */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-all z-30"
          >
            {isMuted ? (
              <img src="/mute.svg" className="w-[14px] h-[14px] brightness-0 invert" alt="Mute" />
            ) : (
              <img src="/sound.svg" className="w-[14px] h-[14px] brightness-0 invert" alt="Sound" />
            )}
          </button>

          {/* Center Feedback Icon */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-10 ${showCenterIcon ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-full border border-white/30">
                {isPaused ? 
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : 
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M8 5v14l11-7z"/></svg>
                }
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 pb-6 select-none pointer-events-none">
            <div className="flex flex-col gap-3 text-white max-w-[85%] pointer-events-auto">
              <div className="flex items-center gap-3">
                <Link href={`/${locale}/profile/${reel.userId}`} className="w-8 h-8 rounded-full border border-white/50 overflow-hidden cursor-pointer">
                  <img src={userImg} alt={reel.userName} className="w-full h-full object-cover" />
                </Link>
                <Link href={`/${locale}/profile/${reel.userId}`} className="font-bold text-sm hover:underline cursor-pointer">{reel.userName}</Link>
                <button className="text-[12px] border border-white/50 px-3 py-1 rounded-lg font-bold hover:bg-white/10">Follow</button>
              </div>
              <p className="text-[14px] line-clamp-2 leading-snug">{reel.content || reel.title || "No caption"}</p>
              <div className="flex items-center gap-2 text-[12px] opacity-80">
                <svg aria-label="Audio" height="12" viewBox="0 0 24 24" width="12" fill="white"><path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8z"></path><path d="M14 8.5v5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>
                <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">{reel.userName} · Original audio</span>
              </div>
            </div>
          </div>

          {/* Right-side Actions */}
          <div className="absolute right-2 bottom-6 flex flex-col items-center gap-5 text-white text-xs z-20">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={handleLike}>
              {reel.postLike ? (
                <svg color="#ff3040" fill="#ff3040" height="26" viewBox="0 0 48 48" width="26"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 1.4.1 2.6.4 3.9 3.6 11.2 13.6 18.2 22.4 22.7a2.3 2.3 0 002.4 0c8.8-4.5 18.8-11.5 22.4-22.7.3-1.2.4-2.5.4-3.9-.1-8-6.1-14.5-13.4-14.5z"></path></svg>
              ) : (
                <svg color="white" fill="white" height="26" viewBox="0 0 24 24" width="26"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
              )}
              <span className="font-bold">{reel.postLikeCount}</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}>
              <svg color="white" fill="white" height="26" viewBox="0 0 24 24" width="26"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
              <span className="font-bold">{reel.commentCount}</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}>
              <svg color="white" fill="white" height="26" viewBox="0 0 24 24" width="26"><line fill="none" stroke="currentColor" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeWidth="2"></polygon></svg>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={handleFavorite}>
              {reel.postFavorite ? (
                <svg color="white" fill="white" height="26" viewBox="0 0 24 24" width="26"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
              ) : (
                <svg color="white" fill="none" height="26" viewBox="0 0 24 24" width="26" stroke="currentColor" strokeWidth="2"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
              )}
            </div>
            <div className="mt-2 w-8 h-8 rounded-lg border-2 border-white/50 overflow-hidden animate-spin-slow">
              <img src={userImg} alt="audio" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Comments Side Panel (Desktop) / Bottom Sheet (Mobile) */}
        {showComments && (
          <div 
            className={`
              absolute lg:relative z-[100] bg-white flex flex-col transition-all duration-300
              bottom-0 left-0 right-0 top-[30%] rounded-t-2xl lg:rounded-r-lg lg:rounded-l-none
              lg:w-[350px] lg:h-full lg:max-h-full lg:top-0 border-l border-gray-100
              ${showComments ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 lg:translate-y-0"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3 lg:hidden" />
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              <span className="font-bold text-gray-800">Comments</span>
              <button onClick={() => setShowComments(false)} className="text-gray-500 font-bold hover:text-black transition-colors">✕</button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {reel.comments?.length > 0 ? (
                reel.comments.map((c) => (
                  <div key={c.postCommentId} className="group flex gap-3 animate-fade-in text-gray-900">
                    <Link href={`/${locale}/profile/${c.userId}`} className="cursor-pointer shrink-0">
                      <img 
                        src={c.userImage ? `${FILE_URL}${c.userImage}` : "/image.webp"} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                        alt={c.userName}
                      />
                    </Link>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Link href={`/${locale}/profile/${c.userId}`} className="font-bold text-xs hover:underline cursor-pointer">{c.userName}</Link>
                          <span className="text-[10px] text-gray-400 font-medium">{new Date(c.dateCommented).toLocaleDateString()}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(c.postCommentId)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                        </button>
                      </div>
                      <p className="text-[13px] leading-tight mt-0.5">{c.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400 text-sm">
                  <p className="font-semibold text-gray-800 mb-1">No comments yet</p>
                  <p>Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="w-full bg-[#efefef] border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-gray-300 outline-none text-black"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={!commentText.trim()} 
                className="text-[#0095f6] font-bold text-sm disabled:opacity-30 hover:text-[#00376b] transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
      {showShareModal && (
        <ShareModal 
          postId={reel.postId} 
          postUrl={typeof window !== 'undefined' ? `${window.location.origin}/${locale}/reels/${reel.postId}` : ""} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default ReelItem;