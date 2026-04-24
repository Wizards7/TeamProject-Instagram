"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { useNotifications, markAllAsRead } from "../../../utils/notifications";
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

  const newNotifications = notifications.filter(n => !n.isRead);
  const olderNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-white dark:bg-black pt-6 pb-20 px-4">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-black dark:text-white mb-6">Notifications</h1>
        
        {/* Simple Tabs/Filters */}
        <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            <button 
                onClick={() => setFilter("all")}
                className={`text-sm font-semibold transition-colors ${filter === "all" ? "text-black dark:text-white border-b-2 border-black dark:border-white pb-2 -mb-[10px]" : "text-gray-400"}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilter("mentions")}
                className={`text-sm font-semibold transition-colors ${filter === "mentions" ? "text-black dark:text-white border-b-2 border-black dark:border-white pb-2 -mb-[10px]" : "text-gray-400"}`}
            >
                Mentions
            </button>
        </div>
      </div>

      <div className="space-y-6">
        {notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-gray-500 text-center px-10"
          >
             <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800">
                <svg fill="none" height="40" viewBox="0 0 24 24" width="40" stroke="currentColor" strokeWidth="1.5"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
             </div>
             <p className="text-xl font-bold text-black dark:text-white mb-2">Activity On Your Posts</p>
             <p className="text-sm leading-relaxed max-w-[280px]">When someone likes or comments on one of your posts, you'll see it here.</p>
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
                  {newNotifications.map((notif) => (
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
                  {olderNotifications.map((notif) => (
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
  const [postImgError, setPostImgError] = useState(false);

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
          <p className="text-black dark:text-white">
            <Link href={`/profile/${notif.userId}`} className="font-bold hover:underline">
                {notif.userName}
            </Link>{" "}
            <span className="font-normal opacity-90">{notif.content}</span>{" "}
            <span className="text-gray-400 dark:text-gray-500 text-xs ml-1 whitespace-nowrap">{notif.date}</span>
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {notif.type === "follow" ? (
            <button className="bg-[#0095f6] hover:bg-[#1877f2] active:scale-95 text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-500/20">
                Follow
            </button>
        ) : notif.postId ? (
            <Link href={`/post/${notif.postId}`} className="block">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10 group-hover:scale-105 transition-transform shadow-sm">
                    {notif.postImage && !postImgError ? (
                        <img 
                            src={`${FILE_URL}${notif.postImage}`} 
                            className="w-full h-full object-cover" 
                            onError={() => setPostImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                            <svg viewBox="0 0 24 24" width="20" height="20" className="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                        </div>
                    )}
                </div>
            </Link>
        ) : null}
      </div>
    </motion.div>
  );
};

export default NotificationPage;
