import { apiSlice } from "./apiSlice";
import { IBaseResponse, IUserProfile } from "../types/interface";

export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<IBaseResponse<IUserProfile>, void>({
      query: () => "/UserProfile/get-my-profile",
      providesTags: ["Profile"],
    }),
    getUserProfileById: builder.query<IBaseResponse<IUserProfile>, string>({
      query: (id) => `/UserProfile/get-user-profile-by-id?id=${id}`,
    }),
  }),
});

export const { useGetMyProfileQuery, useGetUserProfileByIdQuery } = userProfileApi;
