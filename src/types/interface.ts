export interface ILoginRequest {
  userName: string;
  password: string;
}

export interface IRegisterRequest {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Basic response structure
export interface IAuthResponse {
  statusCode: number;
  errors: string[];
  data: string; // Typically the token is here or a message
}

export interface IBaseResponse<T> {
  data: T;
  errors: string[];
  statusCode: number;
}

export interface IChat {
  chatId: number;
  chatName: string;
  chatPhoto: string;
  lastMessage: string;
  messages: IMessage[];
  receiverUserId: string;
}

export interface IMessage {
  id: number;
  messageText: string;
  file: string;
  isMine: boolean;
  senderUserId: string;
  receiverUserId: string;
  chatId: number;
}

export interface IUser {
  id: string;
  avatar: string;
  fullName: string;
  subscribersCount: number;
  userName: string;
}

export interface IPaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  data: T;
  errors: string[];
  statusCode: number;
}

export interface IUserProfile {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  image: string;
  about: string;
  postCount: number;
  followingCount: number;
  followersCount: number;
}
