import { getUser } from "@/lib/auth";
import { Camera, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { MediaPicker } from "./MediaPicker";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewPost() {
  const { avatarUrl, name } = getUser();

  return (
    <div className="w-1/3 flex flex-col gap-3 rounded-xl p-5 border-2 border-zinc-800">
      <div className="w-full flex items-center justify-between gap-3 pb-4 border-b-2 border-zinc-800">
        <div className="flex items-center gap-3">
          <Image
            src={avatarUrl}
            width={60}
            height={60}
            draggable={false}
            alt=""
            className="size-12 rounded-full border-2 border-primary"
          />
          <p className="max-w-[140px] text-zinc-400 text-base">{name}</p>
        </div>

        <label className="flex cursor-pointer items-center text-sm p-2 rounded-md text-primary hover:hover:bg-primary/20">
          <MoreHorizontal className="size-5" />
        </label>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-2">
        <Input type="text" placeholder="Escreva algo..." />
        <MediaPicker />
      </div>

      <div className="w-full flex items-center justify-between">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center text-sm p-2 rounded-md text-primary hover:hover:bg-primary/20"
        >
          <Camera className="size-5" />
        </label>

        <Button variant="outline" size={"sm"}>
          Compartilhar
        </Button>
      </div>
    </div>
  );
}
