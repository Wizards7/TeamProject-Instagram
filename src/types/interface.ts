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
  sendUserId: string;
  sendUserName: string;
  sendUserImage: string;
  receiveUserId: string;
  receiveUserName: string;
  receiveUserImage: string;
  // UI helpers
  lastMessage?: string;
  messages?: IMessage[];
}

export interface IMessage {
  userId: string;
  userName: string;
  userImage: string;
  messageId: number;
  chatId: number;
  messageText: string | null;
  sendMassageDate: string;
  file: string | null;
}

export interface IUser {
  id: string;
  userName: string;
  fullName: string;
  avatar?: string;
  image?: string | null;
  subscribersCount?: number;
  email?: string;
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
  id?: string;
  userId?: string;
  userName: string;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  image: string | null;
  about: string | null;
  gender?: 0 | 1 | null;
  postCount: number;
  followingCount: number;
  followersCount: number;
}

export interface IComment {
  postCommentId: number;
  userId: string;
  userName: string;
  userImage: string | null;
  dateCommented: string;
  comment: string;
}

export interface IPost {
  postId: number;
  userId: string;
  userName: string;
  userImage: string | null;
  datePublished: string;
  images: string[];
  postLike: boolean;
  postLikeCount: number;
  userLikes: string | null;
  commentCount: number;
  comments: IComment[];
  postView: number;
  userViews: string | null;
  postFavorite: boolean;
  userFavorite: string | null;
  title: string | null;
  content: string | null;
}

export interface IPagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  data: T[];
  errors: string[];
  statusCode: number;
}

export interface IStoryViewer {
  userName: string;
  name: string;
  viewCount: number;
  viewLike: number;
}

export interface IStory {
  id: number;
  fileName: string;
  postId: number | null;
  createAt: string;
  userId: string;
  userAvatar: string | null;
  userName?: string; // Often needed for UI
  viewerDto?: IStoryViewer;
  liked?: boolean;
  likedCount?: number;
}

export interface IStoryViewResponse {
  id: number;
  viewUserId: string;
  storyId: number;
}

export interface IFollower {
  id: string;
  userName: string;
  fullName: string;
  image: string | null;
  isFollowing?: boolean;   
}

export interface FollowModalProps {
  title: string;
  users: IFollower[];
  onClose: () => void;
}