import { apiSlice } from "./apiSlice";

import {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
} from "../types/interface";

export const loginApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: `/Account/login`,
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (newUser) => ({
        url: `/Account/register`,
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = loginApi;
