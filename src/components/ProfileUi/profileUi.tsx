"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, Link, usePathname } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { IFollower, IPost } from "../../types/interface";
import {
  useGetMyProfileQuery,
  useGetUserProfileByIdQuery,
  useGetMyPostsQuery,
  useGetPostFavoritesQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useIsFollowingUserQuery,
  useAddFollowingRelationShipMutation,
  useDeleteFollowingRelationShipMutation,
} from "../../api/userProfile";
import { useGetPostsQuery, useViewPostMutation, useLikePostMutation, useAddCommentMutation } from "../../api/post";
import { addNotification } from "../../utils/notifications";
import { useCreateChatMutation } from "../../api/chat";
import { FollowModal } from "../FollowModal";
import { logoutUser } from "@/src/utils/token";
import LogoutModal from "../Auth/LogoutModal";
import { motion, AnimatePresence } from "framer-motion";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const isVideoFile = (filename: string) => {
  const videoExtensions = [".mp4", ".mov", ".wmv", ".avi", ".webm", ".mkv"];
  return videoExtensions.some((ext) => filename?.toLowerCase().endsWith(ext));
};

const PostThumbnail: React.FC<{ post: IPost; onClick: () => void }> = ({
  post,
  onClick,
}) => {
  const filename = post.images?.[0];
  return (
    <div
      onClick={onClick}
      className="relative aspect-square cursor-pointer overflow-hidden group bg-gray-100"
    >
      {filename ? (
        isVideoFile(filename) ? (
          <video
            src={`${FILE_URL}${filename}`}
            className="w-full h-full object-cover"
            muted
          />
        ) : (
          <img
            src={`${FILE_URL}${filename}`}
            alt="post"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400")
            }
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
          No image
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
        <span className="flex items-center gap-1.5">
          <svg fill="white" height="18" viewBox="0 0 24 24" width="18">
            <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z" />
          </svg>
          {(post.postLikeCount ?? 0).toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5">
          <svg fill="white" height="18" viewBox="0 0 24 24" width="18">
            <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" />
          </svg>
          {(post.commentCount ?? 0).toLocaleString()}
        </span>
      </div>

      {filename && isVideoFile(filename) && (
        <div className="absolute top-2 right-2">
          <svg fill="white" height="16" viewBox="0 0 24 24" width="16">
            <path d="M5.888 22.5a3.46 3.46 0 01-1.721-.46l-.003-.002a3.451 3.451 0 01-1.72-2.982V4.943a3.445 3.445 0 015.163-2.987l12.226 7.059a3.444 3.444 0 01-.001 5.967l-12.22 7.056a3.462 3.462 0 01-1.724.462z" />
          </svg>
        </div>
      )}
    </div>
  );
};

const PostModal: React.FC<{ post: IPost; onClose: () => void }> = ({
  post,
  onClose,
}) => {
  const filename = post.images?.[0];
  const locale = useLocale();
  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showCenterIcon, setShowCenterIcon] = useState<"play" | "pause" | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ postId: post.postId, comment: commentText }).unwrap();
      addNotification({
        type: "comment",
        userId: post.userId,
        userName: post.userName,
        userImage: post.userImage,
        postId: post.postId,
        postImage: post.images?.[0],
        content: `commented: ${commentText}`,
      });
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white flex flex-col md:flex-row max-w-[1200px] w-full max-h-[90vh] md:max-h-[850px] rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Section */}
        <div 
          className="w-full md:w-[60%] bg-black flex items-center justify-center shrink-0 relative group cursor-pointer overflow-hidden"
          onClick={togglePlay}
        >
          {filename ? (
            isVideoFile(filename) ? (
              <>
                <video
                  ref={videoRef}
                  src={`${FILE_URL}${filename}`}
                  className="max-h-[90vh] w-full object-contain"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
                
                {/* Custom Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute bottom-4 right-4 pointer-events-auto">
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
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div 
                      className="h-full bg-white transition-all duration-100" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Center Feedback Icon */}
                <AnimatePresence>
                  {showCenterIcon && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
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
              </>
            ) : (
              <img
                src={`${FILE_URL}${filename}`}
                alt="post"
                className="max-h-[90vh] w-full object-contain"
              />
            )
          ) : (
            <div className="text-white text-sm">No content</div>
          )}
        </div>

        {/* Interaction Panel */}
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.userId}`} className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                {post.userImage ? (
                  <img
                    src={`${FILE_URL}${post.userImage}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                  </div>
                )}
              </Link>
              <div className="flex flex-col">
                <Link href={`/profile/${post.userId}`} className="text-sm font-bold hover:opacity-70 transition-opacity">{post.userName}</Link>
                <span className="text-[10px] text-gray-500">Original Audio</span>
              </div>
            </div>
            <button className="text-xs font-bold text-[#0095f6] hover:text-[#00376b]">Follow</button>
          </div>

          {/* Comments Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {(post.content || post.title) && (
              <div className="flex items-start gap-3">
                <Link href={`/profile/${post.userId}`} className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {post.userImage ? (
                    <img src={`${FILE_URL}${post.userImage}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                  )}
                </Link>
                <div className="flex flex-col">
                   <p className="text-sm">
                    <Link href={`/profile/${post.userId}`} className="font-bold mr-2 hover:underline">{post.userName}</Link>
                    {post.content || post.title}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase">1w</span>
                </div>
              </div>
            )}

            {post.comments?.map((c) => (
              <div key={c.postCommentId} className="flex items-start gap-3">
                <Link href={`/profile/${c.userId}`} className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {c.userImage ? (
                    <img src={`${FILE_URL}${c.userImage}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                  )}
                </Link>
                <div className="flex flex-col">
                  <p className="text-sm">
                    <Link href={`/profile/${c.userId}`} className="font-bold mr-2 hover:underline">{c.userName}</Link>
                    {c.comment}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-400 uppercase">2d</span>
                    <button className="text-[10px] font-bold text-gray-500">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => likePost(post.postId)} className="hover:opacity-60 transition-opacity">
                  {post.postLike ? (
                    <svg color="#ff3040" fill="#ff3040" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 1.4.1 2.6.4 3.9 3.6 11.2 13.6 18.2 22.4 22.7a2.3 2.3 0 002.4 0c8.8-4.5 18.8-11.5 22.4-22.7.3-1.2.4-2.5.4-3.9-.1-8-6.1-14.5-13.4-14.5z"></path></svg>
                  ) : (
                    <svg color="#262626" fill="#262626" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
                  )}
                </button>
                <button className="hover:opacity-60 transition-opacity">
                  <svg color="#262626" fill="#262626" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
                </button>
                <button className="hover:opacity-60 transition-opacity">
                  <svg color="#262626" fill="#262626" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeWidth="2"></polygon></svg>
                </button>
              </div>
              <button className="hover:opacity-60 transition-opacity">
                <svg color="#262626" fill="#262626" height="24" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeWidth="2"></polygon></svg>
              </button>
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-bold">{(post.postLikeCount ?? 0).toLocaleString()} likes</p>
              <span className="text-[10px] text-gray-400 uppercase mt-1">April 24, 2026</span>
            </div>
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="border-t border-gray-100 p-4 flex items-center gap-3">
             <button type="button" className="text-gray-600">
               <svg aria-label="Emoji" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-7.66 0a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm3.83 7.434a4.4 4.4 0 01-3.667-2.022c.033-.664.156-1.21.35-1.532l.077-.11h6.48l.077.11c.194.321.317.868.35 1.532a4.4 4.4 0 01-3.667 2.022zM12 1.503a10.497 10.497 0 1010.497 10.497A10.503 10.503 0 0012 1.503zm0 18.994a8.497 8.497 0 118.497-8.497 8.507 8.507 0 01-8.497 8.497z"></path></svg>
             </button>
             <input 
              type="text" 
              placeholder="Add a comment..." 
              className="flex-1 text-sm outline-none border-none focus:ring-0"
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
        </div>
      </motion.div>

      {/* Close button (Floating) */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 text-white hover:opacity-70 z-[110]"
      >
        <svg fill="currentColor" height="28" viewBox="0 0 24 24" width="28">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
};

