import { apiSlice } from "./apiSlice";
import { IStory, IBaseResponse, IStoryViewResponse } from "../types/interface";

export const storyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query<IBaseResponse<IStory[]>, void>({
      query: () => "/Story/get-stories",
      providesTags: ["Story"],
    }),

    getUserStories: builder.query<IBaseResponse<IStory[]>, string>({
      query: (userId) => `/Story/get-user-stories/${userId}`,
      providesTags: ["Story"],
    }),

    getMyStories: builder.query<IBaseResponse<IStory[]>, void>({
      query: () => "/Story/get-my-stories",
      providesTags: ["Story"],
    }),

    getStoryById: builder.query<IBaseResponse<IStory>, number>({
      query: (id) => ({
        url: "/Story/GetStoryById",
        params: { id },
      }),
      providesTags: ["Story"],
    }),

    addStory: builder.mutation<IBaseResponse<string>, { image: File; postId?: number }>({
      query: ({ image, postId }) => {
        const formData = new FormData();
        formData.append("Image", image);
        return {
          url: "/Story/AddStories",
          method: "POST",
          params: postId ? { PostId: postId } : {},
          body: formData,
        };
      },
      invalidatesTags: ["Story"],
    }),

    deleteStory: builder.mutation<IBaseResponse<boolean>, number>({
      query: (id) => ({
        url: "/Story/DeleteStory",
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: ["Story"],
    }),

    likeStory: builder.mutation<IBaseResponse<string>, number>({
      query: (storyId) => ({
        url: "/Story/LikeStory",
        method: "POST",
        params: { storyId },
      }),
      invalidatesTags: ["Story"],
    }),

    addStoryView: builder.mutation<IBaseResponse<IStoryViewResponse>, number>({
      query: (storyId) => ({
        url: "/Story/add-story-view",
        method: "POST",
        params: { StoryId: storyId },
      }),
      invalidatesTags: ["Story"],
    }),
  }),
});

export const {
  useGetStoriesQuery,
  useGetUserStoriesQuery,
  useGetMyStoriesQuery,
  useGetStoryByIdQuery,
  useAddStoryMutation,
  useDeleteStoryMutation,
  useLikeStoryMutation,
  useAddStoryViewMutation,
} = storyApi;
