import { apiSlice } from "./apiSlice";
import { IPost, IPagedResponse, IUserProfile } from "../types/interface";


export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getMyProfile: builder.query<{ data: IUserProfile }, void>({
      query: () => "/UserProfile/get-my-profile",
    }),

    getUserProfileById: builder.query<{ data: IUserProfile }, string>({
      query: (id) => ({
        url: "/UserProfile/get-user-profile-by-id",
        params: { id },
      }),
    }),

    getMyPosts: builder.query<IPagedResponse<IPost>, void>({
      query: () => "/Post/get-my-posts",
    }),

    getPostFavorites: builder.query<
      IPagedResponse<IPost>,
      { PageNumber?: number; PageSize?: number }
    >({
      query: (params) => ({
        url: "/UserProfile/get-post-favorites",
        params,
      }),
    }),

  }),
});
export const {
  useGetMyProfileQuery,
  useGetUserProfileByIdQuery,
  useGetMyPostsQuery,
  useGetPostFavoritesQuery,
} = userProfileApi;