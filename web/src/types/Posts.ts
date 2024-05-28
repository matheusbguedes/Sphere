export interface Posts {
  id: string;
  userName: string;
  userId: string;
  avatarUrl: string;
  content: string;
  postImageUrl: string | null;
  likes: number;
  comments: number;
  userIdLiked: UserLike[];
  createdAt: Date;
}

export interface UserLike {
  id: string;
  userName: string;
  userId: string;
  avatarUrl: string;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  postId: string;
  content: string;
  createdAt: Date;
}
