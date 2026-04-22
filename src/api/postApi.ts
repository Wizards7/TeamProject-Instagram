import { apiSlice } from './apiSlice';

export interface IAddPostRequest {
  title: string;
  content: string;
  images: File[];
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  images: string[];
  userId: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addPost: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/Post/add-post',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Post'],
    }),
    
    getMyPosts: builder.query<IPost[], void>({
      query: () => '/Post/get-my-posts',
      providesTags: ['Post'],
    }),
    
    getFollowingPosts: builder.query<IPost[], { userId: string; pageNumber?: number; pageSize?: number }>({
      query: ({ userId, pageNumber = 1, pageSize = 10 }) => 
        `/Post/get-following-post?UserId=${userId}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
      providesTags: ['Post'],
    }),
    
    likePost: builder.mutation<any, { postId: number }>({
      query: ({ postId }) => ({
        url: `/Post/like-post?postId=${postId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),
    
    addComment: builder.mutation<any, { comment: string; postId: number }>({
      query: (body) => ({
        url: '/Post/add-comment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useAddPostMutation,
  useGetMyPostsQuery,
  useGetFollowingPostsQuery,
  useLikePostMutation,
  useAddCommentMutation,
} = postApi;