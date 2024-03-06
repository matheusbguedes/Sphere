export interface Posts {
  id: string;
  userName: string;
  userId: string;
  avatarUrl: string;
  content: string;
  postImageUrl: string | null;
  likes: number;
  userIdLiked: UserLike[];
  createdAt: Date;
}

export interface UserLike {
  id: string;
  userName: string;
  userId: string;
  avatarUrl: string;
}
