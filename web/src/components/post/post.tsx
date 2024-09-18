"use client";

import api from "@/lib/api";

import { IComment } from "@/types/Comment";
import { IPost } from "@/types/Post";
import { IUser } from "@/types/User";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { MessageSquare, MessagesSquare, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Comment } from "./comment";
import { Like } from "./like";

dayjs.locale("pt-br");

export function Post({ user, post }: { user: IUser; post: IPost }) {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [userComments, setUserComments] = useState<IComment[]>();

  const handlePostDelete = async () => {
    try {
      await api.delete(`/post/${post.id}`);

      return toast.success("Sua publicação foi excluida!");
    } catch {
      toast.error("Erro ao excluir publicação");
    }
  };

  const handleCreateComment = async () => {
    try {
      const response = await api.post(`/post/${post.id}/comment`, {
        content: comment,
      });

      toast.success("Seu comentário foi salvo");

      setComment("");
      setUserComments((prevComments) => [
        ...(prevComments || []),
        response.data,
      ]);
    } catch (error) {
      toast.error("Erro ao salvar comentário");
    }
  };

  return (
    <div className="w-full md:max-w-2xl  flex flex-col gap-5 rounded-xl p-5 border-2 border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-3">
          <Image
            src={post.avatarUrl}
            width={60}
            height={60}
            draggable={false}
            alt="avatar-image"
            onClick={() => {
              router.push(`/profile/${post.userId}`);
            }}
            className="size-12 rounded-full outline-2 outline-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <p className="max-w-[140px] text-zinc-400 text-base">
              {post.userName}
            </p>
            <p className="text-nowrap text-zinc-500 text-sm">
              {dayjs(post.createdAt).format("D [de] MMMM [às] HH:mm")}
            </p>
          </div>
        </div>

        {post.userId == user.sub && (
          <span
            className="p-2 rounded-md cursor-pointer text-zinc-600 hover:text-red-600 hover:bg-red-600/20"
            onClick={handlePostDelete}
          >
            <Trash2 className="size-4" />
          </span>
        )}
      </div>

      {post.content && (
        <p className="text-zinc-400 text-base text-wrap">{post.content}</p>
      )}

      {post.postImageUrl && (
        <Image
          src={post.postImageUrl!}
          width={1000}
          height={1000}
          draggable={false}
          alt="post-image"
          className="aspect-video w-full rounded-lg object-cover shadow-sm"
        />
      )}

      <div className="w-full flex items-center gap-4 pb-2 border-b-2 border-zinc-800">
        <Like user={user} post={post} />

        <div className="w-full flex gap-1 items-center">
          <div className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all">
            <MessageSquare className="size-5" />
          </div>

          {post.commentsCount != 0 && (
            <p className="text-zinc-500 text-sm font-medium">
              {post.commentsCount}
            </p>
          )}
        </div>
      </div>

      {post.comments && (
        <Comment comment={post.comments[post.comments.length - 1]} />
      )}

      {userComments &&
        userComments.map((comment) => {
          return <Comment comment={comment} />;
        })}

      {post.commentsCount > 1 && (
        <Button
          onClick={() => router.push(`/post/${post.id}`)}
          variant="ghost"
          className="p-2 hover:bg-zinc-900 hover:text-primary"
        >
          Ver mais comentários <MessagesSquare className="ml-2 size-4" />
        </Button>
      )}

      <div className="w-full flex items-center gap-3 px-1 pt-1 relative">
        <Image
          src={user.avatarUrl}
          width={60}
          height={60}
          draggable={false}
          alt="profile-image"
          onClick={() => {
            router.push(`/profile/${user.sub}`);
          }}
          className="size-10 rounded-full outline cursor-pointer outline-2 outline-primary"
        />
        <Input
          placeholder="Escreva um comentário..."
          type="text"
          className="bg-zinc-800 bg-opacity-20 py-2 px-4"
          value={comment}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setComment(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && comment) {
              handleCreateComment();
            }
          }}
        />
      </div>
    </div>
  );
}
