import { apiSlice } from "./apiSlice";
import { IPost, IPagedResponse, IComment } from "../types/interface";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<IPagedResponse<IPost>, void>({
      query: () => `/Post/get-posts?PageSize=1000`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ postId }) => ({ type: "Post" as const, id: postId })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    likePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/Post/like-post?postId=${postId}`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const updateLike = (draft: IPagedResponse<IPost>) => {
          const post = draft.data.find((p) => p.postId === postId);
          if (post) {
            const isLiking = !post.postLike;
            post.postLike = isLiking;
            post.postLikeCount += isLiking ? 1 : -1;
          }
        };

        const patchFeed = dispatch(postApi.util.updateQueryData("getPosts", undefined, updateLike));
        const patchReels = dispatch(postApi.util.updateQueryData("getReels", undefined, updateLike));

        try {
          await queryFulfilled;
        } catch {
          patchFeed.undo();
          patchReels.undo();
        }
      },
    }),
    getReels: builder.query<IPagedResponse<IPost>, void>({
      query: () => `/Post/get-reels?PageSize=100`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ postId }) => ({ type: "Reels" as const, id: postId })),
              { type: "Reels", id: "LIST" },
            ]
          : [{ type: "Reels", id: "LIST" }],
    }),
    addComment: builder.mutation<void, { postId: number; comment: string }>({
      query: ({ postId, comment }) => ({
        url: `/Post/add-comment`,
        method: "POST",
        body: { postId, comment },
      }),
      async onQueryStarted({ postId, comment }, { dispatch, queryFulfilled, getState }) {
        // Optimistic update logic
        const state: any = getState();
        // Try multiple ways to get the user profile from cache
        const profile = 
            state.api?.queries?.['getMyProfile(undefined)']?.data?.data ||
            state.api?.queries?.['getMyProfile']?.data?.data;

        const tempComment: IComment = {
          postCommentId: Date.now(),
          userId: profile?.userId || profile?.id || "current-user",
          userName: profile?.userName || "You",
          userImage: profile?.image || null,
          comment: comment,
          dateCommented: new Date().toISOString(),
        };

        const updateComments = (draft: IPagedResponse<IPost>) => {
          const post = draft.data.find((p) => p.postId === postId);
          if (post) {
            post.commentCount += 1;
            if (!post.comments) post.comments = [];
            post.comments.push(tempComment);
          }
        };

        const patchFeed = dispatch(postApi.util.updateQueryData("getPosts", undefined, updateComments));
        const patchReels = dispatch(postApi.util.updateQueryData("getReels", undefined, updateComments));

        try {
          await queryFulfilled;
        } catch {
          patchFeed.undo();
          patchReels.undo();
        }
      },
      // We still invalidate but only the specific tags to ensure consistency 
      // while the optimistic update handles the immediate "automatic rendering"
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Reels", id: postId }
      ],
    }),
    deleteComment: builder.mutation<void, number>({
      query: (commentId) => ({
        url: `/Post/delete-comment?commentId=${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post", "Reels"],
    }),
    addPostFavorite: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/Post/add-post-favorite`,
        method: "POST",
        body: { postId },
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const updateFav = (draft: IPagedResponse<IPost>) => {
          const post = draft.data.find((p) => p.postId === postId);
          if (post) {
            post.postFavorite = !post.postFavorite;
          }
        };
        const patchFeed = dispatch(postApi.util.updateQueryData("getPosts", undefined, updateFav));
        const patchReels = dispatch(postApi.util.updateQueryData("getReels", undefined, updateFav));
        try {
          await queryFulfilled;
        } catch {
          patchFeed.undo();
          patchReels.undo();
        }
      },
      invalidatesTags: ["Post", "Profile"],
    }),
    addPost: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `/Post/add-post`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post", "Profile"],
    }),
    viewPost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/Post/view-post?postId=${postId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useGetPostsQuery, 
  useLikePostMutation, 
  useGetReelsQuery, 
  useAddCommentMutation,
  useDeleteCommentMutation,
  useAddPostFavoriteMutation,
  useAddPostMutation,
  useViewPostMutation 
} = postApi;
