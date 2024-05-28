"use client";

import { useProvider } from "@/context/FeedContext";
import { User } from "@/types/User";
import { HeartCrack, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CardPost } from "./CardPost";

export default function PostsList({ user }: { user: User }) {
  const { posts } = useProvider();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  return (
    <>
      {posts.length != 0 ? (
        posts.map((post) => {
          return <CardPost key={post.id} user={user} post={post} />;
        })
      ) : (
        <div className="h-screen flex flex-1 flex-col items-center justify-center gap-2">
          {isLoading ? (
            <Loader2 className="size-8 text-primary animate-spin" />
          ) : (
            <>
              <span className="text-primary">
                <HeartCrack className="size-6" />
              </span>
              <p className="text-lg font-medium text-zinc-600 ">
                Seu feed está <span className="text-primary">vazio</span>.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
