"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { PostComment, Posts } from "@/types/Posts";
import { User } from "@/types/User";
import Cookie from "js-cookie";
import { Check, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Comments({ user, post }: { user: User; post: Posts }) {
  const [comments, setComments] = useState<PostComment[]>();
  const [content, setContent] = useState("");

  const router = useRouter();

  const token = Cookie.get("token");

  const getComments = async () => {
    try {
      const response = await api.get(`/post/comments/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setComments(response.data);
    } catch (error) {}
  };

  const handleCreateComment = async () => {
    try {
      const response = await api.post(
        `/post/comments/${post.id}`,
        {
          postId: post.id,
          userId: user.sub,
          userName: user.name,
          avatarUrl: user.avatarUrl,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Seu comentário foi salvo", {
        style: {
          background: "rgb(39 39 42)",
          color: "rgb(161 161 170)",
        },
        iconTheme: {
          primary: "#0066FF",
          secondary: "rgb(39 39 42)",
        },
      });
    } catch (error) {
      toast.error("Erro ao salvar comentário", {
        style: {
          background: "rgb(39 39 42)",
          color: "rgb(161 161 170)",
        },
        iconTheme: {
          primary: "#0066FF",
          secondary: "rgb(39 39 42)",
        },
      });
    }
  };

  return (
    <div className="w-full flex gap-1 items-center">
      <Dialog>
        <DialogTrigger onClick={getComments}>
          <div className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all">
            <MessageCircle className="size-5" />
          </div>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-none max-h-[500px] overflow-scroll scrollbar">
          <DialogHeader>
            <DialogTitle className="text-zinc-400">Comentários</DialogTitle>
          </DialogHeader>

          <div className="w-full max-h-full flex flex-col py-2 overflow-scroll scrollbar">
            <div className="w-full flex items-center gap-3 px-1 pb-4 pt-1">
              <Image
                src={user.avatarUrl}
                width={60}
                height={60}
                draggable={false}
                alt="profile-image"
                onClick={() => {
                  router.push(`/user/${user.sub}`);
                }}
                className="size-12 rounded-full outline cursor-pointer outline-2 outline-primary"
              />
              <Input
                placeholder="Faça um comentário"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setContent(e.target.value)
                }
              />
              <Button
                onClick={handleCreateComment}
                disabled={!content}
                variant="outline"
                className="p-2"
              >
                <Check className="size-5" />
              </Button>
            </div>

            <div className="h-0.5 w-full bg-primary/20 rounded-sm" />

            {comments?.length! > 0 ? (
              comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between px-1 py-4 border-b border-zinc-800 last:border-none last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Image
                      src={comment.avatarUrl}
                      width={60}
                      height={60}
                      draggable={false}
                      alt="profile-image"
                      onClick={() => {
                        router.push(`/user/${comment.userId}`);
                      }}
                      className="size-12 rounded-full outline cursor-pointer hover:outline-2 hover:outline-primary"
                    />
                    <div className="flex flex-col">
                      <p className="text-zinc-400 text-base">
                        {comment.userName}
                      </p>
                      <p className="text-zinc-500 text-sm">{comment.content}</p>
                    </div>
                  </div>
                  {comment.userId == user.sub && (
                    <span className="p-2 rounded-md cursor-pointer text-zinc-600 hover:text-red-600 hover:bg-red-600/20">
                      <Trash2 className="size-4" />
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="w-full flex justify-center items-center pt-6 text-zinc-600 text-base font-medium">
                Sem comentários
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-zinc-500 text-sm font-medium">{post.comments}</p>
    </div>
  );
}
