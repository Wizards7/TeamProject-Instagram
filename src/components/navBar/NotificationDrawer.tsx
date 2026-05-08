"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetMyProfileQuery, 
  useGetFollowersQuery, 
  useAddFollowingRelationShipMutation, 
  useDeleteFollowingRelationShipMutation,
  useIsFollowingUserQuery
} from "../../api/userProfile";
import { IFollower } from "../../types/interface";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const { data: profileData } = useGetMyProfileQuery();
  const profile = profileData?.data;
  const currentUserId = profile?.userId || profile?.id;
  
  const { data: subscribersData, isLoading: subscribersLoading } = useGetFollowersQuery(
    { userId: currentUserId || "" },
    { skip: !currentUserId || !isOpen }
  );

  const subscribers = subscribersData?.data || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/5 z-40 lg:left-[72px]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 lg:left-[72px] top-0 bottom-0 w-full max-w-[400px] bg-background border-r border-border z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
            </div>

            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              {subscribersLoading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-11 h-11 rounded-full bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                        <div className="h-2 bg-gray-50 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : subscribers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <svg fill="none" height="32" viewBox="0 0 24 24" width="32" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8.5" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-bold text-black mb-1">{t("noNotifications")}</p>
                  <p className="text-sm">{t("noNotificationsDesc")}</p>
                </div>
              ) : (
                <div className="px-1">
                  <h3 className="px-4 py-2 text-sm font-semibold text-black dark:text-white">{t("recent")}</h3>
                  {subscribers.map((subscriber) => (
                    <NotificationItem 
                      key={subscriber.id} 
                      user={subscriber} 
                      locale={locale}
                      onClose={onClose}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NotificationItem = ({ user, locale, onClose, t }: { user: IFollower, locale: string, onClose: () => void, t: any }) => {
  const { data: followStatus } = useIsFollowingUserQuery({ followingUserId: user.id });
  const [addFollow] = useAddFollowingRelationShipMutation();
  const [deleteFollow] = useDeleteFollowingRelationShipMutation();
  
  const isFollowing = followStatus?.data ?? false;
  const [localFollow, setLocalFollow] = useState(isFollowing);

  // Sync with API state
  useEffect(() => {
    if (followStatus?.data !== undefined) {
      setLocalFollow(followStatus.data);
    }
  }, [followStatus?.data]);

  const handleFollow = async () => {
    const prevState = localFollow;
    setLocalFollow(!prevState);
    try {
      if (prevState) {
        await deleteFollow({ followingUserId: user.id }).unwrap();
      } else {
        await addFollow({ followingUserId: user.id }).unwrap();
      }
    } catch (err) {
      setLocalFollow(prevState);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group cursor-pointer">
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <Link 
          href={`/${locale}/profile/${user.id}`} 
          onClick={onClose}
          className="shrink-0"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
            {user.image ? (
              <img 
                src={`${FILE_URL}${user.image}`} 
                className="w-full h-full object-cover" 
                alt={user.userName}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400 bg-gray-50 uppercase">
                {user.userName?.[0] || "?"}
              </div>
            )}
          </div>
        </Link>
        
        <div className="flex-1 text-sm leading-tight truncate">
          <div className="text-black dark:text-gray-200">
            <Link 
              href={`/${locale}/profile/${user.id}`} 
              onClick={onClose}
              className="font-bold hover:underline"
            >
              {user.userName}
            </Link>{" "}
            <span>{t("startedFollowing")}</span>
          </div>
          <span className="text-gray-400 text-xs">{t("justNow")}</span>
        </div>
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFollow(); }}
        className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
          localFollow 
          ? "bg-white border-gray-300 text-black hover:bg-gray-50" 
          : "bg-[#0095f6] border-[#0095f6] text-white hover:bg-[#1877f2]"
        }`}
      >
        {localFollow ? t("following") : t("follow")}
      </button>
    </div>
  );
};
