import { IComment } from "./Comment";
import { ILike } from "./Like";

export interface IPost {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  content: string;
  postImageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  likes: ILike[] | null;
  comments: IComment[] | null;
  createdAt: Date;
}
