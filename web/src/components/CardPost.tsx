import { getUser } from "@/lib/auth";
import { Heart } from "lucide-react";
import Image from "next/image";
import test from "/public/download.png";

export function CardPost() {
  const { avatarUrl, name } = getUser();

  return (
    <div className="w-1/3 flex flex-col gap-6 rounded-xl p-5 border-2 border-zinc-800">
      <div className="flex items-center gap-3">
        <Image
          src={avatarUrl}
          width={60}
          height={60}
          draggable={false}
          alt=""
          className="size-12 rounded-full border-2 border-primary"
        />
        <div className="flex flex-col">
          <p className="max-w-[140px] text-zinc-400 text-base">{name}</p>
          <p className="max-w-[140px] text-zinc-600 text-sm">2 h</p>
        </div>
      </div>

      <Image
        src={test}
        alt=""
        className="aspect-video w-full rounded-lg object-cover shadow-sm"
      />

      <div className="w-full flex gap-2 items-center">
        <span className="flex cursor-pointer items-center text-sm p-2 gap-2 rounded-md text-primary hover:bg-primary/20">
          <Heart className="size-5" />
        </span>
        <p className="text-zinc-400 text-sm">2 curtidas</p>
      </div>
    </div>
  );
}
