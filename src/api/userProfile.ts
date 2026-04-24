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
      transformResponse: (response: any) => {
        return {
          data: response.data?.map((item: any) => ({
            id: item.userShortInfo?.userId || item.id,
            userName: item.userShortInfo?.userName,
            fullName: item.userShortInfo?.fullname,
            image: item.userShortInfo?.userPhoto,
          })) || []
        };
      },
      providesTags: ["Following"],
    }),

    getFollowing: builder.query<{ data: IFollower[] }, { userId: string; pageNumber?: number; pageSize?: number }>({
      query: ({ userId, pageNumber = 1, pageSize = 30 }) => ({
        url: "/FollowingRelationShip/get-subscriptions",
        params: { UserId: userId, pageNumber, pageSize },
      }),
      transformResponse: (response: any) => {
        return {
          data: response.data?.map((item: any) => ({
            id: item.userShortInfo?.userId || item.id,
            userName: item.userShortInfo?.userName,
            fullName: item.userShortInfo?.fullname,
            image: item.userShortInfo?.userPhoto,
          })) || []
        };
      },
      providesTags: ["Following"],
    }),

    addFollowingRelationShip: builder.mutation<void, { followingUserId: string }>({
      query: (params) => ({
        url: "/FollowingRelationShip/add-following-relation-ship",
        method: "POST",
        params,
      }),
      async onQueryStarted({ followingUserId }, { dispatch, queryFulfilled }) {
        // 1. Optimistically update follow status check
        const patchFollow = dispatch(
          userProfileApi.util.updateQueryData("isFollowingUser", { followingUserId }, (draft) => {
            if (draft) draft.data = true;
          })
        );
        
        // 2. Optimistically update my following count
        const patchMyProfile = dispatch(
          userProfileApi.util.updateQueryData("getMyProfile", undefined, (draft) => {
            if (draft?.data) {
                if (draft.data.followingCount !== undefined) draft.data.followingCount += 1;
                else if ((draft.data as any).subscriptionsCount !== undefined) (draft.data as any).subscriptionsCount += 1;
            }
          })
        );

        // 3. Optimistically update target user's followers count
        const patchOtherProfile = dispatch(
          userProfileApi.util.updateQueryData("getUserProfileById", followingUserId, (draft) => {
            if (draft?.data) {
                if (draft.data.followersCount !== undefined) draft.data.followersCount += 1;
                else if ((draft.data as any).subscribersCount !== undefined) (draft.data as any).subscribersCount += 1;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchFollow.undo();
          patchMyProfile.undo();
          patchOtherProfile.undo();
        }
      },
      invalidatesTags: ["Profile", "Following"],
    }),

    deleteFollowingRelationShip: builder.mutation<void, { followingUserId: string }>({
      query: (params) => ({
        url: "/FollowingRelationShip/delete-following-relation-ship",
        method: "DELETE",
        params,
      }),
      async onQueryStarted({ followingUserId }, { dispatch, queryFulfilled }) {
        // 1. Optimistically update follow status check
        const patchFollow = dispatch(
          userProfileApi.util.updateQueryData("isFollowingUser", { followingUserId }, (draft) => {
            if (draft) draft.data = false;
          })
        );

        // 2. Optimistically update my following count
        const patchMyProfile = dispatch(
          userProfileApi.util.updateQueryData("getMyProfile", undefined, (draft) => {
            if (draft?.data) {
                if (draft.data.followingCount !== undefined) draft.data.followingCount -= 1;
                else if ((draft.data as any).subscriptionsCount !== undefined) (draft.data as any).subscriptionsCount -= 1;
            }
          })
        );

        // 3. Optimistically update target user's followers count
        const patchOtherProfile = dispatch(
          userProfileApi.util.updateQueryData("getUserProfileById", followingUserId, (draft) => {
            if (draft?.data) {
                if (draft.data.followersCount !== undefined) draft.data.followersCount -= 1;
                else if ((draft.data as any).subscribersCount !== undefined) (draft.data as any).subscribersCount -= 1;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchFollow.undo();
          patchMyProfile.undo();
          patchOtherProfile.undo();
        }
      },
      invalidatesTags: ["Profile", "Following"],
    }),

    isFollowingUser: builder.query<{ data: boolean }, { followingUserId: string }>({
      query: ({ followingUserId }) => ({
        url: "/UserProfile/get-is-follow-user-profile-by-id",
        params: { followingUserId },
      }),
      providesTags: ["Following"],
    }),

    updateUserProfile: builder.mutation<void, { about: string; gender: number; firstName: string; lastName: string; userName: string }>({
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