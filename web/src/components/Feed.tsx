"use client";

import { PostsProvider } from "@/lib/context";
import { User } from "@/types/User";

import { NewPost } from "./NewPost";
import PostsList from "./PostsList";

export default function Feed({ user }: { user: User }) {
  return (
    <PostsProvider>
      <div className="w-full flex flex-col items-center justify-center gap-6 p-6 mt-20 relative">
        <NewPost user={user} />
        <PostsList user={user} />
      </div>
    </PostsProvider>
  );
}
