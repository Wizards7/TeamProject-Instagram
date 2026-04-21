import { apiSlice } from "./apiSlice";
import { IUser, IPagedResponse } from "../types/interface";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IPagedResponse<IUser>, { PageNumber?: number, PageSize?: number }>({
      query: (params) => ({
        url: "/User/get-users",
        params,
      }),
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
