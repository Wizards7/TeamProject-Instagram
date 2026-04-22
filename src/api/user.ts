import { apiSlice } from "./apiSlice";
import { IBaseResponse, IPaginatedResponse, IUser } from "../types/interface";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IPaginatedResponse<IUser[]>, { UserName?: string; Email?: string; PageNumber?: number; PageSize?: number }>({
      query: (params) => ({
        url: "/User/get-users",
        params: params,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useLazyGetUsersQuery } = userApi;