type Tab = "posts" | "reels" | "saved";
const tabs: { key: Tab; label: string }[] = [
  { key: "posts", label: "Posts" },
  { key: "reels", label: "Reels" },
  { key: "saved", label: "Saved" },
];

const EmptyStateForPosts: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center max-w-[400px] mx-auto">
    <div className="w-[62px] h-[62px] mb-4 flex items-center justify-center rounded-full border border-black/80">
      <svg
        aria-label="Camera"
        color="currentColor"
        fill="currentColor"
        height="32"
        role="img"
        viewBox="0 0 24 24"
        width="32"
      >
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
        <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12z" />
      </svg>
    </div>
    <h3 className="text-[32px] font-extrabold mb-2 tracking-tight text-black">
      Share photos
    </h3>
    <p className="text-sm text-black/80 mb-6 leading-tight">
      When you share photos, they will appear on your profile.
    </p>
    <button className="text-[#0095f6] text-sm font-semibold hover:text-[#00376b] transition-colors">
      Share your first photo
    </button>
  </div>
);

const ProfileFooter: React.FC = () => (
  <footer className="mt-24 pb-12 px-4">
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
      {[
        "Meta",
        "About",
        "Blog",
        "Jobs",
        "Help",
        "API",
        "Privacy",
        "Terms",
        "Locations",
        "Instagram Lite",
        "Threads",
        "Contact uploading and non-users",
        "Meta Verified",
      ].map((link) => (
        <a
          key={link}
          href="#"
          className="text-xs text-gray-500 hover:underline"
        >
          {link}
        </a>
      ))}
    </div>
    <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
      <span className="flex items-center gap-1 cursor-pointer">
        English (UK)
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M21 8.5l-9 9-9-9L4.5 7l7.5 7.5L19.5 7z" />
        </svg>
      </span>
      <span>© 2026 Instagram from Meta</span>
    </div>
  </footer>
);

