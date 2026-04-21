import { apiSlice } from "./apiSlice";
import { IUserProfile } from "../types/interface";

export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<{ data: IUserProfile }, void>({
      query: () => "/UserProfile/get-my-profile",
    }),
  }),
});

export const {
  useGetMyProfileQuery,
} = userProfileApi;