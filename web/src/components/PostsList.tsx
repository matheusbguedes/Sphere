'use client'

import { CardPost } from "./CardPost";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";

interface Posts {
  id: string;
  userName: string;
  avatarUrl: string;
  content: string;
  postImageUrl: string | null;
  createdAt: Date;
}

export default function PostsLists() {
  
  const [posts, setPosts] = useState<Posts[]>([])

  const GetPosts = async () => {
    const token = Cookie.get("token");

    const response = await api.get('/posts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    setPosts(response.data)
  
    if (posts.length === 0) {
      return;
    }
  }

  useEffect(() => {
    GetPosts();
  }, [])

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-6">
      {posts.map((post) => {
        return <CardPost key={post.id} post={post} />
      })}
    </div>
  );
}
