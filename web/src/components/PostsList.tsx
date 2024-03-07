"use client";

import { useProvider } from "@/context/FeedContext";
import { User } from "@/types/User";
import { CardPost } from "./CardPost";

export default function PostsList({ user }: { user: User }) {
  const { posts } = useProvider();

  return (
    <>
      {posts.map((post) => {
        return <CardPost key={post.id} user={user} post={post} />;
      })}
    </>
  );
}
