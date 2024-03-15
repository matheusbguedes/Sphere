"use client";

import { useProvider } from "@/context/FeedContext";
import { User } from "@/types/User";
import { CircleDashed } from "lucide-react";
import { CardPost } from "./CardPost";

export default function PostsList({ user }: { user: User }) {
  const { posts } = useProvider();

  return (
    <>
      {posts.length != 0 ? (
        posts.map((post) => {
          return <CardPost key={post.id} user={user} post={post} />;
        })
      ) : (
        <div className="h-screen flex flex-1 flex-col items-center justify-center gap-2">
          <span className="text-primary animate-pulse">
            <CircleDashed className="size-7" />
          </span>
          <p className="text-lg font-medium text-zinc-600 ">
            Nenhuma publicação
          </p>
        </div>
      )}
    </>
  );
}
