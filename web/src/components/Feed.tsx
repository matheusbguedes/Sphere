"use client";

import { FeedProvider } from "@/context/FeedContext";
import { User } from "@/types/User";

import { NewPost } from "./NewPost";
import PostsList from "./PostsList";

export default function Feed({ user }: { user: User }) {
  return (
    <FeedProvider>
      <div className="w-full flex flex-col items-center justify-center gap-6 p-3 mt-24">
        <NewPost user={user} />
        <PostsList user={user} />
      </div>
    </FeedProvider>
  );
}
