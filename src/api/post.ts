import { apiSlice } from "./apiSlice";
import { IPost, IPagedResponse } from "../types/interface";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<IPagedResponse<IPost>, void>({
      query: () => `/Post/get-posts?PageSize=1000`,
    }),
    likePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/Post/like-post?postId=${postId}`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.data.find((p) => p.postId === postId);
            if (post) {
              const isLiking = !post.postLike;
              post.postLike = isLiking;
              post.postLikeCount += isLiking ? 1 : -1;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetPostsQuery, useLikePostMutation } = postApi;
