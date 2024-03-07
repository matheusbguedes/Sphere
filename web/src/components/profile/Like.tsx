"use client";

import { useProvider } from "@/context/ProfileContext";
import { api } from "@/lib/api";

import { Posts } from "@/types/Posts";
import { User } from "@/types/User";
import Cookie from "js-cookie";
import { Heart } from "lucide-react";
import { useState } from "react";

export function Like({ user, post }: { user: User; post: Posts }) {
  const isLiked = post.userIdLiked.some(
    (userLike) => userLike.userId === user.sub
  );

  const [like, setLike] = useState(isLiked);
  const token = Cookie.get("token");
  const { getPosts, getProfile } = useProvider();

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

    getPosts();
    getProfile();
  };

  return (
    <div className="w-full flex gap-3 items-center">
      <span
        onClick={handlePostLike}
        className={`flex cursor-pointer items-center text-sm transition-colors hover:text-primary ${
          like ? "text-primary" : "text-zinc-500"
        }`}
      >
        <Heart className="size-5" />
      </span>

      {post.likes > 0 && (
        <p className="text-zinc-500 text-sm">
          {post.likes} {post.likes == 1 ? "curtida" : "curtidas"}
        </p>
      )}
    </div>
  );
}
