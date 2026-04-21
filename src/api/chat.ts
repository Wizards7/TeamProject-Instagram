import { apiSlice } from "./apiSlice";
import { IBaseResponse, IChat, IMessage } from "../types/interface";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<IBaseResponse<IChat[]>, void>({
      query: () => "/Chat/get-chats",
      providesTags: ["Chat"],
    }),
    getChatById: builder.query<IBaseResponse<IChat>, number>({
      query: (chatId) => `/Chat/get-chat-by-id?chatId=${chatId}`,
      providesTags: (result, error, arg) => [{ type: "Chat", id: arg }],
    }),
    createChat: builder.mutation<IBaseResponse<any>, string>({
      query: (receiverUserId) => ({
        url: `/Chat/create-chat?receiverUserId=${receiverUserId}`,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
    sendMessage: builder.mutation<IBaseResponse<any>, FormData>({
      query: (data) => ({
        url: "/Chat/send-message",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Chat", id: Number(arg.get("ChatId")) },
      ],
    }),
    deleteMessage: builder.mutation<IBaseResponse<any>, number>({
      query: (messageId) => ({
        url: `/Chat/delete-message?massageId=${messageId}`,
        method: "DELETE",
      }),
    }),
    deleteChat: builder.mutation<IBaseResponse<any>, number>({
      query: (chatId) => ({
        url: `/Chat/delete-chat?chatId=${chatId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useDeleteChatMutation,
} = chatApi;
