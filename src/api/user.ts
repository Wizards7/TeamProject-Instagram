import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import type { IPaginatedResponse, IUser } from "../types/interface";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUsers: build.query<IPaginatedResponse<IUser[]>, { UserName?: string; Email?: string; PageNumber?: number; PageSize?: number }>({
      query: (params: any) => ({
        url: "/User/get-users",
        params,
      }),
      providesTags: ["User"],
    }),
  }),
})

export const { useGetUsersQuery, useLazyGetUsersQuery } = userApi;
