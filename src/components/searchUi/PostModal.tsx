"use client";

import React, { useEffect, useState, useRef } from "react";
import { IPost } from "../../types/interface";
import { useLikePostMutation } from "../../api/post";
import { useAddFollowingRelationShipMutation, useIsFollowingUserQuery, useGetMyProfileQuery } from "../../api/userProfile";
interface PostModalProps {
  post: IPost;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const [likePost] = useLikePostMutation();
  const [addFollow] = useAddFollowingRelationShipMutation();
  const { data: followStatus } = useIsFollowingUserQuery(
    { followingUserId: post.userId },
    { skip: !post.userId }
  );
  const isFollowing = followStatus?.data ?? false;
  const { data: myProfileData } = useGetMyProfileQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = async () => {
    try {
      await likePost(post.postId).unwrap();
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  
  const FILE_URL = "https://instagram-api.softclub.tj/images/";
  const currentMedia = post.images?.[currentIndex];
  const isVideo = currentMedia?.toLowerCase().endsWith(".mp4") || currentMedia?.toLowerCase().endsWith(".mov");
  const hasMultipleMedia = post.images && post.images.length > 1;

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.images && currentIndex < post.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      setShowCenterIcon(true);
      setTimeout(() => setShowCenterIcon(false), 500);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addFollow({ followingUserId: post.userId }).unwrap();
      
      // Notify the user being followed
      if (myProfileData?.data) {
        addNotification({
          type: "follow",
          userId: myProfileData.data.userId || myProfileData.data.id || "",
          userName: myProfileData.data.userName,
          userImage: myProfileData.data.image,
          recipientId: post.userId,
          content: "started following you.",
        });
      }
    } catch (err) {
      console.error("Follow failed", err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 transition-all duration-300"
      onClick={onClose}
    >
      {/* Close button (top right) */}
      <button 
        className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity z-50 p-2"
        onClick={onClose}
      >
        <svg aria-label="Close" color="#ffffff" fill="#ffffff" height="24" role="img" viewBox="0 0 24 24" width="24">
          <polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="20.643 3.357 12 12 3.357 20.643"></polyline>
          <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="20.643" x2="3.357" y1="20.643" y2="3.357"></line>
        </svg>
      </button>

      {/* Main Modal Container */}
      <div 
        className="bg-white w-full max-w-[1200px] h-full max-h-[90vh] rounded-[20px] flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="w-full md:w-[60%] lg:w-[65%] bg-black flex items-center justify-center relative select-none overflow-hidden group cursor-pointer"
          onDoubleClick={() => {
            if (!post.postLike) handleLike();
            setShowCenterIcon(true);
            setTimeout(() => setShowCenterIcon(false), 800);
          }}
        >
          {currentMedia ? (
            isVideo ? (
              <div className="relative w-full h-full flex items-center justify-center" onClick={togglePlay}>
                <video 
                  ref={videoRef}
                  src={`${FILE_URL}${currentMedia}`} 
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
                
                {/* Center Play/Pause & Double-Click Heart Feedback */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${showCenterIcon ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                  {post.postLike && showCenterIcon ? (
                    <svg fill="white" width="80" height="80" viewBox="0 0 24 24" className="drop-shadow-2xl animate-bounce"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"/></svg>
                  ) : (
                    <div className="bg-black/50 p-6 rounded-full backdrop-blur-sm border border-white/20">
                      {isPlaying ? (
                          <svg fill="white" width="40" height="40" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      ) : (
                          <svg fill="white" width="40" height="40" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Mute Button Toggle */}
                <button 
                  onClick={toggleMute}
                  className="absolute bottom-5 right-5 bg-black/60 p-2.5 rounded-full text-white hover:bg-black transition-all z-20 shadow-lg border border-white/10"
                >
                  {isMuted ? (
                    <img src="/mute.svg" className="w-[14px] h-[14px] brightness-0 invert" alt="Muted" />
                  ) : (
                    <img src="/sound.svg" className="w-[14px] h-[14px] brightness-0 invert" alt="Unmuted" />
                  )}
                </button>
              </div>
            ) : (
              <img 
                src={`${FILE_URL}${currentMedia}`} 
                alt={post.title || ""} 
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="text-gray-500">No Content</div>
          )}

          {/* Carousel Arrows */}
          {hasMultipleMedia && (
            <>
              {currentIndex > 0 && (
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/90 p-2 rounded-full text-white hover:text-black transition-all z-30 backdrop-blur-sm group-hover:opacity-100 opacity-0 shadow-lg"
                >
                  <svg color="currentColor" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><polyline fill="none" points="16.502 3 7.498 12 16.502 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>
                </button>
              )}
              {currentIndex < (post.images?.length || 0) - 1 && (
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/90 p-2 rounded-full text-white hover:text-black transition-all z-30 backdrop-blur-sm group-hover:opacity-100 opacity-0 shadow-lg"
                >
                  <svg color="currentColor" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><polyline fill="none" points="8.998 3 18.002 12 8.998 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>
                </button>
              )}
              
              {/* Pagination Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30">
                {post.images?.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white shadow-md' : 'w-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Info & Comments */}
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col bg-white h-full border-l border-gray-100">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden bg-gray-50">
                {post.userImage ? (
                  <img src={`${FILE_URL}${post.userImage}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                    {post.userName?.[0]}
                  </div>
                )}
              </div>
              <span className="font-semibold text-sm hover:text-gray-500 cursor-pointer">{post.userName}</span>
              <span className="text-gray-400">•</span>
              {!isFollowing && (
                <button 
                  onClick={handleFollow}
                  className="text-[#0095f6] text-sm font-semibold hover:text-[#00376b]"
                >
                  Follow
                </button>
              )}
            </div>
            <button className="hover:opacity-50">
              <svg aria-label="More options" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
            </button>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* Post Content/Caption */}
            {(post.content || post.title) && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shrink-0 mt-1">
                    {post.userImage && <img src={`${FILE_URL}${post.userImage}`} className="w-full h-full object-cover" />}
                 </div>
                 <div className="text-sm">
                    <span className="font-semibold mr-2">{post.userName}</span>
                    <span className="text-gray-900 leading-relaxed">{post.content || post.title}</span>
                    <div className="text-gray-400 text-xs mt-2">1w</div>
                 </div>
              </div>
            )}

            {/* Real Comments logic */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.postCommentId} className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shrink-0 mt-1 bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-[10px]">
                    {comment.userImage ? (
                      <img src={`${FILE_URL}${comment.userImage}`} className="w-full h-full object-cover" />
                    ) : (
                      <span>{comment.userName?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold mr-2 hover:text-gray-500 cursor-pointer">{comment.userName}</span>
                      <span className="text-gray-900 leading-relaxed">{comment.comment}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-semibold">
                      <span>2w</span>
                      <button className="hover:text-black">12 likes</button>
                      <button className="hover:text-black">Reply</button>
                    </div>
                  </div>
                  <button className="mt-2 hover:opacity-50">
                    <svg aria-label="Like" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center pt-20">
                <p className="font-bold text-xl mb-2">No comments yet.</p>
                <p className="text-sm text-gray-500">Start the conversation.</p>
              </div>
            )}
          </div>

          {/* Interaction Bar */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button 
                   onClick={() => handleLike()}
                   className="hover:opacity-50 transform active:scale-125 transition-all"
                >
                   {post.postLike ? (
                     <svg color="#ff3040" fill="#ff3040" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
                   ) : (
                     <svg color="#262626" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
                   )}
                </button>
                <button className="hover:opacity-50"><svg color="#262626" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22l-1.344-4.992z" strokeLinejoin="round"></path></svg></button>
                <button className="hover:opacity-50"><svg color="#262626" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><line x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.083 11.698 20.334" strokeLinejoin="round"></polygon></svg></button>
              </div>
              <button className="hover:opacity-50"><svg color="#262626" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" strokeLinecap="round" strokeLinejoin="round"></polygon></svg></button>
            </div>
            
            <p className="font-bold text-sm mb-1">{post.postLikeCount.toLocaleString()} likes</p>
            <p className="text-gray-400 text-[10px] uppercase">April 3</p>
          </div>

          {/* Add Comment Bar */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-3">
            <button className="hover:opacity-50">
              <svg aria-label="Emoji" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166-1.167 1.167 1.167 0 001.166 1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
            </button>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="flex-1 text-sm border-none focus:ring-0 active:ring-0 outline-none"
            />
            <button className="text-[#0095f6] text-sm font-semibold opacity-50 cursor-default">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
