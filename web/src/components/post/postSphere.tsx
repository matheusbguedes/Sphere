"use client";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import logo from "/public/sphere-logo.svg";

dayjs.locale("pt-br");

export function PostSphere({ content }: { content: string }) {
  return (
    <div className="w-full md:max-w-2xl  flex flex-col gap-5 rounded-xl p-5 border-2 border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-3">
          <Image
            src={logo}
            width={60}
            height={60}
            draggable={false}
            alt="avatar-image"
            className="size-12 rounded-full cursor-pointer"
          />
          <div className="flex flex-col">
            <p className="max-w-[140px] text-primary text-base">Sphere</p>
            <p className="text-nowrap text-zinc-500 text-sm">
              {dayjs(Date.now()).format("D [de] MMMM [às] HH:mm")}
            </p>
          </div>
        </div>
      </div>

      <p className="text-zinc-400 text-base text-wrap">{content}</p>

      <div className="w-full flex items-center gap-4">
        <div className="flex cursor-not-allowed items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all">
          <Heart className="size-5" />
        </div>
        <div className="flex cursor-not-allowed items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all">
          <MessageSquare className="size-5" />
        </div>
      </div>
    </div>
  );
}
