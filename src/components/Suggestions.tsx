"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useGetUsersQuery } from "../api/user";

const Suggestions = () => {
  const locale = useLocale();
  const { data: userData, isLoading } = useGetUsersQuery({ PageNumber: 1, PageSize: 5 });
  const FILE_URL = "https://instagram-api.softclub.tj/images/";

  if (isLoading) return null;

  return (
    <div className="w-[320px] hidden lg:block sticky top-24 ml-8 self-start">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500">Suggestions for you</span>
        <button className="text-xs font-bold text-[#262626] hover:text-gray-500">See All</button>
      </div>

      <div className="space-y-4">
        {userData?.data?.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/${locale}/profile/${user.id}`} className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-gray-50 cursor-pointer">
                {user.image ? (
                  <img src={`${FILE_URL}${user.image}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                    {user.userName[0]}
                  </div>
                )}
              </Link>
              <div className="flex flex-col">
                <Link href={`/${locale}/profile/${user.id}`} className="text-sm font-bold text-[#262626] hover:underline cursor-pointer">
                  {user.userName}
                </Link>
                <span className="text-xs text-gray-500">Followed by many</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-[#0095f6] hover:text-[#00376b] transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Press</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </nav>
        <p className="text-xs text-gray-400 uppercase">© 2026 INSTAGRAM CLONE BY ANTIGRAVITY</p>
      </div>
    </div>
  );
};

export default Suggestions;
