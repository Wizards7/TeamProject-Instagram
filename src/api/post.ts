import { apiSlice } from "./apiSlice";
import { IPost, IPagedResponse } from "../types/interface";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<IPagedResponse<IPost>, void>({
      query: () => `/Post/get-posts?PageSize=1000`,
      providesTags: ["Post"],
    }),
    likePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/Post/like-post?postId=${postId}`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Optimistic update for regular feed
        const patchFeed = dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.data.find((p) => p.postId === postId);
            if (post) {
              const isLiking = !post.postLike;
              post.postLike = isLiking;
              post.postLikeCount += isLiking ? 1 : -1;
            }
          })
        );
        // Optimistic update for Reels
        const patchReels = dispatch(
          postApi.util.updateQueryData("getReels", undefined, (draft) => {
            const reel = draft.data.find((p) => p.postId === postId);
            if (reel) {
              const isLiking = !reel.postLike;
              reel.postLike = isLiking;
              reel.postLikeCount += isLiking ? 1 : -1;
            }
          })
        );
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
      providesTags: ["Post"],
    }),
    addComment: builder.mutation<void, { postId: number; comment: string }>({
      query: ({ postId, comment }) => ({
        url: `/Post/add-comment`,
        method: "POST",
        params: { postId, comment },
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { 
  useGetPostsQuery, 
  useLikePostMutation, 
  useGetReelsQuery, 
  useAddCommentMutation 
} = postApi;
