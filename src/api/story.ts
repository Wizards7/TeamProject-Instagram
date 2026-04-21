import { apiSlice } from "./apiSlice";
import { IStory } from "../types/interface";

export const storyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query<IStory[], void>({
      query: () => "/Story/get-stories",
    }),
  }),
});

export const { useGetStoriesQuery } = storyApi;
