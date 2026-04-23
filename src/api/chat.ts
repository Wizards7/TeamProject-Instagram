import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import type { IBaseResponse, IChat, IMessage } from "../types/interface";

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery,
  tagTypes: ["Chat"],
  endpoints: (build) => ({
    getChats: build.query<IBaseResponse<IChat[]>, void>({
      query: () => "/Chat/get-chats",
      providesTags: ["Chat"],
    }),
    getChatById: build.query<IBaseResponse<IMessage[]>, number>({
      query: (chatId: number) => `/Chat/get-chat-by-id?chatId=${chatId}`,
      providesTags: (result: any, error: any, arg: number) => [{ type: "Chat" as const, id: arg }],
    }),
    createChat: build.mutation<IBaseResponse<any>, string>({
      query: (receiverUserId: string) => ({
        url: `/Chat/create-chat?receiverUserId=${receiverUserId}`,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
    sendMessage: build.mutation<IBaseResponse<any>, FormData>({
      query: (data: FormData) => ({
        url: "/Chat/send-message",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result: any, error: any, arg: FormData) => [
        { type: "Chat" as const, id: Number(arg.get("ChatId")) },
        "Chat"
      ],
    }),
    deleteMessage: build.mutation<IBaseResponse<any>, number>({
      query: (messageId: number) => ({
        url: `/Chat/delete-message?massageId=${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: build.mutation<IBaseResponse<any>, number>({
      query: (chatId: number) => ({
        url: `/Chat/delete-chat?chatId=${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
    clearChat: build.mutation<IBaseResponse<any>, number>({
      query: (chatId: number) => ({
        url: `/Chat/delete-all-messages-in-chat?chatId=${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
})

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useDeleteChatMutation,
  useClearChatMutation,
} = chatApi;
