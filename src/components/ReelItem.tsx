"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { IPost } from "../types/interface";
import { useAddCommentMutation, useLikePostMutation, useAddPostFavoriteMutation, useDeleteCommentMutation } from "../api/post";
import { ShareModal } from "./ShareModal";
import { addNotification } from "../utils/notifications";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showCenterIcon, setShowCenterIcon] = useState<"play" | "pause" | null>(null);
  const [showLikeHeart, setShowLikeHeart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTap = useRef<number>(0);

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

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  const handleInteraction = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleDoubleTap(e);
    } else {
      // Single tap detected (with delay to distinguish from double tap)
      const timeoutId = setTimeout(() => {
        if (Date.now() - lastTap.current >= DOUBLE_TAP_DELAY) {
          togglePlay();
        }
      }, DOUBLE_TAP_DELAY);
    }
    lastTap.current = now;
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (!reel.postLike) {
      likePost(reel.postId);
    }
    setShowLikeHeart(true);
    setTimeout(() => setShowLikeHeart(false), 1000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPaused(false);
        setShowCenterIcon("play");
      } else {
        videoRef.current.pause();
        setIsPaused(true);
        setShowCenterIcon("pause");
      }
      setTimeout(() => setShowCenterIcon(null), 500);
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
    <div className="relative h-full w-full bg-black snap-center flex items-center justify-center overflow-hidden" onClick={handleInteraction}>
      
      {/* Container for Video */}
      <div className="relative h-full w-full flex items-center justify-center transition-all duration-500 ease-in-out">
        
        {/* Main Video Area */}
        <div className="relative h-full aspect-[9/16] w-full max-w-[470px] flex items-center justify-center bg-black shadow-2xl">
           {/* Media Content */}
          {fileName ? (
            isVideo ? (
              <video
                ref={videoRef}
                key={reel.postId}
                src={mediaSrc}
                className="h-full w-full object-cover"
                loop
                muted={isMuted}
                playsInline
              />
            ) : (
              <img 
                src={mediaSrc} 
                className="h-full w-full object-cover" 
                alt="Reel content"
              />
            )
          ) : (
            <div className="text-white text-xs opacity-50">Content not available</div>
          )}

          {/* Gradients for UI clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Double-tap Heart Animation */}
          <AnimatePresence>
            {showLikeHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <svg fill="white" height="100" viewBox="0 0 48 48" width="100" className="drop-shadow-2xl">
                  <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 1.4.1 2.6.4 3.9 3.6 11.2 13.6 18.2 22.4 22.7a2.3 2.3 0 002.4 0c8.8-4.5 18.8-11.5 22.4-22.7.3-1.2.4-2.5.4-3.9-.1-8-6.1-14.5-13.4-14.5z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Play/Pause Feedback Icon */}
          <AnimatePresence>
            {showCenterIcon && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              >
                <div className="bg-black/20 backdrop-blur-md p-6 rounded-full border border-white/20">
                    {showCenterIcon === "play" ? (
                      <svg viewBox="0 0 24 24" width="40" height="40" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="40" height="40" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Header - Sound & Camera icons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
             <h2 className="text-white font-bold text-xl drop-shadow-md">Reels</h2>
             <button 
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-black/40 transition-all"
             >
                {isMuted ? (
                  <svg fill="white" height="18" viewBox="0 0 24 24" width="18"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.37.28-.78.52-1.25.68v2.02c1.01-.21 1.94-.65 2.75-1.26L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : (
                  <svg fill="white" height="18" viewBox="0 0 24 24" width="18"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
             </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 pb-8 flex flex-col justify-end select-none pointer-events-none z-20">
            <div className="flex flex-col gap-3 text-white max-w-[85%] pointer-events-auto">
              <div className="flex items-center gap-3 mb-1">
                <Link href={`/profile/${reel.userId}`} className="w-8 h-8 rounded-full border border-white/50 overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-transform">
                  <img src={userImg} alt={reel.userName} className="w-full h-full object-cover" />
                </Link>
                <Link href={`/profile/${reel.userId}`} className="font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer drop-shadow-md">{reel.userName}</Link>
                <button className="text-[12px] bg-white/10 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-lg font-bold hover:bg-white/20 transition-all">Follow</button>
              </div>
              
              <div className="relative">
                 <p className="text-[14px] line-clamp-2 leading-snug drop-shadow-md pr-2">
                   {reel.content || reel.title || "No caption"}
                 </p>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 max-w-fit">
                   <svg aria-label="Audio" height="10" viewBox="0 0 24 24" width="10" fill="white"><path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8z"></path><path d="M14 8.5v5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>
                   <span className="text-[11px] font-medium truncate max-w-[120px]">{reel.userName} · Original audio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right-side Actions */}
          <div className="absolute right-3 bottom-12 flex flex-col items-center gap-6 text-white text-xs z-30 pointer-events-auto">
            {/* Like */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={handleLike}>
              <div className="transform transition-transform active:scale-125 group-hover:scale-110">
                {reel.postLike ? (
                  <svg color="#ff3040" fill="#ff3040" height="28" viewBox="0 0 48 48" width="28"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 1.4.1 2.6.4 3.9 3.6 11.2 13.6 18.2 22.4 22.7a2.3 2.3 0 002.4 0c8.8-4.5 18.8-11.5 22.4-22.7.3-1.2.4-2.5.4-3.9-.1-8-6.1-14.5-13.4-14.5z"></path></svg>
                ) : (
                  <svg color="white" fill="white" height="28" viewBox="0 0 24 24" width="28" className="drop-shadow-lg"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
                )}
              </div>
              <span className="font-bold drop-shadow-md">{reel.postLikeCount.toLocaleString()}</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={(e) => { e.stopPropagation(); setShowComments(true); }}>
              <div className="transform transition-transform group-hover:scale-110 active:scale-90">
                <svg color="white" fill="white" height="28" viewBox="0 0 24 24" width="28" className="drop-shadow-lg"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
              </div>
              <span className="font-bold drop-shadow-md">{reel.commentCount.toLocaleString()}</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }}>
              <div className="transform transition-transform group-hover:scale-110 active:scale-90">
                <svg color="white" fill="white" height="28" viewBox="0 0 24 24" width="28" className="drop-shadow-lg"><line fill="none" stroke="currentColor" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeWidth="2"></polygon></svg>
              </div>
            </div>

            {/* Favorite / Save */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={handleFavorite}>
              <div className="transform transition-transform group-hover:scale-110 active:scale-90">
                 {reel.postFavorite ? (
                  <svg color="white" fill="white" height="28" viewBox="0 0 24 24" width="28" className="drop-shadow-lg"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
                ) : (
                  <svg color="white" fill="none" height="28" viewBox="0 0 24 24" width="28" stroke="currentColor" strokeWidth="2" className="drop-shadow-lg"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
                )}
              </div>
            </div>

            {/* More / Dots */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="transform transition-transform group-hover:scale-110 active:scale-90">
                <svg color="white" fill="white" height="24" viewBox="0 0 24 24" width="24" className="drop-shadow-lg"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
              </div>
            </div>

            {/* Rotating Music Disc */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mt-2 w-8 h-8 rounded-full border-4 border-white/20 overflow-hidden shadow-xl"
            >
              <img 
                src={userImg} 
                alt="audio" 
                className="w-full h-full object-cover" 
                onError={(e) => (e.currentTarget.src = "/image.webp")}
              />
            </motion.div>
          </div>

          {/* Video Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 z-50">
            <motion.div 
              className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Comments Side Panel */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute lg:relative z-[100] bg-white flex flex-col h-full w-full lg:w-[400px] border-l border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg text-black">Comments</span>
                <button onClick={() => setShowComments(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                {reel.comments?.length > 0 ? (
                  reel.comments.map((c) => (
                    <div key={c.postCommentId} className="group flex gap-3 text-black">
                      <Link href={`/profile/${c.userId}`} className="shrink-0">
                        <img 
                          src={c.userImage ? `${FILE_URL}${c.userImage}` : "/image.webp"} 
                          className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm"
                          alt={c.userName}
                          onError={(e) => (e.currentTarget.src = "/image.webp")}
                        />
                      </Link>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Link href={`/profile/${c.userId}`} className="font-bold text-xs hover:underline">{c.userName}</Link>
                            <span className="text-[10px] text-gray-400 font-medium">{new Date(c.dateCommented).toLocaleDateString()}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteComment(c.postCommentId)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                          </button>
                        </div>
                        <p className="text-[13px] leading-tight mt-1">{c.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-black">
                    <svg height="64" viewBox="0 0 24 24" width="64" fill="currentColor"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
                    <p className="font-bold mt-4">No comments yet</p>
                  </div>
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-gray-300 outline-none text-black"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!commentText.trim()} 
                  className="text-[#0095f6] font-bold text-sm disabled:opacity-30"
                >
                  Post
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
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