const EmptyStateForReels: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center max-w-[350px] mx-auto">
    <div className="w-[62px] h-[62px] mb-4 flex items-center justify-center rounded-full border-2 border-black">
      <svg
        aria-label="Reels"
        color="black"
        fill="black"
        height="32"
        role="img"
        viewBox="0 0 24 24"
        width="32"
      >
        <rect
          height="18"
          rx="3"
          width="18"
          x="3"
          y="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3 9h18M9 21V9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
    <h3 className="text-3xl font-extrabold mb-3 text-black">No reels yet</h3>
    <p className="text-sm text-gray-600 font-medium">
      Capture and share short, fun videos with your friends.
    </p>
  </div>
);

const EmptyStateForSaved: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center max-w-[350px] mx-auto">
    <div className="w-[62px] h-[62px] mb-4 flex items-center justify-center rounded-full border-2 border-black">
      <svg
        aria-label="Saved"
        color="black"
        fill="black"
        height="32"
        role="img"
        viewBox="0 0 24 24"
        width="32"
      >
        <polygon
          fill="none"
          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
          stroke="currentColor"
          strokeWidth="2"
        ></polygon>
      </svg>
    </div>
    <h3 className="text-3xl font-extrabold mb-3 text-black">
      Save items you like
    </h3>
    <p className="text-sm text-gray-600 font-medium">
      Save posts to see them here later. No one can see what you've saved.
    </p>
  </div>
);

