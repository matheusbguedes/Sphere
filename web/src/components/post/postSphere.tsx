"use client";

import { IUser } from "@/types/User";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import logo from "/public/sphere-logo.svg";

dayjs.locale("pt-br");

export function PostSphere({
  user,
  content,
}: {
  user: IUser;
  content: string;
}) {
  const router = useRouter();
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

      <div className="w-full flex items-center gap-4 pb-2 border-b-2 border-zinc-800" />

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
          disabled
          placeholder="Escreva um comentário..."
          className="bg-zinc-800 bg-opacity-20 py-2 px-4 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
