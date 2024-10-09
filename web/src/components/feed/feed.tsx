"use client";

import { useFeed } from "@/context/feedContext";
import { Post } from "../post/post";
import { PostSphere } from "../post/postSphere";
import { Skeleton } from "../ui/skeleton";
import { NewPost } from "./newPost";

export default function Feed() {
  const { posts, isLoading } = useFeed();

  return (
    <div className="w-full h-full flex flex-1 flex-col items-center gap-6 pb-6 px-3 mt-24">
      <NewPost />
      {isLoading ? (
        <Skeleton />
      ) : posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <PostSphere content="Adicione amigos ou faça uma postagem!" />
      )}
    </div>
  );
}
