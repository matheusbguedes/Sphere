"use client";

import api from "@/lib/api";
import { IPost } from "@/types/Post";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PostView({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<IPost>();
  const getPost = async () => {
    try {
      const response = await api.get(`/post/${params.id}`);

      setPost(response.data);
    } catch (error) {
      toast.error("Erro ao resgatar postagem!");
    }
  };

  useEffect(() => {
    getPost();
  });

  return <main className="flex min-h-screen flex-col bg-zinc-900"></main>;
}
