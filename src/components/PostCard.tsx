"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IPost } from "../types/interface";
import { useAddCommentMutation, useDeleteCommentMutation, useLikePostMutation, useAddPostFavoriteMutation } from "../api/post";
import { 
  useAddFollowingRelationShipMutation, 
  useDeleteFollowingRelationShipMutation, 
  useIsFollowingUserQuery,
  useGetMyProfileQuery
} from "../api/userProfile";
import { ShareModal } from "./ShareModal";


const FILE_URL = "https://instagram-api.softclub.tj/images/";

const PostCard = ({ post }: { post: IPost }) => {
  const t = useTranslations("Post");
  const locale = useLocale();
  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [addPostFavorite] = useAddPostFavoriteMutation();
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

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

  const handleLike = async () => {
    try {
      await likePost(post.postId).unwrap();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

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
    if (window.confirm(t("deleteCommentConfirm"))) {
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
            onError={(e) => {
               const target = e.target as HTMLVideoElement;
               target.style.display = 'none';
            }}
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
        className="w-full aspect-square object-cover rounded-lg border border-gray-100 dark:border-gray-800"
        onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop";
            e.currentTarget.className = "w-full aspect-square object-cover rounded-lg border border-gray-100 dark:border-gray-800 opacity-50 grayscale";
        }}
      />
    );
  };

  return (
    <div className="bg-transparent mb-16 w-full max-w-[470px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.userId}`} className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 cursor-pointer">
            <div className="w-full h-full rounded-full border border-white overflow-hidden bg-gray-100 dark:bg-gray-800">
              {post.userImage ? (
                <img 
                    src={`${FILE_URL}${post.userImage}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg";
                    }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] uppercase">
                  {post.userName?.[0] || "U"}
                </div>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-1.5 min-w-0">
            <Link 
              href={`/profile/${post.userId || post.userName}`} 
              className="text-[14px] font-bold text-[#262626] dark:text-gray-200 hover:opacity-60 cursor-pointer truncate max-w-[150px]"
            >
              {post.userName || "user_" + (post.userId?.slice(0, 5) || "unknown")}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-xs shrink-0">• 1w</span>
            
            {/* Follow Button */}
            <PostFollowButton userId={post.userId} userName={post.userName} />
          </div>
        </div>
        <button className="text-[#262626] dark:text-gray-200 hover:opacity-50">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
        </button>
      </div>

      {/* Media Content */}
      <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
        {post.images?.[0] ? renderMedia(post.images[0]) : <div className="aspect-square bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-300">{t("noContent")}</div>}
      </div>

      {/* Footer Info */}
      <div className="py-3 px-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`hover:scale-110 active:scale-90 transition-transform ${post.postLike ? 'text-[#ed4956]' : 'text-[#262626] dark:text-gray-200'}`}>
              {post.postLike ? (
                <svg fill="currentColor" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 5.8 2 8.8 8 14.3l16 13 16-13c6-5.5 8-8.5 8-14.3 0-8-6-14.5-13.4-14.5z"></path></svg>
              ) : (
                <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              )}
            </button>
            <button 
              onClick={() => commentInputRef.current?.focus()}
              className="text-[#262626] dark:text-gray-200 hover:scale-110 transition-transform"
            >
              <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
            </button>
            <button onClick={() => setShowShareModal(true)} className="text-[#262626] dark:text-gray-200 hover:scale-110 transition-transform">
              <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeWidth="2"></polygon></svg>
            </button>
          </div>
          <button onClick={() => addPostFavorite(post.postId)} className="hover:scale-110 transition-transform text-[#262626] dark:text-gray-200">
             {post.postFavorite ? (
                <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20 22L12 14.37 4 22V4h16z"></path></svg>
             ) : (
                <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M20 22L12 14.37 4 22V4h16z"></path></svg>
             )}
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-[#262626] dark:text-gray-200">{post.postLikeCount.toLocaleString()} {t("likes")}</p>
          <div className="text-[14px]">
            <Link href={`/profile/${post.userId}`} className="font-bold mr-2 text-[#262626] dark:text-gray-200 hover:opacity-60">
              {post.userName || "Instagram User"}
            </Link>
            <span className="text-[#262626] dark:text-gray-200 leading-relaxed">{post.content || post.title}</span>
          </div>
          
          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="mt-3 space-y-2">
              {(showAllComments ? post.comments : post.comments.slice(-3)).map((c) => (
                <div key={c.postCommentId} className="group flex items-start justify-between text-[14px]">
                  <div className="flex items-start gap-2 flex-1">
                    <Link href={`/profile/${c.userId}`} className="shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 dark:border-gray-800">
                        {c.userImage ? (
                          <img 
                            src={`${FILE_URL}${c.userImage}`} 
                            className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg";
                          }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] dark:bg-gray-900 uppercase">
                            {c.userName?.[0] || "U"}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <p className="text-[#262626] dark:text-gray-200 leading-tight">
                        <Link href={`/profile/${c.userId}`} className="font-bold mr-2 hover:opacity-60">{c.userName || "User"}</Link>
                        {c.comment}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(c.dateCommented).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteComment(c.postCommentId)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all ml-2"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                  </button>
                </div>
              ))}
              {post.comments.length > 3 && (
                <button 
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="text-gray-500 text-xs font-medium hover:text-black dark:hover:text-white transition-colors mt-1"
                >
                  {showAllComments ? t("showLess") : t("viewAllComments", { count: post.comments.length })}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="mt-4 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 dark:border-white/5 pt-3">
          <input 
            ref={commentInputRef}
            type="text" 
            placeholder={t("addComment")}
            className="flex-1 bg-transparent text-sm outline-none text-[#262626] dark:text-gray-200"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button 
            disabled={!commentText.trim()}
            className="text-[#0095f6] font-bold text-sm disabled:opacity-30 transition-opacity"
          >
            {t("post")}
          </button>
        </form>
      </div>

      {showShareModal && (
        <ShareModal 
          postId={post.postId}
          onClose={() => setShowShareModal(false)} 
          postUrl={typeof window !== 'undefined' ? `${window.location.origin}/${locale}/post/${post.postId}` : ""} 
        />
      )}
    </div>
  );
};

const PostFollowButton = ({ userId, userName }: { userId: string; userName: string }) => {
  const t = useTranslations("Post");
  const { data: myProfile } = useGetMyProfileQuery();
  const { data: isFollowingData } = useIsFollowingUserQuery({ followingUserId: userId });
  const [followUser] = useAddFollowingRelationShipMutation();
  const [unfollowUser] = useDeleteFollowingRelationShipMutation();
  
  const isMe = ((myProfile?.data?.id || myProfile?.data?.userId) && userId && String(myProfile?.data?.id || myProfile?.data?.userId) === String(userId)) ||
               (myProfile?.data?.userName && userName && myProfile.data.userName === userName);
  const isFollowing = isFollowingData?.data ?? false;

  if (isMe || isFollowing) return null;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await followUser({ followingUserId: userId }).unwrap();
    } catch (err) {
      console.error("Follow from post failed", err);
    }
  };

  return (
    <div className="flex items-center gap-1.5 ml-1">
        <span className="text-gray-500 dark:text-gray-400 text-xs">•</span>
        <button 
            onClick={handleToggle}
            className="text-[14px] font-bold text-[#0095f6] hover:text-[#00376b]"
        >
            {t("follow")}
        </button>
    </div>
  );
};

export default PostCard;
