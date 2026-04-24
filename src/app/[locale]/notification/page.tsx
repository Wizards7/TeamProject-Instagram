"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { useNotifications, markAllAsRead, getNotifications } from "../../../utils/notifications";
import { motion, AnimatePresence } from "framer-motion";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const NotificationPage = () => {
  const locale = useLocale();
  const notifications = useNotifications();
  const [filter, setFilter] = useState<"all" | "mentions">("all");

  useEffect(() => {
    // Mark as read when viewing the page
    const timer = setTimeout(() => {
        markAllAsRead();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ONLY show follow-related notifications as requested
  const filteredNotifications = notifications.filter(n => n.type === 'follow' || n.type === 'follow_request');
  
  const newNotifications = filteredNotifications.filter(n => !n.isRead);
  const olderNotifications = filteredNotifications.filter(n => n.isRead);

  const handleClearAll = () => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('insta_notifications', JSON.stringify([]));
          window.dispatchEvent(new Event('notifications_updated'));
      }
  };

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-white dark:bg-black pt-6 pb-20 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-[28px] font-bold text-black dark:text-white">Notifications</h1>
            {filteredNotifications.length > 0 && (
                <button 
                    onClick={handleClearAll}
                    className="text-sm font-semibold text-[#0095f6] hover:text-black dark:hover:text-white transition-colors"
                >
                    Clear all
                </button>
            )}
        </div>
        
        {/* Simple Tabs/Filters */}
        <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            <button 
                onClick={() => setFilter("all")}
                className={`text-sm font-semibold transition-colors relative pb-2 ${filter === "all" ? "text-black dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
            >
                All
                {filter === "all" && <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black dark:bg-white" />}
            </button>
            <button 
                onClick={() => setFilter("mentions")}
                className={`text-sm font-semibold transition-colors relative pb-2 ${filter === "mentions" ? "text-black dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
            >
                Mentions
                {filter === "mentions" && <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black dark:bg-white" />}
            </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Follow Requests Entry */}
        {filteredNotifications.some(n => n.type === 'follow_request') && (
            <div className="flex items-center justify-between py-2 px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center border-2 border-white dark:border-black">
                                <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20"><path d="M18.984 12.984h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                            </div>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-black">
                            {filteredNotifications.filter(n => n.type === 'follow_request').length}
                        </div>
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-black dark:text-white">Follow requests</p>
                        <p className="text-[13px] text-gray-500">Approve or ignore requests</p>
                    </div>
                </div>
                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16" className="text-gray-400"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
            </div>
        )}

        {filteredNotifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-gray-500 text-center px-10"
          >
             <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800">
                <svg fill="none" height="40" viewBox="0 0 24 24" width="40" stroke="currentColor" strokeWidth="1.5"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
             </div>
             <p className="text-xl font-bold text-black dark:text-white mb-2">No notifications yet</p>
             <p className="text-sm leading-relaxed max-w-[280px]">When someone follows you, you'll see it here.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {newNotifications.length > 0 && (
              <motion.div 
                key="new-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="text-[16px] font-bold text-black dark:text-white">New</h2>
                <div className="space-y-1">
                  {newNotifications.filter(n => n.type !== 'follow_request').map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} locale={locale} />
                  ))}
                </div>
              </motion.div>
            )}

            {olderNotifications.length > 0 && (
              <motion.div 
                key="older-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 pt-4"
              >
                <h2 className="text-[16px] font-bold text-black dark:text-white">Earlier</h2>
                <div className="space-y-1">
                  {olderNotifications.filter(n => n.type !== 'follow_request').map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} locale={locale} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ notif, locale }: { notif: any, locale: string }) => {
  const [imgError, setImgError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <motion.div 
        layout
        className="flex items-center justify-between gap-3 py-3 px-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-4 flex-1">
        <Link href={`/profile/${notif.userId}`} className="shrink-0 relative">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-white/10 transition-transform active:scale-90 shadow-sm">
            {notif.userImage && !imgError ? (
              <img 
                src={`${FILE_URL}${notif.userImage}`} 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 uppercase">
                {notif.userName?.[0] || "?"}
              </div>
            )}
          </div>
          {!notif.isRead && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0095f6] rounded-full border-2 border-white dark:border-black" />
          )}
        </Link>
        
        <div className="flex-1 text-[14px] leading-tight">
          <div className="text-black dark:text-white">
            <Link href={`/profile/${notif.userId}`} className="font-bold hover:underline">
                {notif.userName}
            </Link>{" "}
            <span className="font-normal opacity-90">{notif.content}</span>{" "}
            <span className="text-gray-400 dark:text-gray-500 text-xs ml-1 whitespace-nowrap">{notif.date}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <button 
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            isFollowing 
            ? "bg-[#efefef] dark:bg-[#363636] text-black dark:text-white" 
            : "bg-[#0095f6] hover:bg-[#1877f2] text-white shadow-blue-500/10"
          }`}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPage;
