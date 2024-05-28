"use client";

import { useProvider } from "@/context/FeedContext";
import { api } from "@/lib/api";

import { Posts } from "@/types/Posts";
import { User } from "@/types/User";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Cookie from "js-cookie";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PostComments } from "./Comment";
import { Like } from "./Like";

dayjs.locale("pt-br");

export function CardPost({ user, post }: { user: User; post: Posts }) {
  const token = Cookie.get("token");
  const router = useRouter();
  const { getPosts } = useProvider();

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

    return getPosts();
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
              router.push(`/user/${post.userId}`);
            }}
            className="size-12 rounded-full outline outline-2 outline-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <p className="max-w-[140px] text-zinc-400 text-base">
              {post.userName}
            </p>
            <p className="max-w-[140px] text-zinc-500 text-sm">
              {dayjs(post.createdAt).format("D [de] MMMM")}
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

      <div className="w-full flex items-center gap-4">
        <Like user={user} post={post} />
        <PostComments user={user} post={post} />
      </div>
    </div>
  );
}
