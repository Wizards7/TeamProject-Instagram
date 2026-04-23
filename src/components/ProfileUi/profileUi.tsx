"use client";
import React, { useState } from "react";
import { IFollower, IPost } from "../../types/interface";
import {
  useGetMyProfileQuery,
  useGetMyPostsQuery,
  useGetPostFavoritesQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../../api/userProfile";
import { FollowModal } from "../FollowModal";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const isVideoFile = (filename: string) =>
  filename?.toLowerCase().endsWith(".mp4") ||
  filename?.toLowerCase().endsWith(".mov");

const PostThumbnail: React.FC<{ post: IPost; onClick: () => void }> = ({
  post,
  onClick,
}) => {
  const filename = post.images?.[0];
  return (
    <div
      onClick={onClick}
      className="relative aspect-square cursor-pointer overflow-hidden group bg-gray-100"
    >
      {filename ? (
        isVideoFile(filename) ? (
          <video
            src={`${FILE_URL}${filename}`}
            className="w-full h-full object-cover"
            muted
          />
        ) : (
          <img
            src={`${FILE_URL}${filename}`}
            alt="post"
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400")
            }
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
          No image
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
        <span className="flex items-center gap-1.5">
          <svg fill="white" height="18" viewBox="0 0 24 24" width="18">
            <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.325.487.627 1.011.817 1.477.19-.466.492-.99.817-1.477a4.21 4.21 0 013.675-1.941z" />
          </svg>
          {post.postLikeCount.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5">
          <svg fill="white" height="18" viewBox="0 0 24 24" width="18">
            <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" />
          </svg>
          {post.commentCount.toLocaleString()}
        </span>
      </div>

      {filename && isVideoFile(filename) && (
        <div className="absolute top-2 right-2">
          <svg fill="white" height="16" viewBox="0 0 24 24" width="16">
            <path d="M5.888 22.5a3.46 3.46 0 01-1.721-.46l-.003-.002a3.451 3.451 0 01-1.72-2.982V4.943a3.445 3.445 0 015.163-2.987l12.226 7.059a3.444 3.444 0 01-.001 5.967l-12.22 7.056a3.462 3.462 0 01-1.724.462z" />
          </svg>
        </div>
      )}
    </div>
  );
};

const PostModal: React.FC<{ post: IPost; onClose: () => void }> = ({
  post,
  onClose,
}) => {
  const filename = post.images?.[0];
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white flex max-w-[900px] w-full max-h-[90vh] rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[55%] bg-black flex items-center justify-center shrink-0">
          {filename ? (
            isVideoFile(filename) ? (
              <video
                src={`${FILE_URL}${filename}`}
                className="max-h-[90vh] w-full object-contain"
                controls
                autoPlay
                muted
              />
            ) : (
              <img
                src={`${FILE_URL}${filename}`}
                alt="post"
                className="max-h-[90vh] w-full object-contain"
              />
            )
          ) : (
            <div className="text-white text-sm">No content</div>
          )}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden bg-gray-100">
                {post.userImage ? (
                  <img
                    src={`${FILE_URL}${post.userImage}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg")}
                  />
                ) : (
                  <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
            </div>
            <span className="text-sm font-semibold">{post.userName}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(post.content || post.title) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {post.userImage ? (
                    <img
                      src={`${FILE_URL}${post.userImage}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg")}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm">
                  <span className="font-semibold mr-1">{post.userName}</span>
                  {post.content || post.title}
                </p>
              </div>
            )}
            {post.comments?.map((c) => (
              <div key={c.postCommentId} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {c.userImage ? (
                    <img
                      src={`${FILE_URL}${c.userImage}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg")}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm">
                  <span className="font-semibold mr-1">{c.userName}</span>
                  {c.comment}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 p-4">
            <p className="text-sm font-bold">
              {post.postLikeCount.toLocaleString()} likes
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-70"
      >
        <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
};

type Tab = "posts" | "reels" | "saved";
const tabs: { key: Tab; label: string }[] = [
  { key: "posts", label: "Posts" },
  { key: "reels", label: "Reels" },
  { key: "saved", label: "Saved" },
];

const EmptyStateForPosts: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gray-100">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3v18M3 12h18"
          stroke="#8e8e8e"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="9" stroke="#8e8e8e" strokeWidth="1.5" />
      </svg>
    </div>
    <h3 className="text-xl font-light mb-2">Share Photos</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-[300px]">
      When you share photos, they will appear on your profile.
    </p>
    <button className="px-4 py-2 bg-[#0095f6] text-white text-sm font-semibold rounded-lg hover:bg-[#1877f2] transition-colors">
      Share your first photo
    </button>
  </div>
);

const EmptyStateForReels: React.FC = () => (
  <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
    <svg
      fill="none"
      height="48"
      viewBox="0 0 24 24"
      width="48"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect height="18" rx="3" width="18" x="3" y="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
    <p className="text-sm">No reels yet</p>
  </div>
);

const EmptyStateForSaved: React.FC = () => (
  <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
    <svg
      fill="none"
      height="48"
      viewBox="0 0 24 24"
      width="48"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect height="18" rx="3" width="18" x="3" y="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
    <p className="text-sm">No saved posts yet</p>
  </div>
);

const ProfileUi = () => {
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // State for follow modal
  const [followModal, setFollowModal] = useState<{
    type: "followers" | "following";
    open: boolean;
  }>({
    type: "followers",
    open: false,
  });

  const { data: profileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const profile = profileData?.data;

  const { data: myPostsData, isLoading: postsLoading } = useGetMyPostsQuery();
  const myPosts = myPostsData?.data ?? [];

  // Saved posts – only fetched when the tab is active
  const { data: favData, isLoading: favLoading } = useGetPostFavoritesQuery(
    { PageSize: 30 },
    { skip: activeTab !== "saved" },
  );
  const savedPosts = favData?.data ?? [];

  const { data: followersData, isFetching: followersLoading } =
    useGetFollowersQuery(
      { userId: profile?.id ?? "", pageSize: 50 },
      {
        skip:
          !followModal.open || followModal.type !== "followers" || !profile?.id,
      },
    );

  const { data: followingData, isFetching: followingLoading } =
    useGetFollowingQuery(
      { userId: profile?.id ?? "", pageSize: 50 },
      {
        skip:
          !followModal.open || followModal.type !== "following" || !profile?.id,
      },
    );

  const modalUsers: IFollower[] =
    followModal.type === "followers"
      ? (followersData?.data ?? [])
      : (followingData?.data ?? []);
  const modalLoading =
    followModal.type === "followers" ? followersLoading : followingLoading;

  // Determine which posts to display
  let displayedPosts: IPost[] = [];
  let isTabLoading = false;

  if (activeTab === "saved") {
    displayedPosts = savedPosts;
    isTabLoading = favLoading;
  } else if (activeTab === "reels") {
    displayedPosts = myPosts.filter((p) => isVideoFile(p.images?.[0] ?? ""));
    isTabLoading = postsLoading;
  } else {
    displayedPosts = myPosts;
    isTabLoading = postsLoading;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Could not load profile.
      </div>
    );
  }

  return (
    <div className="max-w-[935px] mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-16 mb-10">
        <div className="shrink-0">
          <div className="w-[150px] h-[150px] rounded-full border border-gray-200 overflow-hidden bg-gray-100">
              {profile.image ? (
                <img
                  src={`${FILE_URL}${profile.image}`}
                  alt={profile.userName}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = "/istockphoto-2151669184-612x612.jpg")
                  }
                />
              ) : (
                <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <h2 className="text-xl font-light">{profile.userName}</h2>
            <button className="px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
              Edit profile
            </button>
            <button className="px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
              View archive
            </button>
          </div>

          <div className="flex items-center gap-8 mb-5">
            <p className="text-sm">
              <span className="font-bold">
                {profile.postCount ?? myPosts.length}
              </span>
              <span className="text-[#262626]">posts</span>
            </p>
            <button
              onClick={() => setFollowModal({ type: "followers", open: true })}
              className="text-sm hover:opacity-60 transition-opacity"
            >
              <span className="font-bold">
                {(profile.followersCount ?? 0).toLocaleString()}
              </span>
              <span className="text-[#262626]">followers</span>
            </button>
            <button
              onClick={() => setFollowModal({ type: "following", open: true })}
              className="text-sm hover:opacity-60 transition-opacity"
            >
              <span className="font-bold">
                {(profile.followingCount ?? 0).toLocaleString()}
              </span>
              <span className="text-[#262626]">following</span>
            </button>
          </div>

          <div className="text-sm space-y-1">
            {profile.fullName && (
              <p className="font-bold">{profile.fullName}</p>
            )}
            {profile.about && (
              <p className="text-[#262626] whitespace-pre-line">
                {profile.about}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex items-center justify-center gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 text-xs font-semibold tracking-widest border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#262626] text-[#262626]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid or empty state */}
      {isTabLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
        </div>
      ) : displayedPosts.length === 0 ? (
        activeTab === "posts" ? (
          <EmptyStateForPosts />
        ) : activeTab === "reels" ? (
          <EmptyStateForReels />
        ) : (
          <EmptyStateForSaved />
        )
      ) : (
        <div className="grid grid-cols-3 gap-[3px] mt-1">
          {displayedPosts.map((post) => (
            <PostThumbnail
              key={post.postId}
              post={post}
              onClick={() => setSelectedPost(post)}
            />
          ))}
        </div>
      )}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {/* Followers / Following Modal */}
      {followModal.open && (
        <FollowModal
          title={followModal.type === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          onClose={() => setFollowModal({ type: "followers", open: false })}
        />
      )}

      {/* Loading overlay for modal */}
      {modalLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProfileUi;
