"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useGetPostFavoritesQuery } from "@/src/api/userProfile";
import { PostThumbnail, PostModal } from "./ProfileUi/profileUi";
import { IPost } from "@/src/types/interface";

export default function SavedUi() {
  const t = useTranslations("Profile");
  const { data: savedData, isLoading } = useGetPostFavoritesQuery({ PageSize: 100 });
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const savedPosts = savedData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[935px] mx-auto px-4 py-8 min-h-[calc(100vh-64px)] bg-background">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Saved</h1>
      </div>

      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {savedPosts.map((post) => (
            <PostThumbnail
              key={post.postId}
              post={post}
              onClick={() => setSelectedPost(post)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-border mt-8">
          <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mb-6">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-8 h-8 text-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">
            Save
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Save photos and videos that you want to see again. No one is
            notified, and only you can see what you've saved.
          </p>
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
