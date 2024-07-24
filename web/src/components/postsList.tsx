"use client";

import { useProvider } from "@/context/FeedContext";
import { User } from "@/types/User";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Post } from "./post";
import sphere from "/public/sphere-logo.svg";

dayjs.locale("pt-br");

export default function PostsList({ user }: { user: User }) {
  const { posts } = useProvider();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  return (
    <>
      {posts.length != 0 ? (
        posts.map((post) => {
          return <Post key={post.id} user={user} post={post} />;
        })
      ) : (
        <>
          {isLoading ? (
            <Loader2 className="size-8 animate-spin text-primary mt-3" />
          ) : (
            <div className="w-full md:max-w-2xl  flex flex-col gap-5 rounded-xl p-5 border-2 border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-3">
                  <Image
                    src={sphere}
                    width={60}
                    height={60}
                    draggable={false}
                    alt="avatar-image"
                    className="size-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="max-w-[140px] text-primary text-base">
                      Sphere
                    </p>
                    <p className="max-w-[140px] text-zinc-500 text-sm">
                      {dayjs(Date.now()).format("D [de] MMMM")}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-zinc-400 text-base text-wrap">
                Adicione amigos ou faça uma postagem!
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
