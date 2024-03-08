"use client";

import { Button } from "@/components/ui/button";

import { useProvider } from "@/context/ProfileContext";
import { api } from "@/lib/api";
import { User } from "@/types/User";
import Cookie from "js-cookie";
import { ArrowLeft, CircleDashed, UserPlus, UserRoundX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { CardPost } from "./CardPost";

export default function Profile({ user }: { user: User }) {
  const { profile, posts, getProfile } = useProvider();

  if (!profile || !posts) {
    return;
  }
  const token = Cookie.get("token");

  const handleAddFriend = async () => {
    await api.post(
      `/friend/add`,
      { id: profile.id, userName: profile.name, avatarUrl: profile.avatarUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    getProfile();

    return toast.success(
      `Você começou a seguir ${profile.name.split(" ")[0]}`,
      {
        style: {
          background: "rgb(39 39 42)",
          color: "rgb(161 161 170)",
        },
        iconTheme: {
          primary: "#0066FF",
          secondary: "rgb(39 39 42)",
        },
      }
    );
  };

  const handleRemoveFriend = async () => {
    await api.delete(`/friend/remove/${profile.friendshipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    getProfile();

    return toast.success(
      `Você deixou de seguir ${profile.name.split(" ")[0]}`,
      {
        style: {
          background: "rgb(39 39 42)",
          color: "rgb(161 161 170)",
        },
        iconTheme: {
          primary: "#0066FF",
          secondary: "rgb(39 39 42)",
        },
      }
    );
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-zinc-900 gap-8 pb-5">
      <div className="w-full h-32 bg-zinc-800" />
      <Link
        className="absolute top-6 left-6 p-2 rounded-lg cursor-pointer text-zinc-900 hover:text-primary hover:bg-primary/10"
        href="/"
      >
        <ArrowLeft className="size-6" />
      </Link>
      <div className="w-full flex flex-col items-center justify-center -mt-24">
        <div className="w-max flex flex-col items-center justify-center gap-6">
          <Image
            src={profile.avatarUrl}
            width={1000}
            height={1000}
            draggable={false}
            alt="avatar-image"
            className="size-60 rounded-full outline outline-8 outline-zinc-900"
          />
          <h1 className="font-medium text-zinc-400 text-3xl">{profile.name}</h1>

          <div className="flex items-center justify-center gap-6">
            <p className="flex font-medium text-zinc-500 text-base gap-2">
              <span className="text-primary">{profile.followersCount}</span>
              {profile.followersCount == 1 ? "seguidor" : "seguidores"}
            </p>
            <p className="flex font-medium text-zinc-500 text-base gap-2">
              <span className="text-primary">{profile.followingCount}</span>
              seguindo
            </p>
          </div>
        </div>

        {profile.id != user.sub ? (
          profile.isFriend ? (
            <Button
              onClick={handleRemoveFriend}
              variant="outline"
              className="mt-6 border-zinc-600 text-zinc-600 hover:border-red-600 hover:bg-transparent hover:text-red-600"
            >
              Remover <UserRoundX className="ml-3 size-4" />
            </Button>
          ) : (
            <Button
              onClick={handleAddFriend}
              variant="outline"
              className="mt-6 border-zinc-600 text-zinc-600 hover:border-primary hover:bg-transparent hover:text-primary"
            >
              Adicionar <UserPlus className="ml-3 size-4" />
            </Button>
          )
        ) : (
          ""
        )}
      </div>

      {profile.postsCount == 0 && (
        <div className="h-full flex flex-1 flex-col items-center justify-center gap-2">
          <span className="text-primary">
            <CircleDashed className="size-5" />
          </span>
          <p className="text-base font-medium text-zinc-600 ">
            Nenhuma publicação
          </p>
        </div>
      )}

      <div className="w-full flex flex-col items-center justify-center gap-6 px-3">
        {posts.map((post) => {
          return <CardPost key={post.id} user={user} post={post} />;
        })}
      </div>
    </main>
  );
}
