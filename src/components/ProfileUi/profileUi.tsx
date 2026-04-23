"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { IFollower, IPost } from "../../types/interface";
import {
  useGetMyProfileQuery,
  useGetUserProfileByIdQuery,
  useGetMyPostsQuery,
  useGetPostFavoritesQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useIsFollowingUserQuery,
  useAddFollowingRelationShipMutation,
  useDeleteFollowingRelationShipMutation,
} from "../../api/userProfile";
import { useGetPostsQuery, useViewPostMutation } from "../../api/post";
import { useCreateChatMutation } from "../../api/chat";
import { FollowModal } from "../FollowModal";
import LogoutModal from "../LogoutModal";
import { logoutUser } from "@/src/utils/token";

const FILE_URL = "https://instagram-api.softclub.tj/images/";

const isVideoFile = (filename: string) => {
  const videoExtensions = [".mp4", ".mov", ".wmv", ".avi", ".webm", ".mkv"];
  return videoExtensions.some((ext) => filename?.toLowerCase().endsWith(ext));
};

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
  const locale = useLocale();
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
                  onError={(e) =>
                    (e.currentTarget.src =
                      "/istockphoto-2151669184-612x612.jpg")
                  }
                />
              ) : (
                <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-2/3 h-2/3 text-gray-300"
                    fill="currentColor"
                  >
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
                      onError={(e) =>
                        (e.currentTarget.src =
                          "/istockphoto-2151669184-612x612.jpg")
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-2/3 h-2/3 text-gray-300"
                        fill="currentColor"
                      >
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
                  <Link href={`/${locale}/profile/${c.userId}`}>
                    {c.userImage ? (
                      <img src={`${FILE_URL}${c.userImage}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#f2f2f2] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-gray-300" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </Link>
                </div>
                <p className="text-sm">
                  <Link href={`/${locale}/profile/${c.userId}`} className="font-semibold mr-1 hover:underline">{c.userName}</Link>
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
  <div className="flex flex-col items-center justify-center py-16 text-center max-w-[400px] mx-auto">
    <div className="w-[62px] h-[62px] mb-4 flex items-center justify-center rounded-full border border-black/80">
      <svg
        aria-label="Camera"
        color="currentColor"
        fill="currentColor"
        height="32"
        role="img"
        viewBox="0 0 24 24"
        width="32"
      >
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
        <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12z" />
      </svg>
    </div>
    <h3 className="text-[32px] font-extrabold mb-2 tracking-tight text-black">
      Share photos
    </h3>
    <p className="text-sm text-black/80 mb-6 leading-tight">
      When you share photos, they will appear on your profile.
    </p>
    <button className="text-[#0095f6] text-sm font-semibold hover:text-[#00376b] transition-colors">
      Share your first photo
    </button>
  </div>
);

const ProfileFooter: React.FC = () => (
  <footer className="mt-24 pb-12 px-4">
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
      {[
        "Meta",
        "About",
        "Blog",
        "Jobs",
        "Help",
        "API",
        "Privacy",
        "Terms",
        "Locations",
        "Instagram Lite",
        "Threads",
        "Contact uploading and non-users",
        "Meta Verified",
      ].map((link) => (
        <a
          key={link}
          href="#"
          className="text-xs text-gray-500 hover:underline"
        >
          {link}
        </a>
      ))}
    </div>
    <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
      <span className="flex items-center gap-1 cursor-pointer">
        English (UK)
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M21 8.5l-9 9-9-9L4.5 7l7.5 7.5L19.5 7z" />
        </svg>
      </span>
      <span>© 2026 Instagram from Meta</span>
    </div>
  </footer>
);

const EmptyStateForReels: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center max-w-[350px] mx-auto">
    <div className="w-[62px] h-[62px] mb-4 flex items-center justify-center rounded-full border-2 border-black">
      <svg
        aria-label="Reels"
        color="black"
        fill="black"
        height="32"
        role="img"
        viewBox="0 0 24 24"
        width="32"
      >
        <rect
          height="18"
          rx="3"
          width="18"
          x="3"
          y="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3 9h18M9 21V9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
    <h3 className="text-3xl font-extrabold mb-3 text-black">No reels yet</h3>
    <p className="text-sm text-gray-600 font-medium">
      Capture and share short, fun videos with your friends.
    </p>
  </div>
);

const EmptyStateForSaved: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center max-w-[350px] mx-auto">
    <div className="w-[62px] h-[62px] mb-4 flex items-center justify-center rounded-full border-2 border-black">
      <svg
        aria-label="Saved"
        color="black"
        fill="black"
        height="32"
        role="img"
        viewBox="0 0 24 24"
        width="32"
      >
        <polygon
          fill="none"
          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
          stroke="currentColor"
          strokeWidth="2"
        ></polygon>
      </svg>
    </div>
    <h3 className="text-3xl font-extrabold mb-3 text-black">
      Save items you like
    </h3>
    <p className="text-sm text-gray-600 font-medium">
      Save posts to see them here later. No one can see what you've saved.
    </p>
  </div>
);

const ProfileUi = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const locale = useLocale();
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);

  // --- Dynamic logic start ---
  const isMyProfile = !userId;
  const { data: myProfileData, isLoading: myProfileLoading } = useGetMyProfileQuery(undefined, { skip: !isMyProfile });
  const { data: otherProfileData, isLoading: otherProfileLoading } = useGetUserProfileByIdQuery(userId || "", { skip: isMyProfile });
  
  const profile = isMyProfile ? myProfileData?.data : otherProfileData?.data;
  const profileLoading = isMyProfile ? myProfileLoading : otherProfileLoading;

  const { data: myPostsData, isLoading: myPostsLoading } = useGetMyPostsQuery(undefined, { skip: !isMyProfile });
  const { data: allPostsData, isLoading: allPostsLoading } = useGetPostsQuery(undefined, { skip: isMyProfile });
  
  const postsLoading = isMyProfile ? myPostsLoading : allPostsLoading;

  const [addFollow, { isLoading: isFollowingLoading }] = useAddFollowingRelationShipMutation();
  const [deleteFollow, { isLoading: isUnfollowingLoading }] = useDeleteFollowingRelationShipMutation();
  const { data: followStatus } = useIsFollowingUserQuery({ followingUserId: userId || "" }, { skip: isMyProfile });
  const isFollowing = followStatus?.data ?? false;

  const [createChat] = useCreateChatMutation();
  const [viewPost] = useViewPostMutation();

  const handleFollow = async () => {
    if (!userId) return;
    try {
      if (isFollowing) {
        await deleteFollow({ followingUserId: userId }).unwrap();
      } else {
        await addFollow({ followingUserId: userId }).unwrap();
      }
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  const handleMessageClick = async () => {
    if (!userId) return;
    try {
      await createChat(userId).unwrap();
      router.push(`/${locale}/messages`);
    } catch (error) {
      console.error("Failed to create chat", error);
      router.push(`/${locale}/messages`);
    }
  };

  // Helper to handle various response structures
  const extractPosts = (data: any): IPost[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return (data as any)?.data?.data ?? [];
  };

  const myPosts = extractPosts(myPostsData);
  const otherPosts = extractPosts(allPostsData).filter(p => p.userId === userId);

  // Saved posts – only fetched when the tab is active and it's my profile
  const { data: favData, isLoading: favLoading } = useGetPostFavoritesQuery(
    { PageSize: 30 },
    { skip: activeTab !== "saved" || !isMyProfile },
  );
  const savedPosts = extractPosts(favData);

  const targetId = isMyProfile ? profile?.id : (profile?.userId || profile?.id);

  const { data: followersData, isFetching: followersLoading } =
    useGetFollowersQuery(
      { userId: targetId ?? "", pageSize: 50 },
      {
        skip:
          !followModal.open || followModal.type !== "followers" || !targetId,
      },
    );

  const { data: followingData, isFetching: followingLoading } =
    useGetFollowingQuery(
      { userId: targetId ?? "", pageSize: 50 },
      {
        skip:
          !followModal.open || followModal.type !== "following" || !targetId,
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
    displayedPosts = (isMyProfile ? myPosts : otherPosts).filter((p) => isVideoFile(p.images?.[0] ?? ""));
    isTabLoading = postsLoading;
  } else {
    displayedPosts = isMyProfile ? myPosts : otherPosts;
    isTabLoading = postsLoading;
  }
  // --- Dynamic logic end ---

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
    <div className="max-w-[935px] mx-auto px-4 py-8 text-black bg-white">
      {/* Profile header */}
      <div className="flex items-start gap-8 md:gap-20 mb-12">
        <div className="shrink-0 relative group" onClick={() => setShowAvatarPreview(true)}>
          <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden bg-gray-50 border border-gray-200 cursor-pointer">
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
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-2/3 h-2/3 text-gray-200"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          {/* Camera icon overlay - only if my profile */}
          {isMyProfile && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-full cursor-pointer">
              <svg fill="white" height="32" viewBox="0 0 24 24" width="32">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
                <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 pt-2 text-black">
          <div className="flex items-center justify-between mb-4 relative">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-normal text-gray-900">
                {profile.userName}
              </h2>
              {!isMyProfile && (
                <div className="flex gap-2">
                   <button 
                     onClick={handleFollow} 
                     disabled={isFollowingLoading || isUnfollowingLoading}
                     className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                       isFollowing 
                         ? "bg-[#efefef] hover:bg-gray-200 text-black" 
                         : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
                     }`}
                   >
                     {isFollowingLoading || isUnfollowingLoading ? "..." : (isFollowing ? "Following" : "Follow")}
                   </button>
                   <button onClick={handleMessageClick} className="px-4 py-1.5 bg-[#efefef] text-sm font-semibold rounded-lg hover:bg-gray-200 text-black">Message</button>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
              >
                <img src="/menu.svg" alt="Options" className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-[260px] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 z-20 py-2 overflow-hidden">
                    <button className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-50 transition-colors text-gray-900">
                      QR code
                    </button>
                    <button className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-50 transition-colors text-gray-900">
                      Notification
                    </button>
                    <button className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-50 transition-colors text-gray-900">
                      Settings and privacy
                    </button>
                    {isMyProfile && (
                      <>
                        <div className="h-[1px] bg-gray-100 my-1" />
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full px-4 py-3 text-left text-[15px] hover:bg-gray-50 transition-colors text-[#ed4956] font-medium"
                        >
                          Log out
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-sm text-gray-900">
              {profile.fullName || profile.userName}
            </p>
            {profile.about && <p className="text-sm mt-1 whitespace-pre-line">{profile.about}</p>}
          </div>

          <div className="flex items-center gap-5 mb-6 text-black">
            <div className="text-[15px]">
              <span className="font-bold mr-1">
                {profile.postCount ?? displayedPosts.length}
              </span>
              <span className="text-gray-900">posts</span>
            </div>
            <button
              onClick={() => setFollowModal({ type: "followers", open: true })}
              className="text-[15px] hover:opacity-70 transition-opacity"
            >
              <span className="font-bold mr-1">
                {(profile.followersCount ?? 0).toLocaleString()}
              </span>
              <span className="text-gray-900">follower</span>
            </button>
            <button
              onClick={() => setFollowModal({ type: "following", open: true })}
              className="text-[15px] hover:opacity-70 transition-opacity"
            >
              <span className="font-bold mr-1">
                {(profile.followingCount ?? 0).toLocaleString()}
              </span>
              <span className="text-gray-900">following</span>
            </button>
          </div>
        </div>
      </div>

      {isMyProfile && (
        <div className="flex gap-2 mb-12">
          <button className="flex-1 py-2 bg-[#efefef] text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors text-black">
            Edit Profile
          </button>
          <button className="flex-1 py-2 bg-[#efefef] text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors text-black">
            View archive
          </button>
        </div>
      )}

      {isMyProfile && (
        <div className="flex gap-8 mb-12 px-4">
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-[77px] h-[77px] rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
              <svg
                aria-label="Plus icon"
                color="black"
                fill="black"
                height="44"
                role="img"
                viewBox="0 0 24 24"
                width="44"
              >
                <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.4.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.4.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.8-.8-.8z"></path>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-900">New</span>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200">
        <div className="flex items-center justify-center gap-16">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 py-4 text-xs font-semibold tracking-widest border-t transition-colors ${
              activeTab === "posts"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-500"
            }`}
          >
            <svg
              aria-label="Posts"
              color="currentColor"
              fill="currentColor"
              height="12"
              role="img"
              viewBox="0 0 24 24"
              width="12"
            >
              <rect
                fill="none"
                height="18"
                rx="0"
                stroke="currentColor"
                strokeWidth="2"
                width="18"
                x="3"
                y="3"
              ></rect>
              <line
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                x1="9"
                x2="9"
                y1="3"
                y2="21"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                x1="15"
                x2="15"
                y1="3"
                y2="21"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="9"
                y2="9"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                x1="3"
                x2="21"
                y1="15"
                y2="15"
              ></line>
            </svg>
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-1.5 py-4 text-xs font-semibold tracking-widest border-t transition-colors ${
              activeTab === "reels"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-500"
            }`}
          >
            <svg
              aria-label="Reels"
              color="currentColor"
              fill="currentColor"
              height="12"
              role="img"
              viewBox="0 0 24 24"
              width="12"
            >
              <rect
                height="18"
                rx="2"
                width="18"
                x="3"
                y="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M7 3v18M17 3v18M3 7h4M3 12h4M3 17h4M17 7h4M17 12h4M17 17h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            REELS
          </button>
          {isMyProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-1.5 py-4 text-xs font-semibold tracking-widest border-t transition-colors ${
                activeTab === "saved"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-500"
              }`}
            >
              <svg
                aria-label="Saved"
                color="currentColor"
                fill="currentColor"
                height="12"
                role="img"
                viewBox="0 0 24 24"
                width="12"
              >
                <polygon
                  fill="none"
                  points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                  stroke="currentColor"
                  strokeWidth="2"
                ></polygon>
              </svg>
              SAVED
            </button>
          )}
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
              onClick={() => {
                setSelectedPost(post);
                viewPost(post.postId);
              }}
            />
          ))}
        </div>
      )}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {followModal.open && (
        <FollowModal
          title={followModal.type === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          onClose={() => setFollowModal({ type: "followers", open: false })}
        />
      )}

      {modalLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0095f6] rounded-full animate-spin" />
        </div>
      )}

      <ProfileFooter />

      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}

      {/* Avatar Preview Modal */}
      {showAvatarPreview && (
        <div 
          className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4"
          onClick={() => setShowAvatarPreview(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:opacity-70 z-[120]"
            onClick={() => setShowAvatarPreview(false)}
          >
            <svg fill="currentColor" height="32" viewBox="0 0 24 24" width="32"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-full overflow-hidden aspect-square flex items-center justify-center shadow-2xl border-4 border-white/20" onClick={(e) => e.stopPropagation()}>
            {profile.image ? (
              <img 
                src={`${FILE_URL}${profile.image}`} 
                alt={profile.userName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-64 h-64 md:w-96 md:h-96 bg-gray-50 flex items-center justify-center">
                 <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-gray-200" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                 </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileUi;
