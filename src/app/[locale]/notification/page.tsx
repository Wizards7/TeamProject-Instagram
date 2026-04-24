"use client";

import React, { useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { 
  useGetMyProfileQuery, 
  useGetFollowersQuery, 
  useAddFollowingRelationShipMutation, 
  useDeleteFollowingRelationShipMutation,
  useIsFollowingUserQuery
} from "../../../api/userProfile";
import { motion, AnimatePresence } from "framer-motion";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const NotificationPage = () => {
  const locale = useLocale();
  const { data: profileData, isLoading: profileLoading } = useGetMyProfileQuery();
  const profile = profileData?.data;
  const currentUserId = profile?.userId || profile?.id;
  
  // Use the real API to get subscribers (followers)
  const { data: subscribersData, isLoading: subscribersLoading, refetch } = useGetFollowersQuery(
    { userId: currentUserId || "" },
    { skip: !currentUserId }
  );

  const subscribers = subscribersData?.data || [];
  const isLoading = profileLoading || subscribersLoading;

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-white pt-6 pb-20 px-4 md:px-0">
      <div className="mb-8 px-4">
        <h1 className="text-[28px] font-bold text-black mb-6">Notifications</h1>
        
        <div className="flex gap-6 border-b border-gray-100 pb-2">
            <button className="text-sm font-semibold transition-colors relative pb-2 text-black">
                All
                <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black" />
            </button>
            <button className="text-sm font-semibold transition-colors relative pb-2 text-gray-400 hover:text-gray-600">
                Mentions
            </button>
        </div>
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <div className="flex flex-col gap-4 px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-2 bg-gray-50 rounded w-1/2" />
                </div>
                <div className="w-20 h-8 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-gray-500 text-center px-10"
          >
             <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
                <svg fill="none" height="40" viewBox="0 0 24 24" width="40" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <p className="text-xl font-bold text-black mb-2">No notifications yet</p>
             <p className="text-sm leading-relaxed max-w-[280px]">When someone follows you, you'll see it here.</p>
          </motion.div>
        ) : (
          <div className="space-y-1">
             <h2 className="text-[16px] font-bold text-black px-4 mb-2">New</h2>
             <AnimatePresence mode="popLayout">
                {subscribers.map((subscriber) => (
                  <NotificationItem 
                    key={subscriber.id} 
                    user={subscriber} 
                    locale={locale} 
                  />
                ))}
             </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ user, locale }: { user: any, locale: string }) => {
  const { data: followStatus } = useIsFollowingUserQuery({ followingUserId: user.id });
  const [addFollow] = useAddFollowingRelationShipMutation();
  const [deleteFollow] = useDeleteFollowingRelationShipMutation();
  
  const isFollowing = followStatus?.data ?? false;
  const [localFollow, setLocalFollow] = useState(isFollowing);

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
    <motion.div 
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between gap-3 py-3 px-4 hover:bg-gray-50 transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1">
        <Link href={`/${locale}/profile/${user.id}`} className="shrink-0 relative">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-100 shadow-sm transition-transform active:scale-95">
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
        
        <div className="flex-1 text-[14px] leading-tight">
          <div className="text-black">
            <Link href={`/${locale}/profile/${user.id}`} className="font-bold hover:underline">
                {user.userName}
            </Link>{" "}
            <span className="font-normal">started following you.</span>{" "}
            <span className="text-gray-400 text-xs ml-1 whitespace-nowrap">Just now</span>
          </div>
          {user.fullName && (
            <p className="text-gray-500 text-[13px] mt-0.5">{user.fullName}</p>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <button 
          onClick={(e) => { e.preventDefault(); handleFollow(); }}
          className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
            localFollow 
            ? "bg-white border-gray-300 text-black hover:bg-gray-50" 
            : "bg-[#0095f6] border-[#0095f6] text-white hover:bg-[#1877f2]"
          }`}
        >
            {localFollow ? "Following" : "Follow"}
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPage;
