import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Login", "Todo", "Profile", "Chat", "Post", "Following"],
  endpoints: () => ({}),
});
