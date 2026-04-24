"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useNotifications, markAllAsRead } from "../../../utils/notifications";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const NotificationPage = () => {
  const locale = useLocale();
  const notifications = useNotifications();

  useEffect(() => {
    // Mark as read when viewing the page
    return () => {
      markAllAsRead();
    };
  }, []);

  const newNotifications = notifications.filter(n => !n.isRead);
  const olderNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-white dark:bg-black pt-4 pb-20">
      <div className="px-4 mb-6 flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-black dark:text-white">Notifications</h1>
      </div>

      <div className="space-y-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center px-10">
             <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="1.5"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z"></path></svg>
             </div>
             <p className="font-semibold text-black dark:text-white">Activity On Your Posts</p>
             <p className="text-sm mt-1">When someone likes or comments on one of your posts, you'll see it here.</p>
          </div>
        ) : (
          <>
            {newNotifications.length > 0 && (
              <div className="px-4 py-2">
                <h2 className="text-[16px] font-bold text-black dark:text-white mb-4">New</h2>
                <div className="space-y-4">
                  {newNotifications.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} locale={locale} />
                  ))}
                </div>
              </div>
            )}

            {(newNotifications.length > 0 && olderNotifications.length > 0) && (
              <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-4" />
            )}

            {olderNotifications.length > 0 && (
              <div className="px-4 py-2">
                <h2 className="text-[16px] font-bold text-black dark:text-white mb-4">Earlier</h2>
                <div className="space-y-4">
                  {olderNotifications.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} locale={locale} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ notif, locale }: { notif: any, locale: string }) => {
  return (
    <div className="flex items-center justify-between gap-3 group">
      <div className="flex items-center gap-3 flex-1">
        <Link href={`/${locale}/profile/${notif.userId}`} className="shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
            {notif.userImage ? (
              <img src={`${FILE_URL}${notif.userImage}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400 bg-gray-50 uppercase">
                {notif.userName?.[0]}
              </div>
            )}
          </div>
        </Link>
        
        <div className="flex-1 text-[14px] leading-tight">
          <Link href={`/${locale}/profile/${notif.userId}`} className="font-bold hover:opacity-60 transition-opacity text-black dark:text-white">
            {notif.userName}
          </Link>{" "}
          <span className="text-black dark:text-white">{notif.content}</span>{" "}
          <span className="text-gray-400 text-xs ml-1">{notif.date}</span>
        </div>
      </div>

      {notif.type === "follow" ? (
        <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all">
          Follow
        </button>
      ) : notif.postId ? (
        <Link href={`/${locale}/post/${notif.postId}`} className="shrink-0">
          <div className="w-11 h-11 bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
             {notif.postImage && <img src={`${FILE_URL}${notif.postImage}`} className="w-full h-full object-cover" />}
          </div>
        </Link>
      ) : null}
    </div>
  );
};

export default NotificationPage;
