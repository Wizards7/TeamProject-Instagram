"use client";

import React, { useState, useEffect, useRef } from "react";
import { IStory } from "../types/interface";
import { useAddStoryViewMutation, useLikeStoryMutation, useDeleteStoryMutation } from "../api/story";
import { useGetMyProfileQuery } from "../api/userProfile";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

interface StoryViewerProps {
  stories: IStory[];
  onClose: () => void;
  initialStoryIndex?: number;
  canDelete?: boolean;
}

const isVideoFile = (filename: string) => {
  const videoExtensions = [".mp4", ".mov", ".wmv", ".avi", ".webm", ".mkv"];
  return videoExtensions.some((ext) => filename?.toLowerCase().endsWith(ext));
};

const getRelativeTime = (dateStr: string) => {
  const storyDate = new Date(dateStr);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "сейчас";
  if (diffInMinutes < 60) return `${diffInMinutes}м`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}ч`;
  return `${Math.floor(diffInHours / 24)}д`;
};

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, onClose, initialStoryIndex = 0, canDelete = false }) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [addView] = useAddStoryViewMutation();
  const [likeStory] = useLikeStoryMutation();
  const [deleteStory] = useDeleteStoryMutation();
  const { data: myProfileData } = useGetMyProfileQuery();
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState("");
  
  const currentStory = stories[currentIndex];
  const isMyStory = currentStory?.userId === myProfileData?.data?.id;
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const viewedIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!currentStory) return;

    // Reset progress when story changes
    setProgress(0);
    
    // Mark as viewed only once per session
    if (!viewedIds.current.has(currentStory.id)) {
      addView(currentStory.id);
      viewedIds.current.add(currentStory.id);
    }

    // Auto-advance logic
    const duration = isVideoFile(currentStory.fileName) ? 15000 : 5000; 
    const interval = 50; 
    const step = (interval / duration) * 100;

    if (progressTimer.current) clearInterval(progressTimer.current);

    progressTimer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [currentIndex, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleLike = async () => {
    try {
      await likeStory(currentStory.id).unwrap();
    } catch (err) {
      console.error("Failed to like story", err);
    }
  };

  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (window.confirm("Удалить эту историю?")) {
      try {
        await deleteStory(currentStory.id).unwrap();
        handleNext();
      } catch (err) {
        console.error("Failed to delete story", err);
      }
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-sans overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${FILE_URL}${currentStory.fileName}`} 
          alt="Background Blur" 
          className="w-full h-full object-cover blur-3xl opacity-40 scale-110" 
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative w-full max-w-[380px] h-full md:h-[95vh] flex flex-col z-10">
        {/* Progress Bars Container */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-30">
          {stories.map((_, idx) => (
            <div key={idx} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-75"
                style={{ 
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header Info */}
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 p-[1px] bg-white/10">
              <img 
                src={currentStory.userAvatar ? `${FILE_URL}${currentStory.userAvatar}` : "/image.webp"} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-[13px] font-semibold tracking-tight">
                {currentStory.userName || "user"}
              </span>
              <span className="text-white/60 text-[13px]">
                {getRelativeTime(currentStory.createAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            {isVideoFile(currentStory.fileName) && (
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/90 hover:text-white transition-colors">
                {isMuted ? (
                  <svg aria-label="Muted" height="18" role="img" viewBox="0 0 24 24" width="18" fill="currentColor">
                    <path d="M16.636 7.028a1.5 1.5 0 10-2.395 1.807 3.5 3.5 0 010 4.33 1.5 1.5 0 102.395 1.807 6.5 6.5 0 000-7.944z"></path>
                    <path d="M12.157 2.188a1.458 1.458 0 011.841.543L15.93 5.4a1.5 1.5 0 11-2.422 1.765l-1.423-1.954a.123.123 0 00-.213.04L11.87 19.34a.123.123 0 00.213.04l2.553-3.504a1.5 1.5 0 112.422 1.765l-2.552 3.504a1.458 1.458 0 01-1.841.543 1.454 1.454 0 01-.65-.63L8.035 15.01H3.5a1.5 1.5 0 01-1.5-1.5V10.5a1.5 1.5 0 011.5-1.5h4.535l3.97-6.048a1.454 1.454 0 01.652-.63a.124.124 0 00-.18.11v17.135a.124.124 0 00.18.11.124.124 0 00.08-.11V3.428a.124.124 0 00-.08-.11z"></path>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2.5" x2="21.5" y1="2.5" y2="21.5"></line>
                  </svg>
                ) : (
                  <svg aria-label="Unmuted" height="18" role="img" viewBox="0 0 24 24" width="18" fill="currentColor">
                    <path d="M16.636 7.028a1.5 1.5 0 10-2.395 1.807 3.5 3.5 0 010 4.33 1.5 1.5 0 102.395 1.807 6.5 6.5 0 000-7.944z"></path>
                    <path d="M12.157 2.188a1.458 1.458 0 011.841.543L15.93 5.4a1.5 1.5 0 11-2.422 1.765l-1.423-1.954a.123.123 0 00-.213.04L11.87 19.34a.123.123 0 00.213.04l2.553-3.504a1.5 1.5 0 112.422 1.765l-2.552 3.504a1.458 1.458 0 01-1.841.543 1.454 1.454 0 01-.65-.63L8.035 15.01H3.5a1.5 1.5 0 01-1.5-1.5V10.5a1.5 1.5 0 011.5-1.5h4.535l3.97-6.048a1.454 1.454 0 01.652-.63a.124.124 0 00-.18.11v17.135a.124.124 0 00.18.11.124.124 0 00.08-.11V3.428a.124.124 0 00-.08-.11z"></path>
                  </svg>
                )}
              </button>
            )}
            
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white/90 p-1 hover:bg-white/10 rounded-full transition-colors">
                <svg aria-label="Menu" height="20" role="img" viewBox="0 0 24 24" width="20" fill="currentColor">
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="6" cy="12" r="1.5"></circle>
                  <circle cx="18" cy="12" r="1.5"></circle>
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#262626] rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                  {isMyStory && canDelete && (
                    <button 
                      onClick={handleDelete}
                      className="w-full px-4 py-3 text-left text-[#ed4956] text-[14px] font-semibold hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      Удалить историю
                    </button>
                  )}
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-3 text-left text-white text-[14px] hover:bg-white/5 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>

            <button onClick={onClose} className="text-white/90 p-1 hover:bg-white/10 rounded-full transition-colors">
              <svg aria-label="Close" height="24" role="img" viewBox="0 0 24 24" width="24" fill="currentColor">
                <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></polyline>
                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative bg-zinc-900 overflow-hidden md:rounded-xl shadow-2xl">
          {isVideoFile(currentStory.fileName) ? (
            <video 
              src={`${FILE_URL}${currentStory.fileName}`} 
              autoPlay 
              muted={isMuted}
              playsInline 
              className="w-full h-full object-cover"
              onEnded={handleNext}
            />
          ) : (
            <img 
              src={`${FILE_URL}${currentStory.fileName}`} 
              alt="Story" 
              className="w-full h-full object-cover" 
            />
          )}

          {/* Click Areas */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
            <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="py-4 px-4 flex items-center gap-4 bg-transparent">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Ответьте ${currentStory.userName}...`} 
              className="w-full bg-transparent border border-white/50 rounded-full px-5 py-2.5 text-white text-[13px] focus:outline-none placeholder:text-white/80 focus:border-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`hover:scale-110 transition-transform ${currentStory.liked ? 'text-red-500' : 'text-white'}`}>
              <svg aria-label={currentStory.liked ? "Unlike" : "Like"} height="24" role="img" viewBox="0 0 24 24" width="24" fill="currentColor">
                <path d={currentStory.liked 
                  ? "M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.077 2.5 12.195 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.568 1.011.717 1.565a4.532 4.532 0 01.717-1.565 4.21 4.21 0 013.675-1.941z"
                  : "M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.077 2.5 12.195 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.568 1.011.717 1.565a4.532 4.532 0 01.717-1.565 4.21 4.21 0 013.675-1.941z"
                }></path>
              </svg>
            </button>
            <button className="text-white hover:scale-110 transition-transform">
              <svg aria-label="Direct" height="24" role="img" viewBox="0 0 24 24" width="24" fill="currentColor">
                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
