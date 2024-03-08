export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isFriend: boolean;
  friendshipId: string;
  postsCount: number;
  likesCount: number;
  followersCount: number;
  followingCount: number;
}
