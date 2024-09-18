"use client";

import api from "@/lib/api";
import { IPost } from "@/types/Post";
import { IUser } from "@/types/User";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Post } from "../post/post";
import { PostSphere } from "../post/postSphere";
import { Skeleton } from "../ui/skeleton";
import { NewPost } from "./newPost";

export default function Feed({ user }: { user: IUser }) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getFeed = async () => {
    try {
      const response = await api.get<IPost[]>("/post/feed");
      setPosts(response.data);
    } catch {
      toast.error("Erro ao resgatar postagens");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="w-full h-full flex flex-1 flex-col items-center gap-6 pb-6 px-3 mt-24">
      <NewPost user={user} />

      {isLoading ? (
        <Skeleton />
      ) : posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} user={user} post={post} />)
      ) : (
        <PostSphere
          content="Adicione amigos ou faça uma postagem!"
          user={user}
        />
      )}
    </div>
  );
}
