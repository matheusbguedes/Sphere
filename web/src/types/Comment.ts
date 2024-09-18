export interface IComment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  postId: string;
  content: string;
  createdAt: Date;
}
