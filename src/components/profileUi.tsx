"use client";

import React from "react";
import { useGetMyProfileQuery } from "../api/userProfile";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const ProfileUi = () => {
  const { data: profileData, isLoading, error } = useGetMyProfileQuery();
  const profile = profileData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Could not load profile.
      </div>
    );
  }

  return (
    <div className="max-w-[935px] mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-start gap-16 mb-10">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-[150px] h-[150px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
            <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-gray-100">
              {profile.image ? (
                <img
                  src={`${FILE_URL}${profile.image}`}
                  alt={profile.userName}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 uppercase">
                  {profile.userName?.[0]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          {/* Username + buttons */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <h2 className="text-xl font-light">{profile.userName}</h2>
            <button className="px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
              Edit profile
            </button>
            <button className="px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
              View archive
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-5">
            <p className="text-sm">
              <span className="font-bold">{profile.postCount ?? 0}</span>{" "}
              <span className="text-[#262626]">posts</span>
            </p>
            <button className="text-sm hover:opacity-60 transition-opacity">
              <span className="font-bold">{profile.followersCount?.toLocaleString() ?? 0}</span>{" "}
              <span className="text-[#262626]">followers</span>
            </button>
            <button className="text-sm hover:opacity-60 transition-opacity">
              <span className="font-bold">{profile.followingCount?.toLocaleString() ?? 0}</span>{" "}
              <span className="text-[#262626]">following</span>
            </button>
          </div>

          {/* Bio */}
          <div className="text-sm space-y-1">
            {profile.fullName && <p className="font-bold">{profile.fullName}</p>}
            {profile.about && (
              <p className="text-[#262626] whitespace-pre-line">{profile.about}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUi;