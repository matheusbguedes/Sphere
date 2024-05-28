"use client";

import { User } from "@/types/User";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Profile({ user }: { user: User }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 text-right relative">
      <div className="flex flex-col items-end text-right gap-1">
        <p className="max-w-[140px] text-zinc-400 text-sm">{user.name}</p>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-2 text-sm text-zinc-500  transition-colors hover:hover:text-red-600"
        >
          sair <LogOut className="size-3" />
        </a>
      </div>

      <Image
        src={user.avatarUrl}
        width={60}
        height={60}
        draggable={false}
        alt="profile-image"
        onClick={() => {
          router.push(`/user/${user.sub}`);
        }}
        className="size-11 sm:size-12 rounded-full outline outline-2 outline-primary cursor-pointer"
      />
      <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 bg-primary" />
    </div>
  );
}
