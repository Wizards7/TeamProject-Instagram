import { apiSlice } from "./apiSlice";
import { IPost, IPaginatedResponse, IUserProfile, IFollower } from "../types/interface";


export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getMyProfile: builder.query<{ data: IUserProfile }, void>({
      query: () => "/UserProfile/get-my-profile",
      providesTags: ["Profile"],
    }),

    getUserProfileById: builder.query<{ data: IUserProfile }, string>({
      query: (id) => ({
        url: "/UserProfile/get-user-profile-by-id",
        params: { id },
      }),
      providesTags: ["Profile"],
    }),

    getMyPosts: builder.query<IPaginatedResponse<IPost>, void>({
      query: () => "/Post/get-my-posts?PageSize=100",
      providesTags: ["Post"],
    }),

    getPostFavorites: builder.query<
      IPaginatedResponse<IPost>,
      { PageNumber?: number; PageSize?: number }
    >({
      query: (params) => ({
        url: "/UserProfile/get-post-favorites",
        params,
      }),
      providesTags: ["Post"],
    }),

    getFollowers: builder.query<{ data: IFollower[] }, { userId: string; pageNumber?: number; pageSize?: number }>({
      query: ({ userId, pageNumber = 1, pageSize = 30 }) => ({
        url: "/FollowingRelationShip/get-subscribers",
        params: { UserId: userId, pageNumber, pageSize },
      }),
    }),

    getFollowing: builder.query<{ data: IFollower[] }, { userId: string; pageNumber?: number; pageSize?: number }>({
      query: ({ userId, pageNumber = 1, pageSize = 30 }) => ({
        url: "/FollowingRelationShip/get-subscriptions",
        params: { UserId: userId, pageNumber, pageSize },
      }),
    }),

    addFollowingRelationShip: builder.mutation<void, { followingUserId: string }>({
      query: ({ followingUserId }) => ({
        url: "/FollowingRelationShip/add-following-relation-ship",
        method: "POST",
        params: { followingUserId },
      }),
      invalidatesTags: ["Profile", "Following"],
    }),

    deleteFollowingRelationShip: builder.mutation<void, { followingUserId: string }>({
      query: ({ followingUserId }) => ({
        url: "/FollowingRelationShip/delete-following-relation-ship",
        method: "DELETE",
        params: { followingUserId },
      }),
      invalidatesTags: ["Profile", "Following"],
    }),

    isFollowingUser: builder.query<{ data: boolean }, { followingUserId: string }>({
      query: ({ followingUserId }) => ({
        url: "/UserProfile/get-is-follow-user-profile-by-id",
        params: { followingUserId },
      }),
      providesTags: ["Following"],
    }),

    updateUserProfile: builder.mutation<void, { about: string; gender: number }>({
      query: (body) => ({
        url: "/UserProfile/update-user-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateUserImageProfile: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/UserProfile/update-user-image-profile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteUserImageProfile: builder.mutation<void, void>({
      query: () => ({
        url: "/UserProfile/delete-user-image-profile",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

  }),
});
export const {
  useGetMyProfileQuery,
  useGetUserProfileByIdQuery,
  useGetMyPostsQuery,
  useGetPostFavoritesQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useAddFollowingRelationShipMutation,
  useDeleteFollowingRelationShipMutation,
  useIsFollowingUserQuery,
  useUpdateUserProfileMutation,
  useUpdateUserImageProfileMutation,
  useDeleteUserImageProfileMutation,
} = userProfileApi;