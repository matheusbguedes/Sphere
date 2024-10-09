"use client";

import { Header } from "@/components/header";
import { Comment } from "@/components/post/comment";
import { Like } from "@/components/post/like";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/userContext";
import api from "@/lib/api";
import { IComment } from "@/types/Comment";
import { IPost } from "@/types/Post";
import dayjs from "dayjs";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Post({ params }: { params: { id: string } }) {
  const { user } = useUser();

  const router = useRouter();
  const [post, setPost] = useState<IPost>();

  const [comment, setComment] = useState("");
  const [userComments, setUserComments] = useState<IComment[]>();

  const [isLoading, setIsLoading] = useState(true);

  const getPost = async () => {
    try {
      const response = await api.get(`/post/${params.id}`);
      setPost(response.data);
    } catch (error) {
      toast.error("Erro ao resgatar postagem");
      return router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComment = async () => {
    try {
      const response = await api.post(`/post/${params.id}/comment`, {
        content: comment,
      });

      toast.success("Seu comentário foi salvo");

      setComment("");
      setUserComments((prevComments) => [
        ...(prevComments || []),
        response.data,
      ]);

      return post!.commentsCount++;
    } catch (error) {
      toast.error("Erro ao salvar comentário");
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center pt-6 bg-zinc-900">
        <Skeleton />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
      <Header />
      <div className="w-full h-full flex flex-1 flex-col items-center gap-4 py-6 mt-20">
        <div className="w-full md:max-w-2xl flex justify-center items-center relative">
          <div
            onClick={() => router.back()}
            className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all absolute left-0"
          >
            <ArrowLeft className="size-5" />
          </div>
          <p className="text-lg text-zinc-600 font-medium">
            Postagem de {post!.userName.split(" ")[0]}
          </p>
        </div>

        <div className="w-full md:max-w-2xl flex flex-col gap-5 rounded-xl p-5 border-2 border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-3">
              <Image
                src={post!.avatarUrl}
                width={60}
                height={60}
                draggable={false}
                alt="avatar-image"
                onClick={() => {
                  router.push(`/profile/${post!.userId}`);
                }}
                className="size-12 rounded-full cursor-pointer outline hover:outline-2 hover:outline-primary"
              />
              <div className="flex flex-col">
                <p className="max-w-[140px] text-zinc-400 text-base">
                  {post!.userName}
                </p>
                <p className="text-nowrap text-zinc-500 text-sm">
                  {dayjs(post!.createdAt).format("D [de] MMMM [às] HH:mm")}
                </p>
              </div>
            </div>
          </div>

          {post!.content && (
            <p className="text-zinc-400 text-base text-wrap">{post!.content}</p>
          )}

          {post!.postImageUrl && (
            <Image
              src={post!.postImageUrl!}
              width={1000}
              height={1000}
              draggable={false}
              alt="post-image"
              className="aspect-video w-full rounded-lg object-cover shadow-sm"
            />
          )}

          <div className="w-full flex items-center gap-4 pb-2 border-b-2 border-zinc-800">
            <Like post={post!} />

            <div className="w-full flex gap-1 items-center">
              <div className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all">
                <MessageSquare className="size-5" />
              </div>

              {post!.commentsCount != 0 && (
                <p className="text-zinc-500 text-sm font-medium">
                  {post!.commentsCount}
                </p>
              )}
            </div>
          </div>

          {post!.comments &&
            post!.comments.map((comment) => {
              return <Comment comment={comment} />;
            })}

          {userComments &&
            userComments.map((comment) => {
              return <Comment comment={comment} />;
            })}

          <div className="w-full flex items-center gap-3 px-1 pt-4 border-t-2 border-zinc-800">
            <Image
              src={user.avatarUrl}
              width={60}
              height={60}
              draggable={false}
              alt="profile-image"
              onClick={() => {
                router.push(`/profile/${user.sub}`);
              }}
              className="size-10 rounded-full cursor-pointer outline hover:outline-2 hover:outline-primary"
            />
            <Input
              placeholder="Escreva um comentário..."
              type="text"
              className="bg-zinc-800 bg-opacity-20 py-2 px-4"
              value={comment}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
              onKeyDown={(e: { key: string }) => {
                if (e.key === "Enter" && comment) {
                  handleCreateComment();
                }
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
