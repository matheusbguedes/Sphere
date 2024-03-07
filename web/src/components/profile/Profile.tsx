"use client";

import { Button } from "@/components/ui/button";

import { useProvider } from "@/context/ProfileContext";
import { User } from "@/types/User";
import { ChevronLeft, CircleDashed, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CardPost } from "./CardPost";

export default function Profile({ user }: { user: User }) {
  const { profile, posts } = useProvider();

  if (!profile || !posts) {
    return;
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-zinc-900 gap-6 pb-8">
      <div className="w-full h-32 bg-zinc-800" />
      <Link
        className="absolute top-6 left-6 text-zinc-900 hover:text-primary cursor-pointer"
        href="/"
      >
        <ChevronLeft className="size-6" />
      </Link>
      <div className="w-full flex items-center justify-between px-20 pb-6 -mt-24">
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

        <Button variant="outline" size="lg" className="text-lg">
          Adicionar <UserPlus className="ml-3 size-5" />
        </Button>
      </div>

      {profile.postsCount == 0 && (
        <p className="flex flex-col items-center justify-center font-medium text-zinc-600 text-base gap-2 mt-6">
          <span className="text-primary">
            <CircleDashed className="size-5" />
          </span>{" "}
          Nenhuma publicação
        </p>
      )}

      {posts.map((post) => {
        return <CardPost key={post.id} user={user} post={post} />;
      })}
    </main>
  );
}