const ProfileUi = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // State for follow modal
  const [followModal, setFollowModal] = useState<{
    type: "followers" | "following";
    open: boolean;
  }>({
    type: "followers",
    open: false,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);

  // --- Dynamic logic start ---
  const isMyProfile = !userId;
  const { data: myProfileData, isLoading: myProfileLoading } =
    useGetMyProfileQuery(undefined, { skip: !isMyProfile });
  const { data: otherProfileData, isLoading: otherProfileLoading } =
    useGetUserProfileByIdQuery(userId || "", { skip: isMyProfile });

  const profile = isMyProfile ? myProfileData?.data : otherProfileData?.data;
  const profileLoading = isMyProfile ? myProfileLoading : otherProfileLoading;

  const { data: myPostsData, isLoading: myPostsLoading } = useGetMyPostsQuery(
    undefined,
    { skip: !isMyProfile },
  );
  const { data: allPostsData, isLoading: allPostsLoading } = useGetPostsQuery(
    undefined,
    { skip: isMyProfile },
  );

  const postsLoading = isMyProfile ? myPostsLoading : allPostsLoading;

  const [addFollow, { isLoading: isFollowingLoading }] =
    useAddFollowingRelationShipMutation();
  const [deleteFollow, { isLoading: isUnfollowingLoading }] =
    useDeleteFollowingRelationShipMutation();
  const profileId = profile?.userId || profile?.id;
  const { data: followStatus } = useIsFollowingUserQuery(
    { followingUserId: profileId || "" },
    { skip: isMyProfile || !profileId },
  );
  
  const [localFollowState, setLocalFollowState] = useState<boolean | null>(null);
  const isFollowing = localFollowState !== null ? localFollowState : (followStatus?.data ?? false);

  useEffect(() => {
    setLocalFollowState(null);
  }, [userId]);

  const [createChat] = useCreateChatMutation();
  const [viewPost] = useViewPostMutation();

  const handleFollow = async () => {
    const targetId = profile?.userId || profile?.id || userId;
    if (!targetId) return;

    const nextState = !isFollowing;
    setLocalFollowState(nextState);

    try {
      if (isFollowing) {
        await deleteFollow({ followingUserId: targetId }).unwrap();
      } else {
        await addFollow({ followingUserId: targetId }).unwrap();
        // Simulation: Notify target user
        addNotification({
          type: "follow",
          userId: profile?.userId || profile?.id || targetId,
          userName: profile?.userName || "User",
          userImage: profile?.image || null,
          content: "started following you.",
        });
      }
    } catch (err: any) {
      setLocalFollowState(isFollowing); // Revert on failure
      console.error("Follow action failed:", {
        error: err,
        status: err?.status,
        data: err?.data,
        targetId
      });
    }
  };

  const handleMessageClick = async () => {
    if (!userId) return;
    try {
      await createChat(userId).unwrap();
      router.push("/messages");
    } catch (error) {
      console.error("Failed to create chat", error);
      router.push("/messages");
    }
  };

  // Helper to handle various response structures
  const extractPosts = (data: any): IPost[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (data?.data?.data && Array.isArray(data.data.data)) return data.data.data;
    return [];
  };

  const myPosts = extractPosts(myPostsData);
  const otherPosts = extractPosts(allPostsData).filter(
    (p) => p.userId === userId,
  );

  // Saved posts – only fetched when the tab is active and it's my profile
  const { data: favData, isLoading: favLoading } = useGetPostFavoritesQuery(
    { PageSize: 30 },
    { skip: activeTab !== "saved" || !isMyProfile },
  );
  const savedPosts = extractPosts(favData);

  const targetId = isMyProfile ? profile?.id : profile?.userId || profile?.id;

  const { data: followersData, isFetching: followersLoading } =
    useGetFollowersQuery(
      { userId: targetId ?? "", pageSize: 50 },
      {
        skip:
          !followModal.open || followModal.type !== "followers" || !targetId,
      },
    );

  const { data: followingData, isFetching: followingLoading } =
    useGetFollowingQuery(
      { userId: targetId ?? "", pageSize: 50 },
      {
        skip:
          !followModal.open || followModal.type !== "following" || !targetId,
      },
    );

  const modalUsers: IFollower[] =
    followModal.type === "followers"
      ? (followersData?.data ?? [])
      : (followingData?.data ?? []);
  const modalLoading =
    followModal.type === "followers" ? followersLoading : followingLoading;

  // Determine which posts to display
  let displayedPosts: IPost[] = [];
  let isTabLoading = false;

  if (activeTab === "saved") {
    displayedPosts = savedPosts;
    isTabLoading = favLoading;
  } else if (activeTab === "reels") {
    displayedPosts = (isMyProfile ? myPosts : otherPosts).filter((p) =>
      isVideoFile(p.images?.[0] ?? ""),
    );
    isTabLoading = postsLoading;
  } else {
    displayedPosts = isMyProfile ? myPosts : otherPosts;
    isTabLoading = postsLoading;
  }
  // --- Dynamic logic end ---

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Could not load profile.
      </div>
    );
  }

  return (
    <div className="max-w-[935px] mx-auto px-4 py-8 text-black bg-white">
      {/* Profile header */}
      <div className="flex items-start gap-8 md:gap-20 mb-5">
        <div
          className="shrink-0 relative group"
          onClick={() => setShowAvatarPreview(true)}
        >
          {/* Note bubble */}
          <div className="absolute -top-3 -right-2 z-10">
            <div className="bg-gray-100 border border-gray-200 text-[11px] text-gray-500 px-3 py-1.5 rounded-2xl shadow-xl relative animate-in fade-in zoom-in duration-300">
              Заметка...
              <div className="absolute -bottom-1 left-2 w-2 h-2 bg-gray-100 border-r border-b border-gray-200 rotate-45"></div>
            </div>
          </div>

          <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden bg-gray-100 border border-black/10 cursor-pointer">
            {profile.image ? (
              <img
                src={`${FILE_URL}${profile.image}`}
                alt={profile.userName}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg")
                }
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-2/3 h-2/3 text-gray-400"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 pt-2">
          {/* Row 1: Username and Gear */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-semibold text-black">
              {profile.userName}
            </h2>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black flex items-center justify-center"
              >
                <img src="/menu.svg" alt="Options" className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-[260px] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 z-20 py-2 overflow-hidden">
                    <button className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-100 transition-colors text-black">
                      QR code
                    </button>
                    <button className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-100 transition-colors text-black">
                      Notification
                    </button>
                    <button className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-100 transition-colors text-black">
                      Settings and privacy
                    </button>
                    {isMyProfile && (
                      <>
                        <div className="h-[1px] bg-gray-100 my-1" />
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-100 transition-colors text-[#ed4956] font-medium"
                        >
                          Log out
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 2: Full Name */}
          <div className="mb-4 flex items-center gap-2">
            <p className="text-[15px] text-black">{profile.firstName}</p>
            <p className="text-[15px] text-black">{profile.lastName}</p>
          </div>

          {/* Row 3: Stats */}
          <div className="flex items-center gap-6 md:gap-10 text-black border-y md:border-none py-3 md:py-0 border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-1">
              <span className="font-bold text-[16px]">
                {profile.postCount ?? displayedPosts.length}
              </span>
              <span className="text-gray-500 text-[14px]">posts</span>
            </div>
            <button
              onClick={() => setFollowModal({ type: "followers", open: true })}
              className="flex flex-col md:flex-row items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <span className="font-bold text-[16px]">
                {(profile.followersCount ?? (profile as any).subscribersCount ?? 0).toLocaleString()}
              </span>
              <span className="text-gray-500 text-[14px]">followers</span>
            </button>
            <button
              onClick={() => setFollowModal({ type: "following", open: true })}
              className="flex flex-col md:flex-row items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <span className="font-bold text-[16px]">
                {(profile.followingCount ?? (profile as any).subscriptionsCount ?? 0).toLocaleString()}
              </span>
              <span className="text-gray-500 text-[14px]">following</span>
            </button>
          </div>
        </div>
      </div>

      {profile.about && (
        <div className="mb-6 px-1">
          <p className="text-sm font-normal whitespace-pre-line text-black leading-relaxed">
            {profile.about}
          </p>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex gap-2 mb-10">
        {isMyProfile ? (
          <>
            <Link
              href="/profile/edit"
              className="flex-1 text-center py-2 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors text-black"
            >
              Редактировать профиль
            </Link>
            <button className="flex-1 py-2 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors text-black">
              Посмотреть архив
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleFollow}
              disabled={isFollowingLoading || isUnfollowingLoading}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center min-h-[32px] ${isFollowing
                ? "bg-gray-100 dark:bg-[#363636] hover:bg-gray-200 text-black dark:text-white"
                : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
                }`}
            >
              {isFollowingLoading || isUnfollowingLoading
                ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : isFollowing
                  ? "Following"
                  : "Follow"}
            </button>
            <button
              onClick={handleMessageClick}
              className="flex-1 py-2 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors text-black"
            >
              Message
            </button>
          </>
        )}
      </div>

      {/* Highlights Section */}
      {isMyProfile && (
        <div className="flex gap-8 mb-12">
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-[77px] h-[77px] rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
              <svg
                aria-label="Plus icon"
                color="black"
                fill="black"
                height="44"
                role="img"
                viewBox="0 0 24 24"
                width="44"
              >
                <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.4.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.4.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.8-.8-.8z"></path>
              </svg>
            </div>
            <span className="text-xs font-semibold text-black">Добавить</span>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 mt-4 md:mt-0">
        <div className="flex items-center justify-center gap-12 md:gap-16">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 py-3 md:py-4 text-[12px] font-semibold tracking-[1.2px] border-t transition-all duration-200 ${activeTab === "posts"
              ? "border-black text-black -mt-[1px]"
              : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            <svg aria-label="" color="currentColor" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><rect fill="none" height="18" rx="0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-1.5 py-3 md:py-4 text-[12px] font-semibold tracking-[1.2px] border-t transition-all duration-200 ${activeTab === "reels"
              ? "border-black text-black -mt-[1px]"
              : "border-transparent text-gray-500 hover:text-black"
              }`}
          >
            <svg aria-label="" color="currentColor" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.951" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.951" y1="17.002" y2="17.002"></line><rect fill="none" height="19.901" rx="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="19.901" x="2.049" y="2.049"></rect><path d="M11.666 14.538l6.721-3.993a.5.5 0 000-.862l-6.721-3.993A.5.5 0 0011 6.121V14.11a.5.5 0 00.666.428z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            REELS
          </button>
          {isMyProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-1.5 py-3 md:py-4 text-[12px] font-semibold tracking-[1.2px] border-t transition-all duration-200 ${activeTab === "saved"
                ? "border-black text-black -mt-[1px]"
                : "border-transparent text-gray-500 hover:text-black"
                }`}
            >
              <svg aria-label="" color="currentColor" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
              SAVED
            </button>
          )}
        </div>
      </div>

      {/* Content grid or empty state */}
      {isTabLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
        </div>
      ) : displayedPosts.length === 0 ? (
        activeTab === "posts" ? (
          <EmptyStateForPosts />
        ) : activeTab === "reels" ? (
          <EmptyStateForReels />
        ) : (
          <EmptyStateForSaved />
        )
      ) : (
        <div className="grid grid-cols-3 gap-[3px] mt-1">
          {displayedPosts.map((post) => (
            <PostThumbnail
              key={post.postId}
              post={post}
              onClick={() => {
                setSelectedPost(post);
                viewPost(post.postId);
              }}
            />
          ))}
        </div>
      )}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {followModal.open && (
        <FollowModal
          title={followModal.type === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          onClose={() => setFollowModal({ type: "followers", open: false })}
        />
      )}

      {modalLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
        </div>
      )}

      <ProfileFooter />

      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}

      {/* Avatar Preview Modal */}
      {showAvatarPreview && (
        <div
          className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4"
          onClick={() => setShowAvatarPreview(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:opacity-70 z-[120]"
            onClick={() => setShowAvatarPreview(false)}
          >
            <svg fill="currentColor" height="32" viewBox="0 0 24 24" width="32">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-full overflow-hidden aspect-square flex items-center justify-center shadow-2xl border-4 border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {profile?.image ? (
              <img
                src={`${FILE_URL}${profile.image}`}
                alt={profile.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-64 h-64 md:w-96 md:h-96 bg-gray-50 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-1/2 h-1/2 text-gray-200"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileUi;
