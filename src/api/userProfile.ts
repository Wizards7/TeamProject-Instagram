import { apiSlice } from "./apiSlice";
import { IPost, IPagedResponse, IUserProfile, IFollower } from "../types/interface";


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
}),

deleteFollowingRelationShip: builder.mutation<void, { followingUserId: string }>({
  query: ({ followingUserId }) => ({
    url: "/FollowingRelationShip/delete-following-relation-ship",
    method: "DELETE",
    params: { followingUserId },
  }),
}),

isFollowingUser: builder.query<{ data: boolean }, { followingUserId: string }>({
  query: ({ followingUserId }) => ({
    url: "/UserProfile/get-is-follow-user-profile-by-id",
    params: { followingUserId },
  }),
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
} = userProfileApi;