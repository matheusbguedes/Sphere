"use client";

import api from "@/lib/api";
import { IPost } from "@/types/Post";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function Like({ post }: { post: IPost }) {
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handlePostLike = async () => {
    try {
      await api.post(`post/${post.id}/like`);

      setIsLiked((prevLiked: boolean) => !prevLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      toast.error("Houve um erro, tente novamente!");
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div
        onClick={handlePostLike}
        className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all"
      >
        {isLiked ? (
          <Heart fill="#0066ff" className="size-5 text-primary" />
        ) : (
          <Heart className="size-5" />
        )}
      </div>

      {likesCount > 0 && (
        <p
          className={`text-primary text-sm font-medium text-nowrap ${
            isLiked ? "text-primary" : "text-zinc-500"
          }`}
        >
          {likesCount}
        </p>
      )}
    </div>
  );
}
