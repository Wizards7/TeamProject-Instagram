import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import type { IBaseResponse, IUserProfile } from "../types/interface";

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (build) => ({
    getMyProfile: build.query<IBaseResponse<IUserProfile>, void>({
      query: () => "/UserProfile/get-my-profile",
      providesTags: ["Profile"],
    }),
    getUserProfileById: build.query<IBaseResponse<IUserProfile>, string>({
      query: (id: string) => `/UserProfile/get-user-profile-by-id?id=${id}`,
      providesTags: ["Profile"],
    }),
  }),
})

export const { useGetMyProfileQuery, useGetUserProfileByIdQuery } = userProfileApi;
