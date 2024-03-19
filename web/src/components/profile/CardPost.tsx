"use client";

import { useProvider } from "@/context/ProfileContext";
import { api } from "@/lib/api";

import { Posts } from "@/types/Posts";
import { User } from "@/types/User";
import dayjs from "dayjs";
import Cookie from "js-cookie";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Like } from "./Like";

export function CardPost({ user, post }: { user: User; post: Posts }) {
  const token = Cookie.get("token");

  const { getPosts, getProfile } = useProvider();

  const handlePostDelete = async () => {
    await api.delete(`/post/${post.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    toast.success("Sua publicação foi excluida!", {
      style: {
        background: "rgb(39 39 42)",
        color: "rgb(161 161 170)",
      },
      iconTheme: {
        primary: "#0066FF",
        secondary: "rgb(39 39 42)",
      },
    });

    getPosts();
    getProfile();
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
            className="size-12 rounded-full outline outline-2 outline-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <p className="max-w-[140px] text-zinc-400 text-base">
              {post.userName}
            </p>
            <p className="max-w-[140px] text-zinc-500 text-sm">
              {dayjs(post.createdAt).format("D[ de ]MMM")}
            </p>
          </div>
        </div>

        {post.userId == user.sub && (
          <Trash2
            onClick={handlePostDelete}
            className="size-5.5 p-1 cursor-pointer text-zinc-500  hover:hover:text-red-600"
          />
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

      <Like user={user} post={post} />
    </div>
  );
}
