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

// Basic response structure (adjust if your API returns something else like data/token)
export interface IAuthResponse {
  statusCode: number;
  message: string;
  data: string; // Typically the token is here
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

export interface IStory {
  storyId: number;
  userId: string;
  userName: string;
  userImage: string | null;
  image: string;
  datePublished: string;
}

export interface IUser {
  id: string;
  userName: string;
  fullName: string;
  image: string | null;
  email: string;
}

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
