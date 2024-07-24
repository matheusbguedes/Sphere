"use client";

import { useProvider } from "@/context/FeedContext";
import { api } from "@/lib/api";

import { Posts } from "@/types/Posts";
import { User } from "@/types/User";
import Cookie from "js-cookie";
import { Heart } from "lucide-react";
import { useState } from "react";

export function Likes({ user, post }: { user: User; post: Posts }) {
  const isLiked = post.userIdLiked.some(
    (userLike) => userLike.userId === user.sub
  );

  const [like, setLike] = useState(isLiked);
  const token = Cookie.get("token");
  const { getPosts } = useProvider();

  const handlePostLike = async () => {
    await api.post(
      `post/like/${post.id}`,
      {
        userName: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setLike(!isLiked);

    return getPosts();
  };

  return (
    <div className="flex gap-1 items-center">
      <div
        onClick={handlePostLike}
        className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all"
      >
        {like ? (
          <Heart className="size-5 text-primary" />
        ) : (
          <Heart className="size-5" />
        )}
      </div>

      <p
        className={`text-primary text-sm font-medium text-nowrap ${
          like ? "text-primary" : "text-zinc-500"
        }`}
      >
        {post.likes}
      </p>
    </div>
  );
}
