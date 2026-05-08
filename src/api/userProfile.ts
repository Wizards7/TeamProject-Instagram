import { apiSlice } from "./apiSlice";
import { IPost, IPaginatedResponse, IPagedResponse, IUserProfile, IFollower } from "../types/interface";

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

    getMyPosts: builder.query<IPagedResponse<IPost>, void>({
      query: () => "/Post/get-my-posts?PageSize=100",
      providesTags: ["Post"],
    }),

    getPostFavorites: builder.query<
      IPagedResponse<IPost>,
      { PageNumber?: number; PageSize?: number }
    >({
      query: (params) => ({
        url: "/UserProfile/get-post-favorites",
        params,
      }),
      providesTags: ["Post"],
    }),

    getFollowers: builder.query<{ data: IFollower[] }, { userId: string; pageSize?: number }>({
      query: ({ userId, pageSize }) => ({
        url: `/FollowingRelationShip/get-subscribers`,
        params: {
          UserId: userId,
          PageSize: pageSize || 50,
        },
      }),
      transformResponse: (response: any) => {
        let items = [];
        
        // 1. Try to find the array in common locations
        if (Array.isArray(response)) {
          items = response;
        } else if (response && Array.isArray(response.data)) {
          items = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response && response.data && Array.isArray(response.data.list)) {
          items = response.data.list;
        } else if (response && Array.isArray(response.list)) {
          items = response.list;
        } else if (response && response.data && typeof response.data === "object") {
          // Check for any property that might be an array
          const possibleArray = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleArray) items = possibleArray as any[];
        }

        return {
          data: items.map((item: any) => {
            const user = item.userShortInfo || item.userInfo || item;
            return {
              id: String(user.userId || user.id || user.subscriberUserId || user.followingUserId || user.pk || user.PK || ""),
              userName: user.userName || user.username || user.userName || "unknown",
              fullName: user.fullname || user.fullName || user.firstName || user.userName || "",
              image: user.userPhoto || user.image || user.userImage || user.avatar || user.userAvatar || null,
            };
          }),
        };
      },
      providesTags: ["Following"],
    }),

    getFollowing: builder.query<{ data: IFollower[] }, { userId: string; pageSize?: number }>({
      query: ({ userId, pageSize }) => ({
        url: `/FollowingRelationShip/get-subscriptions`,
        params: {
          UserId: userId,
          PageSize: pageSize || 50,
        },
      }),
      transformResponse: (response: any) => {
        let items = [];
        
        if (Array.isArray(response)) {
          items = response;
        } else if (response && Array.isArray(response.data)) {
          items = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response && response.data && Array.isArray(response.data.list)) {
          items = response.data.list;
        } else if (response && Array.isArray(response.list)) {
          items = response.list;
        } else if (response && response.data && typeof response.data === "object") {
          const possibleArray = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleArray) items = possibleArray as any[];
        }

        return {
          data: items.map((item: any) => {
            const user = item.userShortInfo || item.userInfo || item;
            return {
              id: String(user.userId || user.id || user.subscriberUserId || user.followingUserId || user.pk || user.PK || ""),
              userName: user.userName || user.username || user.userName || "unknown",
              fullName: user.fullname || user.fullName || user.firstName || user.userName || "",
              image: user.userPhoto || user.image || user.userImage || user.avatar || user.userAvatar || null,
            };
          }),
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
      async onQueryStarted({ followingUserId }, { dispatch, getState, queryFulfilled }) {
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

        // Get myId from the profile query
        const state = getState() as any;
        const myProfile = state.api.queries['getMyProfile(undefined)']?.data?.data;
        const myId = myProfile?.id || myProfile?.userId;

        // 4. Optimistically update getFollowing list
        const patchFollowingList = dispatch(
          userProfileApi.util.updateQueryData("getFollowing", { userId: myId || "" }, (draft) => {
            if (draft?.data) {
              // We don't have all details, but we can push a partial user
              // to trigger the 'isFollowed' check in Suggestions
              draft.data.push({
                id: followingUserId,
                userName: "...", // Temporary name
                fullName: "...",
                image: null
              });
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchFollow.undo();
          patchMyProfile.undo();
          patchOtherProfile.undo();
          patchFollowingList.undo();
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
      async onQueryStarted({ followingUserId }, { dispatch, getState, queryFulfilled }) {
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
  overrideExisting: true,
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