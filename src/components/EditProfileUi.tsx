"use client";
import React, { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@/src/i18n/navigation";
import {
  useGetMyProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserImageProfileMutation,
  useDeleteUserImageProfileMutation,
} from "../api/userProfile";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const EditProfileUi = () => {
  const router = useRouter();
  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfileQuery();
  const profile = profileData?.data;

  const [about, setAbout] = useState("");
  const [gender, setGender] = useState<number>(0);
  const [fullName, setFullName] = useState(""); // UI only if API doesn't support update yet
  const [userName, setUserName] = useState(""); // UI only if API doesn't support update yet

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updateImage, { isLoading: isUpdatingImage }] = useUpdateUserImageProfileMutation();
  const [deleteImage, { isLoading: isDeletingImage }] = useDeleteUserImageProfileMutation();

  useEffect(() => {
    if (profile) {
      setAbout(profile.about || "");
      setGender(profile.gender ?? 0);
      setFullName(profile.fullName || "");
      setUserName(profile.userName || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ about, gender }).unwrap();
      router.push("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("imageFile", file);
      try {
        await updateImage(formData).unwrap();
      } catch (err) {
        console.error("Failed to update image:", err);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      try {
        await deleteImage().unwrap();
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-[600px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
        <Link href="/profile" className="text-[#0095f6] hover:underline">
          Profile
        </Link>
        <span className="text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
        <span className="text-gray-900 font-bold">Edit profile</span>
      </nav>

      {/* User Info Card */}
      <div className="bg-[#efefef]/30 dark:bg-zinc-900/50 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
            {profile.image ? (
              <img src={`${FILE_URL}${profile.image}`} alt={profile.userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 uppercase">
                {profile.userName?.[0]}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">{profile.userName}</p>
            <p className="text-gray-500 text-sm">{profile.fullName}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white dark:bg-zinc-800 text-[#0095f6] px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Change photo
          </button>
          {profile.image && (
            <button
              onClick={handleDeleteImage}
              disabled={isDeletingImage}
              className="text-red-500 text-xs font-bold hover:underline"
            >
              Remove photo
            </button>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-gray-500 px-1">Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#efefef]/50 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-gray-800"
            placeholder="Full Name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-gray-500 px-1">User name</label>
          <input
            type="text"
            value={userName}
            readOnly
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-[#efefef]/50 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-gray-800"
            placeholder="Username"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-gray-500 px-1">Bio</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="w-full bg-[#efefef]/50 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all resize-none text-gray-800"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-gray-500 px-1">Gender</label>
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(Number(e.target.value))}
              className="w-full bg-[#efefef]/50 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all appearance-none cursor-pointer text-gray-800"
            >
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Prefer not to say</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 px-1 mt-1">This won't be part of your public profile.</p>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isUpdatingProfile || isUpdatingImage}
            className="w-full max-w-[200px] bg-[#0095f6] hover:bg-[#1877f2] disabled:bg-[#0095f6]/50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            {isUpdatingProfile ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileUi;
